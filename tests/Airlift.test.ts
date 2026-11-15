import { AIRLIFTED, airlifted, recordAirlift } from '../lib/airlifted';
import Airlift from '../Airlift';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import World from '@civ-clone/core-world/World';
import airliftCriteria from '../lib/criteria';
import airliftRules from '../lib/airliftRules';
import { expect } from 'chai';

class Armor extends Unit {}
class Cruiser extends Unit {}

// Stand-in cities: a player, and whether it has an Airport.
type StandInCity = City & { airport: boolean };

describe('Airlift', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      pendingEffectRegistry = new PendingEffectRegistry(),
      turn = new Turn(),
      player = new Player(),
      enemy = new Player(),
      cities = new Map<Tile, StandInCity>(),
      cityRegistry = {
        getByTile: (tile: Tile): City | null => cities.get(tile) ?? null,
      } as unknown as CityRegistry,
      tile = (x: number): Tile =>
        new Tile(x, 0, new Terrain(), null as unknown as World, ruleRegistry),
      city = (
        on: Tile,
        owner: Player = player,
        airport = true
      ): StandInCity => {
        const city = {
          airport,
          player: (): Player => owner,
        } as unknown as StandInCity;

        cities.set(on, city);

        return city;
      },
      from = tile(0),
      to = tile(1),
      source = city(from),
      destination = city(to),
      unit = new Armor(null, player, from, ruleRegistry),
      deps = { cityRegistry, pendingEffectRegistry, turn },
      // Civ2: land units only, between cities with Airports (survey-units §4.1, OpenCiv2 `unit_cmd_airlift`).
      criteria = airliftCriteria(deps, {
        canAirlift: (candidate: Unit): boolean =>
          !(candidate instanceof Cruiser),
        canAirliftFrom: (candidate: City): boolean =>
          (candidate as StandInCity).airport,
      }),
      offered = (target: Tile = to, by: Unit = unit): boolean =>
        criteria.every((criterion: Criterion): boolean =>
          criterion.validate(by, target, by.tile())
        );

    turn.set(20);
    unit.moves().set(1);

    return {
      city,
      cityRegistry,
      deps,
      destination,
      enemy,
      from,
      offered,
      pendingEffectRegistry,
      player,
      ruleRegistry,
      source,
      tile,
      to,
      turn,
      unit,
    };
  };

  describe('airliftCriteria', (): void => {
    it("is offered between two of the unit's player's cities that can airlift", (): void => {
      const { offered } = setUp();

      expect(offered()).to.true;
    });

    it("isn't offered to a unit that can't be airlifted, or with no moves left", (): void => {
      const { from, offered, player, ruleRegistry, unit } = setUp();

      expect(offered(undefined, new Cruiser(null, player, from, ruleRegistry)))
        .to.false;

      unit.moves().set(0);

      expect(offered()).to.false;
    });

    it("isn't offered to the city the unit is in, to a tile with no city, to another player's city or to a city that can't airlift", (): void => {
      const { city, enemy, from, offered, tile } = setUp(),
        theirs = tile(2),
        noAirport = tile(3);

      city(theirs, enemy);
      city(noAirport, undefined, false);

      expect(offered(from)).to.false;
      expect(offered(tile(4))).to.false;
      expect(offered(theirs)).to.false;
      expect(offered(noAirport)).to.false;
    });

    it("isn't offered from outside a city, or from a city that can't airlift", (): void => {
      const { city, offered, tile, unit } = setUp(),
        noAirport = tile(3);

      unit.setTile(tile(4));

      expect(offered()).to.false;

      city(noAirport, undefined, false);
      unit.setTile(noAirport);

      expect(offered()).to.false;
    });

    // `CITYF_AIRLIFTED`: one airlift a turn, checked on both cities (`unit_cmd_airlift`).
    it("isn't offered when either city has airlifted this turn, and is again the next turn", (): void => {
      const { deps, destination, offered, source, turn } = setUp();

      recordAirlift(source, deps);

      expect(offered()).to.false;

      turn.increment();

      expect(offered()).to.true;

      recordAirlift(destination, deps);

      expect(offered()).to.false;
    });
  });

  describe('perform', (): void => {
    it('records both cities, uses up the moves, and moves the unit through the `Moved` rules', (): void => {
      const {
          cityRegistry,
          deps,
          destination,
          from,
          pendingEffectRegistry,
          ruleRegistry,
          source,
          to,
          turn,
          unit,
        } = setUp(),
        moved: [Unit, UnitAction][] = [];

      ruleRegistry.register(
        new Moved(
          new Effect((movedUnit: Unit, action: UnitAction): void => {
            moved.push([movedUnit, action]);
          })
        )
      );

      const action = new Airlift(
        from,
        to,
        unit,
        ruleRegistry,
        cityRegistry,
        pendingEffectRegistry,
        turn
      );

      action.perform();

      expect(unit.tile()).to.equal(to);
      expect(unit.moves().value()).to.equal(0);
      expect(unit.active()).to.false;
      expect(moved).to.deep.equal([[unit, action]]);
      expect(airlifted(source, deps)).to.true;
      expect(airlifted(destination, deps)).to.true;
      expect(
        pendingEffectRegistry
          .getByHandler(AIRLIFTED)
          .map((effect) => [effect.target(), effect.data()])
      ).to.deep.equal([
        [source, { turn: '20' }],
        [destination, { turn: '20' }],
      ]);
    });
  });

  describe('airliftRules', (): void => {
    it('removes the records of the cities of the player whose turn starts, and only theirs', (): void => {
      const {
          city,
          deps,
          enemy,
          pendingEffectRegistry,
          player,
          ruleRegistry,
          source,
          tile,
        } = setUp(),
        theirs = city(tile(5), enemy);

      recordAirlift(source, deps);
      recordAirlift(theirs, deps);

      const [rule] = airliftRules('test', { pendingEffectRegistry });

      expect(rule.id()).to.equal('test:airlift/clear-airlifted');

      ruleRegistry.register(rule);
      ruleRegistry.process(TurnStart, player);

      expect(airlifted(source, deps)).to.false;
      expect(airlifted(theirs, deps)).to.true;
    });
  });
});

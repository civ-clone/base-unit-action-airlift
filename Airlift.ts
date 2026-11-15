import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import { recordAirlift } from './lib/airlifted';

/**
 * Flies the unit from the city it is in (`from`) to another city (`to`), as OpenCiv2's `unit_airlift_perform` does:
 * 1. both cities are recorded as airlifted this turn (`CITYF_AIRLIFTED` is set on both), so neither can airlift again
 *    until its player's next turn;
 * 2. the unit's moves are used up;
 * 3. the unit is put on `to` and the `Moved` rules run for it, with this action.
 *
 * Civ2's roll for the unit being shot down when enemy fighters are near is left out.
 */
export class Airlift extends Action {
  private _cityRegistry: CityRegistry;
  private _pendingEffectRegistry: PendingEffectRegistry;
  private _turn: Turn;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    cityRegistry: CityRegistry = cityRegistryInstance,
    pendingEffectRegistry: PendingEffectRegistry = pendingEffectRegistryInstance,
    turn: Turn = turnInstance
  ) {
    super(from, to, unit, ruleRegistry);

    this._cityRegistry = cityRegistry;
    this._pendingEffectRegistry = pendingEffectRegistry;
    this._turn = turn;
  }

  perform(): void {
    const unit = this.unit(),
      state = {
        pendingEffectRegistry: this._pendingEffectRegistry,
        turn: this._turn,
      };

    [
      this._cityRegistry.getByTile(this.from()),
      this._cityRegistry.getByTile(this.to()),
    ]
      .filter((city: City | null): city is City => city !== null)
      .forEach((city: City): void => recordAirlift(city, state));

    unit.moves().set(0);
    unit.setActive(false);

    unit.setTile(this.to());

    this.ruleRegistry().process(Moved, unit, this);
  }
}

export default Airlift;

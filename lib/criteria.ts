import { AirliftState, airlifted } from './airlifted';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import { hasMovesLeft } from '@civ-clone/core-unit/Rules/Action';

export interface AirliftDependencies extends AirliftState {
  cityRegistry: CityRegistry;
}

export interface AirliftOptions {
  // Which units can be airlifted (Civ2: land units only).
  canAirlift: (unit: Unit) => boolean;
  // Whether a city can airlift (Civ2: it has an Airport).
  canAirliftFrom: (city: City) => boolean;
}

/**
 * The criteria for airlifting the unit from the city it is in to the city on `to`, in order, as OpenCiv2's
 *  `unit_cmd_airlift` checks them: moves left, `canAirlift(unit)`, then for the city on `from` and then the one on `to`
 *  (different tiles): a city of the unit's player, `canAirliftFrom(city)`, and not airlifted this turn.
 */
export const airliftCriteria = (
  { cityRegistry, pendingEffectRegistry, turn }: AirliftDependencies,
  { canAirlift, canAirliftFrom }: AirliftOptions
): Criterion[] => {
  const state = { pendingEffectRegistry, turn },
    airport = (unit: Unit, tile: Tile): boolean => {
      const city = cityRegistry.getByTile(tile);

      return (
        city !== null &&
        city.player() === unit.player() &&
        canAirliftFrom(city) &&
        !airlifted(city, state)
      );
    };

  return [
    hasMovesLeft,
    new Criterion((unit: Unit): boolean => canAirlift(unit)),
    new Criterion(
      (unit: Unit, to: Tile, from: Tile = unit.tile()): boolean => to !== from
    ),
    new Criterion((unit: Unit, to: Tile, from: Tile = unit.tile()): boolean =>
      airport(unit, from)
    ),
    new Criterion((unit: Unit, to: Tile): boolean => airport(unit, to)),
  ];
};

export default airliftCriteria;

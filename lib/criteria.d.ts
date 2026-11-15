import { AirliftState } from './airlifted';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import Unit from '@civ-clone/core-unit/Unit';
export interface AirliftDependencies extends AirliftState {
  cityRegistry: CityRegistry;
}
export interface AirliftOptions {
  canAirlift: (unit: Unit) => boolean;
  canAirliftFrom: (city: City) => boolean;
}
/**
 * The criteria for airlifting the unit from the city it is in to the city on `to`, in order, as OpenCiv2's
 *  `unit_cmd_airlift` checks them: moves left, `canAirlift(unit)`, then for the city on `from` and then the one on `to`
 *  (different tiles): a city of the unit's player, `canAirliftFrom(city)`, and not airlifted this turn.
 */
export declare const airliftCriteria: (
  { cityRegistry, pendingEffectRegistry, turn }: AirliftDependencies,
  { canAirlift, canAirliftFrom }: AirliftOptions
) => Criterion[];
export default airliftCriteria;

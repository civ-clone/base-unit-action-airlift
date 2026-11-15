import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PendingEffectRegistry } from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import Action from '@civ-clone/core-unit/Action';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * Flies the unit from the city it is in (`from`) to another city (`to`), as OpenCiv2's `unit_airlift_perform` does:
 * 1. both cities are recorded as airlifted this turn (`CITYF_AIRLIFTED` is set on both), so neither can airlift again
 *    until its player's next turn;
 * 2. the unit's moves are used up;
 * 3. the unit is put on `to` and the `Moved` rules run for it, with this action.
 *
 * Civ2's roll for the unit being shot down when enemy fighters are near is left out.
 */
export declare class Airlift extends Action {
  private _cityRegistry;
  private _pendingEffectRegistry;
  private _turn;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry?: RuleRegistry,
    cityRegistry?: CityRegistry,
    pendingEffectRegistry?: PendingEffectRegistry,
    turn?: Turn
  );
  perform(): void;
}
export default Airlift;

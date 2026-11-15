import City from '@civ-clone/core-city/City';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
/**
 * The `PendingEffect` handler naming a city's airlift record. Nothing discharges it: `airliftRules` removes the records
 *  of a player's cities when that player's turn starts.
 */
export declare const AIRLIFTED = 'base-unit-action-airlift:airlifted';
export interface AirliftState {
  pendingEffectRegistry: PendingEffectRegistry;
  turn: Turn;
}
/** Whether `city` has been airlifted from or to in the current turn. */
export declare const airlifted: (
  city: City,
  { pendingEffectRegistry, turn }: AirliftState
) => boolean;
/**
 * Records that `city` was airlifted from or to in the current turn: a `PendingEffect` targeting the city, with the turn
 *  in its data. Only a city that has been airlifted has one, so other cities carry nothing extra, and a save keeps it as
 *  it keeps any pending effect.
 */
export declare const recordAirlift: (
  city: City,
  { pendingEffectRegistry, turn }: AirliftState
) => void;
export default airlifted;

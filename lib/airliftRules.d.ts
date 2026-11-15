import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
/**
 * The rules a ruleset with `Airlift` registers: `<prefix>:airlift/clear-airlifted`, a `TurnStart` rule that removes the
 *  airlift records of the cities of the player whose turn is starting (OpenCiv2 clears `CITYF_AIRLIFTED` as it
 *  processes each of its owner's cities at the start of the owner's turn). `airlifted` only counts a record from the
 *  current turn, so this keeps saves tidy rather than deciding anything.
 */
export declare const airliftRules: (
  prefix: string,
  {
    pendingEffectRegistry,
  }: {
    pendingEffectRegistry: PendingEffectRegistry;
  }
) => TurnStart[];
export default airliftRules;

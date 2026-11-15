import CityDestroyed from '@civ-clone/core-city/Rules/Destroyed';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import TurnStart from '@civ-clone/core-player/Rules/TurnStart';
/**
 * The rules a ruleset with `Airlift` registers, so no airlift record outlives the turn it was made in or the city it is
 *  for:
 * - `<prefix>:airlift/clear-airlifted`, a `TurnStart` rule that removes the airlift records of the cities of the player
 *   whose turn is starting (OpenCiv2 clears `CITYF_AIRLIFTED` as it processes each of its owner's cities at the start
 *   of the owner's turn);
 * - `<prefix>:airlift/city-destroyed`, a city `Destroyed` rule that removes a destroyed city's records, so a razed city
 *   isn't kept in a save by them.
 *
 * A captured city keeps its record, as Civ2's city keeps its flag: it is cleared at its new owner's next turn start.
 *  `airlifted` only counts a record from the current turn, so these keep saves tidy rather than deciding anything.
 */
export declare const airliftRules: (
  prefix: string,
  {
    pendingEffectRegistry,
  }: {
    pendingEffectRegistry: PendingEffectRegistry;
  }
) => (TurnStart | CityDestroyed)[];
export default airliftRules;

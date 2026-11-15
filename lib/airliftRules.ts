import { AIRLIFTED } from './airlifted';
import City from '@civ-clone/core-city/City';
import CityDestroyed from '@civ-clone/core-city/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import PendingEffect from '@civ-clone/core-pending-effect/PendingEffect';
import PendingEffectRegistry from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Player from '@civ-clone/core-player/Player';
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
export const airliftRules = (
  prefix: string,
  { pendingEffectRegistry }: { pendingEffectRegistry: PendingEffectRegistry }
): (TurnStart | CityDestroyed)[] => {
  const forget = (effects: PendingEffect[]): void =>
    effects
      .filter(
        (effect: PendingEffect): boolean => effect.handler() === AIRLIFTED
      )
      .forEach((effect: PendingEffect): void =>
        pendingEffectRegistry.unregister(effect)
      );

  return [
    new TurnStart(
      `${prefix}:airlift/clear-airlifted`,
      new Effect((player: Player): void =>
        forget(
          pendingEffectRegistry
            .getByHandler(AIRLIFTED)
            .filter(
              (effect: PendingEffect): boolean =>
                (effect.target() as City).player() === player
            )
        )
      )
    ),
    new CityDestroyed(
      `${prefix}:airlift/city-destroyed`,
      new Effect((city: City): void =>
        forget(pendingEffectRegistry.getByTarget(city))
      )
    ),
  ];
};

export default airliftRules;

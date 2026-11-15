"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airliftRules = void 0;
const airlifted_1 = require("./airlifted");
const Destroyed_1 = require("@civ-clone/core-city/Rules/Destroyed");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
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
const airliftRules = (prefix, { pendingEffectRegistry }) => {
    const forget = (effects) => effects
        .filter((effect) => effect.handler() === airlifted_1.AIRLIFTED)
        .forEach((effect) => pendingEffectRegistry.unregister(effect));
    return [
        new TurnStart_1.default(`${prefix}:airlift/clear-airlifted`, new Effect_1.default((player) => forget(pendingEffectRegistry
            .getByHandler(airlifted_1.AIRLIFTED)
            .filter((effect) => effect.target().player() === player)))),
        new Destroyed_1.default(`${prefix}:airlift/city-destroyed`, new Effect_1.default((city) => forget(pendingEffectRegistry.getByTarget(city)))),
    ];
};
exports.airliftRules = airliftRules;
exports.default = exports.airliftRules;
//# sourceMappingURL=airliftRules.js.map
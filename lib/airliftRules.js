"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airliftRules = void 0;
const airlifted_1 = require("./airlifted");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TurnStart_1 = require("@civ-clone/core-player/Rules/TurnStart");
/**
 * The rules a ruleset with `Airlift` registers: `<prefix>:airlift/clear-airlifted`, a `TurnStart` rule that removes the
 *  airlift records of the cities of the player whose turn is starting (OpenCiv2 clears `CITYF_AIRLIFTED` as it
 *  processes each of its owner's cities at the start of the owner's turn). `airlifted` only counts a record from the
 *  current turn, so this keeps saves tidy rather than deciding anything.
 */
const airliftRules = (prefix, { pendingEffectRegistry }) => [
    new TurnStart_1.default(`${prefix}:airlift/clear-airlifted`, new Effect_1.default((player) => pendingEffectRegistry
        .getByHandler(airlifted_1.AIRLIFTED)
        .filter((effect) => effect.target().player() === player)
        .forEach((effect) => pendingEffectRegistry.unregister(effect)))),
];
exports.airliftRules = airliftRules;
exports.default = exports.airliftRules;
//# sourceMappingURL=airliftRules.js.map
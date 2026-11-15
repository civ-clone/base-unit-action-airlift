"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordAirlift = exports.airlifted = exports.AIRLIFTED = void 0;
const PendingEffect_1 = require("@civ-clone/core-pending-effect/PendingEffect");
/**
 * The `PendingEffect` handler naming a city's airlift record. Nothing discharges it: `airliftRules` removes the records
 *  of a player's cities when that player's turn starts.
 */
exports.AIRLIFTED = 'base-unit-action-airlift:airlifted';
/** Whether `city` has been airlifted from or to in the current turn. */
const airlifted = (city, { pendingEffectRegistry, turn }) => pendingEffectRegistry
    .getByTarget(city)
    .some((effect) => effect.handler() === exports.AIRLIFTED &&
    effect.data().turn === String(turn.value()));
exports.airlifted = airlifted;
/**
 * Records that `city` was airlifted from or to in the current turn: a `PendingEffect` targeting the city, with the turn
 *  in its data. Only a city that has been airlifted has one, so other cities carry nothing extra, and a save keeps it as
 *  it keeps any pending effect.
 */
const recordAirlift = (city, { pendingEffectRegistry, turn }) => pendingEffectRegistry.register(new PendingEffect_1.default(exports.AIRLIFTED, city, { turn: String(turn.value()) }));
exports.recordAirlift = recordAirlift;
exports.default = exports.airlifted;
//# sourceMappingURL=airlifted.js.map
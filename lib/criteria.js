"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airliftCriteria = void 0;
const airlifted_1 = require("./airlifted");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Action_1 = require("@civ-clone/core-unit/Rules/Action");
/**
 * The criteria for airlifting the unit from the city it is in to the city on `to`, in order, as OpenCiv2's
 *  `unit_cmd_airlift` checks them: moves left, `canAirlift(unit)`, then for the city on `from` and then the one on `to`
 *  (different tiles): a city of the unit's player, `canAirliftFrom(city)`, and not airlifted this turn.
 */
const airliftCriteria = ({ cityRegistry, pendingEffectRegistry, turn }, { canAirlift, canAirliftFrom }) => {
    const state = { pendingEffectRegistry, turn }, airport = (unit, tile) => {
        const city = cityRegistry.getByTile(tile);
        return (city !== null &&
            city.player() === unit.player() &&
            canAirliftFrom(city) &&
            !(0, airlifted_1.airlifted)(city, state));
    };
    return [
        Action_1.hasMovesLeft,
        new Criterion_1.default((unit) => canAirlift(unit)),
        new Criterion_1.default((unit, to, from = unit.tile()) => to !== from),
        new Criterion_1.default((unit, to, from = unit.tile()) => airport(unit, from)),
        new Criterion_1.default((unit, to) => airport(unit, to)),
    ];
};
exports.airliftCriteria = airliftCriteria;
exports.default = exports.airliftCriteria;
//# sourceMappingURL=criteria.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Airlift = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const PendingEffectRegistry_1 = require("@civ-clone/core-pending-effect/PendingEffectRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const Action_1 = require("@civ-clone/core-unit/Action");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const airlifted_1 = require("./lib/airlifted");
/**
 * Flies the unit from the city it is in (`from`) to another city (`to`), as OpenCiv2's `unit_airlift_perform` does:
 * 1. both cities are recorded as airlifted this turn (`CITYF_AIRLIFTED` is set on both), so neither can airlift again
 *    until its player's next turn;
 * 2. the unit's moves are used up;
 * 3. the unit is put on `to` and the `Moved` rules run for it, with this action.
 *
 * Civ2's roll for the unit being shot down when enemy fighters are near is left out.
 */
class Airlift extends Action_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, cityRegistry = CityRegistry_1.instance, pendingEffectRegistry = PendingEffectRegistry_1.instance, turn = Turn_1.instance) {
        super(from, to, unit, ruleRegistry);
        this._cityRegistry = cityRegistry;
        this._pendingEffectRegistry = pendingEffectRegistry;
        this._turn = turn;
    }
    perform() {
        const unit = this.unit(), state = {
            pendingEffectRegistry: this._pendingEffectRegistry,
            turn: this._turn,
        };
        [
            this._cityRegistry.getByTile(this.from()),
            this._cityRegistry.getByTile(this.to()),
        ]
            .filter((city) => city !== null)
            .forEach((city) => (0, airlifted_1.recordAirlift)(city, state));
        unit.moves().set(0);
        unit.setActive(false);
        unit.setTile(this.to());
        this.ruleRegistry().process(Moved_1.default, unit, this);
    }
}
exports.Airlift = Airlift;
exports.default = Airlift;
//# sourceMappingURL=Airlift.js.map
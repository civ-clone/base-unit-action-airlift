# base-unit-action-airlift

The `Airlift` unit action: a unit flies from one of its player's cities to another, as OpenCiv2's
`unit_airlift_perform` does. Each city airlifts once a turn.

- `Airlift`: `new Airlift(from, to, unit, ruleRegistry?, cityRegistry?, pendingEffectRegistry?, turn?)`. `perform()`
  records both cities as airlifted this turn (Civ2 sets `CITYF_AIRLIFTED` on both), uses up the unit's moves, puts the
  unit on `to` and runs the `Moved` rules with the action. Civ2's roll for the unit being shot down when enemy fighters
  are near is left out.
- `lib/criteria`: `airliftCriteria({ cityRegistry, pendingEffectRegistry, turn }, { canAirlift, canAirliftFrom })`, in
  order: moves left; `canAirlift(unit)` (Civ2: land units); `to` isn't `from`; then the city on `from` and the city on
  `to` are each the unit's player's, pass `canAirliftFrom(city)` (Civ2: an Airport) and haven't airlifted this turn.
- `lib/airliftRules`: `airliftRules(prefix, { pendingEffectRegistry })` gives `<prefix>:airlift/clear-airlifted`, a
  `TurnStart` rule that removes the airlift records of the cities of the player whose turn is starting.
- `lib/airlifted`: `airlifted(city, { pendingEffectRegistry, turn })`, whether the city has airlifted this turn,
  `recordAirlift(city, ...)`, and `AIRLIFTED`, the handler naming a record.

**State.** A city's airlift is a `PendingEffect` targeting the city, handler `base-unit-action-airlift:airlifted`, with
the turn in its data, created only when a city airlifts. Other cities carry nothing, no new class has to be saved (a
save keeps pending effects already), and nothing discharges it: `airlifted` only counts a record from the current turn,
and `airliftRules` removes old ones.

A library: it has no `main` and registers no rules.

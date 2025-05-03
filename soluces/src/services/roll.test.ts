import { describe, it, expect } from "bun:test";
import { rollDice } from "./roll";

describe("We want to test the 'roll' service", () => {
  it("should roll a dice", () => {
    const roll = rollDice(6);
    expect(roll).toBeGreaterThanOrEqual(1);
    expect(roll).toBeLessThanOrEqual(6);
  });
});

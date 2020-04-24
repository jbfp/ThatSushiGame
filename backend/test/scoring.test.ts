import * as sut from "../src/models/scoring";
import { Nigiri, CardKind, NigiriKind } from "../src/models/card";

describe("Scoring", () => {
    describe("scoreNigiri", () => {
        test("Egg", () => {
            const card: Nigiri = { kind: CardKind.Nigiri, nigiriKind: NigiriKind.Egg };
            const actual = sut.scoreNigiri(card);
            expect(actual).toBe(1);
        });

        test("Salmon", () => {
            const card: Nigiri = { kind: CardKind.Nigiri, nigiriKind: NigiriKind.Salmon };
            const actual = sut.scoreNigiri(card);
            expect(actual).toBe(2);
        });

        test("Squid", () => {
            const card: Nigiri = { kind: CardKind.Nigiri, nigiriKind: NigiriKind.Squid };
            const actual = sut.scoreNigiri(card);
            expect(actual).toBe(3);
        });
    });
});
import * as sut from "../src/models/scoring";
import { Nigiri, CardKind, NigiriKind, Wasabi } from "../src/models/card";
import { WasabiFaceUpCard, FaceUpCardKind } from "../src/models/faceUpCards";

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

    describe("scoreWasabiFaceUpCard", () => {
        const scoreWasabiFaceUpCard = (nigiri: Nigiri): number => {
            const wasabi: Wasabi = { kind: CardKind.Wasabi };
            const faceUpCard: WasabiFaceUpCard = { kind: FaceUpCardKind.Wasabi, nigiri, wasabi };
            return sut.scoreWasabiFaceUpCard(faceUpCard);
        };

        test("Egg", () => {
            const nigiri: Nigiri = { kind: CardKind.Nigiri, nigiriKind: NigiriKind.Egg };
            const actual = scoreWasabiFaceUpCard(nigiri);
            expect(actual).toBe(3);
        });

        test("Salmon", () => {
            const nigiri: Nigiri = { kind: CardKind.Nigiri, nigiriKind: NigiriKind.Salmon };
            const actual = scoreWasabiFaceUpCard(nigiri);
            expect(actual).toBe(6);
        });

        test("Squid", () => {
            const nigiri: Nigiri = { kind: CardKind.Nigiri, nigiriKind: NigiriKind.Squid };
            const actual = scoreWasabiFaceUpCard(nigiri);
            expect(actual).toBe(9);
        });
    });
});
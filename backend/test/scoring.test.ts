import * as sut from "../src/models/scoring";
import { Nigiri, CardKind, NigiriKind, Wasabi } from "../src/models/card";
import { WasabiFaceUpCard, FaceUpCardKind } from "../src/models/faceUpCards";

describe("Scoring", () => {
    describe("scoreNigiri", () => {
        const cases = [
            [NigiriKind.Egg, 1],
            [NigiriKind.Salmon, 2],
            [NigiriKind.Squid, 3],
        ];

        test.each(cases)("%p = %p points", (nigiriKind: NigiriKind, expected: number) => {
            const card: Nigiri = { kind: CardKind.Nigiri, nigiriKind };
            const actual = sut.scoreNigiri(card);
            expect(actual).toBe(expected);
        });
    });

    describe("scoreWasabiFaceUpCard", () => {
        const cases = [
            [NigiriKind.Egg, 3],
            [NigiriKind.Salmon, 6],
            [NigiriKind.Squid, 9],
        ];

        test.each(cases)("%p = %p points", (nigiriKind: NigiriKind, expected: number) => {
            const nigiri: Nigiri = { kind: CardKind.Nigiri, nigiriKind };
            const wasabi: Wasabi = { kind: CardKind.Wasabi };
            const faceUpCard: WasabiFaceUpCard = { kind: FaceUpCardKind.Wasabi, nigiri, wasabi };
            const actual = sut.scoreWasabiFaceUpCard(faceUpCard);
            expect(actual).toBe(expected);
        });
    });


    describe("scoreTempuras", () => {
        test("negative argument", () => {
            expect(() => sut.scoreTempuras(-1))
                .toThrowError("Negative number of tempuras");
        });

        const cases = [
            [0, 0],
            [1, 0],
            [2, 5],
            [3, 5],
            [4, 10],
        ];

        test.each(cases)("%p tempuras = %p points", (n, expected) => {
            expect(sut.scoreTempuras(n)).toBe(expected);
        });
    });

    describe("scoreSashimis", () => {
        test("negative argument", () => {
            expect(() => sut.scoreSashimis(-1))
                .toThrowError("Negative number of sashimis");
        });

        const cases = [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 10],
            [4, 10],
            [5, 10],
            [6, 20],
        ];

        test.each(cases)("%p sashimis = %p points", (n, expected) => {
            expect(sut.scoreSashimis(n)).toBe(expected);
        });
    });
});
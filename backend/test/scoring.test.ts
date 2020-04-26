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

    describe("scoreDumplings", () => {
        test("negative argument", () => {
            expect(() => sut.scoreDumplings(-1))
                .toThrowError("Negative number of dumplings");
        });

        const cases = [
            [0, 0],
            [1, 1],
            [2, 3],
            [3, 6],
            [4, 10],
            [5, 15],
            [6, 15],
        ];

        test.each(cases)("%p dumplings = %p points", (n, expected) => {
            expect(sut.scoreDumplings(n)).toBe(expected);
        });
    });

    describe("scoreMakiRolls", () => {
        describe("no ties", () => {
            const makiRollsByPlayerId = {
                "player 1": 2,
                "player 2": 1,
                "player 3": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first place gets 6 points", () => {
                expect(actual["player 1"]).toBe(6);
            });

            test("second place gets 3 points", () => {
                expect(actual["player 2"]).toBe(3);
            });

            test("third place gets nothing", () => {
                expect(actual["player 3"]).toBe(0);
            });
        });

        describe("first place two-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 1,
                "player 2": 1,
                "player 3": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 3 points", () => {
                expect(actual["player 1"]).toBe(3);
                expect(actual["player 2"]).toBe(3);
            });

            test("second place gets nothing", () => {
                expect(actual["player 3"]).toBe(0);
            });
        });

        describe("first place three-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 1,
                "player 2": 1,
                "player 3": 1,
                "player 4": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 2 points", () => {
                expect(actual["player 1"]).toBe(2);
                expect(actual["player 2"]).toBe(2);
                expect(actual["player 3"]).toBe(2);
            });

            test("second place gets nothing", () => {
                expect(actual["player 4"]).toBe(0);
            });
        });

        describe("first place four-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 1,
                "player 2": 1,
                "player 3": 1,
                "player 4": 1,
                "player 5": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 1 points", () => {
                expect(actual["player 1"]).toBe(1);
                expect(actual["player 2"]).toBe(1);
                expect(actual["player 3"]).toBe(1);
                expect(actual["player 4"]).toBe(1);
            });

            test("second place gets nothing", () => {
                expect(actual["player 5"]).toBe(0);
            });
        });

        describe("first place five-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 1,
                "player 2": 1,
                "player 3": 1,
                "player 4": 1,
                "player 5": 1,
                "player 6": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 1 points", () => {
                expect(actual["player 1"]).toBe(1);
                expect(actual["player 2"]).toBe(1);
                expect(actual["player 3"]).toBe(1);
                expect(actual["player 4"]).toBe(1);
                expect(actual["player 5"]).toBe(1);
            });

            test("second place gets nothing", () => {
                expect(actual["player 6"]).toBe(0);
            });
        });

        describe("second place two-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 2,
                "player 2": 1,
                "player 3": 1,
                "player 4": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 6 points", () => {
                expect(actual["player 1"]).toBe(6);
            });

            test("second place gets 1 point", () => {
                expect(actual["player 2"]).toBe(1);
                expect(actual["player 3"]).toBe(1);
            });

            test("third place gets nothing", () => {
                expect(actual["player 4"]).toBe(0);
            });
        });

        describe("second place three-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 2,
                "player 2": 1,
                "player 3": 1,
                "player 4": 1,
                "player 5": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 6 points", () => {
                expect(actual["player 1"]).toBe(6);
            });

            test("second place gets 1 point", () => {
                expect(actual["player 2"]).toBe(1);
                expect(actual["player 3"]).toBe(1);
                expect(actual["player 4"]).toBe(1);
            });

            test("third place gets nothing", () => {
                expect(actual["player 5"]).toBe(0);
            });
        });

        describe("second place four-way tie", () => {
            const makiRollsByPlayerId = {
                "player 1": 2,
                "player 2": 1,
                "player 3": 1,
                "player 4": 1,
                "player 5": 1,
                "player 6": 0,
            };

            const actual = sut.scoreMakiRolls(makiRollsByPlayerId);

            test("first places get 6 points", () => {
                expect(actual["player 1"]).toBe(6);
            });

            test("second place gets 0 point", () => {
                expect(actual["player 2"]).toBe(0);
                expect(actual["player 3"]).toBe(0);
                expect(actual["player 4"]).toBe(0);
                expect(actual["player 5"]).toBe(0);
            });

            test("third place gets nothing", () => {
                expect(actual["player 6"]).toBe(0);
            });
        });
    });
});
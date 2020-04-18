import { GameEvent, GameEventKind } from "../src/models/events";
import { createGame, IGame, IPlayer, selectCards } from "../src/models/game";

describe("createGame", () => {
    describe("too few players", () => {
        it("should return error 0", () => {
            const playerIds: string[] = [];

            const actual = createGame(playerIds);

            expect(actual).toBeInstanceOf(Error);
        });

        it("should return error 1", () => {
            const playerIds = ["player 0"];

            const actual = createGame(playerIds);

            expect(actual).toBeInstanceOf(Error);
        });
    });

    describe("too many players", () => {
        it("should return error", () => {
            const playerIds = ["player 0", "player 1", "player 2", "player 3", "player 4", "player 5"];

            const actual = createGame(playerIds);

            expect(actual).toBeInstanceOf(Error);
        });
    });

    describe("duplicate players", () => {
        it("should return error", () => {
            const playerIds = ["not-dup", "dup", "dup"];

            const actual = createGame(playerIds);

            expect(actual).toBeInstanceOf(Error);
        });
    });

    it("returns game, not error", () => {
        const playerIds = ["player 0", "player 1", "player 2"];

        const actual = createGame(playerIds);

        expect(actual).not.toBeInstanceOf(Error);
    });
});

describe("selectCards", () => {
    const playerIds = ["a", "b", "c"];
    let game: IGame;
    let player: IPlayer;
    let sut: (playerId: string, card: number[]) => GameEvent[];

    beforeEach(() => {
        game = createGame(playerIds) as IGame;
        player = game.players[0];
        sut = (playerId, cards) => Array.from(selectCards(game, playerId, cards));
    });

    describe("player not in game", () => {
        it("should throw error", () => {
            expect(() => sut("d", null)).toThrowError("Player is not in game");
        });
    });

    describe("player selects N > 1 cards without chopsticks", () => {
        it("should throw error", () => {
            expect(() => sut(player.id, [4, 2]))
                .toThrowError("Player does not have chopsticks; only one card can be played without chopsticks");
        });
    });

    describe("player selects N > 2 cards", () => {
        it("should throw error", () => {
            expect(() => sut(player.id, [0, 1, 2]))
                .toThrowError("Too many cards selected");
        });
    });

    describe("player does not have card", () => {
        it("should thow error", () => {
            expect(() => sut(player.id, [99])).toThrowError("Player does not have card");
        });
    });

    describe("deselect cards", () => {
        it("should set player's selected move to []", () => {
            sut(player.id, []);
            expect(player.selectedCards).toHaveLength(0);
        });
    });

    describe("select cards", () => {
        it("should set player's selected cards", () => {
            const cards = [0];
            sut(player.id, cards);
            const array = [...player.selectedCards]; // Convert CoreMongooseArray to Array
            expect(array).toEqual(cards);
        });
    });

    describe("final player to select cards", () => {
        it("should end the turn", () => {
            // Set moves for all other players
            for (let index = 1; index < game.players.length; index++) {
                const player = game.players[index];
                const id = player.id;
                const events = sut(id, [0]);
                expect(events).toContainEqual({ kind: GameEventKind.CardsSelected, data: { playerId: id } });
            }

            const id = player.id;
            const events = sut(id, [0]);

            expect(events).toContainEqual({ kind: GameEventKind.CardsSelected, data: { playerId: player.id } });
            expect(events).toContainEqual({ kind: GameEventKind.TurnOver, data: { turn: 0 } });
            expect(player.selectedCards).toHaveLength(0);
            expect(player.faceUpCards.length).toBe(1);
            expect(game.currentTurn).toBe(1);
        });
    });
});

import { GameEvent, GameEventKind } from "../src/models/events";
import { createGame, IGame, IPlayer, setMove } from "../src/models/game";
import { Move } from "../src/models/move";

describe("createGame", () => {
    describe("too few players", () => {
        it("should return error 0", () => {
            const playerIds = ["player 0"];

            const actual = createGame(playerIds);

            expect(actual).toBeInstanceOf(Error);
        });

        it("should return error 1", () => {
            const playerIds = ["player 0", "player 1"];

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

describe("setMove", () => {
    const playerIds = ["a", "b", "c"];
    let game: IGame;
    let player: IPlayer;
    let sut: (playerId: string, move: Move | null) => GameEvent[];

    beforeEach(() => {
        game = createGame(playerIds) as IGame;
        player = game.players[0];
        sut = (playerId, move) => Array.from(setMove(game, playerId, move));
    });

    describe("player not in game", () => {
        it("should throw error", () => {
            expect(() => sut("d", null)).toThrowError("Player is not in game");
        });
    });

    describe("player does not have move", () => {
        it("should thow error", () => {
            expect(() => sut(player.id, {} as Move)).toThrowError("Player does not have move");
        });
    });

    describe("unset move", () => {
        it("should set player's selected move to null", () => {
            sut(player.id, null);
            expect(player.selectedMove).toBeNull();
        });
    });

    describe("set move", () => {
        it("should set player's selected move", () => {
            const move = player.possibleMoves[0];
            sut(player.id, move);
            expect(player.selectedMove).toEqual(move);
        });
    });

    describe("final player to set move", () => {
        it("should end the turn", () => {
            // Set moves for all other players
            for (let index = 1; index < game.players.length; index++) {
                const player = game.players[index];
                const id = player.id;
                const move = player.possibleMoves[0];
                const events = sut(id, move);
                expect(events).toContainEqual({ kind: GameEventKind.MoveSet, playerId: id });
            }

            const id = player.id;
            const move = player.possibleMoves[0];
            const events = sut(id, move);

            expect(events).toContainEqual({ kind: GameEventKind.MoveSet, playerId: player.id });
            expect(events).toContainEqual({ kind: GameEventKind.TurnOver, turn: 0 });
            expect(player.selectedMove).toBeNull();
            expect(player.faceUpCards.length).toBe(1);
            expect(game.currentTurn).toBe(1);
        });
    });
});

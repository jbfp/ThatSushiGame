import mongoose from "mongoose";
import request, { Response } from "supertest";
import app, { connectMongoose } from "../src/app";
import { GameView } from "../src/features/get-game";
import { createValidGame, getGame } from "./helpers";

describe("POST /api/games/:gameId/move", () => {
    const userId = "test user";

    const req = (gameId: string, move: object | null) => {
        return request(app)
            .post(`/api/games/${gameId}/move`)
            .set("Authorization", userId)
            .send(move);
    };

    beforeAll(async () => {
        await connectMongoose("mongodb://localhost:27017/set_move_test");
    });

    describe("Setting Move", () => {
        let gameId: string;
        let game: GameView;
        let res: Response;

        beforeAll(async () => {
            gameId = await createValidGame(userId);
            game = await getGame(gameId, userId);
            res = await req(gameId, game.player.possibleMoves[0]);
        });

        it("should return 200", () => {
            expect(res.status).toBe(200);
        });

        it("should have set move for player", async () => {
            const game = await getGame(gameId, userId);
            expect(game.player.selectedMove).toEqual(game.player.possibleMoves[0]);
        });
    });

    describe("Not In Game", () => {
        it("should return 404", async () => {
            const gameId = await createValidGame("other user id");
            const res = await req(gameId, null);
            expect(res.status).toBe(404);
        });
    });

    describe("Set Unknown Move", () => {
        let res: Response;

        beforeAll(async () => {
            const gameId = await createValidGame(userId);
            res = await req(gameId, {});
        });

        it("should return 400", () => {
            expect(res.status).toBe(400);
        });

        it("should return an error", () => {
            expect(res.text).toBe("Player does not have move");
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

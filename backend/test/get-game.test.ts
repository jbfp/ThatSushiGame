import mongoose from "mongoose";
import request, { Response } from "supertest";
import app, { connectMongoose } from "../src/app";
import { createValidGame } from "./helpers";

describe("GET /api/games/:gameId", () => {
    const userId = "test user";

    const req = (gameId: string) => {
        return request(app)
            .get(`/api/games/${gameId}`)
            .set("Authorization", userId);
    };

    beforeAll(async () => {
        await connectMongoose("mongodb://localhost:27017/create_game_test");
    });

    describe("Happy Path", () => {
        let gameId: string;
        let res: Response;

        beforeAll(async () => {
            gameId = await createValidGame(userId);
            res = await req(gameId);
        });

        it("should return 200", () => {
            expect(res.status).toBe(200);
        });

        describe("body", () => {
            it("should return object", () => {
                expect(res.body).toBeInstanceOf(Object);
            });

            it("should return the right game", () => {
                expect(res.body.id).toBe(gameId);
                expect(res.body.player.id).toBe(userId);
            });
        });
    });

    describe("Not In Game", () => {
        it("should return 404", async () => {
            const gameId = await createValidGame("other user id");
            const res = await req(gameId);
            expect(res.status).toBe(404);
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

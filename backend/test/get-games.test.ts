import mongoose from "mongoose";
import request, { Response } from "supertest";
import app, { connectMongoose } from "../src/app";
import { GameView } from "../src/features/get-game";
import { createValidGame } from "./helpers";

describe("GET /api/games", () => {
    const req = (userId: string) => {
        return request(app)
            .get("/api/games")
            .set("Authorization", userId);
    };

    const userId = "test user";

    let gameId: string;
    let res: Response;

    beforeAll(async () => {
        await connectMongoose("mongodb://localhost:27017/create_game_test");
        gameId = await createValidGame(userId);
        res = await req(userId);
    });

    describe("Happy Path", () => {
        it("should return 200", () => {
            expect(res.status).toBe(200);
        });

        describe("body", () => {
            it("should return array", () => {
                expect(res.body).toBeInstanceOf(Array);
            });

            it("should contain game", () => {
                const games: GameView[] = res.body;
                const containsGame = games.some(g => g.id === gameId);
                expect(containsGame).toBeTruthy();
            });
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

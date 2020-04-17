import mongoose from "mongoose";
import request, { Response } from "supertest";
import app, { connectMongoose } from "../src/app";
import { Game } from "../src/models/game";

describe("POST /api/games", () => {
    const req = (userId: string | null, opponents: string[]) => {
        let res = request(app)
            .post("/api/games")
            .send({ opponents });

        if (userId) {
            res = res.set("Authorization", userId);
        }

        return res;
    };

    beforeAll(async () => {
        await connectMongoose("mongodb://localhost:27017/create_game_test");
    });

    describe("Happy Path", () => {
        const userId = "player 0";
        const opponents = ["player 1", "player 2"];

        let res: Response;

        beforeAll(async () => {
            res = await req(userId, opponents);
        });

        it("should return 200", () => {
            expect(res.status).toBe(200);
        });

        it("should return game ID as body", () => {
            expect(res.text).not.toBeNull();
        });

        it("saves game to db", async () => {
            const game = await Game.findById(res.text);
            expect(game).not.toBeNull();
        });

        afterAll(async () => {
            await Game.deleteMany({});
        });
    });

    describe("No Authorization header", () => {
        it("should return 401", async () => {
            const opponents = ["player 0", "player 1", "player 2"];

            const res = await req(null, opponents);

            expect(res.status).toBe(401);
        });
    });

    describe("Too few players", () => {
        const userId = "player 0";
        const opponents: string[] = [];

        let res: Response;

        beforeAll(async () => {
            res = await req(userId, opponents);
        });

        it("should return 400", () => {
            expect(res.status).toBe(400);
        });

        it("should have error", () => {
            expect(res.body.error).toBeTruthy();
            expect(res.body.error).toBe("Too few players");
        });
    });

    describe("Too many players", () => {
        const userId = "player 0";
        const opponents = ["player 1", "player 2", "player 3", "player 4", "player 5"];

        let res: Response;

        beforeAll(async () => {
            res = await req(userId, opponents);
        });

        it("should return 400", () => {
            expect(res.status).toBe(400);
        });

        it("should have error", () => {
            expect(res.body.error).toBeTruthy();
            expect(res.body.error).toBe("Too many players");
        });
    });

    describe("Duplicate players", () => {
        const userId = "player 0";
        const opponents = ["player 1", "player 1"];

        let res: Response;

        beforeAll(async () => {
            res = await req(userId, opponents);
        });

        it("should return 400", () => {
            expect(res.status).toBe(400);
        });

        it("should have error", () => {
            expect(res.body.error).toBeTruthy();
            expect(res.body.error).toBe("Duplicate players");
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

import request from "supertest";
import app from "../src/app";
import { GameView } from "../src/features/get-game";

export const createValidGame = async (userId: string): Promise<string> => {
    const res = await request(app)
        .post("/api/games")
        .set("Authorization", userId)
        .send({ opponents: ["player 1", "player 2"] });

    return res.text;
};

export const getGame = async (gameId: string, userId: string): Promise<GameView> => {
    const res = await request(app)
        .get(`/api/games/${gameId}`)
        .set("Authorization", userId);

    return res.body;
};

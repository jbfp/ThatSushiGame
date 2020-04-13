import { Request, Response } from "express";
import { Game } from "../models/game";

export default async function (_req: Request, res: Response) {
    const userId = res.locals.userId;

    const games = await Game
        .find()
        .where("players.id", userId)
        .select("_id players.id currentRound currentTurn");

    const viewModels = games.map((game): GameListItem => ({
        currentRound: game.currentRound,
        currentTurn: game.currentTurn,
        id: game._id,
        players: game.players.map(p => p.id),
    }));

    res.send(viewModels);
};

interface GameListItem {
    currentRound: number;
    currentTurn: number;
    id: string;
    players: string[];
}

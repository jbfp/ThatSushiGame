import { Request, Response } from "express";
import { createGame } from "../models/game";

export default async function (req: Request, res: Response) {
    const userId = res.locals.userId;
    const opponents = req.body.opponents;
    const players = [userId, ...opponents];
    const gameOrError = createGame(players);

    if (gameOrError instanceof Error) {
        res.status(400).send({ error: gameOrError.message });
        return;
    }

    const gameId = await gameOrError.save().then(g => g.id);
    res.send(gameId);
}

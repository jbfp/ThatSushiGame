import { Request, Response } from "express";
import mongoose from "mongoose";
import { GameEvent, GameEventKind } from "../models/events";
import { Game, setMove } from "../models/game";

export default function (sseClientsByGameId: ReadonlyMap<string, Response[]>) {
    return async function (req: Request, res: Response) {
        const userId = res.locals.userId;
        const gameId = req.params.gameId;
        const move = req.body;
        const game = await Game.findById(gameId);

        if (!game.players.some(p => p.id === userId)) {
            res.status(404).end();
            return;
        }

        let events: GameEvent[];

        try {
            events = Array.from(setMove(game, userId, move));
        } catch (err) {
            res.status(400).send(err.message);
            return;
        }

        mongoose.set("debug", true);
        await game.save();
        res.status(200).end();

        // Send Server-Sent Events to all listeners
        const clients = sseClientsByGameId.get(gameId) || [];

        for (const event of events) {
            const str = [
                `event: ${GameEventKind[event.kind]}`,
                `data: ${JSON.stringify(event.data)}`,
                "\n",
            ].join("\n");

            for (const client of clients) {
                client.write(str);
                client.flush();
            }
        }
    };
}

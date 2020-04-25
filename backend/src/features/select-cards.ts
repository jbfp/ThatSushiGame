import { Request, Response } from "express";
import { GameEvent, GameEventKind } from "../models/events";
import { Game, readyToEndTurn, selectCards } from "../models/game";

const COUNTDOWN_MS = 4_000;

export default function (
    publish: (gameId: string, gameEvent: GameEvent) => void,
    startCountdown: (gameId: string, ms: number) => void
) {
    return async function (req: Request, res: Response) {
        const userId = res.locals.userId;
        const gameId = req.params.gameId;
        const cards = req.body;
        const game = await Game.findById(gameId);

        if (!game.players.some(p => p.id === userId)) {
            res.status(404).end();
            return;
        }

        publish(gameId, { kind: GameEventKind.CountdownAborted, data: {} });

        let events: GameEvent[] = [];

        try {
            events = [...events, ...Array.from(selectCards(game, userId, cards))];
        } catch (err) {
            res.send({ error: err.message });
            return;
        }

        await game.save();
        res.send({});

        for (const event of events) {
            publish(gameId, event);
        }

        if (readyToEndTurn(game)) {
            startCountdown(gameId, COUNTDOWN_MS);
        }
    };
}

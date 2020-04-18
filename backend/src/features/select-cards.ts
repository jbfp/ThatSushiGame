import { Request, Response } from "express";
import { GameEvent, GameEventKind } from "../models/events";
import { endTurn, Game, readyToEndTurn, selectCards } from "../models/game";

const COUNTDOWN_MS = 4_000;

export default function (
    sseClientsByGameId: ReadonlyMap<string, Response[]>,
    countdownsByGameId: Map<string, NodeJS.Timeout>
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

        let events: GameEvent[] = [];

        if (countdownsByGameId.has(gameId)) {
            const timeout = countdownsByGameId.get(gameId);
            countdownsByGameId.delete(gameId);
            clearTimeout(timeout);
            events = [...events, { kind: GameEventKind.CountdownAborted, data: {} }];
        }

        try {
            events = [...events, ...Array.from(selectCards(game, userId, cards))];
        } catch (err) {
            res.send({ error: err.message });
            return;
        }

        await game.save();
        res.send({});

        if (readyToEndTurn(game)) {
            const timeout = setTimeout(async () => {
                const game = await Game.findById(gameId);
                const events = Array.from(endTurn(game));
                await game.save();
                broadcastEvents(sseClientsByGameId, gameId, events);
            }, COUNTDOWN_MS);

            countdownsByGameId.set(gameId, timeout);

            events = [...events, {
                kind: GameEventKind.CountdownStarted,
                data: { seconds: COUNTDOWN_MS / 1000 }
            }];
        }

        broadcastEvents(sseClientsByGameId, gameId, events);
    };
}

/**
 * Send events to all listeners over Server-Sent Events
 */
function broadcastEvents(
    sseClientsByGameId: ReadonlyMap<string, Response[]>,
    gameId: string,
    events: GameEvent[]
) {
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
}

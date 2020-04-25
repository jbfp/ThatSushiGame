import { Response } from "express";
import redis from "redis";
import { GameEvent, GameEventKind } from "./models/events";
import { Game, endTurn } from "./models/game";

interface GameEventMessage {
    gameId: string;
    gameEvent: GameEvent;
}

// Redis for pub/sub between cluster workers
const publisher = redis.createClient();
const subscriber = redis.createClient();

const countdownsByGameId = new Map<string, NodeJS.Timeout>();
const sseClientsByGameId = new Map<string, Response[]>();

export const startCountdown = (gameId: string, ms: number) => {
    const timeout = setTimeout(async () => {
        const game = await Game.findById(gameId);
        const events = Array.from(endTurn(game));
        await game.save();

        for (const event of events) {
            publish(gameId, event);
        }
    }, ms);

    countdownsByGameId.set(gameId, timeout);

    publish(gameId, {
        kind: GameEventKind.CountdownStarted,
        data: { seconds: ms / 1000 },
    });
};

export const subscribe = (gameId: string, res: Response) => {
    if (sseClientsByGameId.has(gameId)) {
        sseClientsByGameId.get(gameId).push(res);
    } else {
        sseClientsByGameId.set(gameId, [res]);
    }
};

export const unsubscribe = (gameId: string, res: Response) => {
    const clients = sseClientsByGameId.get(gameId) || [];
    const index = clients.indexOf(res);
    clients.splice(index, 1);

    if (clients.length === 0) {
        sseClientsByGameId.delete(gameId);
    }
};

export const publish = (gameId: string, gameEvent: GameEvent) => {
    const message: GameEventMessage = { gameId, gameEvent };
    const json = JSON.stringify(message);
    publisher.publish("game-event", json);
};

subscriber.on("message", (channel, message) => {
    if (channel === "game-event") {
        const { gameId, gameEvent }: GameEventMessage = JSON.parse(message);

        if (gameEvent.kind === GameEventKind.CountdownAborted) {
            if (countdownsByGameId.has(gameId)) {
                const timeout = countdownsByGameId.get(gameId);
                countdownsByGameId.delete(gameId);
                clearTimeout(timeout);
            }
        }

        const clients = sseClientsByGameId.get(gameId) || [];

        const str = [
            `event: ${GameEventKind[gameEvent.kind]}`,
            `data: ${JSON.stringify(gameEvent.data)}`,
            "\n",
        ].join("\n");

        for (const client of clients) {
            client.write(str);
            client.flush();
        }
    }
});

subscriber.subscribe(["game-event"]);

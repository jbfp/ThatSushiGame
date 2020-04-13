import { Request, Response } from "express";

export default function (clientsByGameId: Map<string, Response[]>) {
    return function (req: Request, res: Response) {
        const headers = {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache"
        };

        res.writeHead(200, headers);

        const gameId = req.params.gameId;

        if (clientsByGameId.has(gameId)) {
            clientsByGameId.get(gameId).push(res);
        } else {
            clientsByGameId.set(gameId, [res]);
        }

        req.on("close", () => {
            const clients = clientsByGameId.get(gameId) || [];
            const index = clients.indexOf(res);
            clients.splice(index, 1);

            if (clients.length === 0) {
                clientsByGameId.delete(gameId);
            }
        });
    };
}

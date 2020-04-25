import { Request, Response } from "express";

export default function (
    subscribe: (gameId: string, res: Response) => void,
    unsubscribe: (gameId: string, res: Response) => void
) {
    return function (req: Request, res: Response) {
        const headers = {
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache"
        };

        res.writeHead(200, headers);

        const gameId = req.params.gameId;

        subscribe(gameId, res);

        req.on("close", () => {
            unsubscribe(gameId, res);
        });
    };
}

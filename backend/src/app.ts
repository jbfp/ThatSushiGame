import bodyParser from "body-parser";
import compression from "compression";
import errorHandler from "errorhandler";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import createGame from "./features/create-game";
import getGame from "./features/get-game";
import getGames from "./features/get-games";
import { publish, startCountdown, subscribe, unsubscribe } from "./pubsub";
import selectCards from "./features/select-cards";
import stream from "./features/stream";

const app = express();
app.use(compression());
app.use(bodyParser.json({ strict: false }));
app.use(errorHandler());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/games/:gameId/stream", stream(subscribe, unsubscribe));

app.use((req, res, next) => {
    const authorization = req.get("authorization");

    if (authorization) {
        res.locals.userId = authorization;
        next();
    } else {
        res.status(401).end();
    }
});

app.post("/api/games", createGame);
app.get("/api/games", getGames);
app.get("/api/games/:gameId", getGame);
app.post("/api/games/:gameId/cards", selectCards(publish, startCountdown));

export default app;

export async function connectMongoose(url: string) {
    await mongoose.connect(url, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

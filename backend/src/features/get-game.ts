import { Request, Response } from "express";
import { Card } from "../models/card";
import { FaceUpCards } from "../models/faceUpCards";
import { Game } from "../models/game";
import { PossibleMoves } from "../models/possibleMoves";

export default async function (req: Request, res: Response) {
    const userId = res.locals.userId;
    const gameId = req.params.gameId;
    const game = await Game.findById(gameId, { deck: 0 });

    if (!game.players.some(p => p.id === userId)) {
        res.status(404).end();
        return;
    }

    const player = game.players.find(p => p.id === userId);
    const opponents = game.players.filter(p => p.id !== userId);

    const view: GameView = {
        currentRound: game.currentRound,
        currentTurn: game.currentTurn,
        id: game.id,
        player: {
            faceUpCards: player.faceUpCards,
            hand: player.hand,
            id: player.id,
            numPoints: player.numPoints,
            numPuddings: player.numPuddings,
            possibleMoves: player.possibleMoves,
            selectedCards: player.selectedCards,
        },
        opponents: opponents.map(p => ({
            faceUpCards: p.faceUpCards,
            id: p.id,
            numCards: p.hand.length,
            numPoints: p.numPoints,
            numPuddings: p.numPuddings,
            ready: p.selectedCards.length > 0,
        })),
        winner: game.winner,
    };

    res.send(view);
};

export interface GameView {
    currentRound: number;
    currentTurn: number;
    id: string;
    player: PlayerView;
    opponents: OpponentView[];
    winner: string | null;
}

export interface PlayerView {
    faceUpCards: FaceUpCards;
    hand: Card[];
    id: string;
    numPoints: number;
    numPuddings: number;
    possibleMoves: PossibleMoves;
    selectedCards: Card[];
}

export interface OpponentView {
    faceUpCards: FaceUpCards;
    id: string;
    numCards: number;
    numPoints: number;
    numPuddings: number;
    ready: boolean;
}

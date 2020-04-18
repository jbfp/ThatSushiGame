import mongoose, { Document } from "mongoose";
import { Card, CardKind } from "./card";
import { createShuffledDeck, dealHands } from "./deck";
import { GameEvent, GameEventKind } from "./events";
import { countPuddings, FaceUpCardKind, FaceUpCards, playCards as playCardsFuc } from "./faceUpCards";
import { Hand, playCards as playCardsHand } from "./hand";
import { calculatePossibleMoves, PossibleMoves } from "./possibleMoves";
import { scoreRound } from "./scoring";

const NUM_ROUNDS = 3;

export interface IPlayer {
    faceUpCards: FaceUpCards;
    hand: Hand;
    id: string;
    numPoints: number;
    numPuddings: number;
    possibleMoves: PossibleMoves;
    selectedCards: number[];
}

export interface IGame {
    currentRound: number;
    currentTurn: number;
    deck: Card[];
    numTurnsPerRound: number;
    players: IPlayer[];
    winner: string | null;
}

export interface IGameDocument extends Document, IGame { }

const PlayerSchema = new mongoose.Schema({
    faceUpCards: { type: [Object], required: true },
    hand: { type: [Object], required: true },
    id: { type: String, required: true, index: true },
    numPoints: { type: Number, required: true },
    numPuddings: { type: Number, required: true },
    possibleMoves: { type: [Object], required: true },
    selectedCards: { type: [Number], required: true },
}, { _id: false });

const GameSchema = new mongoose.Schema({
    currentRound: { type: Number, required: true },
    currentTurn: { type: Number, required: true },
    deck: { type: [Object], required: true },
    players: { type: [PlayerSchema], required: true },
    numTurnsPerRound: { type: Number, required: true },
    winner: { type: String },
}, { timestamps: true });

export const Game = mongoose.model<IGameDocument>("Game", GameSchema);

export function createGame(playerIds: string[]): IGameDocument | Error {
    const numPlayers = playerIds.length;

    if (numPlayers < 2) {
        return new Error("Too few players");
    }

    if (numPlayers > 5) {
        return new Error("Too many players");
    }

    for (let i = 0; i < playerIds.length; i++) {
        for (let j = i + 1; j < playerIds.length; j++) {
            if (playerIds[i] === playerIds[j]) {
                return new Error("Duplicate players");
            }
        }
    }

    const deck = createShuffledDeck();
    const numCardsPerPlayer = getNumCardsPerPlayer(numPlayers);
    const hands = dealHands(deck, numPlayers, numCardsPerPlayer);
    const players = playerIds.map((id): IPlayer => {
        const faceUpCards: FaceUpCards = [];
        const hand = hands.pop();
        const possibleMoves = calculatePossibleMoves(hand, faceUpCards);

        return {
            faceUpCards,
            hand,
            id,
            numPoints: 0,
            numPuddings: 0,
            possibleMoves,
            selectedCards: [],
        };
    });

    const game: IGame = {
        currentRound: 0,
        currentTurn: 0,
        deck,
        players,
        numTurnsPerRound: numCardsPerPlayer,
        winner: null,
    };

    return new Game(game);
}

export function* selectCards(game: IGame, playerId: string, cards: number[]): Generator<GameEvent> {
    const player = game.players.find(p => p.id === playerId);

    if (!player) {
        throw new Error("Player is not in game");
    }

    if (cards.length > 2) {
        throw new Error("Too many cards selected");
    }

    if (cards.length > 1) {
        // Verify player has chopsticks
        const hasChopsticks = player.faceUpCards.some(f =>
            f.kind === FaceUpCardKind.Card &&
            f.card.kind === CardKind.Chopsticks);

        if (!hasChopsticks) {
            throw new Error("Player does not have chopsticks; only one card can be played without chopsticks");
        }
    }

    for (const card of cards) {
        const hasCard = card < player.hand.length;

        if (!hasCard) {
            throw new Error("Player does not have card");
        }
    }

    player.selectedCards = cards;

    yield {
        kind: GameEventKind.CardsSelected,
        data: { playerId },
    };

    if (game.players.every(p => p.selectedCards.length > 0)) {
        for (const event of endTurn(game)) {
            yield event;
        }
    }
}

export function* endTurn(game: IGame): Generator<GameEvent> {
    const players = game.players;

    // Do moves
    for (const player of players) {
        step(player);
    }

    yield {
        kind: GameEventKind.TurnOver,
        data: { turn: game.currentTurn },
    };

    game.currentTurn += 1;

    if (game.currentTurn === game.numTurnsPerRound) {
        for (const event of endRound(game)) {
            yield event;
        }
    } else {
        // Rotate hands
        const hands = new Array<Hand>(players.length);

        for (let index = 0; index < players.length; index++) {
            const player = game.players[index];
            const hand = takeHand(player);
            const newIndex = (index + 1) % players.length;
            hands[newIndex] = hand;
        }

        for (let index = 0; index < hands.length; index++) {
            giveHand(players[index], hands[index]);
        }
    }
}

export function* endRound(game: IGame): Generator<GameEvent> {
    const players = game.players;

    // Score round
    const faceUpCardsByPlayerId = Object.fromEntries(
        players.map(p => [p.id, p.faceUpCards]));

    const scoresByPlayerId = scoreRound(faceUpCardsByPlayerId);

    for (const playerId in scoresByPlayerId) {
        const player = game.players.find(p => p.id === playerId);
        const score = scoresByPlayerId[playerId];
        roundOver(player, score);
    }

    yield {
        kind: GameEventKind.RoundOver,
        data: { round: game.currentRound },
    };

    game.currentRound += 1;

    if (game.currentRound === NUM_ROUNDS) {
        for (const event of endGame(game)) {
            yield event;
        }
    } else {
        game.currentTurn = 0;

        // Deal new hands
        const newHands = dealHands(
            game.deck,
            players.length,
            game.numTurnsPerRound);

        for (let index = 0; index < newHands.length; index++) {
            giveHand(players[index], newHands[index]);
        }
    }
}

export function* endGame(game: IGame): Generator<GameEvent> {
    const sorted = game.players
        .sort((lhs, rhs) => lhs.numPoints - rhs.numPoints)
        .map(p => p.id);

    game.winner = sorted[0];

    yield {
        kind: GameEventKind.GameOver,
        data: { winner: game.winner },
    };
}

export function getNumCardsPerPlayer(numPlayers: number): number {
    switch (numPlayers) {
        case 2: return 5;
        case 3: return 9;
        case 4: return 8;
        case 5: return 7;
    }
}

export function takeHand(player: IPlayer): Hand {
    const hand = player.hand;
    player.hand = [];
    return hand;
}

export function giveHand(player: IPlayer, hand: Hand) {
    player.hand = hand;
    player.possibleMoves = calculatePossibleMoves(player.hand, player.faceUpCards);
}

export function step(player: IPlayer) {
    const playedCards = playCardsHand(player.hand, player.selectedCards);
    player.selectedCards = [];

    playCardsFuc(player.faceUpCards, playedCards);
    player.numPuddings = countPuddings(player.faceUpCards);
}

export function roundOver(player: IPlayer, score: number) {
    player.numPoints += score;
    player.faceUpCards = [];
    player.hand = [];
}

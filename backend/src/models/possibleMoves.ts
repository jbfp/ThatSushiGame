import { Card, CardKind } from "./card";
import { FaceUpCardKind, FaceUpCards } from "./faceUpCards";
import { Hand } from "./hand";
import { Move, MoveKind } from "./move";

export type PossibleMoves = Move[];

export function calculatePossibleMoves(hand: Hand, faceUpCards: FaceUpCards): PossibleMoves {
    const possibleMoves: PossibleMoves = [];

    for (const card of hand) {
        possibleMoves.push({
            kind: MoveKind.Card,
            card,
        });
    }

    for (const faceUpCard of faceUpCards) {
        if (faceUpCard.kind !== FaceUpCardKind.Card) {
            continue;
        }

        const card = faceUpCard.card;

        if (card.kind === CardKind.Chopsticks) {
            for (const card0 of hand) {
                for (const card1 of hand) {
                    if (card0 === card1) {
                        continue;
                    }

                    for (const [move0, move1] of combineCards(card0, card1)) {
                        possibleMoves.push({
                            kind: MoveKind.Chopsticks,
                            chopsticks: card,
                            move0,
                            move1,
                        });
                    }
                }
            }
        }
    }

    return possibleMoves;
}

function* combineCards(card0: Card, card1: Card): Generator<[Move, Move]> {
    yield [{
        kind: MoveKind.Card,
        card: card0,
    }, {
        kind: MoveKind.Card,
        card: card1,
    }];
}

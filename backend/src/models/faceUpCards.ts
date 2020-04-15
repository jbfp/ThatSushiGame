import { Card, CardKind, Nigiri, Pudding, Wasabi } from "./card";
import { Move, MoveKind } from "./move";
import * as Scoring from "./scoring";

export enum FaceUpCardKind {
    Card,
    Wasabi,
}

export interface CardFaceUpCard {
    kind: FaceUpCardKind.Card;
    card: Card;
}

export interface WasabiFaceUpCard {
    kind: FaceUpCardKind.Wasabi;
    wasabi: Wasabi;
    nigiri: Nigiri;
}

export type FaceUpCard = CardFaceUpCard | WasabiFaceUpCard;
export type FaceUpCards = FaceUpCard[];

export function countPuddings(faceUpCards: FaceUpCards) {
    return faceUpCards
        .filter(c => c.kind === FaceUpCardKind.Card)
        .map(c => (c as CardFaceUpCard).card)
        .filter(card => card.kind === CardKind.Pudding)
        .map(c => c as Pudding)
        .length;
}

export function doMove(faceUpCards: FaceUpCards, move: Move) {
    if (move.kind === MoveKind.Card) {
        if (move.card.kind === CardKind.Nigiri) {
            // Remove the wasabi
            const index = faceUpCards.findIndex(fuc =>
                fuc.kind === FaceUpCardKind.Card &&
                fuc.card.kind === CardKind.Wasabi);

            if (index === -1) {
                // Player does not have wasabi, add Nigir as normal card
                faceUpCards.push({
                    kind: FaceUpCardKind.Card,
                    card: move.card,
                });
            } else {
                const removed = faceUpCards.splice(index, 1);
                const wasabi = (removed[0] as CardFaceUpCard).card as Wasabi;

                console.log(removed, wasabi);

                // Combine the wasabi and the nigiri
                faceUpCards.push({
                    kind: FaceUpCardKind.Wasabi,
                    nigiri: move.card,
                    wasabi,
                });
            }
        } else {
            faceUpCards.push({
                kind: FaceUpCardKind.Card,
                card: move.card,
            });
        }
    } else if (move.kind === MoveKind.Chopsticks) {
        // Remove chopsticks
        const index = faceUpCards.findIndex(fuc =>
            fuc.kind === FaceUpCardKind.Card &&
            fuc.card.kind === CardKind.Chopsticks);

        faceUpCards.splice(index, 1);

        // Do move0
        doMove(faceUpCards, move.move0);

        // Do move1 with result of move0
        doMove(faceUpCards, move.move1);
    }
}

export function scoreFaceUpCards(
    faceUpCards: FaceUpCards
): [number, number] {
    let nigiriPoints = 0;
    let numDumplings = 0;
    let numMakiRolls = 0;
    let numTempuras = 0;
    let numSashimis = 0;

    for (const faceUpCard of faceUpCards) {
        if (faceUpCard.kind === FaceUpCardKind.Card) {
            const card = faceUpCard.card;

            if (card.kind === CardKind.Dumpling) {
                numDumplings++;
            } else if (card.kind === CardKind.MakiRolls) {
                numMakiRolls += card.makiRollsKind;
            } else if (card.kind === CardKind.Nigiri) {
                nigiriPoints += Scoring.scoreNigiri(card);
            } else if (card.kind === CardKind.Tempura) {
                numTempuras++;
            } else if (card.kind === CardKind.Sashimi) {
                numSashimis++;
            }
        } else if (faceUpCard.kind === FaceUpCardKind.Wasabi) {
            nigiriPoints += Scoring.scoreWasabiFaceUpCard(faceUpCard);
        }
    }

    const tempuraPoints = Scoring.scoreTempuras(numTempuras);
    const sashimiPoints = Scoring.scoreSashimis(numSashimis);
    const dumplingPoints = Scoring.scoreDumplings(numDumplings);
    const totalPoints = nigiriPoints + tempuraPoints + sashimiPoints + dumplingPoints;
    return [totalPoints, numMakiRolls];
}

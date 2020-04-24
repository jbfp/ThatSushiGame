import { Card, CardKind, Nigiri, Pudding, Wasabi } from "./card";

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

export function playCards(faceUpCards: FaceUpCards, cards: Card[]) {
    if (cards.length > 1) {
        // Remove chopsticks
        const index = faceUpCards.findIndex(fuc =>
            fuc.kind === FaceUpCardKind.Card &&
            fuc.card.kind === CardKind.Chopsticks);

        faceUpCards.splice(index, 1);

        for (const card of cards) {
            playCards(faceUpCards, [card]);
        }
    } else if (cards.length === 1) {
        const card = cards[0];

        if (card.kind === CardKind.Nigiri) {
            // Remove the wasabi
            const index = faceUpCards.findIndex(fuc =>
                fuc.kind === FaceUpCardKind.Card &&
                fuc.card.kind === CardKind.Wasabi);

            if (index === -1) {
                // Player does not have wasabi, add Nigir as normal card
                faceUpCards.push({
                    kind: FaceUpCardKind.Card,
                    card: card,
                });
            } else {
                const removed = faceUpCards.splice(index, 1);
                const wasabi = (removed[0] as CardFaceUpCard).card as Wasabi;

                // Combine the wasabi and the nigiri
                faceUpCards.push({
                    kind: FaceUpCardKind.Wasabi,
                    nigiri: card,
                    wasabi,
                });
            }
        } else {
            faceUpCards.push({
                kind: FaceUpCardKind.Card,
                card: card,
            });
        }
    }
}

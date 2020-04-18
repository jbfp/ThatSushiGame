import { Card, CardKind } from "./card";

export type Hand = Card[];

export function playCards(hand: Hand, cards: number[]): Card[] {
    if (cards.length > 1) {
        const removed = cards.map(card => hand[card]);

        for (const card of removed) {
            const index = hand.indexOf(card);
            hand.splice(index, 1);
        }

        hand.push({ kind: CardKind.Chopsticks });
        return removed;
    } else if (cards.length === 1) {
        return hand.splice(cards[0], 1);
    }
}

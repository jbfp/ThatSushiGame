import _ from "lodash";
import { Card, CardKind } from "./card";

export type Hand = Card[];

export function playCards(hand: Hand, cards: Card[]) {
    if (cards.length > 1) {
        hand.push({ kind: CardKind.Chopsticks });

        for (const card of cards) {
            playCards(hand, [card]);
        }
    } else if (cards.length === 1) {
        const card = cards[0];
        const index = hand.findIndex(c => _.isEqual(c, card));
        hand.splice(index, 1);
    }
}

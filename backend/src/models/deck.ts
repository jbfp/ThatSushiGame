import _ from "lodash";
import { Card, CardKind, MakiRollsKind, NigiriKind } from "./card";
import { Hand } from "./hand";

const allCards: readonly Card[] = [
    ...Array(14).fill({ kind: CardKind.Tempura }),
    ...Array(14).fill({ kind: CardKind.Sashimi }),
    ...Array(14).fill({ kind: CardKind.Dumpling }),
    ...Array(12).fill({ kind: CardKind.MakiRolls, makiRollsKind: MakiRollsKind.Two }),
    ...Array(8).fill({ kind: CardKind.MakiRolls, makiRollsKind: MakiRollsKind.Three }),
    ...Array(6).fill({ kind: CardKind.MakiRolls, makiRollsKind: MakiRollsKind.One }),
    ...Array(10).fill({ kind: CardKind.Nigiri, nigiriKind: NigiriKind.Salmon }),
    ...Array(5).fill({ kind: CardKind.Nigiri, nigiriKind: NigiriKind.Squid }),
    ...Array(5).fill({ kind: CardKind.Nigiri, nigiriKind: NigiriKind.Egg }),
    ...Array(10).fill({ kind: CardKind.Pudding }),
    ...Array(6).fill({ kind: CardKind.Wasabi }),
    ...Array(4).fill({ kind: CardKind.Chopsticks }),
];

export function index(card: Card): number {
    return allCards.indexOf(card);
}

export type Deck = Card[];

export function createShuffledDeck(): Deck {
    return _.shuffle([...allCards]);
};

export function dealHands(
    deck: Deck,
    numPlayers: number,
    numCardsPerPlayer: number
): Hand[] {
    const hands = [];

    for (let h = 0; h < numPlayers; h++) {
        const hand = [];

        for (let c = 0; c < numCardsPerPlayer; c++) {
            hand.push(deck.pop());
        }

        hands.push(hand);
    }

    return hands;
}

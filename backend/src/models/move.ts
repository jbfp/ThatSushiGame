import { Card, Chopsticks } from "./card";

export enum MoveKind {
    Card,
    Chopsticks,
    Wasabi,
}

export interface CardMove {
    kind: MoveKind.Card;
    card: Card;
}

export interface ChopsticksMove {
    kind: MoveKind.Chopsticks;
    chopsticks: Chopsticks;
    move0: Move;
    move1: Move;
}

export type Move = CardMove | ChopsticksMove;

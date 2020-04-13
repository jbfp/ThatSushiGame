import { Card, Chopsticks, Nigiri, Wasabi } from "./card";

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

export interface WasabiMove {
    kind: MoveKind.Wasabi;
    wasabi: Wasabi;
    nigiri: Nigiri;
}

export type Move = CardMove | ChopsticksMove | WasabiMove;

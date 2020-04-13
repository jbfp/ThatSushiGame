export enum MakiRollsKind {
    One = 1,
    Two = 2,
    Three = 3,
}

export enum NigiriKind {
    Egg = 1,
    Salmon = 2,
    Squid = 3,
}

export enum CardKind {
    Chopsticks,
    Dumpling,
    MakiRolls,
    Nigiri,
    Pudding,
    Sashimi,
    Tempura,
    Wasabi,
}

export interface Chopsticks {
    readonly kind: CardKind.Chopsticks;
}

export interface Dumpling {
    readonly kind: CardKind.Dumpling;
}

export interface MakiRolls {
    readonly kind: CardKind.MakiRolls;
    readonly makiRollsKind: MakiRollsKind;
}

export interface Nigiri {
    readonly kind: CardKind.Nigiri;
    readonly nigiriKind: NigiriKind;
}

export interface Pudding {
    readonly kind: CardKind.Pudding;
}

export interface Sashimi {
    readonly kind: CardKind.Sashimi;
}

export interface Tempura {
    readonly kind: CardKind.Tempura;
}

export interface Wasabi {
    readonly kind: CardKind.Wasabi;
}

export type Card = Chopsticks | Dumpling | MakiRolls | Nigiri | Pudding | Sashimi | Tempura | Wasabi;

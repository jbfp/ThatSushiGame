export enum GameEventKind {
    CardsSelected,
    TurnOver,
    RoundOver,
    GameOver,
}

export interface CardsSelectedGameEvent {
    kind: GameEventKind.CardsSelected;
    data: {
        playerId: string;
    };
}

export interface TurnOverGameEvent {
    kind: GameEventKind.TurnOver;
    data: {
        turn: number;
    };
}

export interface RoundOverGameEvent {
    kind: GameEventKind.RoundOver;
    data: {
        round: number;
    };
}

export interface GameOverGameEvent {
    kind: GameEventKind.GameOver;
    data: {
        winner: string;
    };
}

export type GameEvent = CardsSelectedGameEvent | TurnOverGameEvent | RoundOverGameEvent | GameOverGameEvent;

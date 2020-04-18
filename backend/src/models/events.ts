export enum GameEventKind {
    CardsSelected,
    CountdownStarted,
    CountdownAborted,
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

export interface CountdownStartedGameEvent {
    kind: GameEventKind.CountdownStarted;
    data: {
        seconds: number;
    };
}

export interface CountdownAbortedGameEvent {
    kind: GameEventKind.CountdownAborted;
    data: {};
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

export type GameEvent
    = CardsSelectedGameEvent
    | CountdownStartedGameEvent
    | CountdownAbortedGameEvent
    | TurnOverGameEvent
    | RoundOverGameEvent
    | GameOverGameEvent;

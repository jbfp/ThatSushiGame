export enum GameEventKind {
    MoveSet,
    TurnOver,
    RoundOver,
    GameOver,
}

export interface MoveSetGameEvent {
    kind: GameEventKind.MoveSet;
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

export type GameEvent = MoveSetGameEvent | TurnOverGameEvent | RoundOverGameEvent | GameOverGameEvent;

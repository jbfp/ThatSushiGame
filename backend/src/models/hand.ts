import { Card } from "./card";
import { Move, MoveKind } from "./move";

export type Hand = Card[];

export function doMove(hand: Hand, move: Move) {
    if (move.kind === MoveKind.Card) {
        const index = hand.findIndex(c => c === move.card);
        hand.splice(index, 1);
    } else if (move.kind === MoveKind.Chopsticks) {
        hand.push(move.chopsticks);
        doMove(hand, move.move0);
        doMove(hand, move.move1);
    } else if (move.kind === MoveKind.Wasabi) {
        const index = hand.findIndex(c => c === move.nigiri);
        hand.splice(index, 1);
    }
}

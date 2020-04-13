import { Nigiri } from "./card";
import * as FUC from "./faceUpCards";

export function scoreNigiri(nigiri: Nigiri): number {
    return nigiri.kind;
}

export function scoreWasabiFaceUpCard(wasabiFaceUpCard: FUC.WasabiFaceUpCard): number {
    return 3 * scoreNigiri(wasabiFaceUpCard.nigiri);
}

export function scoreTempuras(numTempuras: number): number {
    if (numTempuras < 0) {
        throw new Error("Negative number of tempuras");
    }

    return 5 * Math.trunc(numTempuras / 2);
}

export function scoreSashimis(numSashimis: number): number {
    if (numSashimis < 0) {
        throw new Error("Negative number of sashimis");
    }

    return 10 * Math.trunc(numSashimis / 3);
}

export function scoreDumplings(numDumplings: number): number {
    if (numDumplings < 0) {
        throw new Error("Negative number of dumplings");
    }

    switch (numDumplings) {
        case 0: return 0;
        case 1: return 1;
        case 2: return 3;
        case 3: return 6;
        case 4: return 10;
        default: return 15;
    }
}

export function scoreRound(
    round: Record<string, FUC.FaceUpCards>
): Record<string, number> {
    const scoreByPlayerId: Record<string, number> = {};
    const numMakiRollsByPlayerId: Record<string, number> = {};

    for (const playerId in round) {
        if (round.hasOwnProperty(playerId)) {
            const faceUpCards = round[playerId];
            const [numPoints, numMakiRolls] = FUC.scoreFaceUpCards(faceUpCards);
            scoreByPlayerId[playerId] = numPoints;
            numMakiRollsByPlayerId[playerId] = numMakiRolls;
        }
    }

    // TODO: Calculate maki roll points

    return scoreByPlayerId;
}

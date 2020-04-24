import { Nigiri } from "./card";
import * as FUC from "./faceUpCards";

/**
 * Scores a Nigiri card.
 * - Egg = 1 point
 * - Salmon = 2 points
 * - Squid = 3 points
 */
export function scoreNigiri(nigiri: Nigiri): number {
    return nigiri.nigiriKind;
}

/**
 * Scores a Nigiri card with Wasabi.
 * The score is 3 × the value of the Nigiri.
 */
export function scoreWasabiFaceUpCard(wasabiFaceUpCard: FUC.WasabiFaceUpCard): number {
    return 3 * scoreNigiri(wasabiFaceUpCard.nigiri);
}

/**
 * Calculates the score of the given set of Tempuras.
 * The score is 5 points per pair of Tempuras.
 */
export function scoreTempuras(numTempuras: number): number {
    if (numTempuras < 0) {
        throw new Error("Negative number of tempuras");
    }

    return 5 * Math.trunc(numTempuras / 2);
}

/**
 * Calculates the score of the given set of Sashimis.
 * The score is 10 points per trio of Sashimis.
 */
export function scoreSashimis(numSashimis: number): number {
    if (numSashimis < 0) {
        throw new Error("Negative number of sashimis");
    }

    return 10 * Math.trunc(numSashimis / 3);
}

/**
 * Calculates the score of the given set of Dumplings.
 * - 0 dumplings = 0 points
 * - 1 dumpling = 1 point
 * - 2 dumplings = 3 points
 * - 3 dumplings = 6 points
 * - 4 dumplings = 10 points
 * - 5 or more dumplings = 15 points
 */
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

    

    return scoreByPlayerId;
}

import _ from "lodash";
import { Nigiri, CardKind } from "./card";
import { FaceUpCards, FaceUpCardKind, WasabiFaceUpCard } from "./faceUpCards";

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
export function scoreWasabiFaceUpCard(wasabiFaceUpCard: WasabiFaceUpCard): number {
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

/**
 * Scores a set of Maki Rolls, each assigned to a Player ID.
 * The player with the most Maki Rolls scores 6 points. If multiple players tie
 * for the most, they split the 6 points evenly
 * (ignoring any remainder) and no second place points are awarded.
 * 
 * The player with the second most Maki Rolls scores 3 points. If multiple players
 * tie for second place, they split the points evenly (ignoring any remainder).
 */
export function scoreMakiRolls(
    numMakiRollsByPlayerId: Record<string, number>
): Record<string, number> {
    const entries = Object.entries(numMakiRollsByPlayerId);
    const grouped = _.groupBy(entries, o => o[1]);
    const ordered = _.orderBy(grouped, o => o[0]);
    const firstPlace = ordered[0];
    const secondPlace = ordered.length > 0 ? ordered[1] : [];
    const hasFirstPlaceTie = firstPlace.length > 1;
    const firstPlacePoints = Math.trunc(6 / firstPlace.length);
    const secondPlacePoints = hasFirstPlaceTie ? 0 : Math.trunc(3 / secondPlace.length);
    const result: Record<string, number> = {};

    for (const playerId in numMakiRollsByPlayerId) {
        if (numMakiRollsByPlayerId.hasOwnProperty(playerId)) {
            let points: number;

            if (firstPlace.some(o => o[0] === playerId)) {
                points = firstPlacePoints;
            } else if (secondPlace.some(o => o[0] === playerId)) {
                points = secondPlacePoints;
            } else {
                points = 0;
            }

            result[playerId] = points;
        }
    }

    return result;
}

/**
 * Scores a set of face-up cards.
 * @returns A tuple consisting of the number of points and the number of Maki Rolls.
 */
export function scoreFaceUpCards(
    faceUpCards: FaceUpCards
): [number, number] {
    let nigiriPoints = 0;
    let numDumplings = 0;
    let numMakiRolls = 0;
    let numTempuras = 0;
    let numSashimis = 0;

    for (const faceUpCard of faceUpCards) {
        if (faceUpCard.kind === FaceUpCardKind.Card) {
            const card = faceUpCard.card;

            if (card.kind === CardKind.Dumpling) {
                numDumplings++;
            } else if (card.kind === CardKind.MakiRolls) {
                numMakiRolls += card.makiRollsKind;
            } else if (card.kind === CardKind.Nigiri) {
                nigiriPoints += scoreNigiri(card);
            } else if (card.kind === CardKind.Tempura) {
                numTempuras++;
            } else if (card.kind === CardKind.Sashimi) {
                numSashimis++;
            }
        } else if (faceUpCard.kind === FaceUpCardKind.Wasabi) {
            nigiriPoints += scoreWasabiFaceUpCard(faceUpCard);
        }
    }

    const tempuraPoints = scoreTempuras(numTempuras);
    const sashimiPoints = scoreSashimis(numSashimis);
    const dumplingPoints = scoreDumplings(numDumplings);
    const totalPoints = nigiriPoints + tempuraPoints + sashimiPoints + dumplingPoints;
    return [totalPoints, numMakiRolls];
}

export function scoreRound(
    round: Record<string, FaceUpCards>
): Record<string, number> {
    const scoreByPlayerId: Record<string, number> = {};
    const numMakiRollsByPlayerId: Record<string, number> = {};

    for (const playerId in round) {
        if (round.hasOwnProperty(playerId)) {
            const faceUpCards = round[playerId];
            const [numPoints, numMakiRolls] = scoreFaceUpCards(faceUpCards);
            scoreByPlayerId[playerId] = numPoints;
            numMakiRollsByPlayerId[playerId] = numMakiRolls;
        }
    }

    const makiRollPointsByPlayerId = scoreMakiRolls(numMakiRollsByPlayerId);

    for (const playerId in makiRollPointsByPlayerId) {
        if (makiRollPointsByPlayerId.hasOwnProperty(playerId)) {
            scoreByPlayerId[playerId] += makiRollPointsByPlayerId[playerId];
        }
    }

    return scoreByPlayerId;
}

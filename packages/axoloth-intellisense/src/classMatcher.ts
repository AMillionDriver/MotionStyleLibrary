export function findClosestClass(
  unknownClass: string,
  knownClasses: string[],
  maxDistance = 3
): string | undefined {
  let bestClass: string | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;

  knownClasses.forEach((knownClass) => {
    const distance = getLevenshteinDistance(unknownClass, knownClass);

    if (distance < bestDistance) {
      bestClass = knownClass;
      bestDistance = distance;
    }
  });

  if (bestDistance > maxDistance) {
    return undefined;
  }

  return bestClass;
}

function getLevenshteinDistance(left: string, right: string): number {
  const previousRow = Array.from({ length: right.length + 1 }, (_, index) => index);
  const currentRow = Array.from({ length: right.length + 1 }, () => 0);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    currentRow[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      currentRow[rightIndex] = Math.min(
        previousRow[rightIndex] + 1,
        currentRow[rightIndex - 1] + 1,
        previousRow[rightIndex - 1] + substitutionCost
      );
    }

    for (let rightIndex = 0; rightIndex <= right.length; rightIndex += 1) {
      previousRow[rightIndex] = currentRow[rightIndex];
    }
  }

  return previousRow[right.length];
}

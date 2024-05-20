import dictionary_ from "./dictionary.json?raw";

const dictionary: Set<string> = new Set(
  JSON.parse(dictionary_).flatMap((word: string) => word.split(" ")),
);

function shuffle<T>(a: T[]): T[] {
  let j: number, x: T, i: number;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * Returns an array of predicted strings with the elements ordered from the most likely
 * to the least likely
 */
function predict_(_str: string): string[] {
  const dict: string[] = [...dictionary, ""];
  return shuffle(dict);
}

/**
 * Gets the characters after the last space in the string
 */
function lastWord(str: string): string {
  return str.slice(str.lastIndexOf(" ") + 1);
}

/**
 * Returns a value to be set as the next prediction or
 * an array of predicted strings with the elements ordered from the most likely
 * to the least likely.
 */
export function predict(
  value: string,
  predictions: string[],
): string | string[] {
  // Removing non-breaking spaces
  const str: string = value.replaceAll("\u00A0", "\u0020");
  if (!str.includes(" ")) {
    // predict nothing if there is one word or less
    return "";
  } else if (str.at(-1) === " ") {
    // Pool the neural network for a new pool of predictions when the word ends
    // This should also take care of the case
    // when the user accidentally types space and then deletes it
    // perhaps by giving the neural network an ability to predict nothing as the best option
    const pool = predict_(value);
    return pool;
  }
  const chars: string = lastWord(str);
  return predictions
    .filter(
      (prediction: string) => prediction === "" || prediction.startsWith(chars),
    )[0]
    .slice(chars.length);
}

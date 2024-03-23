/**
 * Returns an array of predicted strings with the elements ordered from the most likely
 * to the least likely
 */
function predict_(value: string): string[] {
  // TODO
  return [];
}

/**
 * Gets the characters after the last space in the string
 */
function lastWord(value: string): string {
  return value.slice(value.lastIndexOf(" ") + 1);
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
  if (!value.includes(" ")) {
    // predict nothing if there is one word or less
    return "";
  } else if (value.at(-1) === " ") {
    // Pool the neural network for a new pool of predictions when the word ends
    // This should also take care of the case
    // when the user accidentally types space and then deletes it
    // perhaps by giving the neural network an ability to predict nothing as the best option
    const pool = predict_(value);
    return pool;
  }
  const chars: string = lastWord(value);
  return predictions.filter(
    (prediction: string) => prediction === "" || prediction.startsWith(chars),
  )[0].slice(chars.length);
}

/**
 * Ordering code taken from Figma's app bundle.
 *
 * https://www.figma.com/blog/realtime-editing-of-ordered-sequences/#fractional-indexing/
 * https://web.archive.org/web/20200326040431/https://www.figma.com/figbuild/symlinks/figma_app.0380b72e2bc066b109c64b66ba865baa.min.js
 * https://steve.dignam.xyz/2020/03/31/practical-ordering/
 */

/**
 * Example:
 * Let's say we want to generate a position string between 'a' and 'm':
 *
 * Step 1: The character code of 'a' is 97 and 'm' is 109.
 * Step 2: The avg(97, 109) = (97 + 109) / 2 = 103 (which corresponds to the character 'g').
 *
 * So, the position generated between 'a' and 'm' is 'g'.
 *
 * If more characters were needed, the algorithm would continue to compute averages
 * for subsequent characters to find a valid midpoint string. But in this case,
 * 'g' is directly between 'a' and 'm'.
 *
 * The position string 'g' would be returned as the new position between 'a' and 'm'.
 */

/**
 * Constants defining the range of valid character codes for position strings.
 * START_CHAR_CODE = 32 (space character)
 * END_CHAR_CODE = 126 (tilde '~' character)
 * FIRST_POSITION is the first valid position string, starting from the character '!'
 */
const START_CHAR_CODE = 32;
const END_CHAR_CODE = 126;
export const FIRST_POSITION = String.fromCharCode(START_CHAR_CODE + 1);

/**
 * Helper function to throw an error if an expression evaluates to false.
 * Used for development assertions to catch invalid conditions.
 *
 * @param expr - A boolean expression that should be true.
 */
function assertDev(expr: boolean) {
  if (!expr) {
    throw Error('Assertion Error');
  }
}

/**
 * Compares two position strings lexicographically.
 * Returns:
 *  -1 if firstPos < secondPos
 *   1 if firstPos > secondPos
 *   0 if they are equal
 *
 * This is used to determine the relative order between two positions.
 *
 * @param firstPos - The first position string.
 * @param secondPos - The second position string.
 * @returns -1, 0, or 1 depending on the comparison result.
 */
export function comparePositions(firstPos: string, secondPos: string) {
  return +(firstPos < secondPos) - +(firstPos > secondPos);
}

/**
 * Validates whether a position string is valid.
 * A valid position string must:
 *  - Not be empty.
 *  - Not end with the START_CHAR_CODE (space).
 *  - Contain characters within the defined range (START_CHAR_CODE to END_CHAR_CODE).
 *
 * @param pos - The position string to validate.
 * @returns True if the position is valid, otherwise false.
 */
export function isValidPosition(pos: string) {
  if (pos === '' || pos.charCodeAt(pos.length - 1) === START_CHAR_CODE) {
    return false;
  }
  for (let i = 0; i < pos.length; i++) {
    const t = pos.charCodeAt(i);
    if (t < START_CHAR_CODE || t > END_CHAR_CODE) {
      return false;
    }
  }
  return true;
}

/**
 * Generates a position string that comes lexicographically immediately before the given position.
 * It works by decrementing the last character of the position string that can be decremented.
 *
 * If no valid decrement is possible, it appends characters that make the position smaller
 * but still valid (starting from space and tilde).
 *
 * @param pos - The current position string.
 * @returns A new position string that comes before the input position.
 */
export function positionBefore(pos: string) {
  assertDev(0 !== pos.length);

  for (let i = pos.length - 1; i >= 0; i--) {
    const curCharCode = pos.charCodeAt(i);
    if (curCharCode > START_CHAR_CODE + 1) {
      const position = pos.substr(0, i) + String.fromCharCode(curCharCode - 1);
      assertDev(isValidPosition(position));
      return position;
    }
  }

  const position =
    pos.slice(0, pos.length - 1) +
    String.fromCharCode(START_CHAR_CODE) +
    String.fromCharCode(END_CHAR_CODE);
  assertDev(isValidPosition(position));
  return position;
}

/**
 * Generates a position string that comes lexicographically immediately after the given position.
 * It works by incrementing the last character of the position string that can be incremented.
 *
 * If no valid increment is possible, it appends a character that makes the position larger.
 *
 * @param pos - The current position string.
 * @returns A new position string that comes after the input position.
 */
export function positionAfter(pos: string) {
  assertDev(0 !== pos.length);

  for (let i = pos.length - 1; i >= 0; i--) {
    const curCharCode = pos.charCodeAt(i);
    if (curCharCode < END_CHAR_CODE) {
      const position = pos.substr(0, i) + String.fromCharCode(curCharCode + 1);
      assertDev(isValidPosition(position));
      return position;
    }
  }

  const position = pos + String.fromCharCode(START_CHAR_CODE + 1);
  assertDev(isValidPosition(position));
  return position;
}

/**
 * Helper function to compute the average of two numbers.
 * Returns the truncated (integer) average of the two values.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The truncated average of a and b.
 */
function avg(a: number, b: number) {
  return Math.trunc((a + b) / 2);
}

/**
 * Generates a new position string that is lexicographically between two existing position strings.
 * This is useful for inserting a new item between two existing items in an ordered sequence.
 *
 * The function iterates through the characters of both position strings and finds a midpoint
 * between them to create the new position.
 *
 * If the two positions are very close (differ by only 1 in their character codes), it appends
 * additional characters to ensure a valid midpoint can be generated.
 *
 * @param firstPos - The first (smaller) position string.
 * @param secondPos - The second (larger) position string.
 * @returns A new position string that is lexicographically between firstPos and secondPos.
 */
export function positionBetween(firstPos: string, secondPos: string) {
  assertDev(firstPos < secondPos);

  let flag = false;
  let position = '';
  const maxLength = Math.max(firstPos.length, secondPos.length);

  for (let i = 0; i < maxLength; i++) {
    const lower =
      i < firstPos.length ? firstPos.charCodeAt(i) : START_CHAR_CODE;
    const upper =
      i < secondPos.length && !flag ? secondPos.charCodeAt(i) : END_CHAR_CODE;

    if (lower === upper) {
      position += String.fromCharCode(lower);
    } else if (upper - lower > 1) {
      position += String.fromCharCode(avg(lower, upper));
      flag = false;
      break;
    } else {
      position += String.fromCharCode(lower);
      flag = true;
    }
  }

  if (flag) {
    position += String.fromCharCode(avg(START_CHAR_CODE, END_CHAR_CODE));
  }

  assertDev(firstPos < position);
  assertDev(position < secondPos);
  assertDev(isValidPosition(position));
  return position;
}

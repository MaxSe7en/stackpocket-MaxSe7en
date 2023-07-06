/**
  * filters non-integer characters from data provided.
  * @param {number} value the value to be filtered
  * @param {number} minValue minimum acceptable integer value
  * @param {number} maxValue maximum acceptable integer value
  * @returns only numbers from passed data.the number returned exists between a range provided by 'minValue' and 'maxValue'
  */
export function onlyNum(value: string, minValue: number = 1, maxValue: number = 99999) {
  let onlyNums = parseInt(value.replace(/\D+/g, ""));
  if (value) {
    onlyNums = onlyNums ? onlyNums : minValue;
    onlyNums = onlyNums >= maxValue ? maxValue : onlyNums;
  }
  return onlyNums;
}
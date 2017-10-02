/**
 * Expect result is equal to actual value
 * @param {*} actual result
 * @param {*} expected expected result
 */
module.exports.resultIsEqualTo = function(actual, expected) {
  expect(actual).toEqual(expected);
};

/**
 * Expect result is not equal to actual value
 * @param {*} actual result
 * @param {*} expected expected result
 */
module.exports.resultIsNotEqualTo = function(actual, expected) {
  expect(actual).not.toEqual(expected);
};

module.exports.resultIncludes = function(actual, expected) {
  expect(actual).toContain(expected);
};

/**
 * Expect result to be true
 * @param {*} result
 */
module.exports.resultIsTrue = function(result) {
  expect(result).toBeTrue;
};

/**
 * Expect result to be false
 * @param {*} result
 */
module.exports.resultIsFalse = function(result) {
  expect(result).not.toBeTrue;
};

/**
 * Expect result to be null
 * @param {*} result
 */
module.exports.resultIsNull = function(result) {
  expect(result).toBeNull;
};

/**
 * Expect result to be null
 * @param {*} result
 */
module.exports.resultIsUndefined = function(result) {
  expect(result).not.toBeDefined;
};

/**
 * Expect each result of an operation should be true
 * @param {*} results
 */
module.exports.eachResultToBeTrue = function(results) {
  results.forEach(function(result) {
    expect(result).toBeTrue;
  });
};

/**
 * Expect each result of an operation should be false
 * @param {*} results
 */
module.exports.eachResultToBeFalse = function(results) {
  results.forEach(function(result) {
    expect(result).not.toBeTrue;
  });
};

/**
 * Expect each result of an operation should be null
 * @param {*} elements
 */
module.exports.eachResultToBeNull = function(results) {
  results.forEach(function(result) {
    expect(result).toBeNull;
  });
};
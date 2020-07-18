/**
 * Races a timeout promise that rejects after the provided number of milliseconds against the
 * provided promise. The returned promise represents the first promise of the two to fulfill.
 * @param {number} ms - The amount of milliseconds to wait before rejecting the timeout promise
 * @param {Promise} promise - The promise to race against the timeout promise
 * @returns {Promise} A promise representing the result of the first promise to fulfill
 */
function timeoutPromise(ms, promise) {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

export default timeoutPromise;

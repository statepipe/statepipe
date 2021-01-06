/**
 * Fires console.log only when window.$statepipeLog is true
 */
export const log = (...args) => {
  if (window.$statepipeLog === true) {
    console.log.call(console.log, ...args);
  }
};

/**
 * Fires console.log only when window.$statepipeLog is true
 */
export const warn = (...args) => {
  if (window.$statepipeLog === true) {
    console.warn.call(console.warn, ...args);
  }
};

/**
 * Fires console.error only when window.$statepipeLog is true
 */
export const error = (...args) => {
  if (window.$statepipeLog === true) {
    console.error.call(console.error, ...args);
  }
};

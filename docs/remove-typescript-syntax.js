exports.handlers = {
  /**
   * In order to generate TypeScript definitions from JSDoc comments we need to use TypeScript-specific JSDoc syntax:
   * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
   * 
   * Here we remove the TypeScript-specific syntax so we can run jsdoc2md without errors.
   *
   * @param {object} e
   * @param {string} e.filename
   * @param {string} e.source
   */
  beforeParse(e) {
    e.source = e.source.replace(/@typedef\s*{\s*import\(.*}.*$/gm, '');
  },
};

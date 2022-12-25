exports.handlers = {
  /**
   * In order to generate TypeScript definitions from JSDoc comments we need to use TypeScript-specific JSDoc syntax:
   * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
   * 
   * In the JSDoc comments we prefix all blocks of TypeScript-specific syntax with "TypeScript JSDoc:",
   * which we remove here. This way we can run jsdoc2md without errors, but still use TypeScript-specific syntax
   * to improve the generated TypeScript definition files.
   *
   * @param {object} e
   * @param {string} e.filename
   * @param {string} e.source
   */
  beforeParse(e) {
    e.source = e.source.replace(/TypeScript JSDoc:\s*(\* @typedef.*\s*)*/gm, '\n');
  },
};

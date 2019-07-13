import { RegexRule } from './regex-rule';

export class XmlElementRule extends RegexRule {
  constructor(errorMessage: string) {
    /**
     * Element names must start with a letter or underscore
     * Element names can contain letters, digits, hyphens, underscores, and periods
     * Element names cannot contain spaces
     */
    super(/^(?:[A-z]|_){1}(?:\w|\-|\.)*$/, errorMessage);
  }
}

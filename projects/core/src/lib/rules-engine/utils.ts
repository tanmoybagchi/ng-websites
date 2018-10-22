const memberNameExtractor = new RegExp('return (.*);?\\b');

export function getMemberNameFromSelector<TResult>(name: (x?: TResult) => any) {
  const m = memberNameExtractor.exec(name + '');
  if (m == null) {
    throw new Error('The function does not contain a statement matching \'return variableName;\'');
  }
  const parts = m[1].toString().split('.');
  return parts[parts.length - 1];
}

// export function getTypeName(instance: any) {
//   const funcNameRegex = /function (.{1,})\(/;
//   const results = (funcNameRegex).exec((instance).constructor.toString());
//   return (results && results.length > 1) ? results[1] : '';
// }

// export function stringEndsWith(subjectString: string, searchString: string): boolean {
//   return (subjectString.substr(subjectString.length - searchString.length) === searchString);
// }

// export function countDigits(text: string): number {
//   if (text) {
//     return text.replace(/\D/g, '').length;
//   }

//   return 0;
// }

export function isEmpty(propValue: any) {
  if (propValue === undefined || propValue === null) {
    return true;
  }

  if (typeof propValue === 'number') {
    return propValue.toString().trim().length === 0;
  }

  if (typeof propValue === 'string') {
    return propValue.trim().length === 0;
  }

  if (Array.isArray(propValue)) {
    return propValue.length === 0;
  }

  // This needs to be the last check
  if (typeof propValue === 'object') {
    if (propValue instanceof Date) {
      return propValue.valueOf() === 0;
    }

    return Object.keys(propValue).length === 0;
  }

  return false;
}

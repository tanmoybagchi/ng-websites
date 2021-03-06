import { ValueObject } from './models';

export class DomainHelper {
  static adapt<T>(target: { new(): T } | T, source: string | object): T {
    if (target === undefined || target === null) {
      return null;
    }

    if (typeof target === 'function') {
      // Workaround for a Typescript bug https://github.com/Microsoft/TypeScript/issues/17388
      target = new (target as any)();
    }

    const sourceJSON = typeof source === 'string' ?
      String.isNullOrWhitespace(source) ?
        {}
        : JSON.parse(source)
      : source;

    const correctedJSON = {};
    Object.keys(sourceJSON).forEach(k => {
      const camelCasedMemberName = k[0].toLowerCase() + k.slice(1);
      correctedJSON[camelCasedMemberName] = sourceJSON[k];
    });

    this.copyMatchingProperties(target, correctedJSON);

    Object.keys(target)
      .filter(key => typeof target[key] === 'object' && target[key] instanceof ValueObject)
      // tslint:disable-next-line:max-line-length
      .forEach(key => this.adapt(target[key], key in correctedJSON ? correctedJSON[key] : this.extractPrefixedObject(correctedJSON, `${key}_`)));

    return target as T;
  }

  private static copyMatchingProperties(target, source) {
    if (target === undefined || target === null || source === undefined || source === null) {
      return;
    }

    Object.keys(target).forEach(k => {
      if (source[k] === undefined) {
        return;
      }

      switch (typeof target[k]) {
        case 'string':
          target[k] = source[k] === null
            ? target[k]
            : typeof source[k] === 'string'
              ? source[k]
              : source[k].toString();
          break;

        case 'boolean':
          target[k] = source[k] === null
            ? target[k]
            : typeof source[k] === 'boolean'
              ? source[k]
              : !!source[k];
          break;

        case 'number':
          target[k] = source[k] === null
            ? target[k]
            : typeof source[k] === 'number'
              ? source[k]
              : Number(source[k]);
          break;

        case 'object':
          if (target[k] instanceof Date || Reflect.getMetadata('design:type', target, k) === Date) {
            target[k] = source[k] instanceof Date ?
              source[k] :
              String.hasData(source[k]) ?
                new Date(source[k]) :
                null;
          }

          if (Array.isArray(target[k]) && Array.isArray(source[k]) && Reflect.hasMetadata('design:type', target, k)) {
            const itemType = Reflect.getMetadata('design:type', target, k);

            source[k].forEach(item => target[k].push(DomainHelper.adapt(itemType, item)));
          }

          break;
      }
    });
  }

  private static extractPrefixedObject(source: { [x: string]: any; }, keyPrefix: string) {
    const target = {};

    Object.keys(source)
      .filter(x => x.startsWith(keyPrefix))
      .forEach(x => target[x.replace(keyPrefix, '')] = source[x]);

    return target;
  }
}

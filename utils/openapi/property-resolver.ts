import { XMLParser } from 'fast-xml-parser';
import { Metadata, Property, ValueTypes } from './types';

export interface PropertyResolver<T> {
  resolve(property: Property, metadata: Metadata): Record<string, T>;
}

export class PlainTextPropertyResolver implements PropertyResolver<string> {
  resolve(property: Property, metadata: Metadata): Record<string, string> {
    if (metadata.type !== 'text') {
      throw Error(`Invalid metadata type: ${metadata.type}, expected type: text`);
    }
    const obj: Record<string, string> = {};
    if (metadata.nullable) {
      obj[metadata.name] = '';
    } else {
      obj[metadata.name] = property.value.toString();
    }
    return obj;
  }
}

export class PlainNumberPropertyResolver implements PropertyResolver<number> {
  resolve(property: Property, metadata: Metadata): Record<string, number> {
    if (metadata.type !== 'number') {
      throw Error(`Invalid metadata type: ${metadata.type}, expected type: number`);
    }
    const obj: Record<string, number> = {};
    if (metadata.nullable || isNaN(Number(property.value))) {
      obj[metadata.name] = 0;
    } else {
      obj[metadata.name] = Number(property.value);
    }
    return obj;
  }
}

export class ArrayTextPropertyResolver implements PropertyResolver<string[]> {
  resolve(property: Property, metadata: Metadata): Record<string, string[]> {
    if (metadata.type !== 'array-text') {
      throw Error(`Invalid metadata type: ${metadata.type}, expected type: array-text`);
    }
    const obj: Record<string, string[]> = {};
    const separator = metadata.separator;
    if (!separator) {
      throw Error(`Invalid value, it has to be array text and has separator`);
    }

    if (metadata.nullable || property.value.toString().length < 1) {
      obj[metadata.name] = [];
    } else {
      const values = property.value.toString().split(metadata.separator);
      obj[metadata.name] = [...values];
    }
    return obj;
  }
}

export class ArrayNumberPropertyResolver implements PropertyResolver<number[]> {
  resolve(property: Property, metadata: Metadata): Record<string, number[]> {
    if (metadata.type !== 'array-number') {
      throw Error(`Invalid metadata type: ${metadata.type}, expected type: array-number`);
    }
    const obj: Record<string, number[]> = {};
    const separator = metadata.separator;
    if (!separator) {
      throw Error(`Invalid value, it has to be array text and has separator`);
    }

    if (metadata.nullable || property.value.toString().length < 1) {
      obj[metadata.name] = [];
    } else {
      const values = property.value
        .toString()
        .split(metadata.separator)
        .map((it: any) => Number(it));
      obj[metadata.name] = [...values];
    }
    return obj;
  }
}

export class XmlPropertyResolver implements PropertyResolver<any> {
  private xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    allowBooleanAttributes: true,
    attributesGroupName: '',
    parseTagValue: true,
  });
  resolve(property: Property, metadata: Metadata): Record<string, any> {
    if (metadata.type !== 'xml') {
      throw Error(`Invalid metadata type: ${metadata.type}, expected type: xml`);
    }
    const obj: Record<string, any> = {};

    if (metadata.nullable || property.value.toString().length < 1) {
      obj[metadata.name] = {};
    } else {
      // console.debug('raw xml value', property.value);
      const xmlObj = this.xmlParser.parse(property.value);
      obj[metadata.name] = xmlObj;
      // obj[metadata.name] = '{}';
    }
    return obj;
  }
}

export class PropertyResolverFactory {
  private static plainTextPropertyResolver = new PlainTextPropertyResolver();
  private static plainNumberPropertyResolver = new PlainNumberPropertyResolver();
  private static arrayTextPropertyResolver = new ArrayTextPropertyResolver();
  private static arrayNumberPropertyResolver = new ArrayNumberPropertyResolver();
  private static xmlPropertyResolver = new XmlPropertyResolver();

  static create(type: ValueTypes): PropertyResolver<any> {
    switch (type) {
      case 'text': {
        return PropertyResolverFactory.plainTextPropertyResolver;
      }
      case 'number': {
        return PropertyResolverFactory.plainNumberPropertyResolver;
      }
      case 'array-text': {
        return PropertyResolverFactory.arrayTextPropertyResolver;
      }
      case 'array-number': {
        return PropertyResolverFactory.arrayNumberPropertyResolver;
      }
      case 'xml': {
        return PropertyResolverFactory.xmlPropertyResolver;
      }
      default: {
        return PropertyResolverFactory.plainTextPropertyResolver;
      }
    }
  }
}

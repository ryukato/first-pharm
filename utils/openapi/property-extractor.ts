import { Entry } from './types';

export class PropertyExtractor {
  extract(source: any, keys: string[]) {
    const filtered = this.filterObject(source, ([k, _]) => keys.includes(k, 0));
    return { ...filtered };
  }

  filterObject<T extends object>(
    obj: T,
    fn: (entry: Entry<T>, i: number, arr: Entry<T>[]) => boolean
  ) {
    return Object.fromEntries((Object.entries(obj) as Entry<T>[]).filter(fn)) as Partial<T>;
  }
}

export type ValueTypes = 'number' | 'text' | 'url' | 'array-text' | 'array-number' | 'xml';

export type Metadata = {
  key: string;
  type: ValueTypes;
  separator?: string | null;
  name: string;
  nullable: boolean;
};

export type Property = {
  key: string;
  value: any;
};

export type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

export type OffsetPagingParameters = {
  pageNo: number;
  size?: number;
};

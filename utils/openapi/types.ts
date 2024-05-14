import { MediProductModel } from '~/models/models';

export type ValueTypes = 'number' | 'text' | 'url' | 'array-text' | 'array-number' | 'xml';

export type PagingResponse = {
  pageNo: number;
  totalCount: number;
  numOfRows: number;
};

export type SearchedProductList = {
  paging: PagingResponse;
  list: MediProductModel[];
};

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

export type Paragraph = {
  '#text': string;
  tagName: string;
  textIndent: string;
  marginLeft: string;
};

export type Article = {
  title: string;
  PARAGRAPH?: Paragraph[] | Paragraph | null;
};

export type Section = {
  title: string;
  ARTICLE: Article | Article[];
};

export type RootDocument = {
  title: string;
  type: string;
  SECTION: Section;
};

export type DocMessage = {
  DOC: RootDocument;
};

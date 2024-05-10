export type MediProductModel = {
  readonly itemSeq: number;
  readonly itemName: string;
  readonly entpName: string;
  readonly itemPermitDate: string;
  readonly etcOtcCode: string;
  readonly materialName: string;
  readonly storageMethod: string;
  readonly validTerm: string;
  readonly changeDate: string;
  readonly gbnName: string;
  readonly effects: ParagraphItem[];
  readonly usage: ParagraphItem[];
  readonly caution: ParagraphItem[];
  readonly mainItemIngr: string;
  readonly ingrName: string[];
};

export type ParagraphItem = {
  readonly content: string;
};

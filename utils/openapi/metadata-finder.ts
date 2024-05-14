import { Metadata } from './types';

const metadatas: Array<Metadata> = [
  {
    key: 'ITEM_SEQ',
    type: 'number',
    nullable: false,
    name: 'itemSeq',
  },
  {
    key: 'ITEM_NAME',
    type: 'text',
    nullable: false,
    name: 'itemName',
  },
  {
    key: 'ENTP_NAME',
    type: 'text',
    nullable: false,
    name: 'entpName',
  },
  {
    key: 'ITEM_PERMIT_DATE',
    type: 'text',
    nullable: false,
    name: 'itemPermitDate',
  },
  {
    key: 'ETC_OTC_CODE',
    type: 'text',
    nullable: false,
    name: 'etcOtcCode',
  },
  {
    key: 'MATERIAL_NAME',
    type: 'text',
    nullable: false,
    name: 'materialName',
  },
  {
    key: 'STORAGE_METHOD',
    type: 'text',
    nullable: false,
    name: 'storageMethod',
  },
  {
    key: 'VALID_TERM',
    type: 'text',
    nullable: false,
    name: 'validTerm',
  },
  {
    key: 'CHANGE_DATE',
    type: 'text',
    nullable: false,
    name: 'changeDate',
  },
  {
    key: 'GBN_NAME',
    type: 'array-text',
    nullable: false,
    separator: ',',
    name: 'gbnName',
  },
  {
    key: 'EE_DOC_DATA',
    type: 'xml',
    nullable: false,
    name: 'eeDocData',
  },
  {
    key: 'UD_DOC_DATA',
    type: 'xml',
    nullable: false,
    name: 'udDocData',
  },
  {
    key: 'NB_DOC_DATA',
    type: 'xml',
    nullable: false,
    name: 'nbDocData',
  },
  {
    key: 'MAIN_ITEM_INGR',
    type: 'text',
    nullable: false,
    name: 'mainItemIngr',
  },
  {
    key: 'INGR_NAME',
    type: 'array-text',
    separator: '|',
    nullable: true,
    name: 'ingrName',
  },
];

export class MetadataFinder {
  find(key: string): Metadata | null {
    const filtered = metadatas.filter((it) => it.key === key);
    if (filtered && filtered.length > 0) {
      return filtered[0];
    } else {
      return null;
    }
  }
}

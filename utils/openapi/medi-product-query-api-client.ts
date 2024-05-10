import { MediProductModel, ParagraphItem } from '~/models/models';
import { DEFAULT_GET_REQ_OPTIONS } from './default-get-req-options';
import { MEDI_API_RES_KEYS } from './medi-product-res-keys';
import { MetadataFinder } from './metadata-finder';
import { PropertyExtractor } from './property-extractor';
import { PropertyResolverFactory } from './property-resolver';
import { Metadata } from './types';

export default class MediProductApiClient {
  private baseUrl: string =
    'https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService05/getDrugPrdtPrmsnDtlInq04';
  private apiKey: string =
    'mf/ad0132hYGXI2kLeBAJ7ml+DdVw2EHtFNIk6/suAJZSAkj4ZyJON/YMHJuzC4Vvo9Q+QaJFIim3yx2Q4nwPA==';

  constructor(apiKey?: string, baseUrl?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      this.baseUrl = `${this.baseUrl}?serviceKey=${encodeURIComponent(this.apiKey)}&type=json`;
    }
  }

  async findByName(name: string): Promise<any> {
    const requestUrl = `${this.baseUrl}&pageNo=1&numOfRows=10&item_name=${encodeURIComponent(name)}`;
    // console.debug('requestUrl', requestUrl);
    let response: Response | null = null;
    try {
      response = await fetch(requestUrl, DEFAULT_GET_REQ_OPTIONS);
    } catch (error) {
      console.error('Fail to request searching:', JSON.stringify(error));
      return Promise.reject(new Error(`Fail to request searching, error: ${error}`));
    }
    console.debug('response status', response.status);
    let jsonResponse = null;
    try {
      jsonResponse = await response!.json();
    } catch (error: any) {
      console.error('Fail to get json response:', JSON.stringify(error));
      return Promise.reject(new Error(`Fail to get json response, error: ${error}`));
    }
    return this.resolveResponse(jsonResponse);
  }

  async findByBarcode(barcode: string): Promise<any> {
    const requestUrl = `${this.baseUrl}&pageNo=1&numOfRows=10&bar_code=${barcode}`;
    let response: Response | null = null;
    try {
      response = await fetch(requestUrl, DEFAULT_GET_REQ_OPTIONS);
    } catch (error) {
      console.error('Fail to request searching:', JSON.stringify(error));
      return Promise.reject(new Error(`Fail to request searching, error: ${error}`));
    }
    let jsonResponse = null;
    try {
      jsonResponse = await response!.json();
    } catch (error: any) {
      console.error('Fail to get json response:', JSON.stringify(error));
      return Promise.reject(new Error(`Fail to get json response, error: ${error}`));
    }
    return this.resolveResponse(jsonResponse);
  }

  private async resolveResponse(jsonResponse: any): Promise<any> {
    const items: any[] = jsonResponse['body']['items'];
    // console.debug('searched items: ', JSON.stringify(items));
    const keys = MEDI_API_RES_KEYS;
    try {
      if (items && items.length > 0) {
        return items.map((item) => {
          const filtered = new PropertyExtractor().extract(item, keys);
          // console.debug('filtered', filtered);
          const resolved = Object.entries(filtered).map(([k, v]) => {
            const metadata: Metadata | null = new MetadataFinder().find(k);
            if (!metadata) {
              return;
            }

            const resolver = PropertyResolverFactory.create(metadata.type);
            return resolver.resolve({ key: k, value: v }, metadata);
          });

          const target = {};
          Object.assign(target, ...resolved);
          return this.convertToMediProductModel(target);
        });
      } else {
        Promise.resolve([]);
      }
    } catch (error: any) {
      console.error('Fail to resolve json response, error:', JSON.stringify(error));
      throw Error('Fail to resolve json response');
    }
  }

  private convertToMediProductModel(rawData: any): MediProductModel {
    // console.debug('rawData', rawData);
    try {
      return {
        itemSeq: rawData['itemSeq'],
        itemName: rawData['itemName'],
        entpName: rawData['entpName'],
        itemPermitDate: rawData['itemPermitDate'],
        etcOtcCode: rawData['etcOtcCode'],
        materialName: rawData['materialName'],
        storageMethod: rawData['storageMethod'],
        validTerm: rawData['validTerm'],
        changeDate: rawData['changeDate'],
        gbnName: rawData['gbnName'],
        effects: this.convertToParagraph(rawData['eeDocData']),
        usage: this.convertToParagraph(rawData['udDocData']),
        caution: this.convertToParagraph(rawData['nbDocData']),
        // effects: [],
        // usage: [],
        // caution: [],
        mainItemIngr: rawData['mainItemIngr'],
        ingrName: rawData['ingrName'],
      };
    } catch (error: any) {
      console.error('Fail to conver to medi-product, error:', JSON.stringify(error));
      return {};
    }
  }

  private convertToParagraph(rawParagraph: any): ParagraphItem[] {
    if (!rawParagraph || Object.keys(rawParagraph).length < 1) {
      return [];
    }
    const article = rawParagraph['DOC']['SECTION']['ARTICLE'];
    if (article) {
      // check it is array
      if (Array.isArray(article)) {
        return (article as any[]).map((item) => {
          if (item['PARAGRAPH']) {
            return {
              content: item['PARAGRAPH'],
            };
          } else {
            return {
              content: item['title'],
            };
          }
        });
      } else {
        return [
          {
            content: article['title'],
          },
        ];
      }
    } else {
      return [];
    }
  }
}

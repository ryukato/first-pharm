import { MediProductModel } from '~/models/models';
import { DEFAULT_GET_REQ_OPTIONS } from './default-get-req-options';
import { MEDI_API_RES_KEYS } from './medi-product-res-keys';
import { MetadataFinder } from './metadata-finder';
import { PropertyExtractor } from './property-extractor';
import { PropertyResolverFactory } from './property-resolver';
import { Metadata, OffsetPagingParameters, PagingResponse, ProductList } from './types';

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

  async findByName(name: string, pagingParameter: OffsetPagingParameters): Promise<ProductList> {
    const page = pagingParameter.pageNo;
    const numOfRows = pagingParameter.size || 10;
    const requestUrl = `${this.baseUrl}&pageNo=${page}&numOfRows=${numOfRows}&item_name=${encodeURIComponent(name)}`;
    console.debug('requestUrl', requestUrl);
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

  async findByBarcode(
    barcode: string,
    pagingParameter: OffsetPagingParameters
  ): Promise<ProductList> {
    const page = pagingParameter.pageNo;
    const numOfRows = pagingParameter.size || 10;
    const requestUrl = `${this.baseUrl}&pageNo=${page}&numOfRows=${numOfRows}&bar_code=${barcode}`;
    console.debug('requestUrl', requestUrl);
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
    const { pageNo, totalCount, numOfRows }: PagingResponse = jsonResponse['body'];
    const items: any[] = jsonResponse['body']['items'];
    const keys = MEDI_API_RES_KEYS;
    try {
      if (items && items.length > 0) {
        const convertedList = items.map((item) => {
          const filtered = new PropertyExtractor().extract(item, keys);
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
        return {
          paging: {
            pageNo,
            totalCount,
            numOfRows,
          },
          list: convertedList,
        };
      } else {
        Promise.resolve({
          paging: {
            pageNo,
            totalCount,
            numOfRows,
          },
          list: [],
        });
      }
    } catch (error: any) {
      console.error('Fail to resolve json response, error:', JSON.stringify(error));
      throw Error('Fail to resolve json response');
    }
  }

  private convertToMediProductModel(rawData: any): MediProductModel {
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
        effects: rawData['eeDocData'],
        usage: rawData['udDocData'],
        caution: rawData['nbDocData'],
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
}

export const apiClient = new MediProductApiClient();

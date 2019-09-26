export interface Record {
    [key: string]: any;
}
export interface GetRecordsOptions {
    displayValue?: boolean | string;
    excludeReferenceLink?: boolean;
    fields?: string[];
    limit?: number;
    offset?: number | string;
    query?: string;
    queryNoDomain?: boolean;
    suppressPaginationHeader?: boolean;
    view?: string;
}
export interface GetRecordOptions {
    displayValue?: boolean | string;
    excludeReferenceLink?: boolean;
    fields?: string[];
    queryNoDomain?: boolean;
    view?: string;
}
export interface CreateRecordOptions {
    displayValue?: boolean | string;
    fields?: string[];
    excludeReferenceLink?: boolean;
    inputDisplayValue?: boolean;
    view?: string;
}
export default class SNAPI {
    instance: string;
    endpoint: string;
    tableEndpoint: string;
    attachmentEndpoint: string;
    defaultHeaders: Headers;
    token: string;
    constructor({ token, instance }: {
        token: any;
        instance: any;
    });
    private handleResponse;
    getRecords(table: any, { displayValue, excludeReferenceLink, fields, limit, offset, query, queryNoDomain, suppressPaginationHeader, view }: GetRecordsOptions): Promise<Response>;
    getRecord(table: string, sysId: string, { displayValue, excludeReferenceLink, fields, queryNoDomain, view }?: GetRecordOptions): Promise<Response>;
    getProperty(property: string): Promise<string>;
    createRecord(table: string, data: Record, { displayValue, fields, excludeReferenceLink, inputDisplayValue, view, }?: CreateRecordOptions): Promise<{
        status: any;
        data: any;
    }>;
    getProfilePicture(sysId: string, abortSignal?: AbortSignal): Promise<string>;
    scriptedRestApi(resourcePath: string, httpMethod: string, { additionalHeaders }: {
        additionalHeaders?: {};
    }): Promise<Response>;
}

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
  displayValue?: boolean | string,
  fields?: string[],
  excludeReferenceLink?: boolean,
  inputDisplayValue?: boolean,
  view?: string,
}

export default class SNAPI {
  instance: string;
  endpoint: string;
  tableEndpoint: string;
  attachmentEndpoint: string;
  defaultHeaders: Headers;
  token: string;

  constructor({ token, instance }) {
    this.instance = instance;
    this.endpoint = `https://${this.instance}.service-now.com`;
    this.attachmentEndpoint = `https://${this.instance}.service-now.com/api/now/attachment`;
    this.tableEndpoint = `https://${this.instance}.service-now.com/api/now/table`;
    this.defaultHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private async handleResponse(response) {
    if (response.ok) {
      const json = await response.json();
      return {
        status: response.status,
        data: json.result,
      };
    } else {
      try {
        const json = await response.json();
        console.error(`ServiceNow returned error ${response.status}:\n${JSON.stringify(json, null, 2)}`);

        return {
          status: response.status,
          data: json,
        };
      } catch (e) {
        console.error('Error attempting to parse response. \n' + e);
        return {
          status: 500,
          data: null
        };
      }
    }
  }

  public async getRecords(
    table,
    {
      displayValue = false,
      excludeReferenceLink = false,
      fields = [],
      limit = 10000,
      offset = 0,
      query = '',
      queryNoDomain = false,
      suppressPaginationHeader = false,
      view = ''
    }: GetRecordsOptions
  ): Promise<Response> {
    const queryParameters = [
      `sysparm_display_value=${displayValue}`,
      `sysparm_exclude_reference_link=${excludeReferenceLink}`,
      `sysparm_fields=${fields.join()}`,
      `sysparm_limit=${limit}`,
      `sysparm_offset=${offset}`,
      `sysparm_query=${query}`,
      `sysparm_query_no_domain=${queryNoDomain}`,
      `sysparm_suppress_pagination_header=${suppressPaginationHeader}`,
      `sysparm_view=${view}`
    ].join('&');

    const response = await fetch(`${this.tableEndpoint}/${table}?${queryParameters}`, {
      method: 'GET',
      headers: this.defaultHeaders
    });

    return response;

  }

  public async getRecord(
    table: string,
    sysId: string,
    {
      displayValue = false,
      excludeReferenceLink = false,
      fields = [],
      queryNoDomain = false,
      view = ''
    }: GetRecordOptions = {}
  ): Promise<Response> {
    const queryParameters = [
      `sysparm_display_value=${displayValue}`,
      `sysparm_exclude_reference_link=${excludeReferenceLink}`,
      `sysparm_fields=${fields.join()}`,
      `sysparm_query_no_domain=${queryNoDomain}`,
      `sysparm_view=${view}`
    ].join('&');

    const response = await fetch(`${this.tableEndpoint}/${table}/${sysId}?${queryParameters}`, {
      method: 'GET',
      headers: this.defaultHeaders
    });

    return response;
    //return await this.handleResponse(response);

  }

  public async getProperty(property: string): Promise<string> {
    try {
      const response = await fetch(`${this.tableEndpoint}/sys_properties?sysparm_query=name=${property}`, {
        method: 'GET',
        headers: this.defaultHeaders
      });

      const json = await response.json();
      return json.result[0].value;
    } catch (e) {
      return null;
    }
  }

  public async createRecord(table: string, data: Record, {
    displayValue = false,
    fields = [],
    excludeReferenceLink = false,
    inputDisplayValue = false,
    view = '',
  }: CreateRecordOptions = {}) {
    const queryParameters = [
      `sysparm_display_value=${displayValue}`,
      `sysparm_fields=${fields.join()}`,
      `sysparm_exclude_reference_link=${excludeReferenceLink}`,
      `sysparm_input_display_value=${inputDisplayValue}`,
      `sysparm_view=${view}`
    ].join('&');

    const response = await fetch(`${this.tableEndpoint}/${table}?${queryParameters}`, {
      method: 'POST',
      headers: this.defaultHeaders
    });

    return await this.handleResponse(response);    
  }

  public async getProfilePicture(sysId: string, abortSignal?: AbortSignal) {

    const response = await this.getRecords('sys_attachment', {
      query: `table_sys_id=${sysId}^file_name=photo`,
      limit: 1,
      fields: ['sys_id'],
    });

    const attachment = (await response.json()).result;

    if (attachment && attachment[0] && attachment[0].sys_id) {
      const attachmentId = attachment[0].sys_id;
      const response = await fetch(`${this.attachmentEndpoint}/${attachmentId}/file`, {
        signal: abortSignal || null,
        method: 'GET',
        headers: this.defaultHeaders,
      });
  
      const buffer = await response.arrayBuffer();
      let u8 = new Uint8Array(buffer)
      let b64encoded = btoa([].reduce.call(new Uint8Array(buffer),function(p,c){return p+String.fromCharCode(c)},''))
      let mimetype="image/jpeg"
      return "data:"+mimetype+";base64,"+b64encoded
    }

    return '';
  }

  public async scriptedRestApi(resourcePath: string, httpMethod: string, { additionalHeaders = {} }): Promise<Response> {
    const headers = new Headers(this.defaultHeaders);
    for (const key in additionalHeaders) {
      headers.set(key, additionalHeaders[key]);
    }

    const response = await fetch(`${this.endpoint}/${resourcePath}`, {
      method: httpMethod,
      headers,
    });

    return response;
  }
}

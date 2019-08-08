import fetch from 'node-fetch';

function btoa(text): string {
  return Buffer.from(text).toString('base64');
}

interface Record {
  [key: string]: any;
}

interface GetRecordsOptions {
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

interface GetRecordOptions {
  displayValue?: boolean | string;
  excludeReferenceLink?: boolean;
  fields?: string[];
  queryNoDomain?: boolean;
  view?: string;
}

interface CreateRecordOptions {
  displayValue?: boolean | string,
  fields?: string[],
  excludeReferenceLink?: boolean,
  inputDisplayValue?: boolean,
  view?: string,
}

export default class SNAPI {
  username: string;
  password: string;
  instance: string;
  endpoint: string;
  defaultHeaders: object;

  constructor({ username, password, instance }) {
    this.username = username;
    this.password = password;
    this.instance = instance;
    this.endpoint = `https://${this.instance}.service-now.com/api/now/table`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`
    };
  }

  private async handleResponse(response) {
    if (response.ok) {
      const json = await response.json();
      return json.result;
    } else {
      try {
        const json = await response.json();
        throw new Error(`ServiceNow returned error ${response.status}:\n${JSON.stringify(json, null, 2)}`);
      } catch (e) {
        throw new Error('Error attempting to parse response. \n' + e);
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
  ): Promise<Record[]> {
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

    const response = await fetch(`${this.endpoint}/${table}?${queryParameters}`, {
      method: 'GET',
      headers: this.defaultHeaders
    });

    return await this.handleResponse(response);
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
  ): Promise<Record> {
    const queryParameters = [
      `sysparm_display_value=${displayValue}`,
      `sysparm_exclude_reference_link=${excludeReferenceLink}`,
      `sysparm_fields=${fields.join()}`,
      `sysparm_query_no_domain=${queryNoDomain}`,
      `sysparm_view=${view}`
    ].join('&');

    const response = await fetch(`${this.endpoint}/${table}/${sysId}?${queryParameters}`, {
      method: 'GET',
      headers: this.defaultHeaders
    });

    return await this.handleResponse(response);
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

    const response = await fetch(`${this.endpoint}/${table}?${queryParameters}`, {
      method: 'POST',
      headers: this.defaultHeaders
    });

    return await this.handleResponse(response);    
  }
}

import fetch from 'node-fetch';

function btoa(text) {
  return Buffer.from(text).toString('base64');
}

interface GetRecordsOptions {
  displayValue?: boolean | string,
  excludeReferenceLink?: boolean,
  fields?: string[],
  limit?: number,
  offset?: number | string,
  query?: string,
  queryNoDomain?: boolean,
  suppressPaginationHeader?: boolean,
  view?: string,
}

interface GetRecordOption {
  displayValue?: boolean | string,
  excludeReferenceLink?: boolean,
  fields?: string[],
  queryNoDomain?: boolean,
  view?: string,
}

export default class SNAPI {

  username: string;
  password: string;
  instance: string;
  endpoint: string;
  defaultHeaders: object;

  constructor ({ username, password, instance }) {
    this.username = username;
    this.password = password;
    this.instance = instance;
    this.endpoint = `https://${this.instance}.service-now.com/api/now/table`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${this.username}:${this.password}`)}`,
    };
  }

  async getRecords(table, {
    displayValue = false,
    excludeReferenceLink = false,
    fields = [],
    limit = 10000,
    offset = 0,
    query = '',
    queryNoDomain = false,
    suppressPaginationHeader = false,
    view = ''
  }: GetRecordsOptions): Promise<{ [key: string]: any }> {

    const queryParameters = [
      `sysparm_display_value=${displayValue}`, 
      `sysparm_exclude_reference_link=${excludeReferenceLink}`,
      `sysparm_fields=${fields.join()}`,
      `sysparm_limit=${limit}`,
      `sysparm_offset=${offset}`,
      `sysparm_query=${query}`,
      `sysparm_query_no_domain=${queryNoDomain}`,
      `sysparm_suppress_pagination_header=${suppressPaginationHeader}`,
      `sysparm_view=${view}`,
    ].join('&')

    const response = await fetch(`${this.endpoint}/${table}?${queryParameters}`, {
      method: 'GET',
      headers: this.defaultHeaders,
    });

    const json =  await response.json();

    if (response.status >= 400) {
      throw new Error(`${response.status}: ${json.error.message}`);
    }

    return json.result;
  }

  async getRecord(table: string, sysId: string, {
    displayValue = false,
    excludeReferenceLink = false,
    fields = [],
    queryNoDomain = false,
    view = ''
  }: GetRecordOption = {}): Promise<object> {

    const queryParameters = [
      `sysparm_display_value=${displayValue}`, 
      `sysparm_exclude_reference_link=${excludeReferenceLink}`,
      `sysparm_fields=${fields.join()}`,
      `sysparm_query_no_domain=${queryNoDomain}`,
      `sysparm_view=${view}`,
    ].join('&')

    const response = await fetch(`${this.endpoint}/${table}/${sysId}?${queryParameters}`, {
      method: 'GET',
      headers: this.defaultHeaders,
    });

    const json =  await response.json();

    if (response.status >= 400) {
      throw new Error(`${response.status}: ${json.error.message}`);
    }

    return json.result;
  }
}
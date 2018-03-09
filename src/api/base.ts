import http from './http/';

class BaseApi {
  private readonly http;
  constructor() {
    this.http = http;
  }

  protected get(url: string, params?: any) {
    return this.http.get(url, {
      params,
    });
  }

  protected post(url: string, data?: any, config?: any) {
    return this.http.post(url, data, config);
  }

  protected put(url: string, data?: any, config?: any) {
    return this.http.put(url, data, config);
  }

  protected delete(url: string, params?: any) {
    return this.http.delete(url, {
      params,
    });
  }
}

export default BaseApi;

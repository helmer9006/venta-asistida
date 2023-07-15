export interface IHttpAdapter {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any, headers: object): Promise<T>;
}

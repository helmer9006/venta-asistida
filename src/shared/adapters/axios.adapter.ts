import axios, { AxiosInstance } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { IHttpAdapter } from '../interfaces/http-adapter.interface';



@Injectable()
export class AxiosAdapter implements IHttpAdapter {
  private axios: AxiosInstance = axios;
  logger = new Logger('AxiosAdapter');
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
    } catch (error) {
      this.logger.error(`Ha ocurrido un error en la petición http. Error ${JSON.stringify(error)}`)
      throw new Error('Ha ocurrido un error en la petición http.');
    }
  }
  async post<T>(url: string, data: any, headers: object): Promise<T> {
    try {
      const response = await axios.post(url, data, { headers: headers });
      return response.data;
    } catch (error) {
      this.logger.error(`Ha ocurrido un error en la petición http. Error ${JSON.stringify(error)}`)
      throw new Error('Ha ocurrido un error en la petición http.');
    }
  }
}

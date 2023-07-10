// Example entity for mapping data
export class GenericResponse {
  statusCode: number;
  message: string;
  data?: any

  constructor(data:any, statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
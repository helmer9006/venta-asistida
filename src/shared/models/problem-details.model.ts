export class ProblemDetails {
  title: string;
  status: number;
  error: any;
  details: string;
  constructor(title: string, status: number, error: any, detaiLs: string) {
    this.title = title;
    this.status = status;
    this.error = error;
    this.details = detaiLs;
  }
}

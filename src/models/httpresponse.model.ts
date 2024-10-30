export interface GeneralObject {
  [key: string]: any;
}

export interface HTTPResponse {
  message: string;
  data: any[];
  statusCode?: string;
  status: number;
  pagination?: GeneralObject;
}

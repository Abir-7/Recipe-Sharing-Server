export type TErrorSourece = {
  path: string | number;
  message: string;
};

export type genericErrorReturn = {
  statusCode: number;
  message: string;
  errorSource: TErrorSourece[];
};

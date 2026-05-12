import { ResultStatus } from "./resultCode"

type ExtensionType = {
  field: string | null;
  message: string;
};

export type Result<T = null> = {
  status: ResultStatus;
  extensions: ExtensionType[];
  data: T;
};
import { ResponseStatusEnum } from "./ResponseStatusEnum";

export interface ResponseMessage {
    status: ResponseStatusEnum;
    message?: string;
  }
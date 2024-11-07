import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    context?: HttpContext;
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: true;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}
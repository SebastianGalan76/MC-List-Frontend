import { ErrorStatusResponse } from "./ErrorStatusResponse";
import { ResponseStatusEnum } from "./ResponseStatusEnum";

export interface PageResponse<T> {
    status: ResponseStatusEnum;
    error: ErrorStatusResponse;
    content: PageContent<T>
}

export interface PageContent<T> {
    totalElements: number;
    totalPages: number;
    size: number;
    content: T[];
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    empty: boolean;
}
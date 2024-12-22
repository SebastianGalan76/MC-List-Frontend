export interface Banner {
    id: number;
    size: BannerSize;
    link: string;
    filePath: string;
    status: BannerStatus;
    rejectedReason: string | null;
    publishedAt: Date | null;
    finishedAt: Date | null;
    paid: boolean;
}

export enum BannerSize {
    BIG, NORMAL, SMALL
}

export enum BannerStatus {
    PUBLISHED, ACCEPTED, REJECTED, NOT_VERIFIED, FINISHED
}
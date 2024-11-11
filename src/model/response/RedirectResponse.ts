export interface RedirectResponse {
    success: boolean;
    message: string;
    errorCode: number;
    destination: string;
}
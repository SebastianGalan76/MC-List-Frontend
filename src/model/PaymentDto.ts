export interface PaymentDto {
    secret: string,
    amount: string,
    serviceName: string,
    websiteAddress: string,
    orderId: string,
    email: string,
    personalData: string,
    hash: string
}
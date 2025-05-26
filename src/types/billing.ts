export enum InvoiceTypeEnum {
    FV = 'FV',
    EV = 'EV',
    FA = 'FA',
    EA = 'EA'
}

export enum AibGroupTypeEnum {
    A = 'A',
    B = 'B'
}

export enum TaxGroupTypeEnum {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F'
}

export enum PaymentTypeEnum {
    ESPECES = 'ESPECES',
    VIREMENT = 'VIREMENT',
    CARTEBANCAIRE = 'CARTEBANCAIRE',
    MOBILEMONEY = 'MOBILEMONEY',
    CHEQUES = 'CHEQUES',
    CREDIT = 'CREDIT',
    AUTRE = 'AUTRE'
}

export interface ClientDto {
    ifu?: string;
    name?: string;
    contact?: string;
    address?: string;
}

export interface OperatorDto {
    id?: string;
    name: string;
}

export interface PaymentDto {
    name: PaymentTypeEnum;
    amount: number;
}

export interface ItemDto {
    code?: string;
    name: string;
    price: number;
    quantity: number;
    taxGroup: TaxGroupTypeEnum;
    taxSpecific?: number;
    originalPrice?: number;
    priceModification?: string;
}

export interface InvoiceRequestDataDto {
    ifu: string;
    aib?: AibGroupTypeEnum;
    type: InvoiceTypeEnum;
    items: ItemDto[];
    client?: ClientDto;
    operator: OperatorDto;
    payment?: PaymentDto[];
    reference?: string;
}

export interface InvoiceResponseDataDto {
    uid: string;
    ta: number;
    tb: number;
    tc: number;
    td: number;
    taa: number;
    tab: number;
    tac: number;
    tad: number;
    tae: number;
    taf: number;
    hab: number;
    had: number;
    vab: number;
    vad: number;
    aib: number;
    ts: number;
    total: number;
    errorCode?: string;
    errorDesc?: string;
}

export interface PendingRequestDto {
    date: string;
    uid: string;
}

export interface StatusResponseDto {
    status: boolean;
    version: string;
    ifu: string;
    nim: string;
    tokenValid: string;
    serverDateTime: string;
    pendingRequestsCount: number;
    pendingRequestsList: PendingRequestDto[];
}

export interface SecurityElementsDto {
    dateTime: string;
    qrCode: string;
    codeMECeFDGI: string;
    counters: string;
    nim?: string;
    errorCode?: string;
    errorDesc?: string;
}

export interface InvoiceDetailsDto extends InvoiceRequestDataDto {
    errorCode?: string;
    errorDesc?: string;
}
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

export enum InvoiceNatureEnum {
    NA = 'NA',
    Type1 = 'Type1',
    Type2 = 'Type2',
    Type3 = 'Type3',
    Type4 = 'Type4',
    Type5 = 'Type5',
    Type6 = 'Type6',
    Other = 'Other'
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
    /** Identifiant unique de la facture en attente, à utiliser pour confirmInvoice / cancelInvoice */
    uid: string;
    /** Montant HT taxable au groupe A (exonéré de TVA) */
    ta: number;
    /** Montant HT taxable au groupe B (TVA 18 %) */
    tb: number;
    /** Montant HT taxable au groupe C */
    tc: number;
    /** Montant HT taxable au groupe D */
    td: number;
    /** Montant de TVA du groupe A */
    taa: number;
    /** Montant de TVA du groupe B */
    tab: number;
    /** Montant de TVA du groupe C */
    tac: number;
    /** Montant de TVA du groupe D */
    tad: number;
    /** Montant de TVA du groupe E */
    tae: number;
    /** Montant de TVA du groupe F */
    taf: number;
    /** Montant HT de la base de calcul AIB groupe B */
    hab: number;
    /** Montant HT de la base de calcul AIB groupe D */
    had: number;
    /** Montant AIB calculé sur le groupe B */
    vab: number;
    /** Montant AIB calculé sur le groupe D */
    vad: number;
    /** Montant total AIB (Acompte sur Impôt sur les Bénéfices) */
    aib: number;
    /** Total des montants HT (toutes catégories, hors TVA et AIB) */
    ts: number;
    /** Total TTC (ts + TVA + AIB) */
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
    pendingAibPaymentUid?: string;
    pendingAibPaymentUrl?: string;
    pendingAibPaymentList?: PendingRequestDto[];
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
    paymentUrl?: string;
    errorCode?: string;
    errorDesc?: string;
}

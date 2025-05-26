export interface EmcfInfoDto {
    nim: string;
    status: 'Enregistre' | 'Actif' | 'Désactivé';
    shopName: string;
    address1: string;
    address2?: string;
    address3: string;
    contact1: string;
    contact2?: string;
    contact3?: string;
}

export interface InfoResponseDto {
    status: boolean;
    version: string;
    ifu: string;
    nim: string;
    tokenValid: string;
    serverDateTime: string;
    emcflist: EmcfInfoDto[];
}

export interface TaxGroupsDto {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    aibA: number;
    aibB: number;
}

export interface InvoiceTypeDto {
    type: string;
    description: string;
}

export interface PaymentTypeDto {
    type: string;
    description: string;
}
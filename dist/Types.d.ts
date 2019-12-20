import Payment from "./classes/Payment";
export declare enum PaymentStatusEnum {
    paid = "paid",
    paidout = "paidout",
    expired = "expired",
    failed = "failed",
    canceled = "canceled"
}
export declare enum SequenceTypeEnum {
    oneoff = "oneoff",
    first = "first",
    recurring = "recurring"
}
export declare enum MethodEnum {
    null = "null",
    bancontact = "bancontact",
    banktransfer = "banktransfer",
    belfius = "belfius",
    creditcard = "creditcard",
    directdebit = "directdebit",
    eps = "eps",
    giftcard = "giftcard",
    giropay = "giropay",
    ideal = "ideal",
    inghomepay = "inghomepay",
    kbc = "kbc",
    klarnapaylater = "klarnapaylater",
    klarnasliceit = "klarnasliceit",
    mybank = "mybank",
    paypal = "paypal",
    paysafecard = "paysafecard",
    przelewy24 = "przelewy24",
    sofort = "sofort"
}
export declare enum ModeEnum {
    live = "live",
    test = "test"
}
export declare enum LocaleEnum {
    en_US = "en_US",
    nl_NL = "nl_NL",
    nl_BE = "nl_BE",
    fr_FR = "fr_FR",
    fr_BE = "fr_BE",
    de_DE = "de_DE",
    de_AT = "de_AT",
    de_CH = "de_CH",
    es_ES = "es_ES",
    ca_ES = "ca_ES",
    pt_PT = "pt_PT",
    it_IT = "it_IT",
    nb_NO = "no_NO",
    sv_SE = "sv_SE",
    fi_FI = "fi_FI",
    da_DK = "da_DK",
    is_IS = "is_IS",
    hu_HU = "hu_HU",
    pl_PL = "pl_PL",
    lv_LV = "lv_LV",
    lt_LT = "lt_LT"
}
export declare enum MethodResourceEnum {
    orders = "orders",
    payments = "payments"
}
export declare enum WalletsEnum {
    applepay = "applepay"
}
export declare enum MethodListIncludeEnum {
    issuers = "issuers",
    pricing = "pricing"
}
export interface IMethodListPricing {
    description: string;
    fixed: {
        value: string;
        currency: string;
    };
    variable: string;
}
export interface IMethodListIssuers {
    resource: 'issuer';
    id: string;
    name: string;
    image: {
        size1x: string;
        size2x: string;
        svg: string;
    };
}
export interface IMethod {
    resource: 'method';
    id: string;
    description: string;
    minimumAmount: {
        value: string;
        currency: string;
    };
    maximumAmount: {
        value: string;
        currency: string;
    };
    image: {
        [key: string]: any;
        size1x: string;
        size2x: string;
        svg: string;
    };
    pricing?: IMethodListPricing[];
    issuers?: IMethodListIssuers[];
    _links: {
        self: IIndexedObject;
    };
}
export interface IAmount {
    value: string | number;
    currency: string;
}
export interface IApplicationFee {
    amount: IAmount;
    description: string;
}
export interface ICurrencyFormatNumbersOnlyObject {
    style: 'currency';
    currency: string;
    currencyDisplay: 'none';
}
export interface IPaymentLinks {
    self: {
        href: string;
        type: string;
    };
    checkout: {
        href: string;
        type: string;
    };
    documentation: {
        href: string;
        type: string;
    };
}
export interface IMollieRequestResult {
    _links: IPaymentLinks;
}
export interface IMollieRequestListResult extends IMollieRequestResult {
    count: number;
}
export interface IMolliePaymentListResult extends IMollieRequestListResult {
    _embedded: {
        payments: Payment[];
    };
}
export interface IMollieMethodListResult extends IMollieRequestListResult {
    _embedded: {
        methods: Array<IMethod>;
    };
}
export interface IPaymentsListOptions {
    from?: string;
    limit?: number;
}
export interface IMethodListOptions {
    locale?: LocaleEnum;
    amount?: IAmount;
    resource?: MethodResourceEnum;
    billingCountry?: string;
    includeWallets?: WalletsEnum;
    include?: MethodListIncludeEnum;
}
export interface IIndexedObject {
    [key: string]: any;
}
export interface IErrorObject {
    error: string;
}
export declare type paymentsCreateType = (amount: IAmount, description: string, redirectUrl: string, options?: IIndexedObject, lang?: string) => Promise<Payment | IErrorObject>;
export declare type paymentsGetType = (id: string) => Promise<Payment | IErrorObject>;
export declare type paymentsListType = (options?: Object) => Promise<IMolliePaymentListResult | IErrorObject>;
export declare type Dictionary = {
    [index: string]: any;
};
//# sourceMappingURL=Types.d.ts.map
import Payment from "./classes/Payment";
import Mollie from "./Mollie";
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
export interface IMollie extends Mollie {
}
export interface IPayment extends Payment {
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
        payments: IPayment[];
    };
}
export interface IMolliePayments {
    create: paymentsCreateType;
    get: paymentsGetType;
    list: paymentsListType;
}
export interface IIndexedObject {
    [key: string]: any;
}
export interface IErrorObject {
    error: string;
}
export declare function isIErrorObject(obj: any): obj is IErrorObject;
export declare type paymentsCreateType = (amount: IAmount, description: string, redirectUrl: string, options?: IIndexedObject, lang?: string) => Promise<Payment | IErrorObject>;
export declare type paymentsGetType = (id: string) => Promise<Payment | IErrorObject>;
export declare type paymentsListType = (options?: Object) => Promise<IMolliePaymentListResult | IErrorObject>;
//# sourceMappingURL=Types.d.ts.map
import {
    IAmount,
    IApplicationFee,
    IPaymentLinks,
    MethodEnum,
    ModeEnum,
    PaymentStatusEnum,
    SequenceTypeEnum
} from "../Types";

export default class Payment {

    readonly resource!: string; // Indicates the response contains a payment object. Will always contain payment for this endpoint.
    readonly id!: string; //The identifier uniquely referring to this payment. Mollie assigns this identifier at payment creation time. For example tr_7UhSN1zuXS. Its ID will always be used by Mollie to refer to a certain payment.
    readonly mode!: ModeEnum; //The mode used to create this payment. Mode determines whether a payment is real (live mode) or a test payment.
    readonly createdAt!: Date;  // The payment’s date and time of creation, in ISO 8601 format.
    readonly status!: PaymentStatusEnum; // The payment’s status. Please refer to the documentation regarding statuses for more info about which statuses occur at what point.
    readonly isCancelable?: boolean;
    readonly authorizedAt?: Date;
    readonly paidAt?: Date;
    readonly canceledAt?: Date;
    readonly expiresAt?: Date;
    readonly failedAt?: Date;
    readonly amount!: IAmount;
    readonly amountRefunded?: IAmount;
    readonly amountRemaining?: IAmount;
    readonly amountCaptured?: IAmount;
    readonly description!: string;
    readonly redirectUrl!: string;
    readonly webhookUrl?: string;
    readonly method!: MethodEnum | MethodEnum[];
    readonly metadata: any;
    readonly locale!: string;
    readonly countryCode?: string;
    readonly profileId!: string;
    readonly settlementId?: string;
    readonly customerId?: string;
    readonly sequenceType!: SequenceTypeEnum;
    readonly mandateId?: string;
    readonly subcriptionId?: string;
    readonly orderId?: string;
    readonly applicationFee?: IApplicationFee;
    readonly details?: Object;
    readonly _links!: IPaymentLinks;

    constructor(incoming: Object) {
        Object.assign(this, incoming);
    }

    /**
     * Returns a boolean stating the order is paid or not
     * @returns {boolean} Order is paid or not
     */
    isPaid(): boolean {
        return this.status.toLowerCase() === PaymentStatusEnum.paid || this.status.toLowerCase() === PaymentStatusEnum.paidout;
    }

    /**
     * Returns the checkout string for this payment
     * @returns {string} Checkout link
     */
    getPaymentUrl(): string {
        return this._links.checkout.href;
    }

}

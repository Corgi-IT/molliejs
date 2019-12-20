import { IAmount, IApplicationFee, IPaymentLinks, MethodEnum, ModeEnum, PaymentStatusEnum, SequenceTypeEnum } from "../Types";
export default class Payment {
    readonly resource: string;
    readonly id: string;
    readonly mode: ModeEnum;
    readonly createdAt: Date;
    readonly status: PaymentStatusEnum;
    readonly isCancelable?: boolean;
    readonly authorizedAt?: Date;
    readonly paidAt?: Date;
    readonly canceledAt?: Date;
    readonly expiresAt?: Date;
    readonly failedAt?: Date;
    readonly amount: IAmount;
    readonly amountRefunded?: IAmount;
    readonly amountRemaining?: IAmount;
    readonly amountCaptured?: IAmount;
    readonly description: string;
    readonly redirectUrl: string;
    readonly webhookUrl?: string;
    readonly method: MethodEnum | MethodEnum[];
    readonly metadata: any;
    readonly locale: string;
    readonly countryCode?: string;
    readonly profileId: string;
    readonly settlementId?: string;
    readonly customerId?: string;
    readonly sequenceType: SequenceTypeEnum;
    readonly mandateId?: string;
    readonly subcriptionId?: string;
    readonly orderId?: string;
    readonly applicationFee?: IApplicationFee;
    readonly details?: Object;
    readonly _links: IPaymentLinks;
    constructor(incoming: Object);
    /**
     * Returns a boolean stating the order is paid or not
     * @returns {boolean} Order is paid or not
     */
    isPaid(): boolean;
    /**
     * Returns the checkout string for this payment
     * @returns {string} Checkout link
     */
    getPaymentUrl(): string;
}
//# sourceMappingURL=Payment.d.ts.map
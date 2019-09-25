import Payment from "../classes/Payment";
import { IAmount, IErrorObject, IIndexedObject, IMolliePaymentListResult, IPayment, IPaymentsListOptions } from "../Types";
import Mollie from "../Mollie";
export default class MolliePayments {
    private mollie;
    constructor(mollie: Mollie);
    /**
     * Creates a new payment
     * @param {Number} amount The amount to be paid
     * @param {String} description The description for the payment
     * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
     * @param {Object} options Options Mollie accepts for Payment.Create
     * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
     * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
     */
    create: (amount: IAmount, description: string, redirectUrl: string, options?: IIndexedObject | undefined, lang?: string | undefined) => Promise<Payment | IErrorObject>;
    /**
     * Get information about a payment from Mollie by it's id
     * @param {String} id The payments id
     * @returns {Object} Payment information or error, given by Mollie
     */
    get: (id: string) => Promise<IPayment | IErrorObject>;
    /**
     * Retrieves a list of payments from Mollie
     * @param {Object} options Options Mollie accepts for Payment.List
     * @returns {Object} List of payments along with some other data
     */
    list: (options?: IPaymentsListOptions | undefined) => Promise<IMolliePaymentListResult | IErrorObject>;
}
//# sourceMappingURL=payments.d.ts.map
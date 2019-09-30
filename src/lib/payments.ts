import Payment from "../classes/Payment";
import {
    IAmount,
    ICurrencyFormatNumbersOnlyObject,
    IErrorObject,
    IIndexedObject,
    IMolliePaymentListResult,
    IPayment, IPaymentsListOptions, isIErrorObject,
} from "../Types";
import {formatCurrency, getCurrencyFormatNumbersOnly} from "./Formatter";
import Mollie from "../Mollie";

const denied = require('obj-denied');
const {assign} = Object;

export default class MolliePayments {
    private mollie: Mollie;

    constructor(mollie: Mollie) {
        this.mollie = mollie;
    }

    /**
     * Creates a new payment
     * @param {Number} amount The amount to be paid
     * @param {String} description The description for the payment
     * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
     * @param {Object} options Options Mollie accepts for Payment.Create
     * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
     * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
     */
    create = async (amount: IAmount, description: string, redirectUrl: string, options?: IIndexedObject, lang?: string): Promise<Payment | IErrorObject> => {
        if (options) {
            if (!denied(options, 'recurringType') && denied(options, 'customerId')) {
                return {error: 'You need a customerId if you want to use recurring payments'};
            }
            if (!denied(options, 'recurringType') && ['first', 'recurring'].indexOf(options.recurringType) === -1) {
                return {error: 'recurringType needs value "first" or "recurring"'};
            }
        }

        const formatObject: ICurrencyFormatNumbersOnlyObject = getCurrencyFormatNumbersOnly(amount.currency);

        amount.value = `${formatCurrency(amount.value, formatObject, lang || 'nl-NL')}`;

        const opts = assign({
            amount,
            description,
            redirectUrl
        }, options);

        // @ts-ignore
        const result: IPayment | IErrorObject = await this.mollie.request(
            'POST',
            'payments',
            opts
        );

        if (result.hasOwnProperty('error')) {
            return result;
        } else {
            return readifyPayment(result as IPayment);
        }
    };

    /**
     * Get information about a payment from Mollie by it's id
     * @param {String} id The payments id
     * @returns {Object} Payment information or error, given by Mollie
     */
    get = async (id: string): Promise<IPayment | IErrorObject> => {
        if (!id) {
            throw {error: 'No id is given'};
        }

        const result = await this.mollie.request(
            'GET',
            `payments/${id}`
        );

        if (result.error) {
            return result;
        } else {
            return readifyPayment(result);
        }
    };

    /**
     * Retrieves a list of payments from Mollie
     * @param {Object} options Options Mollie accepts for Payment.List
     * @returns {Object} List of payments along with some other data
     */
    list = async (options?: IPaymentsListOptions): Promise<IMolliePaymentListResult | IErrorObject> => {
        if (options && options.limit && options.limit > 250) {
            return {error: 'Limit larger than 250 is not allowed'};
        }

        const result: IMolliePaymentListResult | IErrorObject = await this.mollie.request(
            'GET',
            'payments',
            {},
            options || {}
        );

        if (isIErrorObject(result)) {
            return result;
        } else {
            result._embedded.payments = readifyPayments(result._embedded.payments);
            return result;
        }
    };

}

function readifyPayment(payment: IPayment): Payment {
    return new Payment(payment);
}

function readifyPayments(payments: IPayment[]) {
    for (let i = 0; i < payments.length; i++) {
        payments[i] = new Payment(payments[i]);
        // Object.setPrototypeOf(payments[i], Payment.prototype);
    }

    return payments;
}


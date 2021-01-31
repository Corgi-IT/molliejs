import Payment from "../classes/Payment";
import {
    Dictionary,
    IAmount,
    ICurrencyFormatNumbersOnlyObject,
    IErrorObject,
    IIndexedObject,
    IMolliePaymentListResult,
    IPaymentsListOptions,
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
    create = async (amount: IAmount, description: string, redirectUrl: string, options?: Dictionary, lang?: string): Promise<Payment | Error> => {
        if (options) {
            if (!denied(options, 'recurringType') && denied(options, 'customerId')) {
                return new Error('You need a customerId if you want to use recurring payments');
            }
            if (!denied(options, 'recurringType') && ['first', 'recurring'].indexOf(options.recurringType) === -1) {
                return new Error('recurringType needs value "first" or "recurring"');
            }
        }

        const a = {...amount};

        a.value = parseFloat(`${a.value}`).toFixed(2);

        if(a.value === 'NaN') {
            return new Error(`Value "${amount.value}" is not a valid value.`);
        }

        const opts = assign({
            amount: a,
            description,
            redirectUrl
        }, options);

        const result: Payment | Error = await this.mollie.request(
            'POST',
            'payments',
            opts
        );

        if (result instanceof Error) {
            return result;
        } else {
            return readifyPayment(result);
        }
    };

    /**
     * Get information about a payment from Mollie by it's id
     * @param {String} id The payments id
     * @returns {Object} Payment information or error, given by Mollie
     */
    get = async (id: string): Promise<Payment | Error> => {
        if (!id) {
            return new Error('No id is given');
        }

        const result = await this.mollie.request(
            'GET',
            `payments/${id}`
        );

        if (result instanceof Error) {
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
    list = async (options?: IPaymentsListOptions): Promise<IMolliePaymentListResult | Error> => {
        if (options && options.limit && options.limit > 250) {
            return new Error('Limit larger than 250 is not allowed');
        }

        const result: IMolliePaymentListResult | Error = await this.mollie.request(
            'GET',
            'payments',
            {},
            <Dictionary>options || {}
        );
        if (result instanceof Error) {
            return result;
        } else {
            result._embedded.payments = readifyPayments(result._embedded.payments);
            return result;
        }
    };

}

function readifyPayment(payment: Payment): Payment {
    return new Payment(payment);
}

function readifyPayments(payments: Payment[]) {
    for (let i = 0; i < payments.length; i++) {
        payments[i] = new Payment(payments[i]);
        // Object.setPrototypeOf(payments[i], Payment.prototype);
    }

    return payments;
}


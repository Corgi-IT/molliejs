"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_1 = __importDefault(require("../classes/Payment"));
const Formatter_1 = require("./Formatter");
const denied = require('obj-denied');
const { assign } = Object;
class MolliePayments {
    constructor(mollie) {
        /**
         * Creates a new payment
         * @param {Number} amount The amount to be paid
         * @param {String} description The description for the payment
         * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
         * @param {Object} options Options Mollie accepts for Payment.Create
         * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
         * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
         */
        this.create = async (amount, description, redirectUrl, options, lang) => {
            if (options) {
                if (!denied(options, 'recurringType') && denied(options, 'customerId')) {
                    return new Error('You need a customerId if you want to use recurring payments');
                }
                if (!denied(options, 'recurringType') && ['first', 'recurring'].indexOf(options.recurringType) === -1) {
                    return new Error('recurringType needs value "first" or "recurring"');
                }
            }
            const formatObject = Formatter_1.getCurrencyFormatNumbersOnly(amount.currency);
            amount.value = `${Formatter_1.formatCurrency(amount.value, formatObject, lang || 'nl-NL')}`;
            const opts = assign({
                amount,
                description,
                redirectUrl
            }, options);
            const result = await this.mollie.request('POST', 'payments', opts);
            if (result instanceof Error) {
                return result;
            }
            else {
                return readifyPayment(result);
            }
        };
        /**
         * Get information about a payment from Mollie by it's id
         * @param {String} id The payments id
         * @returns {Object} Payment information or error, given by Mollie
         */
        this.get = async (id) => {
            if (!id) {
                return new Error('No id is given');
            }
            const result = await this.mollie.request('GET', `payments/${id}`);
            if (result instanceof Error) {
                return result;
            }
            else {
                return readifyPayment(result);
            }
        };
        /**
         * Retrieves a list of payments from Mollie
         * @param {Object} options Options Mollie accepts for Payment.List
         * @returns {Object} List of payments along with some other data
         */
        this.list = async (options) => {
            if (options && options.limit && options.limit > 250) {
                return new Error('Limit larger than 250 is not allowed');
            }
            const result = await this.mollie.request('GET', 'payments', {}, options || {});
            if (result instanceof Error) {
                return result;
            }
            else {
                result._embedded.payments = readifyPayments(result._embedded.payments);
                return result;
            }
        };
        this.mollie = mollie;
    }
}
exports.default = MolliePayments;
function readifyPayment(payment) {
    return new Payment_1.default(payment);
}
function readifyPayments(payments) {
    for (let i = 0; i < payments.length; i++) {
        payments[i] = new Payment_1.default(payments[i]);
        // Object.setPrototypeOf(payments[i], Payment.prototype);
    }
    return payments;
}

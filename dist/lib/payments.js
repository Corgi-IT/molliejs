"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Payment_1 = __importDefault(require("../classes/Payment"));
const Types_1 = require("../Types");
const Formatter_1 = require("./Formatter");
const denied = require('obj-denied');
const { assign } = Object;
/**
 *
 * @param {IMollie} mollie
 * @return {paymentsCreateType}
 */
function createGenerator(mollie) {
    /**
     * Creates a new payment
     * @param {Number} amount The amount to be paid
     * @param {String} description The description for the payment
     * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
     * @param {Object} options Options Mollie accepts for Payment.Create
     * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
     * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
     */
    return async function create(amount, description, redirectUrl, options, lang) {
        if (options) {
            if (!denied(options, 'recurringType') && denied(options, 'customerId')) {
                return { error: 'You need a customerId if you want to use recurring payments' };
            }
            if (!denied(options, 'recurringType') && ['first', 'recurring'].indexOf(options.recurringType) === -1) {
                return { error: 'recurringType needs value "first" or "recurring"' };
            }
        }
        const formatObject = Formatter_1.getCurrencyFormatNumbersOnly(amount.currency);
        amount.value = `${Formatter_1.formatCurrency(amount.value, formatObject, lang || 'nl-NL')}`;
        const opts = assign({
            amount,
            description,
            redirectUrl
        }, options);
        // @ts-ignore
        const result = await mollie.request('POST', 'payments', opts);
        if (result.hasOwnProperty('error')) {
            return result;
        }
        else {
            return readifyPayment(result);
        }
    };
}
exports.createGenerator = createGenerator;
/**
 *
 * @param {IMollie} mollie
 * @return {getType}
 */
function getGenerator(mollie) {
    /**
     * Get information about a payment from Mollie by it's id
     * @param {String} id The payments id
     * @returns {Object} Payment information or error, given by Mollie
     */
    return async function get(id) {
        if (!id) {
            throw { error: 'No id is given' };
        }
        // @ts-ignore
        const result = await mollie.request('GET', `payments/${id}`);
        if (result.error) {
            throw result;
        }
        else {
            return readifyPayment(result);
        }
    };
}
exports.getGenerator = getGenerator;
/**
 *
 * @param {IMollie} mollie
 * @return {paymentsListType}
 */
function listGenerator(mollie) {
    /**
     * Retrieves a list of payments from Mollie
     * @param {Object} options Options Mollie accepts for Payment.List
     * @returns {Object} List of payments along with some other data
     */
    return async function list(options) {
        if (!denied(options, 'count') && options.count > 250) {
            throw { error: 'Count larger than 250 is not allowed' };
        }
        const result = await mollie.request('GET', 'payments', {}, options);
        if (Types_1.isIErrorObject(result)) {
            return result;
        }
        else {
            result._embedded.payments = readifyPayments(result._embedded.payments);
            return result;
        }
    };
}
exports.listGenerator = listGenerator;
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

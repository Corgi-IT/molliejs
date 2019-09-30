"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../Types");
const Formatter_1 = require("./Formatter");
const denied = require('obj-denied');
const { assign } = Object;
class MollieMethods {
    constructor(mollie) {
        /**
         * Creates a new payment
         * @param {SequenceTypeEnum} sequenceType The SequenceType for this payment. Defaults to a standard payment (oneoff)
         * @param {String} description The description for the payment
         * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
         * @param {Object} options Options Mollie accepts for Payment.Create
         * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
         * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
         */
        this.list = async (sequenceType = Types_1.SequenceTypeEnum.oneoff, options) => {
            if (options && options.amount) {
                const formatObject = Formatter_1.getCurrencyFormatNumbersOnly(options.amount.currency);
                options.amount.value = `${Formatter_1.formatCurrency(options.amount.value, formatObject, options.locale || 'nl-NL')}`;
            }
            return await this.mollie.request('GET', 'methods', {}, {
                sequenceType,
                ...options,
            });
        };
        /**
         * Get information about a payment from Mollie by it's id
         * @param {string} method The method to be retrieved, e.g. ideal
         * @param {IMethodListOptions} options Options for this function
         * @returns {Object} Payment information or error, given by Mollie
         */
        this.get = async (method, options) => {
            if (options && options.amount) {
                const formatObject = Formatter_1.getCurrencyFormatNumbersOnly(options.amount.currency);
                options.amount.value = `${Formatter_1.formatCurrency(options.amount.value, formatObject, options.locale || 'nl-NL')}`;
            }
            return await this.mollie.request('GET', `methods/${method}`, {}, options);
        };
        /**
         * Retrieves a list of payments from Mollie
         * @param {LocaleEnum} locale The used Locale. Defaults to "nl_NL"
         * @param {IAmount} amount
         * @param {MethodListIncludesEnum} include
         * @returns {Object} List of payments along with some other data
         */
        this.listAll = async (locale = Types_1.LocaleEnum.nl_NL, amount, include) => {
            const urlParams = {
                locale,
                include
            };
            if (amount) {
                const formatObject = Formatter_1.getCurrencyFormatNumbersOnly(amount.currency);
                amount.value = `${Formatter_1.formatCurrency(amount.value, formatObject, locale || 'nl-NL')}`;
                urlParams.amount = amount;
            }
            return await this.mollie.request('GET', 'methods/all', {}, urlParams);
        };
        this.mollie = mollie;
    }
    static isIMethod(obj) {
        return obj.hasOwnProperty('resource') && obj.resource === 'method';
    }
    static isIMollieMethodListResult(obj) {
        return obj.hasOwnProperty('_embedded') && obj._embedded.hasOwnProperty('methods');
    }
}
exports.default = MollieMethods;

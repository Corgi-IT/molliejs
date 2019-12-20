import Payment from "../classes/Payment";
import {
    IAmount,
    ICurrencyFormatNumbersOnlyObject,
    IErrorObject,
    IMethod,
    IMethodListOptions,
    IMolliePaymentListResult,
    LocaleEnum,
    MethodListIncludeEnum,
    SequenceTypeEnum,
    IMollieMethodListResult, IIndexedObject, Dictionary,
} from "../Types";
import {formatCurrency, getCurrencyFormatNumbersOnly} from "./Formatter";
import Mollie from "../Mollie";

const denied = require('obj-denied');
const {assign} = Object;

export default class MollieMethods {
    private mollie: Mollie;

    constructor(mollie: Mollie) {
        this.mollie = mollie;
    }

    static isIMethod(obj: any): obj is IMethod {
        return obj.hasOwnProperty('resource') && obj.resource === 'method';
    }

    static isIMollieMethodListResult(obj: any): obj is IMollieMethodListResult {
        return obj.hasOwnProperty('_embedded') && obj._embedded.hasOwnProperty('methods');
    }

    /**
     * Creates a new payment
     * @param {SequenceTypeEnum} sequenceType The SequenceType for this payment. Defaults to a standard payment (oneoff)
     * @param {String} description The description for the payment
     * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
     * @param {Object} options Options Mollie accepts for Payment.Create
     * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
     * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
     */
    list = async (sequenceType: SequenceTypeEnum = SequenceTypeEnum.oneoff, options?: IMethodListOptions): Promise<IMollieMethodListResult[] | IErrorObject> => {

        if (options && options.amount) {
            const formatObject: ICurrencyFormatNumbersOnlyObject = getCurrencyFormatNumbersOnly(options.amount.currency);
            options.amount.value = `${formatCurrency(options.amount.value, formatObject, options.locale || 'nl-NL')}`;
        }

        return await this.mollie.request(
            'GET',
            'methods',
            {},
            <Dictionary>{
                sequenceType,
                ...options,
            }
        );

    };

    /**
     * Get information about a payment from Mollie by it's id
     * @param {string} method The method to be retrieved, e.g. ideal
     * @param {IMethodListOptions} options Options for this function
     * @returns {Object} Payment information or error, given by Mollie
     */
    get = async (method: string, options?: IMethodListOptions): Promise<IMethod | IErrorObject> => {
        if (options && options.amount) {
            const formatObject: ICurrencyFormatNumbersOnlyObject = getCurrencyFormatNumbersOnly(options.amount.currency);
            options.amount.value = `${formatCurrency(options.amount.value, formatObject, options.locale || 'nl-NL')}`;
        }

        return await this.mollie.request(
            'GET',
            `methods/${method}`,
            {},
            <Dictionary>options
        );
    };

    /**
     * Retrieves a list of payments from Mollie
     * @param {LocaleEnum} locale The used Locale. Defaults to "nl_NL"
     * @param {IAmount} amount
     * @param {MethodListIncludesEnum} include
     * @returns {Object} List of payments along with some other data
     */
    listAll = async (locale: LocaleEnum = LocaleEnum.nl_NL, amount?: IAmount, include?: MethodListIncludeEnum): Promise<IMollieMethodListResult[] | IErrorObject> => {
        const urlParams: IIndexedObject = {
            locale,
            include
        };

        if (amount) {
            const formatObject: ICurrencyFormatNumbersOnlyObject = getCurrencyFormatNumbersOnly(amount.currency);
            amount.value = `${formatCurrency(amount.value, formatObject, locale || 'nl-NL')}`;
            urlParams.amount = amount;
        }


        return await this.mollie.request(
            'GET',
            'methods/all',
            {},
            urlParams,
        );
    }
}


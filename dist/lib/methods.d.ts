import { IAmount, IErrorObject, IMethod, IMethodListOptions, LocaleEnum, MethodListIncludeEnum, SequenceTypeEnum, IMollieMethodListResult } from "../Types";
import Mollie from "../Mollie";
export default class MollieMethods {
    private mollie;
    constructor(mollie: Mollie);
    static isIMethod(obj: any): obj is IMethod;
    static isIMollieMethodListResult(obj: any): obj is IMollieMethodListResult;
    /**
     * Creates a new payment
     * @param {SequenceTypeEnum} sequenceType The SequenceType for this payment. Defaults to a standard payment (oneoff)
     * @param {String} description The description for the payment
     * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
     * @param {Object} options Options Mollie accepts for Payment.Create
     * @param {string?} lang optional the supply the language to the Intl.NumberFormatter function. Defaults to nl-NL
     * @returns {Promise<Payment | Payment[] | IErrorObject>} New Payment or error, created by Mollie
     */
    list: (sequenceType?: SequenceTypeEnum, options?: IMethodListOptions | undefined) => Promise<IErrorObject | IMollieMethodListResult[]>;
    /**
     * Get information about a payment from Mollie by it's id
     * @param {string} method The method to be retrieved, e.g. ideal
     * @param {IMethodListOptions} options Options for this function
     * @returns {Object} Payment information or error, given by Mollie
     */
    get: (method: string, options?: IMethodListOptions | undefined) => Promise<IMethod | IErrorObject>;
    /**
     * Retrieves a list of payments from Mollie
     * @param {LocaleEnum} locale The used Locale. Defaults to "nl_NL"
     * @param {IAmount} amount
     * @param {MethodListIncludesEnum} include
     * @returns {Object} List of payments along with some other data
     */
    listAll: (locale?: LocaleEnum, amount?: IAmount | undefined, include?: MethodListIncludeEnum | undefined) => Promise<IErrorObject | IMollieMethodListResult[]>;
}
//# sourceMappingURL=methods.d.ts.map
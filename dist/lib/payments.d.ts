import { IMollie, paymentsCreateType, paymentsGetType, paymentsListType } from "../Types";
/**
 *
 * @param {IMollie} mollie
 * @return {paymentsCreateType}
 */
export declare function createGenerator(mollie: IMollie): paymentsCreateType;
/**
 *
 * @param {IMollie} mollie
 * @return {getType}
 */
export declare function getGenerator(mollie: IMollie): paymentsGetType;
/**
 *
 * @param {IMollie} mollie
 * @return {paymentsListType}
 */
export declare function listGenerator(mollie: IMollie): paymentsListType;
//# sourceMappingURL=payments.d.ts.map
import { IIndexedObject } from "./Types";
import MolliePayments from './lib/payments';
export declare class Mollie {
    readonly key: string;
    payments: MolliePayments;
    static create(key: string): Mollie;
    constructor(key: string);
    request(method: string, extension: string, data: IIndexedObject, urlParameters: Object): Promise<any>;
    test(): Promise<boolean>;
}
export default Mollie;
//# sourceMappingURL=Mollie.d.ts.map
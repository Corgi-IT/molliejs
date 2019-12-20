import { Dictionary, IIndexedObject } from "./Types";
import MolliePayments from './lib/payments';
import MollieMethods from "./lib/methods";
export declare class Mollie {
    readonly key: string;
    payments: MolliePayments;
    methods: MollieMethods;
    static create(key: string): Mollie;
    constructor(key: string);
    request(method: string, extension: string, data?: IIndexedObject, urlParameters?: Dictionary): Promise<any | Error>;
    test(): Promise<boolean>;
}
export default Mollie;
//# sourceMappingURL=Mollie.d.ts.map
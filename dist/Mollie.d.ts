import { IMolliePayments } from "./Types";
declare class Mollie {
    readonly key: string;
    payments: IMolliePayments;
    static create(key: string): Mollie;
    constructor(key: string);
    request(method: string, extension: string, data: Object, urlParameters: Object): Promise<any>;
    test(): Promise<boolean>;
}
export default Mollie;
//# sourceMappingURL=Mollie.d.ts.map
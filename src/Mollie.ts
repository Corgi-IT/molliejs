import {IIndexedObject, isIErrorObject} from "./Types";

// const Payment = require('./classes/Payment');
import MolliePayments from './lib/payments';
// import denied from 'obj-denied';
import fetch from 'node-fetch';

export class Mollie {

    readonly key: string;
    payments: MolliePayments = new MolliePayments(this);

    static create(key: string): Mollie {
        return new Mollie(key);
    }

    constructor(key: string) {
        this.key = key;
    }

    async request(method: string, extension: string, data: IIndexedObject, urlParameters: Object): Promise<any> {
        if (!this.key) {
            return {error: 'There is no API key I can use, please set your key `this.key`'};
        }
        method = method.toLowerCase();

        const fetchOptions: IIndexedObject = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.key}`
            }
        };

        // Add data to request
        if (method !== 'get') {
            fetchOptions.body = JSON.stringify(data);
        }

        const result = await fetch(
            `https://api.mollie.nl/v2/${extension}${addURLParams(urlParameters)}`,
            fetchOptions
        );

        try {
            return await result.json();
        } catch (e) {
            return {error: e.message};
        }

    }

    async test() {
        const result = await this.payments.list();

        return !isIErrorObject(result);
    }
}

function addURLParams(urlParameters: IIndexedObject = {}): string {
    if (Object.keys(urlParameters).length === 0)
        return '';

    let urlParams = '';

    for (let prop in urlParameters) {
        urlParams += `&${prop}=${urlParameters[prop]}`;
    }

    return urlParams.replace('&', '?');
}

module.exports = Mollie;
export default Mollie;
// module.exports.Payment = Payment;

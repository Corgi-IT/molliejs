import {Dictionary, IErrorObject, IFetchOptions, IIndexedObject} from "./Types";

// const Payment = require('./classes/Payment');
import MolliePayments from './lib/payments';
// import denied from 'obj-denied';
import fetch from 'node-fetch';
import MollieMethods from "./lib/methods";

class Mollie {

    readonly key: string;
    payments: MolliePayments = new MolliePayments(this);
    methods: MollieMethods = new MollieMethods(this);

    static create(key: string): Mollie {
        return new Mollie(key);
    }

    constructor(key: string) {
        this.key = key;
    }

    async request(method: string, extension: string, data?: object, urlParameters?: Dictionary): Promise<any | Error> {
        if (!this.key) {
            return new Error('There is no API key I can use, please set your key `this.key`');
        }
        method = method.toLowerCase();

        const fetchOptions: IFetchOptions = {
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
            `https://api.mollie.nl/v2/${extension}${genQueryString(urlParameters)}`,
            fetchOptions
        );

        try {
            return await result.json();
        } catch (e) {
            return e;
        }

    }

    async test() {
        const result = await this.payments.list();

        return !(result instanceof Error);
    }
}

const genQueryString = (query?: Dictionary): string => {
    if (!query)
        return '';
    return '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
};

module.exports = Mollie;
export default Mollie;
// module.exports.Payment = Payment;

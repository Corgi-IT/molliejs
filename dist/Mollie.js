"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
// const Payment = require('./classes/Payment');
const payments_1 = __importDefault(require("./lib/payments"));
// import denied from 'obj-denied';
const node_fetch_1 = __importDefault(require("node-fetch"));
const methods_1 = __importDefault(require("./lib/methods"));
class Mollie {
    constructor(key) {
        this.payments = new payments_1.default(this);
        this.methods = new methods_1.default(this);
        this.key = key;
    }
    static create(key) {
        return new Mollie(key);
    }
    async request(method, extension, data, urlParameters) {
        if (!this.key) {
            return { error: 'There is no API key I can use, please set your key `this.key`' };
        }
        method = method.toLowerCase();
        const fetchOptions = {
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
        const result = await node_fetch_1.default(`https://api.mollie.nl/v2/${extension}${addURLParams(urlParameters)}`, fetchOptions);
        try {
            return await result.json();
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async test() {
        const result = await this.payments.list();
        return !Types_1.isIErrorObject(result);
    }
}
exports.Mollie = Mollie;
function addURLParams(urlParameters = {}) {
    if (Object.keys(urlParameters).length === 0)
        return '';
    let urlParams = '';
    for (let prop in urlParameters) {
        urlParams += `&${prop}=${urlParameters[prop]}`;
    }
    return urlParams.replace('&', '?');
}
module.exports = Mollie;
exports.default = Mollie;
// module.exports.Payment = Payment;

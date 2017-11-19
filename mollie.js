const superagent = require('superagent');
const denied = require('obj-denied');

class Mollie {

    constructor(key) {
        this.key = key;

        this.customers = {};
        this.issuers = {};
        this.methods = {};
        this.payments = {};
        this.refunds = {};

        const customers = require('./lib/customers');
        const issuers = require('./lib/issuers');
        const methods = require('./lib/methods');
        const payments = require('./lib/payments');
        const refunds = require('./lib/refunds');

        for (let key in customers)
            this.customers[key] = customers[key].bind(this)
        for (let key in issuers)
            this.issuers[key] = issuers[key].bind(this);
        for (let key in methods)
            this.methods[key] = methods[key].bind(this);
        for (let key in payments)
            this.payments[key] = payments[key].bind(this);
        for (let key in refunds)
            this.refunds[key] = refunds[key].bind(this);
    }

    async request(method, extension, data, urlParameters) {
        if (!this.key) {
            throw {error: 'There is no API key I can use, please set your key `this.key`'};
        }
        method = method.toLowerCase();

        const request = getHTTPMethod(method, extension, urlParameters);

        // Set api key
        request.set('Authorization', `Bearer ${this.key}`);

        // Add data to request
        if (method !== 'get') {
            request.send(data);
        }

        try {
            const result = await request;

            return result.body;
        } catch (e) {
            if (denied(e, 'response'))
                throw e;
            else
                throw e.response.body;
        }
    }

    async test() {
        try {
            const result = await this.payments.list();

            return !!result.data;
        } catch (e) {
            if (e.error && e.error.message && e.error.message === 'Unauthorized request')
                return false;

            throw e;
        }
    }
}

function getHTTPMethod(method, extension, urlParameters) {
    const url = `https://api.mollie.nl/v1/${extension}${addURLParams(urlParameters)}`;

    switch (method) {
        case 'get':
            return superagent.get(url);
        case 'post':
            return superagent.post(url);
        case 'delete':
            return superagent.delete(url);
    }
}

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

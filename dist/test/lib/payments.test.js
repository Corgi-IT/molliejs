"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mollie_1 = __importDefault(require("../../Mollie"));
const Payment_1 = __importDefault(require("../../classes/Payment"));
const Types_1 = require("../../Types");
const path_1 = require("path");
describe('Payments', () => {
    let check = 0;
    let payment_id;
    let mollieOne;
    let keys;
    beforeAll(() => {
        if (process.env.MOLLIE_KEY)
            keys = [{ key: process.env.MOLLIE_KEY }];
        else
            keys = require(path_1.join(process.cwd(), '/test_keys'));
    });
    beforeEach(() => {
        try {
            check = 0;
            mollieOne = new Mollie_1.default(keys[0].key);
        }
        catch (e) {
            console.log('error', e);
        }
    });
    describe('.create', () => {
        const amount = {
            currency: 'EUR',
            value: 10.00
        };
        const description = 'MollieJS module Test for NPM package https://www.npmjs.com/package/molliejs';
        const redirectUrl = 'http://example.org/order/12345';
        describe('Basics', () => {
            it('Should be a function', () => {
                expect(mollieOne.payments.create).toBeInstanceOf(Function);
            });
        });
        describe('Errors', () => {
            it('Should return an error object if recurringType is set, but no customerID', async () => {
                const result = await mollieOne.payments.create(amount, description, redirectUrl, { recurringType: 'first' });
                expect(result).toHaveProperty('error');
            });
            it('Should return an error object if recurringType is not "first" or "recurring"', async () => {
                const result = await mollieOne.payments.create(amount, description, redirectUrl, {
                    recurringType: 'amazing!!',
                    customerId: 'John Cena'
                });
                expect(result).toHaveProperty('error');
            });
        });
        describe('Success', () => {
            it('Should return an Object', async () => {
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                expect(payment).toBeInstanceOf(Payment_1.default);
            });
            it('Should have basic properties', async () => {
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                expect(payment).toHaveProperty('id');
                expect(payment).toHaveProperty('status');
                expect(payment).toHaveProperty('amount');
                expect(payment).toHaveProperty('description');
            });
            it('Should have function getPaymentUrl which returns the paymentUrl', async () => {
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                expect(payment).toHaveProperty('getPaymentUrl');
                if (payment instanceof Payment_1.default) {
                    const url = payment.getPaymentUrl();
                    expect(url).toEqual(payment._links.checkout.href);
                }
            });
            it('Should have function isPaid which returns false', async () => {
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                expect(payment).toHaveProperty('isPaid');
                if (payment instanceof Payment_1.default) {
                    const paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                    payment_id = payment.id;
                }
            });
            it('Should work with an app URL as callback', async () => {
                const orderId = 12345;
                const redirectUrl = `notores://payment/callback/${orderId}`;
                const payment = await mollieOne.payments.create(amount, description, redirectUrl, {
                    metadata: {
                        orderId,
                    }
                });
                if (payment instanceof Payment_1.default) {
                    expect(payment).toHaveProperty('redirectUrl', redirectUrl);
                    expect(payment.metadata).toHaveProperty('orderId', orderId);
                }
            });
            it('Should work with an issuer if method is iDeal', async () => {
                const orderId = 12345;
                const redirectUrl = `notores://payment/callback/${orderId}`;
                const payment = await mollieOne.payments.create(amount, description, redirectUrl, {
                    method: 'ideal',
                    issuer: 'ideal_ABNANL2A',
                    metadata: {
                        orderId,
                    }
                });
                if (payment instanceof Payment_1.default) {
                    expect(payment).toHaveProperty('redirectUrl', redirectUrl);
                    expect(payment.metadata).toHaveProperty('orderId', orderId);
                }
            });
        });
    });
    describe('.get', () => {
        describe('Success', () => {
            it('Should return an Object', async () => {
                const result = await mollieOne.payments.get(payment_id);
                expect(result).toHaveProperty('amount');
            });
            it('Should have basic properties', async () => {
                const payment = await mollieOne.payments.get(payment_id);
                expect(payment).toBeInstanceOf(Payment_1.default);
            });
            it('Should have function getPaymentUrl which returns the paymentUrl', async () => {
                const payment = await mollieOne.payments.get(payment_id);
                if (payment instanceof Payment_1.default) {
                    expect(payment).toHaveProperty('getPaymentUrl');
                    const url = payment.getPaymentUrl();
                    expect(url).toEqual(payment._links.checkout.href);
                    check = 1;
                }
            });
            it('Should have function isPaid, with various outcomes based on the status', async () => {
                let payment = await mollieOne.payments.get(payment_id);
                if (payment instanceof Payment_1.default) {
                    expect(payment).toHaveProperty('isPaid');
                    let paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                    // @ts-ignore
                    payment.status = 'paid';
                    paid = payment.isPaid();
                    expect(paid).toBeTruthy();
                    // @ts-ignore
                    payment.status = 'paidout';
                    paid = payment.isPaid();
                    expect(paid).toBeTruthy();
                    // @ts-ignore
                    payment.status = 'expired';
                    paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                }
            });
        });
    });
    describe('.list', () => {
        const offset = 2;
        const count = 'Mollie ES6 module Test';
        describe('Basics', () => {
            it('Should be a function', () => {
                expect(mollieOne.payments.list).toBeInstanceOf(Function);
            });
        });
        describe('Errors', () => {
            it('Should throw an error if a count of more than 250 is given', async () => {
                const result = await mollieOne.payments.list({ limit: 251 });
                expect(result).toHaveProperty('error', 'Limit larger than 250 is not allowed');
            });
        });
        describe('Success', () => {
            it('Should return an Object', async () => {
                const payment = await mollieOne.payments.list({ limit: 15 });
                expect(payment).toBeInstanceOf(Object);
            });
            it('Should return certain fields', async () => {
                const limit = 10, from = payment_id;
                const payment = await mollieOne.payments.list({ limit, from });
                if (!Types_1.isIErrorObject(payment)) {
                    expect(payment).toHaveProperty('count', limit);
                    expect(payment).toHaveProperty('_embedded');
                    expect(payment._embedded).toHaveProperty('payments');
                }
            });
            it('Should return payments with payment functions', async () => {
                const payments = await mollieOne.payments.list({ limit: 15 });
                if (!Types_1.isIErrorObject(payments)) {
                    const payment = payments._embedded.payments[0];
                    expect(payment).toHaveProperty('getPaymentUrl');
                    expect(payment).toHaveProperty('isPaid');
                }
            });
            it('Should work without parameters', async () => {
                const payments = await mollieOne.payments.list();
                if (!Types_1.isIErrorObject(payments)) {
                    expect(payments).toHaveProperty('count');
                    expect(payments).toHaveProperty('_embedded');
                }
            });
        });
    });
});

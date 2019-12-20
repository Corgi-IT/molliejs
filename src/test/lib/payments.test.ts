"use strict";
import Mollie from "../../Mollie";
import Payment from "../../classes/Payment";
import {Dictionary, IAmount} from "../../Types";
import {join} from 'path';

describe('Payments', () => {
    let check: number = 0;
    let payment_id: string;

    let mollieOne: Mollie;
    let keys: [{ key: string }];

    beforeAll(() => {
        if (process.env.MOLLIE_KEY)
            keys = [{key: process.env.MOLLIE_KEY}];
        else
            keys = require(join(process.cwd(), '/test_keys'));
    });

    beforeEach(() => {
        try {
            check = 0;
            mollieOne = new Mollie(keys[0].key);
        } catch (e) {
            console.log('error', e);
        }
    });

    describe('.create', () => {
        const amount: IAmount = {
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
                const result = await mollieOne.payments.create(
                    amount,
                    description,
                    redirectUrl,
                    {recurringType: 'first'}
                );

                expect(result).toBeInstanceOf(Error);
            });

            it('Should return an error object if recurringType is not "first" or "recurring"', async () => {
                const result = await mollieOne.payments.create(
                    amount,
                    description,
                    redirectUrl,
                    {
                        recurringType: 'amazing!!',
                        customerId: 'John Cena'
                    }
                );

                expect(result).toBeInstanceOf(Error);
            });
        });

        describe('Success', () => {
            it('Should return an Object', async () => {
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);

                expect(payment).toBeInstanceOf(Payment);
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

                if (payment instanceof Payment) {
                    const url = payment.getPaymentUrl();
                    expect(url).toEqual(payment._links.checkout.href);
                }
            });

            it('Should have function isPaid which returns false', async () => {
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                expect(payment).toHaveProperty('isPaid');

                if (payment instanceof Payment) {
                    const paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                    payment_id = payment.id;
                }
            });

            it('Should work with a value over 1000', async () => {
                amount.value = 1234.56;
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                expect(payment).toHaveProperty('isPaid');

                if (payment instanceof Payment) {
                    const paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                    payment_id = payment.id;
                }
            });

            it('Should work with a value over 1000 in other currencies', async () => {
                amount.value = 1234.56;
                amount.currency = 'USD';
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);

                amount.currency = 'EUR';

                expect(payment).toHaveProperty('isPaid');

                if (payment instanceof Payment) {
                    const paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                    payment_id = payment.id;
                }
            });

            it('Should work with a value over 10000000 in other currencies', async () => {
                amount.value = 12345679.12;
                amount.currency = 'USD';
                const payment = await mollieOne.payments.create(amount, description, redirectUrl);

                amount.value = 10.00;
                amount.currency = 'EUR';

                expect(payment).toHaveProperty('isPaid');

                if (payment instanceof Payment) {
                    const paid = payment.isPaid();
                    expect(paid).toBeFalsy();
                    payment_id = payment.id;
                }
            });

            it('Should work with an app URL as callback', async () => {
                const orderId = 12345;
                const redirectUrl = `notores://payment/callback/${orderId}`;
                const payment = await mollieOne.payments.create(amount, description, redirectUrl,
                    <Dictionary>{
                        metadata: {
                            orderId,
                        }
                    }
                );

                if (payment instanceof Payment) {
                    expect(payment).toHaveProperty('redirectUrl', redirectUrl);
                    expect(payment.metadata).toHaveProperty('orderId', orderId);
                }
            });

            it('Should work with an issuer if method is iDeal', async () => {
                const orderId = 12345;
                const redirectUrl = `notores://payment/callback/${orderId}`;
                const payment = await mollieOne.payments.create(amount, description, redirectUrl,
                    {
                        method: 'ideal',
                        issuer: 'ideal_ABNANL2A',
                        metadata: {
                            orderId,
                        }
                    }
                );

                if (payment instanceof Payment) {
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
                expect(payment).toBeInstanceOf(Payment);
            });

            it('Should have function getPaymentUrl which returns the paymentUrl', async () => {
                const payment = await mollieOne.payments.get(payment_id);

                if (payment instanceof Payment) {
                    expect(payment).toHaveProperty('getPaymentUrl');
                    const url = payment.getPaymentUrl();
                    expect(url).toEqual(payment._links.checkout.href);
                    check = 1;
                }
            });

            it('Should have function isPaid, with various outcomes based on the status', async () => {
                let payment = await mollieOne.payments.get(payment_id);
                if (payment instanceof Payment) {

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
            it('Should return an Error if a count of more than 250 is given', async () => {
                const result = await mollieOne.payments.list({limit: 251});
                if(result instanceof Error) {
                    expect(result.message).toBe('Limit larger than 250 is not allowed');
                } else {
                    expect(true).toBeFalsy();
                }
            });
        });

        describe('Success', () => {
            it('Should return an Object', async () => {
                const payment = await mollieOne.payments.list({limit: 15});
                expect(payment).toBeInstanceOf(Object);
            });

            it('Should return certain fields', async () => {
                const limit = 10, from = payment_id;
                const payment = await mollieOne.payments.list({limit, from});

                if (payment instanceof Error) {
                    expect(true).toBeFalsy();
                } else {
                    expect(payment).toHaveProperty('count', limit);
                    expect(payment).toHaveProperty('_embedded');
                    expect(payment._embedded).toHaveProperty('payments');
                }
            });

            it('Should return payments with payment functions', async () => {
                const payments = await mollieOne.payments.list({limit: 15});

                if (payments instanceof Error) {
                    expect(true).toBeFalsy();
                } else {
                    const payment = payments._embedded.payments[0];
                    expect(payment).toHaveProperty('getPaymentUrl');
                    expect(payment).toHaveProperty('isPaid');
                }
            });

            it('Should work without parameters', async () => {
                const payments = await mollieOne.payments.list();

                if (!(payments instanceof Error)) {
                    expect(payments).toHaveProperty('count');
                    expect(payments).toHaveProperty('_embedded');
                }
            });
        });
    });

});

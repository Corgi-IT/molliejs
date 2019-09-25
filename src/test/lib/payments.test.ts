"use strict";
import Mollie from "../../Mollie";
import Payment from "../../classes/Payment";
import {IAmount, isIErrorObject} from "../../Types";
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
        const description = 'Mollie ES6 module Test';
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

                expect(result).toHaveProperty('error');
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

                expect(result).toHaveProperty('error');
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

            it('Should work with an app URL as callback', async () => {
                const orderId = 12345;
                const redirectUrl = `notores://payment/callback/${orderId}`;
                const payment = await mollieOne.payments.create(amount, description, redirectUrl,
                    {
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
            it('Should throw an error if a count of more than 250 is given', async () => {
                const result = await mollieOne.payments.list({limit: 251});
                expect(result).toHaveProperty('error', 'Limit larger than 250 is not allowed');
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

                if (!isIErrorObject(payment)) {
                    expect(payment).toHaveProperty('count', limit);
                    expect(payment).toHaveProperty('_embedded');
                    expect(payment._embedded).toHaveProperty('payments');
                }
            });

            it('Should return payments with payment functions', async () => {
                const payments = await mollieOne.payments.list({limit: 15});

                if (!isIErrorObject(payments)) {
                    const payment = payments._embedded.payments[0];
                    expect(payment).toHaveProperty('getPaymentUrl');
                    expect(payment).toHaveProperty('isPaid');
                }
            });

            it('Should work without parameters', async () => {
                const payments = await mollieOne.payments.list();

                if (!isIErrorObject(payments)) {
                    expect(payments).toHaveProperty('count');
                    expect(payments).toHaveProperty('_embedded');
                }
            });
        });
    });

});

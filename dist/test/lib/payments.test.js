"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mollie_1 = __importDefault(require("../../Mollie"));
const Payment_1 = __importDefault(require("../../classes/Payment"));
const path_1 = require("path");
// const Mollie = require('../../Mollie');
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
        const description = 'Mollie ES6 module Test';
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
        });
    });
    describe('.get', () => {
        describe('Success', () => {
            it('Should return an Object', async () => {
                const result = await mollieOne.payments.get(payment_id);
                expect(result).toHaveProperty('amount');
            });
            // it('Should have basic properties', async () => {
            //     try {
            //         const payment = await mollieOne.payments.get(payment_id);
            //
            //         payment.should.have.property('id');
            //         payment.should.have.property('status');
            //         payment.should.have.property('amount');
            //         payment.should.have.property('description');
            //         check = 1;
            //     } catch (error) {
            //         console.log(error);
            //         check = 2;
            //     }
            //     check.should.equal(1);
            // });
            //
            // it('Should have function getPaymentUrl which returns the paymentUrl', async () => {
            //     try {
            //         const payment = await mollieOne.payments.get(payment_id);
            //
            //         payment.should.have.property('getPaymentUrl');
            //         const url = payment.getPaymentUrl();
            //         url.should.be.an.String();
            //         url.should.equal(payment.links.paymentUrl)
            //         check = 1;
            //     } catch (error) {
            //         console.log(error);
            //         console.log(error.stack);
            //         check = 2;
            //     }
            //     check.should.equal(1);
            // });
            //
            // it('Should have function isPaid, with various outcomes based on the status', async () => {
            //     try {
            //         let payment = await mollieOne.payments.get(payment_id);
            //         payment.should.have.property('isPaid');
            //         let paid = payment.isPaid();
            //         paid.should.be.a.Boolean();
            //         paid.should.equal(false);
            //
            //         payment.status = 'paid';
            //         paid = payment.isPaid();
            //         paid.should.be.a.Boolean();
            //         paid.should.equal(true);
            //
            //         payment.status = 'paidout';
            //         paid = payment.isPaid();
            //         paid.should.be.a.Boolean();
            //         paid.should.equal(true);
            //
            //         payment.status = 'expired';
            //         paid = payment.isPaid();
            //         paid.should.be.a.Boolean();
            //         paid.should.equal(false);
            //
            //         check = 1;
            //     } catch (error) {
            //         console.log(error);
            //         console.log(error.stack);
            //         check = 2;
            //     }
            //     check.should.equal(1);
            // });
        });
    });
    //
    //
    // describe('.list', () => {
    //     const offset = 2;
    //     const count = 'Mollie ES6 module Test';
    //
    //     describe('Basics', () => {
    //         it('Should be a function', () => {
    //             mollieOne.payments.list.should.be.a.Function();
    //         });
    //     });
    //
    //     describe('Errors', () => {
    //         it('Should throw an error if a count of more than 250 is given', async () => {
    //             try {
    //                 await mollieOne.payments.list({count: 251});
    //                 check = 1;
    //             } catch (error) {
    //                 error.should.have.property('error', 'Count larger than 250 is not allowed');
    //                 check = 2;
    //             }
    //             check.should.equal(2);
    //         });
    //     });
    //
    //     describe('Success', () => {
    //         it('Should return an Object', async () => {
    //             try {
    //                 const payment = await mollieOne.payments.list({count: 15});
    //                 payment.should.be.an.Object();
    //                 check = 1;
    //             } catch (error) {
    //                 console.log(error);
    //                 check = 2;
    //             }
    //             check.should.equal(1);
    //         });
    //
    //         it('Should return certain fields', async () => {
    //             try {
    //                 const count = 10, offset = 2;
    //                 const payment = await mollieOne.payments.list({count, offset});
    //                 payment.should.have.property('totalCount');
    //                 payment.should.have.property('offset', offset);
    //                 payment.should.have.property('count');
    //                 payment.should.have.property('data');
    //                 check = 1;
    //             } catch (error) {
    //                 console.log(error);
    //                 check = 2;
    //             }
    //             check.should.equal(1);
    //         });
    //
    //         it('Should return payments with payment functions', async () => {
    //             try {
    //                 const payments = await mollieOne.payments.list({count: 15});
    //                 const payment = payments.data[0];
    //
    //                 payment.should.have.property('getPaymentUrl');
    //                 payment.should.have.property('isPaid');
    //
    //                 check = 1;
    //             } catch (error) {
    //                 console.log(error);
    //                 check = 2;
    //             }
    //             check.should.equal(1);
    //         });
    //
    //         it('Should work without parameters', async () => {
    //             try {
    //                 const payment = await mollieOne.payments.list();
    //
    //                 payment.should.have.property('totalCount');
    //                 payment.should.have.property('offset');
    //                 payment.should.have.property('count');
    //                 payment.should.have.property('data');
    //
    //                 check = 1;
    //             } catch (error) {
    //                 console.log(error);
    //                 check = 2;
    //             }
    //             check.should.equal(1);
    //         });
    //     });
    // });
});

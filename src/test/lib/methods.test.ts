"use strict";
import Mollie from "../../Mollie";
import {MethodListIncludeEnum, MethodResourceEnum, SequenceTypeEnum} from "../../Types";
import {join} from 'path';
import MollieMethods from "../../lib/methods";

describe('Payments', () => {
    let check: number = 0;

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

    describe('.list', () => {
        describe('Success', () => {
            it('Should adhere to the IMollieMethodListResult interface', async () => {
                const result = await mollieOne.methods.list();
                expect(MollieMethods.isIMollieMethodListResult(result)).toBeTruthy();
            });

            it('Should have an array of IMethods an Object', async () => {
                const result = await mollieOne.methods.list();

                if(MollieMethods.isIMollieMethodListResult(result)) {
                    expect(MollieMethods.isIMethod(result._embedded.methods[0])).toBeTruthy();
                }
            });

            it('Should accept all SequenceType enums', async () => {
                const resultOneOff = await mollieOne.methods.list(SequenceTypeEnum.oneoff);
                const resultFirst = await mollieOne.methods.list(SequenceTypeEnum.first);
                const resultRecurring = await mollieOne.methods.list(SequenceTypeEnum.recurring);

                expect(resultOneOff).not.toHaveProperty('error');
                expect(resultFirst).not.toHaveProperty('error');
                expect(resultRecurring).not.toHaveProperty('error');
            });

            it('Should accept the method resource', async () => {
                const resultOrders = await mollieOne.methods.list(SequenceTypeEnum.oneoff, {resource: MethodResourceEnum.orders});
                const resultPayments = await mollieOne.methods.list(SequenceTypeEnum.oneoff, {resource: MethodResourceEnum.payments});

                expect(resultOrders).not.toHaveProperty('error');
                expect(resultPayments).not.toHaveProperty('error');
            });

            it('Should accept the option "include"', async() => {
                const resultIssuers = await mollieOne.methods.list(SequenceTypeEnum.oneoff, {include: MethodListIncludeEnum.issuers});
                const resultPricing = await mollieOne.methods.list(SequenceTypeEnum.oneoff, {include: MethodListIncludeEnum.pricing});

                expect(resultIssuers).not.toHaveProperty('error');
                expect(resultPricing).not.toHaveProperty('error');
                if(MollieMethods.isIMollieMethodListResult(resultIssuers)) {
                    expect(resultIssuers._embedded.methods[0]).toHaveProperty('issuers');
                } else {
                    throw new Error('Result is not IMollieMethodListResult');
                }
            });
        });
    });

    describe('.get', () => {
        const method = 'ideal';

        describe('Success', () => {
            it('Should adhere to the IMethod interface', async () => {
                const result = await mollieOne.methods.get(method);
                expect(MollieMethods.isIMethod(result)).toBeTruthy();
            });

            it('Should accept the method resource', async () => {
                const resultOrders = await mollieOne.methods.get(method, {resource: MethodResourceEnum.orders});
                const resultPayments = await mollieOne.methods.get(method, {resource: MethodResourceEnum.payments});

                expect(resultOrders).not.toHaveProperty('error');
                expect(resultPayments).not.toHaveProperty('error');
            });

            it('Should return the right resource', async () => {
                const result = await mollieOne.methods.get(method); // method === iDeal

                if(MollieMethods.isIMethod(result)) {
                    expect(result).toHaveProperty('id', method);
                }
            });
        });
    });

    describe('.listAll', () => {
        describe('Success', () => {
            it('Should adhere to the IMollieMethodListResult interface', async () => {
                const result = await mollieOne.methods.listAll();

                expect(MollieMethods.isIMollieMethodListResult(result)).toBeTruthy();
            });

            it('Should have an array of IMethods an Object', async () => {
                const result = await mollieOne.methods.listAll();

                if(MollieMethods.isIMollieMethodListResult(result)) {
                    expect(MollieMethods.isIMethod(result._embedded.methods[0])).toBeTruthy();
                }
            });
        });
    });
});

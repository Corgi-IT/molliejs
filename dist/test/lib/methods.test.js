"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mollie_1 = __importDefault(require("../../Mollie"));
const Types_1 = require("../../Types");
const path_1 = require("path");
const methods_1 = __importDefault(require("../../lib/methods"));
describe('Payments', () => {
    let check = 0;
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
    describe('.list', () => {
        describe('Success', () => {
            it('Should adhere to the IMollieMethodListResult interface', async () => {
                const result = await mollieOne.methods.list();
                expect(methods_1.default.isIMollieMethodListResult(result)).toBeTruthy();
            });
            it('Should have an array of IMethods an Object', async () => {
                const result = await mollieOne.methods.list();
                if (methods_1.default.isIMollieMethodListResult(result)) {
                    expect(methods_1.default.isIMethod(result._embedded.methods[0])).toBeTruthy();
                }
            });
            it('Should accept all SequenceType enums', async () => {
                const resultOneOff = await mollieOne.methods.list(Types_1.SequenceTypeEnum.oneoff);
                const resultFirst = await mollieOne.methods.list(Types_1.SequenceTypeEnum.first);
                const resultRecurring = await mollieOne.methods.list(Types_1.SequenceTypeEnum.recurring);
                expect(resultOneOff).not.toHaveProperty('error');
                expect(resultFirst).not.toHaveProperty('error');
                expect(resultRecurring).not.toHaveProperty('error');
            });
            it('Should accept the method resource', async () => {
                const resultOrders = await mollieOne.methods.list(Types_1.SequenceTypeEnum.oneoff, { resource: Types_1.MethodResourceEnum.orders });
                const resultPayments = await mollieOne.methods.list(Types_1.SequenceTypeEnum.oneoff, { resource: Types_1.MethodResourceEnum.payments });
                expect(resultOrders).not.toHaveProperty('error');
                expect(resultPayments).not.toHaveProperty('error');
            });
            it('Should accept the option "include"', async () => {
                const resultIssuers = await mollieOne.methods.list(Types_1.SequenceTypeEnum.oneoff, { include: Types_1.MethodListIncludeEnum.issuers });
                const resultPricing = await mollieOne.methods.list(Types_1.SequenceTypeEnum.oneoff, { include: Types_1.MethodListIncludeEnum.pricing });
                expect(resultIssuers).not.toHaveProperty('error');
                expect(resultPricing).not.toHaveProperty('error');
                if (methods_1.default.isIMollieMethodListResult(resultIssuers)) {
                    expect(resultIssuers._embedded.methods[0]).toHaveProperty('issuers');
                }
                else {
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
                expect(methods_1.default.isIMethod(result)).toBeTruthy();
            });
            it('Should accept the method resource', async () => {
                const resultOrders = await mollieOne.methods.get(method, { resource: Types_1.MethodResourceEnum.orders });
                const resultPayments = await mollieOne.methods.get(method, { resource: Types_1.MethodResourceEnum.payments });
                expect(resultOrders).not.toHaveProperty('error');
                expect(resultPayments).not.toHaveProperty('error');
            });
            it('Should return the right resource', async () => {
                const result = await mollieOne.methods.get(method); // method === iDeal
                if (methods_1.default.isIMethod(result)) {
                    expect(result).toHaveProperty('id', method);
                }
            });
        });
    });
    describe('.listAll', () => {
        describe('Success', () => {
            it('Should adhere to the IMollieMethodListResult interface', async () => {
                const result = await mollieOne.methods.listAll();
                expect(methods_1.default.isIMollieMethodListResult(result)).toBeTruthy();
            });
            it('Should have an array of IMethods an Object', async () => {
                const result = await mollieOne.methods.listAll();
                if (methods_1.default.isIMollieMethodListResult(result)) {
                    expect(methods_1.default.isIMethod(result._embedded.methods[0])).toBeTruthy();
                }
            });
        });
    });
});

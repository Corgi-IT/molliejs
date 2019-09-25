"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mollie_1 = __importDefault(require("../Mollie"));
const path_1 = require("path");
describe('Mollie Test', () => {
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
            mollieOne = new Mollie_1.default(keys[0].key);
        }
        catch (e) {
            console.log('error', e);
        }
    });
    describe('Construct', () => {
        it('Should create a new instance with keyword "new"', () => {
            const first = new Mollie_1.default(keys[0].key);
            const second = new Mollie_1.default(keys[0].key);
            expect(first).toHaveProperty('payments');
            expect(second).toHaveProperty('payments');
            expect(first === second).toBeFalsy();
        });
        it('Should create a new instance when calling "Mollie()"', () => {
            const first = Mollie_1.default.create(keys[0].key);
            const second = Mollie_1.default.create(keys[0].key);
            expect(first === second).toBeFalsy();
        });
    });
});

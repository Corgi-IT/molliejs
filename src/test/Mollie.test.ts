import Mollie from '../Mollie';
import {join} from "path";

console.log('Mollie', Mollie);

describe('Mollie Test', () => {

    let mollieOne: any;

    let keys: { key: string }[];

    beforeAll(() => {
        // process.env.TEST_DIR = __dirname;

        if (process.env.MOLLIE_KEY)
            keys = [{key: process.env.MOLLIE_KEY}];
        else
            keys = require(join(process.cwd(), '/test_keys'));

        console.log('keys', keys);
    });

    beforeEach(() => {
        try {
            mollieOne = new Mollie(keys[0].key);
        } catch (e) {
            console.log('error', e);
        }
    });

    describe('Construct', () => {
        it('Should create a new instance with keyword "new"', () => {
            const first = new Mollie(keys[0].key);
            const second = new Mollie(keys[0].key);

            expect(first).toHaveProperty('payments');
            expect(second).toHaveProperty('payments');

            expect(first === second).toBeFalsy();
        });

        it('Should create a new instance when calling "Mollie()"', () => {
            const first = Mollie.create(keys[0].key);
            const second = Mollie.create(keys[0].key);

            expect(first === second).toBeFalsy();
        });
    });
});

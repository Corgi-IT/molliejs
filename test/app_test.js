"use strict";
require('should');
const Mollie = require('../mollie');

describe('Mollie Test', () => {

    let mollieOne;

    let keys;

    before(() => {
        process.env.TEST_DIR = __dirname;

        if (process.env.MOLLIE_KEY)
            keys = [{key: process.env.MOLLIE_KEY}];
        else
            keys = require(`${process.env.TEST_DIR}/test_keys`);
    });

    beforeEach(() => {
        mollieOne = new Mollie(keys[0].key);
    });

    describe('Construct', () => {
        it('Should create a new instance with keyword "new"', () => {
            const first = new Mollie(keys[0].key);
            const second = new Mollie(keys[0].key);

            first.should.have.property('payments');
            second.should.have.property('payments');

            first.should.not.equal(second);
        });

        it('Should create a new instance when calling "Mollie()"', () => {
            const first = Mollie.create(keys[0].key);
            const second = Mollie.create(keys[0].key);

            first.should.have.property('payments');
            second.should.have.property('payments');

            first.should.not.equal(second);
        });
    });

    describe('App', () => {
        it('Should be an Object', () => {
            mollieOne.should.be.an.Object();
        });

        it('Should have property payments', () => {
            mollieOne.should.have.property('payments');
            mollieOne.payments.should.be.an.Object();
        });

        it('Should throw an error if no API key is set', async () => {
            let check = 0;
            const mollie = new Mollie();

            try {
                await mollie.request();
                check = 1;
            } catch (error) {
                error.should.have.property('error', 'There is no API key I can use, please set your key `this.key`');
                check = 2;
            }

            check.should.equal(2);
        });

        describe('.test', () => {

            it('Should have a function test', () => {
                mollieOne.test.should.be.a.Function();
            });

            it('Should return true if the key is valid', async () => {
                const result = await mollieOne.test();

                result.should.equal(true);
            });

            it('Should return false if the key is invalid', async () => {
                const fakeKey = new Mollie('test_fake_key');

                const result = await fakeKey.test();

                result.should.equal(false);
            });

        })
    });
});

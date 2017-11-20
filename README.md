![Mollie](https://www.mollie.nl/files/Mollie-Logo-Style-Small.png)

# molliejs
NPM Package for the Mollie API, by an official Mollie Partner.

[![Build Status](https://travis-ci.org/Geexteam/molliejs.svg?branch=master)](https://travis-ci.org/Geexteam/molliejs)
[![Dependency Status](https://gemnasium.com/badges/github.com/Geexteam/molliejs.svg)](https://gemnasium.com/github.com/Geexteam/molliejs)
[![NSP Status](https://nodesecurity.io/orgs/geex-team/projects/3fbb082e-1d0a-472b-b275-3ab45a52cb6e/badge)](https://nodesecurity.io/orgs/geex-team/projects/3fbb082e-1d0a-472b-b275-3ab45a52cb6e)

## Requirements ##
To use the this module, the following is required:

+ Node.js v8.0.0 or higher
+ A Mollie account |[Sign up for free](https://www.mollie.com/en/signup/2269941).
+ If you need any help with setting it up, just contact us [@GeeX_dev](https://twitter.com/GeeX_dev) on twitter 
or mail us at [development@geex.company](mailto:development@geex.company?subject=MollieES8%20Help)

## Installation ##

You can install this module with NPM:

    npm install --save molliejs

## Getting started ##
Require the library.
```ES8
    const Mollie = require('molliejs');
```

Initialize
```ES8
    const mollieApi = new Mollie('test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM');
```

All callbacks are now written with ES8' `async/await`.

Create a new payment.
```ES8
    async () => {
        const amount = 10.00;
        const description = 'My first API payment';
        const redirectUrl = 'https://example.org/order/12345';
        try {
            const payment = await mollieApi.payments.create(
                amount,
                description,
                redirectUrl
            );
            console.log(payment.getPaymentUrl());
        } catch (e) {
            // Handle error
        }
    );
```

Retrieving a payment.
```ES8
    async () => {
        const paymentId = 'paymentId';
        try {
            const payment = await mollieApi.payments.get(paymentId);
            if(payment.isPaid()) {
                console.log('Payment is fulfilled');
            }
        } catch (e) {
            // Handle error
        }
    );
```

## Implemented Functions ##

### Payments ###

#### Create ####

##### Normal #####
```ES8
    const amount = 10.00;
    const description = 'My first API payment';
    const redirectUrl = 'https://example.org/order/12345';
    try {
        const payment = await mollieApi.payments.create(
            amount,
            description,
            redirectUrl
        );
        console.log(payment.getPaymentUrl());
    } catch (e) {
        // Handle error
    }
```

##### Recurring #####
```ES8
    const amount = 10.00;
    const description = 'My first API recurring payment';
    const redirectUrl = 'https://example.org/order/12345';
    try {
        const payment = await mollieApi.payments.create(
            amount,
            description,
            redirectUrl,
            {
                recurringType: 'first' || 'recurring',
                customerId: 'John Cena'
            }
        );
        console.log(payment.getPaymentUrl());
    } catch (e) {
        // Handle error
    }
```

#### Get ####

```ES8
    const paymentId = 'paymentId';
    const options = {
        method: 'creditcard'
    };
    try {
        const payment = await mollieApi.payments.get(paymentId, options);
        if(payment.isPaid()) {
            console.log('Payment is paid');
        }
    } catch (e) {
        // Handle error
    }
```

#### List ####

```ES8
    const options = {
        count: 100,
        offset: 200
    }
    try {
        const payments_list = await mollieApi.payments.list(options);
        /*
        payments_list = {
            totalCount: Number,
            offset:     Number,
            count:      Number,
            data:       [Payments],
            links: {
                first:      String(url),
                previous:   String(url),
                next:       String(url),
                last:       String(url)
            }
        }
        */
    } catch (e) {
        // Handle error
    }
```

### Methods ###

#### List ####

```ES8
    const options = {
        count: 10,
        offset: 5
    }
    try {
        const methods_list = await mollieApi.methods.list(options);
        /*
        methods_list = {
            totalCount: Number,
            offset:     Number,
            count:      Number,
            data:       [Methods],
            links: {
                first:      String(url),
                previous:   String(url),
                next:       String(url),
                last:       String(url)
            }
        }
        */
    } catch (e) {
        // Handle error
    }
```

#### Get ####

```ES8
    const amount = 100.00;
    const methodId = 'creditcard';

    try {
        const method = await mollieApi.methods.get(methodId);
        if(method.getMinAmount() < amount && method.getMaxAmount > amount) {
            // Allow user to check out
        }
    } catch (e) {
        // Handle error
    }
```
### Issuers ###

This part is iDEAL only.
Using issuers makes it possible to integrate the bank choice in your own system.

#### List ####

```ES8
    const options = {
        count: 20,
        offset: 2
    }
    try {
        const issuers_list = await mollieApi.issuers.list(options);
        /*
        issuers_list = {
            totalCount: Number,
            offset:     Number,
            count:      Number,
            data:       [Issuers],
            links: {
                first:      String(url),
                previous:   String(url),
                next:       String(url),
                last:       String(url)
            }
        }
        */
    } catch (e) {
        // Handle error
    }
```

#### Get ####

```ES8
    const issuerId = 'ideal_ABNANL2A';

    try {
        const issuer = await mollieApi.issuers.get(issuerId);
        // Do something with this issuer
    } catch (e) {
        // Handle error
    }
```

### Refunds ###

#### Create ####

```ES8
    try {
        const refundId = 'someId';
        const amount = 5.00; // This is optional, if omitted,
                             // the full amount will be refunded
        const refund = await mollieApi.refunds.create(refundId, amount);
    } catch (e) {
        // Handle error
    }
```

#### Get ####

```ES8
    const paymentId = 'paymentId';
    const refundId = 'refundId'
    try {
        const refund = await mollieApi.refunds.get(paymentId, refundId);
        if(refund.payment.isFullyRefunded()) {
            console.log('Payment is fully refunded');
        }
    } catch (e) {
        // Handle error
    }
```

#### List ####

```ES8
    const paymentId = 'paymentId';
    const options = {
        count: 10,
        offset: 2
    }
    try {
        const payments_list = await mollieApi.refunds.list(paymentId, options);
    } catch (e) {
        // Handle error
    }
```

#### Cancel ####

```ES8
    const paymentId = 'paymentId';
    const refundId = 'refundId'
    try {
        const refund = await mollieApi.refunds.cancel(paymentId, refundId);
    } catch (e) {
        // Handle error
    }
```

### Customers ###

#### Create ####

##### Normal #####
```ES8
    try {
        const customer = await mollieApi.customers.create(
            'Customer name',
            'info@domain.tld',
            {locale: 'en', metadata: {something: 'here'}}
        );
        // New customer created, do something fun with it
    } catch (e) {
        // Handle error
    }
```

#### Get ####

```ES8
    const customerId = 'someId';
    try {
        const customer = await mollieApi.customers.get(customerId);
        // Do something with this customer data
    } catch (e) {
        // Handle error
    }
```

#### List ####

```ES8
    const options = {
        count: 100,
        offset: 200
    }
    try {
        const customer_list = await mollieApi.customers.list(options);
        /*
        customer_list = {
            totalCount: Number,
            offset:     Number,
            count:      Number,
            data:       [Customers],
            links: {
                first:      String(url),
                previous:   String(url),
                next:       String(url),
                last:       String(url)
            }
        }
        */
    } catch (e) {
        // Handle error
    }
```


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../Types");
class Payment {
    constructor(incoming) {
        Object.assign(this, incoming);
    }
    /**
     * Returns a boolean stating the order is paid or not
     * @returns {boolean} Order is paid or not
     */
    isPaid() {
        return this.status.toLowerCase() === Types_1.PaymentStatusEnum.paid || this.status.toLowerCase() === Types_1.PaymentStatusEnum.paidout;
    }
    /**
     * Returns the checkout string for this payment
     * @returns {string} Checkout link
     */
    getPaymentUrl() {
        return this._links.checkout.href;
    }
}
exports.default = Payment;

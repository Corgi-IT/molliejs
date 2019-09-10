"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["paid"] = "paid";
    PaymentStatusEnum["paidout"] = "paidout";
    PaymentStatusEnum["expired"] = "expired";
    PaymentStatusEnum["failed"] = "failed";
    PaymentStatusEnum["canceled"] = "canceled";
})(PaymentStatusEnum = exports.PaymentStatusEnum || (exports.PaymentStatusEnum = {}));
var SequenceTypeEnum;
(function (SequenceTypeEnum) {
    SequenceTypeEnum["oneoff"] = "oneoff";
    SequenceTypeEnum["first"] = "first";
    SequenceTypeEnum["recurring"] = "recurring";
})(SequenceTypeEnum = exports.SequenceTypeEnum || (exports.SequenceTypeEnum = {}));
var MethodEnum;
(function (MethodEnum) {
    MethodEnum["null"] = "null";
    MethodEnum["bancontact"] = "bancontact";
    MethodEnum["banktransfer"] = "banktransfer";
    MethodEnum["belfius"] = "belfius";
    MethodEnum["creditcard"] = "creditcard";
    MethodEnum["directdebit"] = "directdebit";
    MethodEnum["eps"] = "eps";
    MethodEnum["giftcard"] = "giftcard";
    MethodEnum["giropay"] = "giropay";
    MethodEnum["ideal"] = "ideal";
    MethodEnum["inghomepay"] = "inghomepay";
    MethodEnum["kbc"] = "kbc";
    MethodEnum["klarnapaylater"] = "klarnapaylater";
    MethodEnum["klarnasliceit"] = "klarnasliceit";
    MethodEnum["mybank"] = "mybank";
    MethodEnum["paypal"] = "paypal";
    MethodEnum["paysafecard"] = "paysafecard";
    MethodEnum["przelewy24"] = "przelewy24";
    MethodEnum["sofort"] = "sofort";
})(MethodEnum = exports.MethodEnum || (exports.MethodEnum = {}));
var ModeEnum;
(function (ModeEnum) {
    ModeEnum["live"] = "live";
    ModeEnum["test"] = "test";
})(ModeEnum = exports.ModeEnum || (exports.ModeEnum = {}));
function isIErrorObject(obj) {
    return obj.hasOwnProperty('error');
}
exports.isIErrorObject = isIErrorObject;

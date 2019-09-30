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
var LocaleEnum;
(function (LocaleEnum) {
    LocaleEnum["en_US"] = "en_US";
    LocaleEnum["nl_NL"] = "nl_NL";
    LocaleEnum["nl_BE"] = "nl_BE";
    LocaleEnum["fr_FR"] = "fr_FR";
    LocaleEnum["fr_BE"] = "fr_BE";
    LocaleEnum["de_DE"] = "de_DE";
    LocaleEnum["de_AT"] = "de_AT";
    LocaleEnum["de_CH"] = "de_CH";
    LocaleEnum["es_ES"] = "es_ES";
    LocaleEnum["ca_ES"] = "ca_ES";
    LocaleEnum["pt_PT"] = "pt_PT";
    LocaleEnum["it_IT"] = "it_IT";
    LocaleEnum["nb_NO"] = "no_NO";
    LocaleEnum["sv_SE"] = "sv_SE";
    LocaleEnum["fi_FI"] = "fi_FI";
    LocaleEnum["da_DK"] = "da_DK";
    LocaleEnum["is_IS"] = "is_IS";
    LocaleEnum["hu_HU"] = "hu_HU";
    LocaleEnum["pl_PL"] = "pl_PL";
    LocaleEnum["lv_LV"] = "lv_LV";
    LocaleEnum["lt_LT"] = "lt_LT";
})(LocaleEnum = exports.LocaleEnum || (exports.LocaleEnum = {}));
var MethodResourceEnum;
(function (MethodResourceEnum) {
    MethodResourceEnum["orders"] = "orders";
    MethodResourceEnum["payments"] = "payments";
})(MethodResourceEnum = exports.MethodResourceEnum || (exports.MethodResourceEnum = {}));
var WalletsEnum;
(function (WalletsEnum) {
    WalletsEnum["applepay"] = "applepay";
})(WalletsEnum = exports.WalletsEnum || (exports.WalletsEnum = {}));
var MethodListIncludesEnum;
(function (MethodListIncludesEnum) {
    MethodListIncludesEnum["issuers"] = "issuers";
    MethodListIncludesEnum["pricing"] = "pricing";
})(MethodListIncludesEnum = exports.MethodListIncludesEnum || (exports.MethodListIncludesEnum = {}));
function isIErrorObject(obj) {
    return obj.hasOwnProperty('error');
}
exports.isIErrorObject = isIErrorObject;

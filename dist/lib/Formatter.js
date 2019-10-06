"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCurrencyFormatNumbersOnly(currencyCode) {
    return {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'none',
    };
}
exports.getCurrencyFormatNumbersOnly = getCurrencyFormatNumbersOnly;
function formatCurrency(value, format, lang) {
    const stripSymbols = (format.currencyDisplay === 'none');
    const localFormat = stripSymbols ? { ...format, currencyDisplay: 'code' } : format;
    let result = Intl.NumberFormat(lang, localFormat).format(value);
    if (stripSymbols) {
        result = result.replace(/[a-z]{3}/i, "").trim();
        result = result.replace(/,/g, '');
    }
    return result;
}
exports.formatCurrency = formatCurrency;

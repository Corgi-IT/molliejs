import {ICurrencyFormatNumbersOnlyObject} from "../Types";

export function getCurrencyFormatNumbersOnly(currencyCode: string): ICurrencyFormatNumbersOnlyObject {
    return {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'none',
    }
}

export function formatCurrency(value: number | string, format: ICurrencyFormatNumbersOnlyObject, lang: string) {
    const stripSymbols = (format.currencyDisplay === 'none');
    const localFormat = stripSymbols ? {...format, currencyDisplay: 'code'} : format;
    let result = Intl.NumberFormat(lang, localFormat).format(value as number);
    if (stripSymbols) {
        result = result.replace(/[a-z]{3}/i, "").trim();
    }
    return result
}

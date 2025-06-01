import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import bnIn from '../src/locales/bn-IN';

const localeCode = 'bn-IN';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(bnIn);
  });

  const wrongLocaleCode = localeCode + '-wrong';
  test(`Wrong Locale: ${wrongLocaleCode}`, () => {
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'শূন্য'],
  [137, 'এক শত সাঁইত্রিশ'],
  [700, 'সাত শত'],
  [4680, 'চার হাজার ছয় শত আশি'],
  [63892, 'তেষট্টি হাজার আট শত বিরানব্বই'],
  [792581, 'সাত লাখ বিরানব্বই হাজার পাঁচ শত একাশী'],
  [2741034, 'সাতাশ লাখ একচল্লিশ হাজার চৌত্রিশ'],
  [86429753, 'আট কোটি চৌষট্টি লাখ ঊনত্রিশ হাজার সাত শত তিপ্পান্ন'],
  [975310864, 'সাতানব্বই কোটি তিপ্পান্ন লাখ দশ হাজার আট শত চৌষট্টি'],
  [9876543210, 'নয় শত সাতআশি কোটি পঁয়ষট্টি লাখ তেতাল্লিশ হাজার দুই শত দশ'],
  [98765432101, 'নয় হাজার আট শত ছিয়াত্তর কোটি চুয়ান্ন লাখ বত্রিশ হাজার এক শত এক'],
  [987654321012, 'আটানব্বই হাজার সাত শত পঁয়ষট্টি কোটি তেতাল্লিশ লাখ একুশ হাজার বারো'],
  [9876543210123, 'নয় লাখ সাতআশি হাজার ছয় শত চুয়ান্ন কোটি বত্রিশ লাখ দশ হাজার এক শত তেইশ'],
  [98765432101234, 'আটানব্বই লাখ ছিয়াত্তর হাজার পাঁচ শত তেতাল্লিশ কোটি একুশ লাখ এক হাজার দুই শত চৌত্রিশ'],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Negative Integers with options = {}', () => {
  const testNegativeIntegers = cloneDeep(testIntegers);
  testNegativeIntegers.map((row, i) => {
    if (i === 0) {
      return;
    }
    row[0] = -row[0];
    row[1] = `ঋণ ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} টাকা`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} টাকা`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    row[1] = `${row[1]} টাকা`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats = [
  [0.0, 'শূন্য'],
  [0.04, 'শূন্য দশমিক শূন্য চার'],
  [0.0468, 'শূন্য দশমিক শূন্য চার ছয় আট'],
  [0.4, 'শূন্য দশমিক চার'],
  [0.63, 'শূন্য দশমিক তেষট্টি'],
  [0.973, 'শূন্য দশমিক নয় শত তিয়াত্তর'],
  [0.999, 'শূন্য দশমিক নয় শত নিরানব্বই'],
  [37.06, 'সাঁইত্রিশ দশমিক শূন্য ছয়'],
  [37.068, 'সাঁইত্রিশ দশমিক শূন্য ছয় আট'],
  [37.68, 'সাঁইত্রিশ দশমিক অষ্টষষ্টি'],
  [37.683, 'সাঁইত্রিশ দশমিক ছয় শত তিরাশী'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency: [number, string][] = [
  [0.0, 'শূন্য টাকা'],
  [0.04, 'শূন্য টাকা এবং চার পয়সা'],
  [0.0468, 'শূন্য টাকা এবং পাঁচ পয়সা'],
  [0.4, 'শূন্য টাকা এবং চল্লিশ পয়সা'],
  [0.63, 'শূন্য টাকা এবং তেষট্টি পয়সা'],
  [0.973, 'শূন্য টাকা এবং সাতানব্বই পয়সা'],
  [0.999, 'এক টাকা'],
  [37.06, 'সাঁইত্রিশ টাকা এবং ছয় পয়সা'],
  [37.068, 'সাঁইত্রিশ টাকা এবং সাত পয়সা'],
  [37.68, 'সাঁইত্রিশ টাকা এবং অষ্টষষ্টি পয়সা'],
  [37.683, 'সাঁইত্রিশ টাকা এবং অষ্টষষ্টি পয়সা'],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace(`শূন্য টাকা এবং `, '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `শূন্য টাকা`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` এবং [\u0980-\u09FF ]+ পয়সা`), '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` এবং [\u0980-\u09FF ]+ পয়সা`), '');
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

/*
  MIT License
  Copyright (c) 2021 Matt McInnis

  Series of Javascript functions that can be used/extended to calculate income taxes either 
  directly through programatic scripting or in a spreadsheet-based application. 

  See README for example uses, installation tips, etc.
*/

PROVINCIAL_TAX_BRACKETS = {
  ON: [
    [10880, 45142, 0.0505],
    [45142, 90287, 0.0915],
    [90287, 150000, 0.1116],
    [150000, 220000, 0.1216],
    [220000, Infinity, 0.1316],
  ],
};

/**
 * Calculates total taxes payable in Ontario, including federal taxes,
 * provincial taxes and the provincial surtax.
 *
 * @param {number} income Employment income earned
 * @param {number} type Either "total_tax", "after_tax_income", "total_provincial_tax", "provincial_tax", "provincial_surtax",
 * "federal_tax", "tax_rate"
 * @return Total
 * @customfunction
 */
function INCOMETAXCAN2021(income, type = "total_tax") {
  // Note: Please see comments in ontarioSurtax() about how the income tax
  // and surtax applies.
  const provincial_tax = ontarioIncomeTax(income);
  const provincial_surtax = ontarioSurtax(income);
  const total_provincial_tax = provincial_tax + provincial_surtax;
  const federal_tax = federalIncomeTax(income);

  const taxBreakdown = {
    provincial_tax,
    provincial_surtax,
    total_provincial_tax,
    federal_tax,
    total_tax: total_provincial_tax + federal_tax,
    after_tax_income: income - total_provincial_tax - federal_tax,
    tax_rate: (total_provincial_tax + federal_tax) / income,
  };
  return taxBreakdown[type];
}

/**
 * Calculates Ontario taxes payable based on income, EXCLUDING surtax.
 *
 * @param {number} income Employment income earned
 * @return Provincial taxes payable.
 * @customfunction
 */
function ontarioIncomeTax(income) {
  const taxBrackets = PROVINCIAL_TAX_BRACKETS["ON"];
  // [min, max, rate]
  const taxesPayable = taxBrackets.map(([min, max, rate]) => {
    const taxPayable = Math.max(Math.min(income - min, max - min), 0) * rate;
    // console.log(min, max, rate, taxPayable, income);
    return taxPayable;
  });

  return taxesPayable.reduce((acc, el) => acc + el);
}

/**
 * Calculates Ontario surtax payable based on income.
 *
 * @param {number} income Employment income earned
 * @return Provincial taxes payable.
 * @customfunction
 */
function ontarioSurtax(income) {
  // min, rate
  const surtaxBrackets = [
    [4874, 0.2],
    [6237, 0.36],
  ];
  // Note: The surtax applies to taxes payable above the amount indicated and is cumulative.
  // For example, if $7k is owed in taxes, an additional 20% must be paid above $4830 and an
  // additional 36% above $6182.
  // [min, max, rate]

  // Since surtax is calculated on provincial taxes payable, not income, we need to find how
  // much taxes we owe:
  const provincialTaxPayable = ontarioIncomeTax(income);

  const taxesPayable = surtaxBrackets.map(([min, rate]) => {
    return Math.max(provincialTaxPayable - min, 0) * rate;
  });

  return taxesPayable.reduce((acc, el) => acc + el);
}

/**
 * Calculates Federal taxes payable based on income, including surtax.
 *
 * @param {number} income Employment income earned
 * @return Federal taxes payable.
 * @customfunction
 */
function federalIncomeTax(income) {
  const taxBrackets = [
    [13808, 49020, 0.15],
    [49020, 98040, 0.205],
    [98040, 151978, 0.26],
    [151978, 216511, 0.29],
    [216511, Infinity, 0.33],
  ];

  // [min, max, rate]
  const taxesPayable = taxBrackets.map(([min, max, rate]) => {
    const taxPayable = Math.max(Math.min(income - min, max - min), 0) * rate;
    // console.log(min, max, rate, taxPayable, income);
    return taxPayable;
  });

  // add up all the taxes payable
  return taxesPayable.reduce((acc, el) => acc + el);
}

(function test() {
  console.log(INCOMETAXCAN2021(113000));
})();

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
 * @param {string} type Either "total_tax", "total_deductions", "net_pay", "total_provincial_tax", "provincial_tax",
 * "provincial_surtax", "federal_tax", "tax_rate", "canada_pension_plan", "ei_deduction", "net_pay_rate"
 * @return Dollar amount of the provided type
 * @customfunction
 */
function INCOMETAXCAN2021(income, type = "total_tax") {
  // Note: Please see comments in ontarioSurtax() about how the income tax
  // and surtax applies.
  const provincial_tax = ontarioIncomeTax(income);
  const provincial_surtax = ontarioSurtax(income);
  const total_provincial_tax = provincial_tax + provincial_surtax;
  const federal_tax = federalIncomeTax(income);
  const canada_pension_plan = canadaPensionPlanDeduction(income);
  const ei_deduction = employmentInsuranceDeduction(income);
  const total_tax = total_provincial_tax + federal_tax;
  const total_deductions = canada_pension_plan + ei_deduction;

  const taxBreakdown = {
    total_tax,
    total_deductions,
    net_pay: income - total_tax - total_deductions,
    total_provincial_tax,
    provincial_tax,
    provincial_surtax,
    federal_tax,
    tax_rate: (total_provincial_tax + federal_tax) / income,
    canada_pension_plan,
    ei_deduction,
    net_pay_rate: (income - total_tax - total_deductions) / income,
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
 * Calculates employment insurance deduction from salary
 *
 * @param {number} income Employment income earned
 * @return Employment insurance deducted
 * @customfunction
 */
function employmentInsuranceDeduction(income) {
  // Note: Ei is typically deducted at some rate (~1.58%) up to a maximum amount
  // (e.x. 56,000). This is set federally. Search "EI premium rates and maximums"
  // for more information.

  // max, rate
  const eiBrackets = [56300, 0.0158];

  const taxableAmt = income > eiBrackets[0] ? eiBrackets[0] : income;
  const taxesPayable = taxableAmt * eiBrackets[1];

  return taxesPayable;
}

/**
 * Calculates Canada Pension Plan (CPP) deduction from salary
 *
 * @param {number} income Employment income earned
 * @return Amount of Canada Pension Plan deducted
 * @customfunction
 */
function canadaPensionPlanDeduction(income) {
  // Note: CPP is calculated by taking the gross income, deducting the
  // basic yearly exemption (~3500), and multiplying the result by the
  // CPP contribution rate (~5.1%). This amount should not exceed the
  // sum of the maximum annual employee and employer contribution (~3166).
  const maxPensionableEarnings = 61600.0;
  const basicExemption = 3500.0;
  const contributionRate = 0.0545;
  const maximumEmployeeAndEmployerConribution = 3166.45;

  const earnings = Math.min(
    Math.max(income - basicExemption, 0),
    maxPensionableEarnings
  );
  // take the minimum of the max amount and calculated amount
  const taxesPayable = Math.min(
    earnings * contributionRate,
    maximumEmployeeAndEmployerConribution
  );

  return taxesPayable;
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
  console.log(canadaPensionPlanDeduction(400000));
})();

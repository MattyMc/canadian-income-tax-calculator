# Canadian Income Tax Calculator, Formulas

Calculate provincial and federal income taxes payable based on income. Useful for financial planning, particularly in Google Sheets.

## Tax Primer

Full-time employees have a few forms of deductions on their pay:

- Federal Income Tax
- Provincial Income Tax
- Provincial Income Surtax
- Canada Pension Plan
- Employment Insurance

Each calculation is unique and generally complex, and all are included in our formula.

## Usage

Generally, the primary API is through the `INCOMETAXCAN2021(income, type)`, where:

- `income`: Total annual income.
- `type`: Either "total_tax", "total_deductions", "net_pay", "total_provincial_tax", "provincial_tax",
  "provincial_surtax", "federal_tax", "tax_rate", "canada_pension_plan", "ei_deduction", "net_pay_rate"

For explanation of what is included in each particular type see below.

### Examples

```javascript
// Find total income tax payable (provincial income tax, federal income tax) for income of $50,000
INCOMETAXCAN2021(50000, "total_tax");

// Find total deductions (provincial, federal, CPP and EI) for income of $50,000
INCOMETAXCAN2021(50000, "total_deductions");

// Find net pay for income of $80,000
INCOMETAXCAN2021(80000, "net_pay");
```

### Types

- total_tax: All provincial income taxes and federal income taxes.
- total_deductions: Canada Pension Plan deductions and Employment Insurance deductions.
- net_pay: Income minus total tax (`total_tax`) minus total deductions (`total_deductions`).
- total_provincial_tax: All provincial taxes, including the provincial surtax.
- provincial_tax: Only provincial income tax, excluding the provincial surtax.
- provincial_surtax: Only the provincial surtax, excluding the provincial income tax.
- federal_tax: Federal income taxes.
- tax_rate: Federal and provincial income taxes (incl. provincial surtax) divided by income.
- canada_pension_plan: Canada Pension Plan deductions.
- ei_deduction: Employment Insurance Deductions
- net_pay_rate: Net pay divided by income.

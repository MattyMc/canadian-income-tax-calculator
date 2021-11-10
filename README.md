# Canadian Income Tax Calculator, Formulas
Calculate provincial and federal income taxes payable based on income. Useful for financial planning, particularly in Google Sheets.

## Usage
See documentation in ontarioIncomeTax.js for all options. Generally, the primary API is through the `INCOMETAXCAN2021(income, type)`, where: 
  - `income`: Total annual income.
  - `type`: "total_tax", "after_tax_income", "total_provincial_tax", "provincial_tax", "provincial_surtax", "federal_tax", "tax_rate"

## Examples
```javascript
// Find total income tax payable for income of $50,000
INCOMETAXCAN2021(50000, "total_tax");

// Find after_tax_income for income of $80,000
INCOMETAXCAN2021(80000, "after_tax_income");

// Find total_provincial_tax payable (provincial income tax + provincial income surtax)
INCOMETAXCAN2021(80000, "after_tax_income");
```

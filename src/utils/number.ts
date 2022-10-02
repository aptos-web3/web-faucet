import Decimal from 'decimal.js-light'

export function formatNumber (value: number | string, decimal = 2) {
  return new Decimal(value).toFixed(decimal)
}

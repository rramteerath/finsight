export function formatCurrency(number) {
  return "$" + number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
  //return parseFloat(Math.round(number * 100) / 100).toFixed(2)
}

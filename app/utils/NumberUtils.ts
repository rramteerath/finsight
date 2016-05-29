class NumberUtils {

  public static formatCurrency(number) {
    return "$" + (number?number:0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
  }

}

export { NumberUtils }

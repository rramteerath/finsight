class NumberUtils {

  public static formatCurrency(number) {
    if (number)
      return "$" + number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    else
      return ""
    //return parseFloat(Math.round(number * 100) / 100).toFixed(2)
  }

}

export { NumberUtils }

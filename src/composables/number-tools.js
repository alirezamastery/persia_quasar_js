export const addCommaForIntNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const removeCommas = (val) => {
  return val.replace(/,/g, '')
}

export const formatIntNumber = (val) => {
  const commaRemoved = removeCommas(val)
  return addCommaForIntNumber(commaRemoved)
}

export const numberWithCommaToInt = (val) => {
  return parseInt(removeCommas(val))
}

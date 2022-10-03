export const logger = (...msg) => {
  let txt = ''
  msg.forEach(item=>{
    txt += ' ' + item
  })
  console.log('PERSIA-LOG |', txt)
  // console.log(txt)
}

export function visualizeVariantSelector(selector) {
  console.log('selector', selector)
  if (selector.selector_type.title === 'color') {
    if (selector['digikala_id'] === 1) {
      return {
        'background-color': '#000000',
        'color': '#FFFFFF',
      }
    }
    return {
      'background-color': selector['extra_info'],
      'color': 'black',
    }
  }
  return {}
}

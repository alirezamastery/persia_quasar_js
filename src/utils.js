export const logger = (...msg) => {
  let txt = ''
  msg.forEach(item=>{
    txt += ' ' + item
  })
  console.log('PERSIA-LOG |', txt)
  // console.log(txt)
}

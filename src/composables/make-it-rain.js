export default async function makeItRain() {
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  function setColor(length, i) {
    if (9 < i && i <= length - 4)
      return '#00ff00'
    if (i === 0)
      return '#000000'
    if (i === 1)
      return '#001a00'
    if (i === 2)
      return '#003300'
    if (i === 3)
      return '#004d00'
    if (i === 4)
      return '#006600'
    if (i === 5)
      return '#008000'
    if (i === 6)
      return '#009900'
    if (i === 7)
      return '#00b300'
    if (i === 8)
      return '#00cc00'
    if (i === 9)
      return '#00e600'
    if (length - 4 < i && i <= length - 2)
      return '#76fe76'
    if (i === length - 1)
      return '#ffffff'
  }

  const asciiUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const letterWidth = 30  //in pixels
  const letterHeight = 42  //in pixels
  const distance = letterHeight

  let loop = true
  let scrW,
    scrH,
    lineMaxLength,
    lineMinLength,
    lengths,
    numberOfXPositions,
    numberOfDrops,
    numberOfYPositions,
    yPositions,
    availableXPositions

  function calculateParams() {
    scrW = window.innerWidth
    scrH = window.innerHeight
    numberOfXPositions = parseInt(scrW / letterWidth)
    numberOfDrops = Math.floor(numberOfXPositions / 2)
    // numberOfDrops = numberOfXPositions - 1
    const y1 = -Math.floor(scrH / distance) * distance * 4
    const y2 = -Math.floor(scrH / distance) * distance * 2
    numberOfYPositions = Math.floor((y2 - y1) / distance)
    lineMaxLength = numberOfYPositions
    lineMinLength = Math.floor(numberOfYPositions / 2)
    lengths = new Array(lineMaxLength - lineMinLength)
    for (let i = 0; i < lengths.length; i++) {
      lengths[i] = i + lineMinLength
    }
    yPositions = new Array(numberOfYPositions)
    for (let i = 0; i < yPositions.length; i++) {
      yPositions[i] = -i * distance + y2;
    }
    availableXPositions = new Array(numberOfXPositions)
    for (let i = 0; i < availableXPositions.length; i++) {
      availableXPositions[i] = i * letterWidth
    }
    // console.log(`scrW: ${scrW} | scrH: ${scrH} | lineMaxLength: ${lineMaxLength} | lineMinLength: ${lineMinLength} |
    // numberOfXPositions: ${numberOfXPositions} | numberOfDrops: ${numberOfDrops} | numberOfYPositions:
    // ${numberOfYPositions}`)
  }

  const canvas = document.getElementById('rain-canvas')

  class Drop {
    constructor() {
      this.line = document.createElement('div')
      this.line.classList.add('drop-line')
      for (let i = 0; i < lengths[Math.floor(Math.random() * lengths.length)]; i++) {
        const char = document.createElement('span')
        char.classList.add('drop-char')
        char.innerText = asciiUppercase[Math.floor(Math.random() * asciiUppercase.length)]
        this.line.appendChild(char)
      }
      this.top = 0
      this.x = 0
      this.setX()
      this.setY()
      canvas.appendChild(this.line)
    }

    fall() {
      this.top += letterHeight
      if (this.top > scrH) {
        this.top = -letterHeight * this.line.childNodes.length
        availableXPositions.push(this.x)
        this.setX()
        this.setY()
      }
      this.line.style.top = `${this.top}px`
      // const text = setCharAt(this.line.innerHTML, 0, asciiUppercase[Math.floor(Math.random() *
      // asciiUppercase.length)]) this.line.innerText = text.substring(1, text.length) + text[0]
      const firstNode = this.line.removeChild(this.line.firstChild)
      this.line.appendChild(firstNode)
      for (let i = 0; i < this.line.childNodes.length; i++) {
        this.line.childNodes[i].style.color = setColor(this.line.childNodes.length, i)
        if (Math.floor(Math.random() * 40) === 1) {
          this.line.childNodes[i].innerText = asciiUppercase[Math.floor(Math.random() * asciiUppercase.length)]
        }
      }
    }

    setY() {
      this.top = yPositions[Math.floor(Math.random() * yPositions.length)]
      this.line.style.top = `${this.top}px`
    }

    setX() {
      this.x = availableXPositions[Math.floor(Math.random() * availableXPositions.length)]
      availableXPositions = availableXPositions.filter(item => item !== this.x)
      this.line.style.left = `${this.x}px`
    }
  }

  async function main() {
    loop = true
    calculateParams()
    canvas.innerHTML = ''
    let t = 0
    const drops = []
    for (let i = 0; i < numberOfDrops; i++) {
      drops.push(new Drop())
    }
    while (loop) {
      for (const drop of drops) {
        drop.fall()
      }
      await sleep(40)
    }
  }

  await main()

}

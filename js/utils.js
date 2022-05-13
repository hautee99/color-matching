import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffleColor(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr
  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRamdomColorParis = (count) => {
  // receive count ---> return count * 2 ramdom color
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  // ramdom 'count' colors

  for (let i = 0; i < count; i++) {
    // ramdomColor() function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }
  // double current color list
  const fullColorList = [...colorList, ...colorList]

  // shuffle color list

  shuffleColor(fullColorList)

  // shuffle colorList

  return fullColorList
}

export function showPlayAgianButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}
export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}
export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

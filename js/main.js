import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  createTimer,
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  getRamdomColorParis,
  hidePlayAgainButton,
  setTimerText,
  showPlayAgianButton,
} from './utils.js'

let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  const fullSecond = `0${second}`.slice(-2)
  setTimerText(fullSecond)
}

function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over!')
  showPlayAgianButton()
}

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isCLicked = liElement.classList.contains('active')
  if (!liElement || isCLicked || shouldBlockClick) return
  // show color for clicked cell
  liElement.classList.add('active')

  //save clicked cell to selection
  selections.push(liElement)
  if (selections.length < 2) return

  // check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMath = firstColor === secondColor

  // set backgroundColor forcus li

  if (isMath) {
    const colorBg = document.querySelector('.color-background')
    if (colorBg) colorBg.style.backgroundColor = firstColor
    // check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      console.log('is win')
      showPlayAgianButton()
      setTimerText('You Win!')
      timer.clear()
      gameStatus = GAME_STATUS.FINISHED
    }

    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    // reset
    selections = []
    gameStatus = GAME_STATUS.PLAYING
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}
function initColor() {
  // ramdom 8 pairs of colors
  const colorList = getRamdomColorParis(PAIRS_COUNT)

  // bind to li > dispatchEvent.overlay
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

function attachEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (e) => {
    handleColorClick(e.target)
  })
}

function resetGame() {
  // reset global vars
  gameStatus = GAME_STATUS.PLAYING
  selections = []

  // remove active class from li
  // hide play agian
  // clear you win/ timeout text
  const colorList = getColorElementList()
  for (const colorElement of colorList) {
    colorElement.classList.remove('active')
  }
  hidePlayAgainButton()

  setTimerText('')

  // new colors
  initColor()

  // start new game
  startTimer()
}

function attachEventForPlayButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return
  playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}

// main
;(() => {
  initColor()
  attachEventForColorList()
  attachEventForPlayButton()
  startTimer()
})()

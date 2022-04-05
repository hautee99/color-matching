import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hidePlayAgainButton,
  setTimerText,
  showReplayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinsish,
})

function handleTimerChange(seconds) {
  const fullSecond = `0${seconds}`.slice(-2)
  setTimerText(fullSecond)
}
function handleTimerFinsish() {
  // end game
  gameStatus = GAME_STATUS.FINISHED

  setTimerText('GAME OVER!')
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClick = liElement.classList.contains('active')
  if (!liElement || isClick || shouldBlockClick) return
  liElement.classList.add('active')

  //   save clicked cell to selection
  selections.push(liElement)
  if (selections.length < 2) return
  //   check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    const colorBg = document.querySelector('.color-background')
    if (colorBg) colorBg.style.backgroundColor = firstColor
    //check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      // show replay
      showReplayAgainButton()
      setTimerText('YOU WIN')
      timer.clear()
      gameStatus = GAME_STATUS.FINISHED
      // show You win
    }
    selections = []
    return
  }

  //in case of not match
  // remove active class for 2 li elemnets
  gameStatus = GAME_STATUS.BLOCKING
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    //reset select for the next turn
    selections = []

    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function initColors() {
  // ramdom 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  // bind to list > dispatchEvent.overlay
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}
function attachEventColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return
  //   Event target
  ulElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return
    handleColorClick(e.target)
  })
}
function resetGame() {
  // reset global vars
  gameStatus = GAME_STATUS.PLAYING
  selections = []

  // reset DOM
  // remove active class form li
  // hide play button
  // clear you win / timeout text
  const colorElementList = getColorElementList()
  for (const elementColor of colorElementList) {
    elementColor.classList.remove('active')
  }
  hidePlayAgainButton()
  setTimerText('')

  // init new color
  initColors()

  // start a new game
  startTimer()
}

function attachEvenForPlayButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return
  playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}
// main
;(() => {
  initColors()
  attachEventColorList()
  attachEvenForPlayButton()
  startTimer()
})()

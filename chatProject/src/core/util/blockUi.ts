const BLOCK_UI_ID = 'vm-block-ui'
const blockElement = document.createElement('div')
blockElement.id = BLOCK_UI_ID
let blockCounter = 0;

blockElement.innerHTML = '<i></i>' //'<i class="icon-spin5 animate-spin"/>'
  document.body.appendChild(blockElement)
  document.addEventListener('keydown', blockKey)
  console.log('blockUi initialized', document.getElementById(BLOCK_UI_ID));

function blockKey(e: KeyboardEvent) {
  
  if (blockCounter > 0) {
    e.preventDefault()
    e.stopPropagation()
    // console.log('blockKey - block - blockCounter = ', blockCounter);
  } else {
    // console.log('blockKey - pass - blockCounter = ', blockCounter);
  }
}

export function blockOn() {
  if (blockCounter === 0) {
    // blockElement.style.display = 'block'
    blockElement.classList.add('on')
  }
  blockCounter++
  // console.log('on - blockCounter = ', blockCounter);
  
}

export function blockOff() {
  blockCounter--
  if (blockCounter < 0) {
    //blockCounter = 0
    throw 'block on/off counter 가 마이너이면 문제있음'
  }
  if (blockCounter === 0) {
    blockElement.classList.remove('on')
    // blockElement.style.display = 'none'
    blockElement.focus()
  }
  // console.log('off - blockCounter = ', blockCounter);
}


// initBlockUi()
import './style.css'

import { hashPassword, signMessage } from './crypto.ts'
import { handleMessageEvent } from './messages.ts'

let hashButton = document.querySelector<HTMLButtonElement>('#hashButton')!
hashButton.addEventListener('click', () => hashPassword())

let hmacButton = document.querySelector<HTMLButtonElement>('#hmacButton')!
hmacButton.addEventListener('click', () => signMessage())

let hostInput = document.querySelector<HTMLInputElement>('#hostInput')!
let connectButton = document.querySelector<HTMLButtonElement>('#connectButton')!
connectButton.addEventListener('click', () => {
  let host = 'http://' + hostInput.value
  let uiWindow = window.open(host, 'wled-ui')
  if (uiWindow) {
    //uiWindow.postMessage('{"wled-rc":"opened"}', host)
  } else {
    document.getElementById('connectionInfo')!.textContent = 'Failed to open window';
  }
})

onmessage = (event) => { handleMessageEvent(event) };
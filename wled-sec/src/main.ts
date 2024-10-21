import './style.css'

import { hashPassword, signMessage } from './crypto.ts'
import { handleMessageEvent } from './messages.ts'

let hostInput = document.querySelector<HTMLInputElement>('#hostInput')!
async function hashAndConnect() {
  document.getElementById('connectionInfo')!.textContent = 'Connecting...';
  await hashPassword()
  let url = 'http://' + hostInput.value
  try { // Verify that the URL is valid
    new URL(url)
  } catch (e) {
    document.getElementById('connectionInfo')!.textContent = 'Invalid URL';
    return;
  }
  let uiWindow = window.open(url, 'wled-ui')
  if (uiWindow) {
    //uiWindow.postMessage('{"wled-rc":"opened"}', host)
    document.getElementById('connectionInfo')!.innerHTML = '&#10004; Opened UI tab';
  } else {
    document.getElementById('connectionInfo')!.textContent = 'Failed to open window';
  }
}

let hashButton = document.querySelector<HTMLButtonElement>('#hashButton')!
hashButton.addEventListener('click', () => hashPassword())

let hmacButton = document.querySelector<HTMLButtonElement>('#hmacButton')!
hmacButton.addEventListener('click', () => signMessage())

let connectButton = document.querySelector<HTMLButtonElement>('#connectButton')!
connectButton.addEventListener('click', () => hashAndConnect())

let testingToggle = document.querySelector<HTMLElement>('#testingToggle')!
testingToggle.addEventListener('click', () => {
  let testingDiv = document.getElementById('testingDiv')!
  if (testingDiv.style.display != 'block') {
    testingDiv.style.display = 'block';
    testingToggle.textContent = 'Hide testing controls';
  } else {
    testingDiv.style.display = 'none';
    testingToggle.textContent = 'Show testing controls';
  }
})

onmessage = (event) => { handleMessageEvent(event) };
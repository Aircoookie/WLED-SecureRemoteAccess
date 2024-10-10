import './style.css'

import { hashPassword, signMessage } from './crypto.ts'
import { handleMessageEvent } from './messages.ts'

let hashButton = document.querySelector<HTMLButtonElement>('#hashButton')!
hashButton.addEventListener('click', () => hashPassword())

let hmacButton = document.querySelector<HTMLButtonElement>('#hmacButton')!
hmacButton.addEventListener('click', () => signMessage())

onmessage = (event) => { handleMessageEvent(event) };
import './style.css'

import { hashPassword, signMessage } from './crypto.ts'

let hashButton = document.querySelector<HTMLButtonElement>('#hashButton')!
hashButton.addEventListener('click', () => hashPassword())

let hmacButton = document.querySelector<HTMLButtonElement>('#hmacButton')!
hmacButton.addEventListener('click', () => signMessage())
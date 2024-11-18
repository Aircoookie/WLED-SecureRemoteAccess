var derivedKey: CryptoKey;

// Connect PBKDF2 to HTML elements
export async function hashPassword() {
  var password = (<HTMLInputElement>document.getElementById('password'))!.value;
  const passwordBuffer = new TextEncoder().encode(password);
  const saltBuffer = new TextEncoder().encode('testsalt');
  var iterations = +(<HTMLInputElement>document.getElementById('iterations'))!.value;
  derivedKey = await getPBKDF2DerivedKey(passwordBuffer, saltBuffer, iterations);
}

/*
 * Derives a PSK from a password using PBKDF2
 * @param passwordBuffer The password bytes to derive the key from
 * @param saltBuffer The salt to use for the derivation
 * @param iterations The number of PBKDF2 iterations
 * @returns The derived key for use by HMAC-SHA256
 */
async function getPBKDF2DerivedKey(passwordBuffer: Uint8Array, saltBuffer: Uint8Array, iterations: number) {
  var start = performance.now();

  const inputKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false, ['deriveKey']
  );

  var pars = {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: 'SHA-256'
  }

  // Type of derived key - used for HMAC generation
  var hmacPars = {
      name: 'HMAC',
      hash: 'SHA-256',
      length: 256
  }
  const derivedKey = await crypto.subtle.deriveKey(pars, inputKey, hmacPars, true, ['sign', 'verify'])

  crypto.subtle.exportKey('raw', derivedKey).then(function(keydata) {
    var hash = Array.from(new Uint8Array(keydata)).map(function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
    
    var end = performance.now();
    document.getElementById('info')!.textContent = 'Hashing with ' + iterations + ' iterations took ' + (end - start) + ' ms';
    document.getElementById('hash')!.textContent = hash;
  });

  return derivedKey;
}

async function generateHMAC(message: string, key: CryptoKey) : Promise<string> {
  var start = performance.now();

  const messageBuffer = new TextEncoder().encode(message);
  const signature = await crypto.subtle.sign('HMAC', key, messageBuffer);

  var hash = Array.from(new Uint8Array(signature)).map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
  
  var end = performance.now();
  document.getElementById('hmacInfo')!.textContent = 'HMAC generation took ' + (end - start) + ' ms';
  document.getElementById('hmac')!.textContent = hash;
  return hash;
}

export async function signMessage(message?: string) : Promise<string> {
  if (!message) {
    message = (<HTMLInputElement>document.getElementById('message')).value;
  }
  if (!derivedKey) {
    throw new Error('Please hash the password first');
  }
  return generateHMAC(message, derivedKey);
}

var counter : number = 0;
var sessionId : string = '00';

export function nonceCounter() {
  counter++;
  return counter;
}

export function getSessionId() {
  return sessionId;
}

export function setSessionId(sid: string) {
  // TODO check whether sid is a valid hex string
  sessionId = sid;
}

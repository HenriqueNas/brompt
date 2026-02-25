// Web Crypto API helpers for secure client-side encryption

interface EncryptedData {
  v: number // version for future compatibility
  salt: string // base64
  iv: string // base64
  ciphertext: string // base64
}

function u8ToArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.slice().buffer
}

// Helper to convert ArrayBuffer/Uint8Array to Base64
function toBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Helper to convert Base64 to Uint8Array
function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// Derive a key from a passphrase using PBKDF2
async function deriveKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: u8ToArrayBuffer(salt),
      iterations: 200000, // High iteration count for security
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encrypt(
  text: string,
  passphrase: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const enc = new TextEncoder()

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: u8ToArrayBuffer(iv) },
    key,
    u8ToArrayBuffer(enc.encode(text))
  )

  const data: EncryptedData = {
    v: 1,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  }

  return JSON.stringify(data)
}

export async function decrypt(
  encryptedJson: string,
  passphrase: string
): Promise<string> {
  try {
    const data: EncryptedData = JSON.parse(encryptedJson)

    if (data.v !== 1) {
      throw new Error('Unsupported encryption version')
    }

    const salt = fromBase64(data.salt)
    const iv = fromBase64(data.iv)
    const ciphertext = fromBase64(data.ciphertext)
    const key = await deriveKey(passphrase, salt)

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: u8ToArrayBuffer(iv) },
      key,
      u8ToArrayBuffer(ciphertext)
    )

    const dec = new TextDecoder()
    return dec.decode(decryptedBuffer)
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Invalid passphrase or corrupted data')
  }
}

// Helper to check if a string looks like our encrypted JSON
export function isEncrypted(value: string): boolean {
  try {
    const data = JSON.parse(value)
    return (
      data &&
      data.v === 1 &&
      typeof data.ciphertext === 'string' &&
      typeof data.salt === 'string'
    )
  } catch {
    return false
  }
}

class CryptoService {
  private static async generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable
      ['encrypt', 'decrypt'],
    )
  }

  private static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('jwk', key)
    return JSON.stringify(exported)
  }

  private static async importKey(keyString: string): Promise<CryptoKey> {
    const jwk = JSON.parse(keyString)
    return window.crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  }

  private static saveKeyToStorage(keyString: string): void {
    localStorage.setItem('ek', keyString)
  }

  private static loadKeyFromStorage(): string | null {
    return localStorage.getItem('ek')
  }

  private static async ensureKeyInitialization(): Promise<CryptoKey> {
    let keyString = this.loadKeyFromStorage()
    if (!keyString) {
      const key = await this.generateKey()
      const exportedKey = await this.exportKey(key)
      this.saveKeyToStorage(exportedKey)
      keyString = exportedKey
    }

    return this.importKey(keyString)
  }

  public static async encryptData(data: string): Promise<ArrayBuffer> {
    const key = await this.ensureKeyInitialization()
    const encoded = new TextEncoder().encode(data)
    const iv = window.crypto.getRandomValues(new Uint8Array(12)) // Initialization vector
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoded,
    )
    // Combine the IV with the encrypted data to make it easier to decrypt later
    return new Blob([iv, new Uint8Array(encrypted)]).arrayBuffer()
  }

  public static async decryptData<T>(encryptedData: ArrayBuffer): Promise<T> {
    const key = await this.ensureKeyInitialization()

    const iv = encryptedData.slice(0, 12)
    const data = encryptedData.slice(12)
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      key,
      data,
    )
    const decoded = new TextDecoder().decode(decrypted)
    return JSON.parse(decoded) as T
  }
}

export default CryptoService

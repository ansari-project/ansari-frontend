/**
 * CryptoService provides encryption and decryption functionalities using the Web Crypto API.
 * It demonstrates the use of AES-GCM for cryptographic operations.
 *
 * Note: Storing encryption keys in local storage is not recommended for production applications
 * due to security concerns. This example is for educational purposes, and a more secure key management
 * solution should be considered for real-world applications.
 */
class CryptoService {
  /**
   * Generates a cryptographic key for AES-GCM operations.
   *
   * @returns A promise that resolves to a CryptoKey.
   */
  private static async generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable, allowing the key to be exported
      ['encrypt', 'decrypt'],
    )
  }

  /**
   * Exports a CryptoKey to a JSON Web Key (JWK) string.
   *
   * @param key - The CryptoKey to be exported.
   * @returns A promise that resolves to a string representation of the JWK.
   */
  private static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('jwk', key)
    return JSON.stringify(exported)
  }

  /**
   * Imports a CryptoKey from a JSON Web Key (JWK) string.
   *
   * @param keyString - The string representation of the JWK to be imported.
   * @returns A promise that resolves to the imported CryptoKey.
   */
  private static async importKey(keyString: string): Promise<CryptoKey> {
    const jwk = JSON.parse(keyString)
    return window.crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  }

  /**
   * Saves an encryption key to local storage.
   *
   * @param keyString - The string representation of the JWK to be saved.
   */
  private static saveKeyToStorage(keyString: string): void {
    localStorage.setItem('ek', keyString)
  }

  /**
   * Loads an encryption key from local storage.
   *
   * @returns The string representation of the JWK, or null if not found.
   */
  private static loadKeyFromStorage(): string | null {
    return localStorage.getItem('ek')
  }

  /**
   * Ensures the cryptographic key is initialized either by generating a new one or by loading an existing one from local storage.
   *
   * @returns A promise that resolves to a CryptoKey.
   */
  private static async ensureKeyInitialization(): Promise<CryptoKey> {
    let keyString = this.loadKeyFromStorage()
    if (!keyString) {
      const key = await this.generateKey()
      keyString = await this.exportKey(key)
      this.saveKeyToStorage(keyString)
    }
    return this.importKey(keyString)
  }

  /**
   * Encrypts a string using AES-GCM.
   *
   * @param data - The data to encrypt.
   * @returns A promise that resolves to an ArrayBuffer containing the encrypted data.
   */
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
    // Combine the IV with the encrypted data to facilitate decryption
    return new Blob([iv, new Uint8Array(encrypted)]).arrayBuffer()
  }

  /**
   * Decrypts data encrypted with AES-GCM.
   *
   * @param encryptedData - The encrypted data as an ArrayBuffer.
   * @returns A promise that resolves to the decrypted string.
   */
  public static async decryptData<T>(encryptedData: ArrayBuffer): Promise<T> {
    const key = await this.ensureKeyInitialization()

    const iv = encryptedData.slice(0, 12) // Extracts the IV from the encrypted data
    const data = encryptedData.slice(12) // Extracts the actual encrypted data
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

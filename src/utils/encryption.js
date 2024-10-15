import CryptoJs from "crypto-js";
// Function to decrypt data using AES
export const decryptData = (encryptedData, rawKey) => {
  //   console.log(encryptedData, " ", rawKey);
  const bytes = CryptoJs.AES.decrypt(encryptedData, rawKey);
  return bytes.toString(CryptoJs.enc.Utf8);
};

// Function to encrypt data using AES
export const encryptData = (data, rawKey) => {
  return CryptoJs.AES.encrypt(data, rawKey).toString();
};

export async function decryptObject(data, decryption, encryptedKey) {
  const decryptedData = {};

  // Use for...of to handle async/await properly
  for (const key of Object.keys(data)) {
    if (typeof data[key] === "string") {
      // Decrypt string values
      decryptedData[key] = await decryption(data[key], encryptedKey);
    } else if (Array.isArray(data[key])) {
      // Decrypt each string inside arrays using Promise.all
      decryptedData[key] = await Promise.all(
        data[key].map(async (item) =>
          typeof item === "string" ? await decryption(item, encryptedKey) : item
        )
      );
    } else if (typeof data[key] === "object" && data[key] !== null) {
      // Recursively decrypt nested objects
      decryptedData[key] = await decryptObject(
        data[key],
        decryption,
        encryptedKey
      );
    } else {
      // For non-string values, just copy them
      decryptedData[key] = data[key];
    }
  }

  return decryptedData;
}

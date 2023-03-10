/*
 * aes加解密操作
 *
 * @Author: 谢力
 * @Date:   2018-11-08 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-08 14:08:56
 */
import CryptoJS from "crypto-js";
import { JsonToString, StringToJson } from "./tool";

/*
 * 密钥
 */
let key =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB";

export default {
  /*
   * 加密
   */
  encrypt(value) {
    let iv = CryptoJS.enc.Utf8.parse(key),
      srcs = CryptoJS.enc.Utf8.parse(JsonToString(value)),
      encrypt = CryptoJS.AES.encrypt(srcs, iv, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    return encrypt.ciphertext.toString();
  },

  /*
   * 解密
   */
  decrypt(value) {
    var iv = CryptoJS.enc.Utf8.parse(key),
      encryptedHexStr = CryptoJS.enc.Hex.parse(value),
      srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr),
      decrypt = CryptoJS.AES.decrypt(srcs, iv, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    return StringToJson(decrypt.toString(CryptoJS.enc.Utf8));
  },
};

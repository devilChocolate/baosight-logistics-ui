import Crypto from './crypto';
const SystemAliasName = ['baosight-logistics-ui','grid_table']
class Storage {
  constructor(storage) {
    this.storage = storage;
  }

  /*
   * 写入
   * @expire 时间戳(毫秒)
   */
  set(key, value, expire) {
    key = [...SystemAliasName, key.toString()].join("@");
    this.storage.setItem(
      key,
      Crypto.encrypt({
        value: value,
        time: +new Date(),
        expire: expire,
      })
    );
  }

  /*
   * 读取
   * @return isExpired ==> 是否过期
   */
  read(key) {
    key = [...SystemAliasName, key.toString()].join("@");
    let data = this.storage.getItem(key);
    if (data) {
      data = Crypto.decrypt(data);
      if (data.expire && data.expire <= new Date().getTime() - data.time) {
        localStorage.removeItem(key.toString());
        return null;
      } else {
        return data.value;
      }
    }
    return null;
  }

  /*
   * 删除
   * @key 不传则删除所有
   */
  clear(key) {
    if (key) {
      key = [...SystemAliasName, key.toString()].join("@");
      this.storage.removeItem(key);
    } else {
      this.storage.clear();
    }
  }
}

/*
 * LocalStorage
 */
export const LocalStorage = new Storage(localStorage);

/*
 * SessionStorage
 */
export const SessionStorage = new Storage(sessionStorage);

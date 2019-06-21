/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  if (str.length < 1)
    return false;
  return true;
}

export function validAccount(phone){
  if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone)))
    return false;
  return true;
}

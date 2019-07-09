const chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
export function generateRandomName(size) {
  let res = "";
  for(let ia = 0; ia < size ; ia ++) {
    let id = Math.ceil(Math.random()*35);
    res += chars[id];
  }
  return res;
}

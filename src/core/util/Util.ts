export default class Util {
  /**
   * Generates a hashcode for a given string.
   *
   * @param string
   * @author esmirahala - https://stackoverflow.com/a/7616484
   */
  public static hashCode = function(string: string) {
    let hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  };
}
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

  /**
   * Shuffles an array - unbiased shuffle algorithm is the Fisher-Yates Shuffle.
   *
   * @param array
   * @author: Fisher Yates - https://stackoverflow.com/a/2450976
   */
  public static shuffleArray(array: Array<any>){
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }
}
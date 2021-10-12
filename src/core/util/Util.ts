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

  /**
   * Formats seconds into HH:MM:SS always in the shortest form.
   * E.g:
   *  - 10s    = 0:10
   *  - 100s   = 1.40
   *  - 1000s  = 16.40
   *
   * @param seconds
   */
  public static formatSeconds(seconds: number): string {
    let date = new Date(0);
    date.setSeconds(seconds);

    let timeString = date.toISOString().substr(11, 8);

    if (timeString.substr(0, 4) === "00:0") {
      return timeString.substr(4, timeString.length)
    } else if (timeString.substr(0, 2) === "00"){
      return timeString.substr(3, timeString.length)
    } else {
      return timeString
    }
  }
}
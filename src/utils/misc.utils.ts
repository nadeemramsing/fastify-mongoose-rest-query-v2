export function countCharacter(char: string, word: string) {
  return word.split(char).length - 1
}

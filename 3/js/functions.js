// eslint-disable-next-line no-unused-vars
const checkString = function  (line, lineLenght) {
  if (line.length()<=lineLenght) {return true;}
  return false;
};
// eslint-disable-next-line no-unused-vars
const checkPalindrome = function (line) {
  const newLine = line.toLowerCase().replaceAll();
  let finalLine;
  for (let i = newLine.length(); i > 0; i--) {
    finalLine+=newLine[i];
  }
  if (finalLine===newLine) {return true;}
  return false;
};

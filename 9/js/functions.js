// eslint-disable-next-line no-unused-vars
const checkString = function(line, lineLength) {
  if (line.length <= lineLength) { return true; }
  return false;
};

// eslint-disable-next-line no-unused-vars
const checkPalindrome = function(line) {
  const newLine = line.toLowerCase().replaceAll(' ', '');
  let finalLine = '';
  for (let i = newLine.length - 1; i >= 0; i--) {
    finalLine += newLine[i];
  }
  if (finalLine === newLine) { return true; }
  return false;
};

const checkTime = function(timeStart, timeEnd, meetStart, meetTime) {
  const timeToMinutes = function(time) {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1] || 0, 10);
    return hours * 60 + minutes;
  };
  const dayStart = timeToMinutes(timeStart);
  const dayEnd = timeToMinutes(timeEnd);
  const meetingStart = timeToMinutes(meetStart);
  const meetingDuration = meetTime;
  const meetingEnd = meetingStart + meetingDuration;

  if (meetingStart >= dayStart && meetingEnd <= dayEnd) {
    return true;
  }
  return false;
};

window.myFunctions = {
  checkString,
  checkPalindrome,
  checkTime
};

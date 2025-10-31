
const checkStringLength = function (line, maxLength) {
  return line.length <= maxLength;
};

const checkPalindrome = function (line) {
  const normalizedLine = line.toLowerCase().replaceAll(' ', '');
  let reversedLine = '';

  for (let i = normalizedLine.length - 1; i >= 0; i--) {
    reversedLine += normalizedLine[i];
  }

  return reversedLine === normalizedLine;
};

const checkMeetingTime = function (timeStart, timeEnd, meetStart, meetDuration) {
  const convertTimeToMinutes = function (time) {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1] || 0, 10);
    return hours * 60 + minutes;
  };

  const dayStartMinutes = convertTimeToMinutes(timeStart);
  const dayEndMinutes = convertTimeToMinutes(timeEnd);
  const meetingStartMinutes = convertTimeToMinutes(meetStart);
  const meetingEndMinutes = meetingStartMinutes + meetDuration;

  return meetingStartMinutes >= dayStartMinutes && meetingEndMinutes <= dayEndMinutes;
};

export {
  checkStringLength,
  checkPalindrome,
  checkMeetingTime
};


const checkString = (line, lineLength) => line.length <= lineLength;

const checkPalindrome = (line) => {
  const cleaned = line.toLowerCase().replaceAll(' ', '');
  return cleaned === cleaned.split('').reverse().join('');
};

const checkTime = (timeStart, timeEnd, meetStart, meetTime) => {
  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const dayStart = timeToMinutes(timeStart);
  const dayEnd = timeToMinutes(timeEnd);
  const meetingStart = timeToMinutes(meetStart);
  const meetingEnd = meetingStart + meetTime;

  return meetingStart >= dayStart && meetingEnd <= dayEnd;
};

export { checkString, checkPalindrome, checkTime };


const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export { getRandomElement, getRandomInteger };

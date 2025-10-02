const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export {getRandomElement, getRandomInteger};

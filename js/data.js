
import { getRandomElement, getRandomInteger } from './util.js';

const NAMES = [
  'Артём',
  'Мария',
  'Сергей',
  'Анна',
  'Дмитрий',
  'Екатерина',
  'Алексей',
  'Ольга',
  'Иван',
  'Наталья'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const DESCRIPTIONS = [
  'Прекрасный закат на море',
  'Горный пейзаж в утреннем тумане',
  'Уютный вечер с книгой и чаем',
  'Прогулка по осеннему парку',
  'Летнее кафе в старом городе',
  'Архитектура современного мегаполиса',
  'Домашний питомец в забавной позе',
  'Путешествие по неизведанным местам',
  'Городские огни ночью',
  'Природа в её первозданной красоте'
];

const generateUniqueIds = (count) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInteger(1, 1000));
  }
  return Array.from(ids);
};

const generateComments = (count) => {
  const commentIds = generateUniqueIds(count);
  const comments = [];

  for (let i = 0; i < count; i++) {
    const messageCount = getRandomInteger(1, 2);
    const selectedMessages = [];

    for (let j = 0; j < messageCount; j++) {
      selectedMessages.push(getRandomElement(MESSAGES));
    }

    comments.push({
      id: commentIds[i],
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
      message: selectedMessages.join(' '),
      name: getRandomElement(NAMES)
    });
  }

  return comments;
};

const generatePhotos = () => {
  const photos = [];

  for (let i = 1; i <= 25; i++) {
    const commentsCount = getRandomInteger(0, 30);

    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: getRandomElement(DESCRIPTIONS),
      likes: getRandomInteger(15, 200),
      comments: generateComments(commentsCount)
    });
  }

  return photos;
};

const generatePhotosArray = generatePhotos();
export { generatePhotosArray };

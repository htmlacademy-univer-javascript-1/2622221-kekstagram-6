// eslint-disable-next-line no-unused-vars
import { getRandomElement, getRandomInteger } from './util.js';

const NAMES = ['Артём', 'Мария', 'Сергей', 'Анна', 'Дмитрий', 'Екатерина', 'Алексей', 'Ольга', 'Иван', 'Наталья'];
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

// описания для каждой из 25 картинок
const DESCRIPTIONS = [
  'Панорамный вид на курортный город с бассейном и зелёным холмом',
  'Знак "GO TO THE BEACH" на фоне травы и голубого неба',
  'Вид с высоты на облака и горизонт',
  'Женщина в бикини на песчаном пляже с фотоаппаратом',
  'Тарелка с японским супом и двумя смешными шариками риса',
  'Чёрный спортивный автомобиль с открытыми дверьми-ножницами',
  'Десерт с клубникой на деревянной доске',
  'Стакан красного сока с клубникой и виноградом',
  'Девушка радостно машет руками на фоне моря и летящего самолёта',
  'Красивая обувница с летней обувью',
  'Пустая дорога вдоль забора под облачным небом',
  'Белый спортивный автомобиль на асфальте',
  'Блюдо с лососем, авокадо и овощами на фольге',
  'Кот в виде суши с желтой полоской',
  'Серый робот-подушка лежит на белом диване',
  'Сказочный вид из окна самолёта',
  'Хор в черных костюмах на сцене с барабанной установкой',
  'Красный ретро-автомобиль у кирпичной стены',
  'Голубые сапоги на полу рядом с дверью, освещённой светом',
  'Пальмы на фоне заката и современных зданий',
  'Тарелка с рисом, креветками и лимоном',
  'Закат над морем с оранжевым солнцем',
  'Краб на камне в природе',
  'Силуэты людей на концерте с поднятыми руками',
  'Белый внедорожник в воде, рядом плещется человек',
];

// Фиксированные данные по id фото
const FIXED_DATA = {
  1: { desc: 0, likes: 142, comments: 7 },
  2: { desc: 1, likes: 89,  comments: 13 },
  3: { desc: 2, likes: 200, comments: 18 },
  4: { desc: 3, likes: 55,  comments: 11 },
  5: { desc: 4, likes: 113, comments: 8 },
  6: { desc: 5, likes: 77,  comments: 9 },
  7: { desc: 6, likes: 188, comments: 29 },
  8: { desc: 7, likes: 33,  comments: 4 },
  9: { desc: 8, likes: 165, comments: 20 },
  10: { desc: 9, likes: 102, comments: 14 },
  11: { desc: 10, likes: 97,  comments: 18 },
  12: { desc: 11, likes: 135, comments: 10 },
  13: { desc: 12, likes: 64,  comments: 12 },
  14: { desc: 13, likes: 177, comments: 11 },
  15: { desc: 14, likes: 42,  comments: 15},
  16: { desc: 15, likes: 131, comments: 27 },
  17: { desc: 16, likes: 88,  comments: 13 },
  18: { desc: 17, likes: 155, comments: 6 },
  19: { desc: 18, likes: 29,  comments: 11 },
  20: { desc: 19, likes: 101, comments: 14 },
  21: { desc: 20, likes: 123, comments: 15 },
  22: { desc: 21, likes: 71,  comments: 2 },
  23: { desc: 22, likes: 199, comments: 13 },
  24: { desc: 23, likes: 58,  comments: 1 },
  25: { desc: 24, likes: 170, comments: 19 }
};

function generateCommentsForId(photoId, count) {
  const comments = [];
  const seed = photoId * 1000;
  for (let i = 0; i < count; i++) {
    const id = (seed + i) % 1000 + 1;
    const avatar = `img/avatar-${((seed + i * 7) % 6) + 1}.svg`;
    const name = NAMES[(seed + i * 11) % NAMES.length];
    const messageCount = ((seed + i * 13) % 2) + 1;
    const messages = [];
    for (let j = 0; j < messageCount; j++) {
      messages.push(MESSAGES[(seed + i * 17 + j * 5) % MESSAGES.length]);
    }
    comments.push({
      id,
      avatar,
      message: messages.join(' '),
      name
    });
  }
  return comments;
}

const generatePhotos = () => {
  const photosArray = [];
  for (let i = 1; i <= 25; i++) {
    const fixed = FIXED_DATA[i];
    photosArray.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: DESCRIPTIONS[fixed.desc],
      likes: fixed.likes,
      comments: generateCommentsForId(i, fixed.comments)
    });
  }
  return photosArray;
};

export const photos = generatePhotos();

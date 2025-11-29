const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentsList = bigPicture.querySelector('.social__comments');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const body = document.body;

let currentComments = [];
let commentsShown = 0;
const COMMENTS_PER_PORTION = 5;

// Создание одного комментария
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(avatar);
  commentElement.appendChild(text);
  return commentElement;
}

// Обработчик ESC
function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

// Обработчик кнопки "Загрузить ещё"
function onCommentsLoaderClick() {
  renderCommentsPortion();
}

// Отрисовка порции комментариев
function renderCommentsPortion() {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);
  commentsToShow.forEach((comment) => {
    commentsList.appendChild(createCommentElement(comment));
  });
  commentsShown += commentsToShow.length;

  // Обновляем счётчик
  commentsCount.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  // Управление кнопкой "Загрузить ещё"
  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

// Сброс состояния комментариев
function resetComments() {
  commentsList.innerHTML = '';
  commentsShown = 0;
  currentComments = []; // Очищает данные — поэтому его нужно вызывать ДО присвоения новых данных
}

// Закрытие большого фото
function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  resetComments(); // Очистка при закрытии — хорошо
}

// Открытие большого фото
function openBigPicture(photoData) {
  // Заполняем данные изображения
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.big-picture__img img').alt = photoData.description;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;

  // Сначала сбрасываем состояние (очищаем DOM и предыдущие данные)
  resetComments();

  // Потом уже заполняем актуальными комментариями
  currentComments = [...photoData.comments];

  // И только после этого отрисовываем первую порцию
  renderCommentsPortion();

  // Управление видимостью
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  // Добавление обработчиков
  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
}

// Привязка закрытия по клику на крестик
closeButton.addEventListener('click', closeBigPicture);

// Экспорт для использования в thumbnail.js
export { openBigPicture };

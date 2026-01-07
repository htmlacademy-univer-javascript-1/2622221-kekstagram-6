import { isEscapeKey } from './util.js';

const COMMENTS_PER_PORTION = 5;

const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentsList = bigPicture.querySelector('.social__comments');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const body = document.body;

let currentComments = [];
let commentsShown = 0;

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

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
}

function onCommentsLoaderClick() {
  renderCommentsPortion();
}

function renderCommentsPortion() {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);
  commentsToShow.forEach((comment) => {
    commentsList.appendChild(createCommentElement(comment));
  });
  commentsShown += commentsToShow.length;

  commentsCount.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function resetComments() {
  commentsList.innerHTML = '';
  commentsShown = 0;
  currentComments = [];
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  resetComments();
}

function openBigPicture(photoData) {
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.big-picture__img img').alt = photoData.description;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;

  resetComments();
  currentComments = [...photoData.comments];
  renderCommentsPortion();

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
}

closeButton.addEventListener('click', closeBigPicture);

export { openBigPicture };

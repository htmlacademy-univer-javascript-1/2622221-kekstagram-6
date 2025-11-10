
const COMMENTS_PER_STEP = 5;

const bigPictureElement = document.querySelector('.big-picture');
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');
const commentsCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const commentsListElement = bigPictureElement.querySelector('.social__comments');

let currentComments = [];
let commentsShown = 0;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const pictureElement = document.createElement('img');
  pictureElement.classList.add('social__picture');
  pictureElement.src = comment.avatar;
  pictureElement.alt = comment.name;
  pictureElement.width = 35;
  pictureElement.height = 35;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = comment.message;

  commentElement.appendChild(pictureElement);
  commentElement.appendChild(textElement);

  return commentElement;
};

const renderComments = () => {
  const commentsToShow = Math.min(commentsShown + COMMENTS_PER_STEP, currentComments.length);

  if (commentsShown === 0) {
    commentsListElement.innerHTML = '';
  }

  const fragment = document.createDocumentFragment();
  for (let i = commentsShown; i < commentsToShow; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    fragment.appendChild(commentElement);
  }

  commentsListElement.appendChild(fragment);

  const commentsCountText = `${commentsToShow} из <span class="comments-count">${currentComments.length}</span> комментариев`;
  commentsCountElement.innerHTML = commentsCountText;

  if (commentsToShow >= currentComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }

  commentsShown = commentsToShow;
};

const onCommentsLoaderClick = () => {
  renderComments();
};

const resetComments = () => {
  commentsShown = 0;
  currentComments = [];
  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
};

const openBigPicture = (photoData) => {
  resetComments();

  bigPictureElement.querySelector('.big-picture__img img').src = photoData.url;
  bigPictureElement.querySelector('.likes-count').textContent = photoData.likes;
  bigPictureElement.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = photoData.description;

  commentsCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  currentComments = photoData.comments;
  renderComments();

  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetComments();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
};

closeButtonElement.addEventListener('click', closeBigPicture);
document.addEventListener('keydown', onDocumentKeydown);

export { openBigPicture };

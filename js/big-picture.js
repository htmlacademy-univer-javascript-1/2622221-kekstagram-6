
const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const openBigPicture = (photoData) => {
  //заполняем данные
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;

  //скрываем элементы
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  //добавляем комментарии
  const commentsList = bigPicture.querySelector('.social__comments');
  commentsList.innerHTML = '';
  photoData.comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');
    commentElement.innerHTML = `
      <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
      <p class="social__text">${comment.message}</p>
    `;
    commentsList.appendChild(commentElement);
  });

  //показываем окна
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

//закрытие по клику и Esc
closeButton.addEventListener('click', closeBigPicture);
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
});

export { openBigPicture };

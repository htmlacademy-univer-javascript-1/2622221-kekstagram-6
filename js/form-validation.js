
import { isEscapeKey } from './util.js';

const form = document.querySelector('.img-upload__form');
const uploadInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = document.querySelector('.img-upload__cancel');
const body = document.body;
const hashtagsInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error-text'
});

function validateHashtags(value) {
  if (!value.trim()) {
    return true;
  }

  const hashtags = value.toLowerCase().split(' ').filter(Boolean);

  if (hashtags.length > 5) {
    return false;
  }

  const uniqueHashtags = new Set(hashtags);
  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  for (const tag of hashtags) {
    if (tag === '#') {
      return false;
    }
    if (tag.length > 20) {
      return false;
    }
    if (!/^#[a-zа-яё0-9]{1,19}$/i.test(tag)) {
      return false;
    }
  }

  return true;
}

function getHashtagErrorMessage() {
  return 'Некорректные хэш-теги';
}

function validateComment(value) {
  return value.length <= 140;
}

function getCommentErrorMessage() {
  return 'Длина комментария не может превышать 140 символов';
}

pristine.addValidator(hashtagsInput, validateHashtags, getHashtagErrorMessage);
pristine.addValidator(commentInput, validateComment, getCommentErrorMessage);

function closeForm() {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !evt.target.matches('.text__hashtags, .text__description')) {
    evt.preventDefault();
    closeForm();
  }
}

function onFieldKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
}

function openForm() {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

function onFormSubmit(evt) {
  evt.preventDefault();
  pristine.validate();
}

uploadInput.addEventListener('change', openForm);
uploadCancel.addEventListener('click', closeForm);
form.addEventListener('submit', onFormSubmit);
hashtagsInput.addEventListener('keydown', onFieldKeydown);
commentInput.addEventListener('keydown', onFieldKeydown);

export { closeForm };

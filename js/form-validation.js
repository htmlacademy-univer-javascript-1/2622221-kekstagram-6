import { isEscapeKey } from './util.js';

// Все инициализации перенесем в функцию
function initForm() {
  const form = document.querySelector('.img-upload__form');

  if (!form) {
    return;
  }

  const uploadInput = document.querySelector('.img-upload__input');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const uploadCancel = document.querySelector('.img-upload__cancel');
  const body = document.body;
  const hashtagsInput = form.querySelector('.text__hashtags');
  const commentInput = form.querySelector('.text__description');

  const scaleControlSmaller = document.querySelector('.scale__control--smaller');
  const scaleControlBigger = document.querySelector('.scale__control--bigger');
  const scaleControlValue = document.querySelector('.scale__control--value');
  const imgUploadPreview = document.querySelector('.img-upload__preview img');

  const effectsList = document.querySelector('.effects__list');
  const effectLevelContainer = document.querySelector('.img-upload__effect-level');
  const effectLevelSlider = document.querySelector('.effect-level__slider');
  const effectLevelValue = document.querySelector('.effect-level__value');

  let currentScale = 100;
  let currentEffect = 'none';
  let slider = null;

  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error-text',
  });

  function validateHashtags(value) {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.split(' ').filter(Boolean);

    if (hashtags.length > 5) {
      return false;
    }

    for (let i = 0; i < hashtags.length; i++) {
      const tag = hashtags[i];

      if (!tag.startsWith('#')) {
        return false;
      }

      if (tag === '#') {
        return false;
      }

      if (tag.length > 20) {
        return false;
      }

      const tagWithoutHash = tag.slice(1);
      if (tagWithoutHash.length === 0) {
        return false;
      }

      const hashtagRegex = /^#[a-zA-Zа-яА-ЯёЁ0-9]+$/;
      if (!hashtagRegex.test(tag)) {
        return false;
      }
    }

    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);

    if (uniqueHashtags.size !== hashtags.length) {
      return false;
    }

    return true;
  }

  function getHashtagErrorMessage(value) {
    if (!value.trim()) {
      return '';
    }

    const hashtags = value.split(' ').filter(Boolean);

    if (hashtags.length > 5) {
      return 'Превышено количество хэштегов. Максимум 5.';
    }

    for (let i = 0; i < hashtags.length; i++) {
      const tag = hashtags[i];

      if (!tag.startsWith('#')) {
        return 'Отсутствует символ # в начале хэштега.';
      }

      if (tag === '#') {
        return 'Отсутствует текст после символа #.';
      }

      if (tag.length > 20) {
        return 'Превышена длина хэштега. Максимум 20 символов.';
      }

      const tagWithoutHash = tag.slice(1);
      if (tagWithoutHash.length === 0) {
        return 'Отсутствует текст после символа #.';
      }

      const hashtagRegex = /^#[a-zA-Zа-яА-ЯёЁ0-9]+$/;
      if (!hashtagRegex.test(tag)) {
        if (tag.includes(' ')) {
          return 'Обнаружен пробел внутри хэштега.';
        } else if (tag.includes('-')) {
          return 'Обнаружен недопустимый символ: дефис (-).';
        } else if (tag.includes('_')) {
          return 'Обнаружен недопустимый символ: подчёркивание (_).';
        } else if (tag.match(/[.,!?@$%&*]/)) {
          return 'Обнаружены недопустимые символы: знаки препинания или специальные символы.';
        } else {
          return 'Обнаружены недопустимые символы. Разрешены только буквы и цифры.';
        }
      }
    }

    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);

    if (uniqueHashtags.size !== hashtags.length) {
      return 'Обнаружены повторяющиеся хэштеги.';
    }

    return 'Некорректные хэш-теги';
  }

  function validateComment(value) {
    return value.length <= 140;
  }

  function getCommentErrorMessage() {
    return 'Превышена длина комментария. Максимум 140 символов.';
  }

  pristine.addValidator(hashtagsInput, validateHashtags, getHashtagErrorMessage);
  pristine.addValidator(commentInput, validateComment, getCommentErrorMessage);

  function setScale(scale) {
    currentScale = Math.max(25, Math.min(100, scale));
    imgUploadPreview.style.transform = `scale(${currentScale / 100})`;
    scaleControlValue.value = `${currentScale}%`;
  }

  function onScaleSmallerClick() {
    if (currentScale > 25) {
      setScale(currentScale - 25);
    }
  }

  function onScaleBiggerClick() {
    if (currentScale < 100) {
      setScale(currentScale + 25);
    }
  }

  function updateImageFilter() {
    if (currentEffect === 'none') {
      imgUploadPreview.style.filter = 'none';
      return;
    }

    const value = parseFloat(effectLevelValue.value);

    switch (currentEffect) {
      case 'chrome':
        imgUploadPreview.style.filter = `grayscale(${value})`;
        break;
      case 'sepia':
        imgUploadPreview.style.filter = `sepia(${value})`;
        break;
      case 'marvin':
        imgUploadPreview.style.filter = `invert(${value}%)`;
        break;
      case 'phobos':
        imgUploadPreview.style.filter = `blur(${value}px)`;
        break;
      case 'heat':
        imgUploadPreview.style.filter = `brightness(${value})`;
        break;
      default:
        imgUploadPreview.style.filter = 'none';
    }
  }

  function resetEffect() {
    currentEffect = 'none';
    effectLevelContainer.classList.add('hidden');
    effectLevelValue.value = '';

    if (slider) {
      slider.destroy();
      slider = null;
    }

    imgUploadPreview.style.filter = 'none';

    document.querySelectorAll('.effects__label').forEach((label) => {
      label.classList.remove('effects__label--active');
    });

    const originalLabel = document.querySelector('label[for="effect-none"]');
    if (originalLabel) {
      originalLabel.classList.add('effects__label--active');
    }

    const originalRadio = document.querySelector('#effect-none');
    if (originalRadio) {
      originalRadio.checked = true;
    }
  }

  function initSlider(effectName) {
    const config = {
      chrome: { min: 0, max: 1, step: 0.1, start: 1 },
      sepia: { min: 0, max: 1, step: 0.1, start: 1 },
      marvin: { min: 0, max: 100, step: 1, start: 100 },
      phobos: { min: 0, max: 3, step: 0.1, start: 3 },
      heat: { min: 1, max: 3, step: 0.1, start: 3 }
    }[effectName];

    if (!config) {
      return;
    }

    if (slider) {
      slider.destroy();
    }

    slider = noUiSlider.create(effectLevelSlider, {
      range: {
        min: config.min,
        max: config.max
      },
      start: config.start,
      step: config.step,
      connect: 'lower',
      format: {
        to: function (value) {
          if (Number.isInteger(value)) {
            return value.toFixed(0);
          }
          return value.toFixed(1);
        },
        from: function (value) {
          return parseFloat(value);
        }
      }
    });

    effectLevelValue.value = config.start;
    updateImageFilter();

    slider.on('update', (values) => {
      effectLevelValue.value = values[0];
      updateImageFilter();
    });
  }

  function onEffectChange(evt) {
    const radio = evt.target.closest('.effects__radio');
    if (!radio) {
      return;
    }

    const newEffect = radio.value;

    document.querySelectorAll('.effects__label').forEach((label) => {
      label.classList.remove('effects__label--active');
    });

    const currentLabel = document.querySelector(`label[for="effect-${newEffect}"]`);
    if (currentLabel) {
      currentLabel.classList.add('effects__label--active');
    }

    currentEffect = newEffect;

    if (newEffect === 'none') {
      resetEffect();
    } else {
      effectLevelContainer.classList.remove('hidden');

      if (slider) {
        slider.destroy();
      }

      initSlider(newEffect);
    }
  }

  function resetFormToInitialState() {
    setScale(100);
    resetEffect();
    form.reset();
    pristine.reset();
    imgUploadPreview.style.transform = '';
    imgUploadPreview.style.filter = '';
    effectLevelContainer.classList.add('hidden');
    uploadInput.value = '';
  }

  function closeForm() {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    resetFormToInitialState();
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
    resetFormToInitialState();
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  }

  function showSuccessMessage() {
    const successTemplate = document.querySelector('#success');
    if (!successTemplate) {
      return;
    }

    const existingMessage = document.querySelector('.success');
    if (existingMessage) {
      existingMessage.remove();
    }

    const successElement = successTemplate.content.cloneNode(true);
    document.body.appendChild(successElement);

    const successSection = document.querySelector('.success');

    if (successSection) {
      successSection.style.position = 'fixed';
      successSection.style.top = '0';
      successSection.style.left = '0';
      successSection.style.width = '100%';
      successSection.style.height = '100%';
      successSection.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      successSection.style.display = 'flex';
      successSection.style.alignItems = 'center';
      successSection.style.justifyContent = 'center';
      successSection.style.zIndex = '10000';

      const successInner = successSection.querySelector('.success__inner');
      if (successInner) {
        successInner.style.backgroundColor = 'white';
        successInner.style.padding = '30px';
        successInner.style.borderRadius = '10px';
        successInner.style.textAlign = 'center';
        successInner.style.maxWidth = '400px';
      }

      const successButton = successSection.querySelector('.success__button');
      if (successButton) {
        successButton.addEventListener('click', () => {
          successSection.remove();
        });

        const onMessageKeydown = (evt) => {
          if (isEscapeKey(evt)) {
            evt.preventDefault();
            successSection.remove();
            document.removeEventListener('keydown', onMessageKeydown);
          }
        };

        document.addEventListener('keydown', onMessageKeydown);

        successSection.addEventListener('click', (evt) => {
          if (!evt.target.closest('.success__inner')) {
            successSection.remove();
            document.removeEventListener('keydown', onMessageKeydown);
          }
        });
      }
    }
  }

  function showErrorMessage() {
    const errorTemplate = document.querySelector('#error');
    if (!errorTemplate) {
      return;
    }

    const existingMessage = document.querySelector('.error');
    if (existingMessage) {
      existingMessage.remove();
    }

    const errorElement = errorTemplate.content.cloneNode(true);
    document.body.appendChild(errorElement);

    const errorSection = document.querySelector('.error');

    if (errorSection) {
      errorSection.style.position = 'fixed';
      errorSection.style.top = '0';
      errorSection.style.left = '0';
      errorSection.style.width = '100%';
      errorSection.style.height = '100%';
      errorSection.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      errorSection.style.display = 'flex';
      errorSection.style.alignItems = 'center';
      errorSection.style.justifyContent = 'center';
      errorSection.style.zIndex = '10000';

      const errorInner = errorSection.querySelector('.error__inner');
      if (errorInner) {
        errorInner.style.backgroundColor = 'white';
        errorInner.style.padding = '30px';
        errorInner.style.borderRadius = '10px';
        errorInner.style.textAlign = 'center';
        errorInner.style.maxWidth = '400px';
      }

      const errorButton = errorSection.querySelector('.error__button');
      if (errorButton) {
        errorButton.addEventListener('click', () => {
          errorSection.remove();
        });

        const onMessageKeydown = (evt) => {
          if (isEscapeKey(evt)) {
            evt.preventDefault();
            errorSection.remove();
            document.removeEventListener('keydown', onMessageKeydown);
          }
        };

        document.addEventListener('keydown', onMessageKeydown);

        errorSection.addEventListener('click', (evt) => {
          if (!evt.target.closest('.error__inner')) {
            errorSection.remove();
            document.removeEventListener('keydown', onMessageKeydown);
          }
        });
      }
    }
  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (!isValid) {
      return;
    }

    const submitButton = form.querySelector('.img-upload__submit');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Отправляю...';

    const formData = new FormData(form);

    fetch('https://29.javascript.htmlacademy.pro/kekstagram', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          showSuccessMessage();
          closeForm();
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        showErrorMessage();
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      });
  }

  // Назначаем обработчики
  uploadInput.addEventListener('change', openForm);
  uploadCancel.addEventListener('click', closeForm);
  form.addEventListener('submit', onFormSubmit);

  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', onFieldKeydown);
  }

  if (commentInput) {
    commentInput.addEventListener('keydown', onFieldKeydown);
  }

  if (scaleControlSmaller) {
    scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  }

  if (scaleControlBigger) {
    scaleControlBigger.addEventListener('click', onScaleBiggerClick);
  }

  if (effectsList) {
    effectsList.addEventListener('change', onEffectChange);
  }

  // Инициализация начального состояния
  setScale(100);
  resetEffect();
  if (effectLevelContainer) {
    effectLevelContainer.classList.add('hidden');
  }
}

// Инициализируем форму когда DOM загружен
document.addEventListener('DOMContentLoaded', initForm);

export { initForm };

/* eslint-disable no-use-before-define */
import { isEscapeKey } from './util.js';
import { sendPhoto } from './api.js';

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

  /* ---------- валидация ---------- */

  // инициализация pristine для валидации формы
  const pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__error-text',
  });

  // проверка корректности хэштегов
  function validateHashtags(value) {
    // пустое значение допустимо
    if (!value.trim()) {
      return true;
    }

    // разбиваем на отдельные теги, убираем пустые
    const hashtags = value.split(' ').filter(Boolean);

    // не более 5 хэштегов
    if (hashtags.length > 5) {
      return false;
    }

    // проверка дубликатов без учёта регистра
    const lowerCase = hashtags.map((tag) => tag.toLowerCase());
    if (new Set(lowerCase).size !== hashtags.length) {
      return false;
    }

    // каждый хэштег должен соответствовать регулярному выражению
    return hashtags.every((tag) =>
      /^#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}$/.test(tag)
    );
  }

  // получение текста ошибки для хэштегов
  function getHashtagErrorMessage(value) {
    const hashtags = value.split(' ').filter(Boolean);

    if (hashtags.length > 5) {
      return 'можно указать не более 5 хэштегов.';
    }

    const lowerCaseTags = hashtags.map((tag) => tag.toLowerCase());
    if (new Set(lowerCaseTags).size !== hashtags.length) {
      return 'один и тот же хэштег нельзя использовать дважды.';
    }

    for (const tag of hashtags) {
      if (!tag.startsWith('#')) {
        return 'хэштег должен начинаться с символа #.';
      }

      if (tag.length === 1) {
        return 'хэштег не может состоять только из символа #.';
      }

      if (tag.length > 20) {
        return 'длина хэштега не должна превышать 20 символов (включая #).';
      }

      const content = tag.slice(1);
      if (!/^[a-zA-Zа-яА-ЯёЁ0-9]+$/.test(content)) {
        return 'после # допускаются только буквы и цифры (без пробелов, знаков препинания и спецсимволов).';
      }
    }

    return 'некорректный формат хэштега.';
  }

  // добавление валидаторов
  pristine.addValidator(hashtagsInput, validateHashtags, getHashtagErrorMessage);
  pristine.addValidator(
    commentInput,
    (value) => value.length <= 140,
    'максимум 140 символов'
  );

  /* ---------- масштаб ---------- */

  // установка масштаба изображения
  function setScale(scale) {
    currentScale = Math.max(25, Math.min(100, scale));
    imgUploadPreview.style.transform = `scale(${currentScale / 100})`;
    scaleControlValue.value = `${currentScale}%`;
  }

  /* ---------- эффекты ---------- */

  // применение выбранного эффекта к изображению
  function updateImageFilter(value) {
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

  // инициализация слайдера для настройки эффекта
  function initSlider(effect) {
    const settings = {
      chrome: { min: 0, max: 1, step: 0.1, start: 1 },
      sepia: { min: 0, max: 1, step: 0.1, start: 1 },
      marvin: { min: 0, max: 100, step: 1, start: 100 },
      phobos: { min: 0, max: 3, step: 0.1, start: 3 },
      heat: { min: 1, max: 3, step: 0.1, start: 3 },
    }[effect];

    // уничтожение предыдущего слайдера
    if (slider) {
      slider.destroy();
    }

    // создание нового слайдера
    slider = noUiSlider.create(effectLevelSlider, {
      range: {
        min: settings.min,
        max: settings.max,
      },
      start: settings.start,
      step: settings.step,
      connect: 'lower',
    });

    // установка начального значения
    effectLevelValue.value = settings.start;
    updateImageFilter(settings.start);

    // обновление эффекта при изменении слайдера
    slider.on('update', (values) => {
      effectLevelValue.value = values[0];
      updateImageFilter(values[0]);
    });
  }

  // сброс эффекта до оригинала
  function resetEffect() {
    currentEffect = 'none';
    effectLevelContainer.classList.add('hidden');

    if (slider) {
      slider.destroy();
      slider = null;
    }

    imgUploadPreview.style.filter = 'none';
    document.querySelector('#effect-none').checked = true;
  }

  // обработчик изменения эффекта
  function onEffectChange(evt) {
    currentEffect = evt.target.value;

    if (currentEffect === 'none') {
      resetEffect();
      return;
    }

    effectLevelContainer.classList.remove('hidden');
    initSlider(currentEffect);
  }

  /* ---------- форма ---------- */

  // сброс формы к начальному состоянию
  function resetForm() {
    form.reset();
    pristine.reset();
    setScale(100);
    resetEffect();
    if (uploadInput) {
      uploadInput.value = '';
    }
  }

  // закрытие формы редактирования
  function closeForm() {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    resetForm();
  }

  // открытие формы редактирования
  function openForm() {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
  }

  // отображение модального сообщения
  function showMessage(templateId) {
    const template = document.querySelector(templateId);
    if (!template) {
      return;
    }

    const fragment = template.content.cloneNode(true);
    const message = fragment.firstElementChild;
    document.body.append(message);

    // поднятие сообщения выше формы (z-index формы = 2)
    message.style.zIndex = '3';

    // поиск внутреннего блока и кнопки закрытия
    const inner = message.querySelector('.success__inner, .error__inner');
    const button = message.querySelector('.success__button, .error__button');

    // очистка обработчиков при закрытии
    const cleanup = () => {
      message.removeEventListener('click', onClickOutside);
      if (button) {
        button.removeEventListener('click', onClickButton);
      }
    };

    // закрытие по клику вне контента сообщения
    const onClickOutside = (evt) => {
      if (inner && !evt.target.closest(`.${inner.className}`)) {
        cleanup();
        message.remove();
      }
    };

    // закрытие по клику на кнопку
    const onClickButton = () => {
      cleanup();
      message.remove();
    };

    if (button) {
      button.addEventListener('click', onClickButton);
    }

    message.addEventListener('click', onClickOutside);
  }

  /* ---------- отправка ---------- */

  // обработчик отправки формы
  function onFormSubmit(evt) {
    evt.preventDefault();

    // валидация перед отправкой
    if (!pristine.validate()) {
      showMessage('#error');
      return;
    }

    const submitButton = form.querySelector('.img-upload__submit');
    submitButton.disabled = true;

    sendPhoto(new FormData(form))
      .then(() => {
        showMessage('#success');
        closeForm();
      })
      .catch(() => {
        showMessage('#error');
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  }

  /* ---------- обработчики ---------- */

  // открытие формы при выборе файла
  uploadInput.addEventListener('change', openForm);

  // закрытие формы по кнопке отмены
  uploadCancel.addEventListener('click', closeForm);

  // отправка формы
  form.addEventListener('submit', onFormSubmit);

  // изменение масштаба
  scaleControlSmaller.addEventListener('click', () => setScale(currentScale - 25));
  scaleControlBigger.addEventListener('click', () => setScale(currentScale + 25));

  // выбор эффекта
  effectsList.addEventListener('change', onEffectChange);

  // инициализация масштаба и эффекта
  setScale(100);
  resetEffect();
}

// запуск инициализации после загрузки dom
document.addEventListener('DOMContentLoaded', initForm);

// единый обработчик esc для всех модальных окон
document.addEventListener('keydown', (evt) => {
  if (!isEscapeKey(evt)) {
    return;
  }

  // закрытие сообщения об ошибке или успехе
  const message = document.querySelector('.success, .error');
  if (message) {
    evt.preventDefault();
    const button = message.querySelector('.success__button, .error__button');
    if (button) {
      button.click();
    } else {
      message.remove();
    }
    return;
  }

  // закрытие формы редактирования
  const overlay = document.querySelector('.img-upload__overlay:not(.hidden)');
  if (overlay) {
    evt.preventDefault();
    const cancelBtn = document.querySelector('.img-upload__cancel');
    if (cancelBtn) {
      cancelBtn.click();
    }
  }
});

export { initForm };

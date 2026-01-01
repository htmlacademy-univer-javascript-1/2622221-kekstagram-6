
export function showMessage(templateId) {
  const template = document.querySelector(templateId);
  if (!template) {
    return;
  }

  const fragment = template.content.cloneNode(true);
  const message = fragment.firstElementChild;
  document.body.append(message);
  message.style.zIndex = '3';

  const inner = message.querySelector('.success__inner, .error__inner');
  const button = message.querySelector('.success__button, .error__button');

  const cleanup = () => {
    message.remove();
  };

  const onClickOutside = (evt) => {
    if (inner && !evt.target.closest(`.${inner.className}`)) {
      cleanup();
    }
  };

  const onClickButton = () => {
    cleanup();
  };

  if (button) {
    button.addEventListener('click', onClickButton);
  }
  message.addEventListener('click', onClickOutside);
}

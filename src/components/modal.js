function closeModalByEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector('.popup_is-opened')
    closeModal(openedModal)
  }
}

let isMouseDownOnOverlay = false;

// Обработчик для события mousedown
function handleMouseDown(event) {
  isMouseDownOnOverlay = (event.target === event.currentTarget);
}

// Обработчик для события mouseup
function handleMouseUp(event) {
  if (event.target !== event.currentTarget) {
    isMouseDownOnOverlay = false;
  }
}

// Обработчик для события mouseover
function changeCursorMouseover(event) {
  if (event.target === event.currentTarget) {
    event.target.style.cursor = "pointer";
  }
}

// Обработчик для события mouseout
function changeCursorMouseout(event) {
  if (event.target === event.currentTarget) {
    event.target.style.cursor = "default";
  }
}

// Функция открытия поп-апа
function openModal(popup) {

  // Обработка закрытия поп-апа с удалением слушателей
  function handleClose() {
    closeModal(popup);
    popup.querySelector('.popup__close').removeEventListener('click', handleClose)

    popup.removeEventListener('click', handleOverlayClose);
    popup.removeEventListener('mousedown', handleMouseDown);
    popup.removeEventListener('mouseup', handleMouseUp);
    popup.removeEventListener('mouseover', changeCursorMouseover)
    popup.removeEventListener('mouseout', changeCursorMouseout)

    document.removeEventListener('keydown', closeModalByEsc)
  }

  // Обработчик для клика на overlay
  function handleOverlayClose(event) {
    // Закрываем только если нажатие началось на overlay
    if (isMouseDownOnOverlay && event.target === event.currentTarget) {
      handleClose();
    }
  }

  popup.classList.add('popup_is-opened')

  // Добавление слушателей при открытии поп-апа
  popup.querySelector('.popup__close').addEventListener('click', handleClose)

  popup.addEventListener('click', handleOverlayClose);
  popup.addEventListener('mousedown', handleMouseDown);
  popup.addEventListener('mouseup', handleMouseUp);
  popup.addEventListener('mouseover', changeCursorMouseover)
  popup.addEventListener('mouseout', changeCursorMouseout)

  document.addEventListener('keydown', closeModalByEsc)
}

// Функция закрытия поп-апа
function closeModal(popup) {
  popup.classList.remove('popup_is-opened')
}

export { closeModal, openModal }

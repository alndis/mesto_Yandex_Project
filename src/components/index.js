import '../pages/index.css';

import { createCard, updateCardLikes } from './card.js';
import { enableValidation, checkValidation } from './validate.js';
import { openModal, closeModal } from './modal.js';

import {
  getInitialCards,
  getUserInfo,
  changeUserInfo,
  changeAvatar,
  postNewCard,
  deleteCard,
  toggleLikeCard
} from './api.js';

const profileName = document.querySelector('.profile__title');
const profileAbout = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

const profileFormPopup = document.querySelector('.popup_type_edit');
const cardFormPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarFormPopup = document.querySelector('.popup_type_avatar');

const image = imagePopup.querySelector('.popup__image');
const caption = imagePopup.querySelector('.popup__caption');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

const profileFormElement = profileFormPopup.querySelector('.popup__form');
const profileFormButton = profileFormElement.querySelector('.popup__button');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const aboutInput = profileFormElement.querySelector('.popup__input_type_description');
nameInput.value = profileName.textContent;
aboutInput.value = profileAbout.textContent;

const cardFormElement = cardFormPopup.querySelector('.popup__form');
const cardFormButton = cardFormElement.querySelector('.popup__button');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const avatarFormElement = avatarFormPopup.querySelector('.popup__form');
const avatarFormButton = avatarFormElement.querySelector('.popup__button');
const avatarLinkInput = avatarFormElement.querySelector('.popup__input_type_url');

// Обработчик нажатия на карточку
placesList.addEventListener('click', evt => {
  if (evt.target.classList.contains('card__image')) {
    image.src = ""
    image.src = evt.target.src
    caption.textContent = evt.target.alt
    openModal(imagePopup)
  } else if (evt.target.classList.contains('card__like-button')) {
    evt.target.disabled = true;
    const cardItem = evt.target.closest('.places__item');
    // Метод для постановки или снятия лайка карточки
    let _method;
    if (evt.target.classList.contains('card__like-button_is-active')) {
      _method = "DELETE";
    } else {
      _method = "PUT";
    }
    // установка/снятие лайка
    toggleLikeCard(cardItem.id, _method)
      .then(cardInfo => {
        const newCardItem = updateCardLikes(cardItem, cardInfo.likes.length);
        cardItem.replaceWith(newCardItem);
        evt.target.classList.toggle('card__like-button_is-active')
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        evt.target.disabled = false;
      });
  } else if (evt.target.classList.contains('card__delete-button')) {
    evt.target.disabled = true;
    const cardItem = evt.target.closest('.places__item');
    // удаление карточки
    deleteCard(cardItem.id)
      .then(res => {
        cardItem.remove();
      })
      .catch(err => {
        console.log(err);
      })
  }
})

let userId;
// информация от всех запросов
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfo, cards]) => {
    profileName.textContent = userInfo.name;
    profileAbout.textContent = userInfo.about;
    profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
    userId = userInfo._id;

    cards.forEach(cardInfo => {
      const link = cardInfo.link;
      const name = cardInfo.name;
      const likeCount = cardInfo.likes.length;
      const _id = cardInfo._id;
      const newCard = createCard(link, name, likeCount, _id);
      if (cardInfo.likes.some(user => user._id === userId)) {
        newCard.querySelector('.card__like-button').classList.add('card__like-button_is-active');
      }
      if (cardInfo.owner._id !== userId) {
        newCard.querySelector('.card__delete-button').classList.add('card__delete-button_diactivate');
      }
      placesList.append(newCard);
    });
  })
  .catch(err => {
    console.log(err);
  });


// Обработка поп-апа изменения аватарки
profileAvatar.addEventListener('click', event => {

  avatarLinkInput.value = profileAvatar.style.backgroundImage.slice(5, -2);

  checkValidation(avatarFormElement, validationSettings)
  openModal(avatarFormPopup)
})

// Обработчик «отправки» формы
function handleAvatarFormSubmit(evt) {
  evt.preventDefault()

  avatarFormButton.textContent = "Сохранение...";
  const body = {
    avatar: avatarLinkInput.value
  };
  // запрос на изменение аватарки
  changeAvatar(body)
    .then(userInfo => {
      profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      closeModal(avatarFormPopup);
      avatarFormButton.textContent = "Сохранить";
    });
}

// отпрвка данных
avatarFormPopup.addEventListener('submit', handleAvatarFormSubmit)

// Обработка поп-апа изменения профиля
profileEditButton.addEventListener('click', event => {

  nameInput.value = profileName.textContent
  aboutInput.value = profileAbout.textContent

  checkValidation(profileFormElement, validationSettings)
  openModal(profileFormPopup)
})

// Обработчик «отправки» формы
function handleProfileFormSubmit(evt) {
  evt.preventDefault() // Эта строчка отменяет стандартную отправку формы.

  profileFormButton.textContent = "Сохранение...";
  const body = {
    name: nameInput.value,
    about: aboutInput.value
  };

  changeUserInfo(body)
    .then(userInfo => {
      profileName.textContent = userInfo.name;
      profileAbout.textContent = userInfo.about;
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      closeModal(profileFormPopup);
      profileFormButton.textContent = "Сохранить";
    });
}

// Прикрепление обработчика к форме
profileFormElement.addEventListener('submit', handleProfileFormSubmit)


// создание новой карточки

addCardButton.addEventListener('click', () => {

  cardLinkInput.value = ''
  cardNameInput.value = ''

  checkValidation(cardFormElement, validationSettings)
  openModal(cardFormPopup)
})

// Обработчик для создания новой карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault()
  // тело запроса
  cardFormButton.textContent = "Создание...";
  const body = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };

  postNewCard(body)
    .then(cardInfo => {
      const link = cardInfo.link;
      const name = cardInfo.name;
      const likeCount = cardInfo.likes.length;
      const _id = cardInfo._id;
      const newCard = createCard(link, name, likeCount, _id);
      placesList.prepend(newCard);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      closeModal(cardFormPopup);
      cardFormButton.textContent = "Создать";
    });
}

// Прикрепление обработчика к форме
cardFormElement.addEventListener('submit', handleCardFormSubmit)


// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings)

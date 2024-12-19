// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
export const createCard = (link, title, likeCount, _id) => {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const cardLikeCount = cardElement.querySelector('.card__like-count');

  cardTitle.textContent = title;

  cardImage.src = link;
  cardImage.alt = title;

  cardLikeCount.textContent = likeCount;
  cardElement.id = _id;

  return cardElement
}

export const updateCardLikes = (card, likeCount) => {
  const cardLikeCount = card.querySelector('.card__like-count');
  cardLikeCount.textContent = likeCount;
  return card;
}

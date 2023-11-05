// API 객체
import APIHandler from "./api.js";
const API = new APIHandler();

// 카드 클래스
class Card {
  constructor(cardElement, title, id, category) {
    this.cardElement = cardElement;
    this.title = title;
    this.id = id;
    this.category = category;
  }
}

// 전체 카드 카테고리 요소 반환
const getCardContainers = () => {
  return document.querySelectorAll(".card-container");
};

// 카드 요소에서 카드 객체 반환
const getCardInfo = cardElement =>
  new Card(
    cardElement,
    cardElement.children[1].value,
    cardElement.id.replace("card-id-", ""),
    cardElement.parentNode.parentNode.getAttribute("data-card-category")
  );

// 카드 드래그 앤 드랍 시작 이벤트. 카테고리 이름 & 카드 ID 저장. 이동가능 영역 표시
const ondragstart = event => {
  let currentColumnType = event.target.parentNode.parentNode.getAttribute(
    "data-card-category"
  );
  getCardContainers().forEach(element => {
    if (
      element.parentNode.getAttribute("data-card-category") !==
      currentColumnType
    )
      element.classList.add("hoverable");
  });
  event.dataTransfer.setData("columnType", currentColumnType);
  event.dataTransfer.setData("cardID", event.target.id);
};

// 카드 온드랍 이벤트. 카테고리 이동
const cardOnDrop = event => {
  event.target.classList.remove("hover");
  let from = event.dataTransfer.getData("columnType");
  let to = event.target.parentNode.getAttribute("data-card-category");
  let id = event.dataTransfer.getData("cardID");
  let card = document.getElementById(id);
  if (from && to && card && from !== to) {
    event.target.appendChild(card);
    updateCard(getCardInfo(card));
  }
};

// 카드 드래그 앤 드랍 종료 이벤트. 이동가능 영역 표시 CSS class 제거
const ondragend = event => {
  getCardContainers().forEach(element => {
    element.classList.remove("hoverable");
  });
};

// 새로운 카드 생성 이벤트.
const createCard = event => {
  let category = event.target.parentNode.getAttribute("data-card-category");
  let cardObj = new Card(null, null, null, category);
  cardFactory(cardObj);
};

// 기존/신규 카드 요소 생성. 이후 onChangeCard() 트리거
const cardFactory = cardObj => {
  let cardElement = document.createElement("div");
  cardElement.className = "card";
  cardElement.ondragstart = ondragstart;
  cardElement.ondragend = ondragend;
  cardElement.setAttribute("draggable", true);
  if (cardObj.id) cardElement.id = "card-id-" + cardObj.id;

  let title = document.createElement("textarea");
  title.setAttribute("rows", 3);
  title.setAttribute("cols", 1);
  title.setAttribute("name", "title");
  title.className = "card-title";
  title.onchange = onChangeCard;
  if (cardObj.title) title.value = cardObj.title;

  let del = document.createElement("div");
  del.innerHTML = "x";
  del.className = "card-delete";
  del.onclick = deleteCard;

  cardElement.appendChild(del);
  cardElement.appendChild(title);

  let cardContainer = document
    .querySelectorAll(`[data-card-category='${cardObj.category}']`)[0]
    .querySelector(".card-container");
  cardContainer.appendChild(cardElement);
  title.focus();
};

// 카드 생성/업데이트 컨트롤러
const onChangeCard = event => {
  let title = event.target.value.trim();
  let cardElement = event.target.parentNode;
  let cardObj = getCardInfo(cardElement);
  if (title.length > 0 && cardElement.id === "") {
    registerCard(cardObj);
  } else if (title.length > 0 && cardElement.id !== "") {
    updateCard(cardObj);
  } else {
    card.remove(); // 입력된 내용이 없으면 카드 생성 취소
  }
};

// 기존 카드들 불러오기
const getCards = async () => {
  var cards = await API.getCards();  
  if (cards && cards.length > 0) {
    cards.forEach(card => {      
      let cardObj = new Card(null, card.title, card.id, card.category);
      cardFactory(cardObj);
    });
  }
};

// 카드 등록
const registerCard = async cardObj => {
  let cardId = await API.postCard(cardObj);
  cardObj.cardElement.id = "card-id-" + cardId;
};

// 카드 업데이트
const updateCard = async cardObj => {
  await API.putCard(cardObj);
};

// 카드 삭제
const deleteCard = event => {
  let cardElement = event.target.parentNode;
  let id = cardElement.id.replace("card-id-", "");
  API.deleteCard(id);
  cardElement.remove();
};

// 드래그 앤 드랍 이벤트 등록
(() => {
  window.createCard = createCard;
  getCardContainers().forEach(element => {
    element.ondragenter = event => event.target.classList.add("hover");
    element.ondragleave = event => event.target.classList.remove("hover");
    element.ondragover = event => event.preventDefault();
    element.ondrop = cardOnDrop;
  });
  getCards();
})();

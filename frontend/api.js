export default class APIHandler {
  constructor() {

  }

  // TODO: 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {    

    return null;
  }

  // TODO: 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {

    return Math.round(Math.random() * 10000).toString();
  }

  // TODO: ID로 카드 검색 후 내용,카테고리 수정
  async putCard(cardObj) {    

  }

  // TODO: ID로 카드 검색 후 삭제
  async deleteCard(id) {

  }

  // TODO: API 요청 컨테이너. Method, Path, Body 속성 
  // TODO: API 호출 함수
}


export default class State {
  constructor(appCallbacks) {
    this.LOCALSTORAGE_NAME = 'niRastorGeoAndMedia';
    this.nextCardId = 1;
    this.cards = [];
    this.appCallbacks = appCallbacks;
  }

  getNextCardId() {
    return this.nextCardId;
  }

  increaseNextCardId() {
    this.nextCardId += 1;
    return this.nextCardId;
  }

  addCard(card) {
    this.cards.push(card);
  }

  getCardIndexById(id) {
    return this.cards.findIndex((card) => card.id === id);
  }

  removeCard(id) {
    this.cards.splice(this.getCardIndexById(id), 1);
  }

  save() {
    const saved = {
      nextCardId: this.nextCardId,
      cards: this.cards,
    };
    window.localStorage.setItem(this.LOCALSTORAGE_NAME, JSON.stringify(saved));
  }

  load() {
    const loadedString = window.localStorage.getItem(this.LOCALSTORAGE_NAME);

    if (!loadedString) {
      return false;
    }

    try {
      const loaded = JSON.parse(loadedString);
      this.nextCardId = loaded.nextCardId;
      loaded.cards.forEach((card) => {
        const newCard = this.appCallbacks.createCard(
          card.id, card.latitude, card.longitude, card.text,
        );
        this.cards.push(newCard);
      });
      return this.cards;
    } catch (e) {
      // err handler here
      return false;
    }
  }
}

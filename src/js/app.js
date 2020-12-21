import Input from './input';
import Card from './card';
import State from './state';

class App {
  constructor() {
    this.appContainerEl = document.querySelector('.app');
    this.state = new State({
      createCard: this.createCard.bind(this),
    });
  }

  init() {
    this.appColumnEl = document.createElement('div');
    this.appColumnEl.classList.add('app-column');
    this.appContainerEl.appendChild(this.appColumnEl);

    this.appMessagesEl = document.createElement('div');
    this.appMessagesEl.classList.add('app-messages');
    this.appColumnEl.appendChild(this.appMessagesEl);

    this.appInputEl = document.createElement('div');
    this.appInputEl.classList.add('app-input');
    this.appColumnEl.appendChild(this.appInputEl);

    this.input = new Input(this.appInputEl, {
      createNewCard: this.createNewCard.bind(this),
    });
    this.input.init();

    this.state.load();
  }

  createCard(id, latitude, longitude, text) {
    const newCard = new Card(id, latitude, longitude, text, {
      removeCard: this.removeCard.bind(this),
    });
    newCard.createCardEl();
    const { firstChild } = this.appMessagesEl;
    if (firstChild) {
      this.appMessagesEl.insertBefore(newCard.getCardEl(), firstChild);
    } else {
      this.appMessagesEl.appendChild(newCard.getCardEl());
    }
    return newCard;
  }

  createNewCard(latitude, longitude, text) {
    const id = this.state.getNextCardId();
    this.state.increaseNextCardId();
    const newCard = this.createCard(id, latitude, longitude, text);
    this.state.addCard(newCard);
    this.state.save();
  }

  removeCard(id) {
    this.state.removeCard(id);
    this.state.save();
  }
}

const app = new App();
app.init();

document.addEventListener('keydown', (e) => {
  if (e.code === 'F2') {
    // eslint-disable-next-line no-console
    console.log(app.state.cards);
  }
});

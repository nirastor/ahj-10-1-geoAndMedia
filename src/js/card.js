export default class Card {
  constructor(id, latitude, longitude, text, appCallback) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.text = text;
    this.appCallback = appCallback;
    this.cardEl = document.createElement('div');
  }

  createCardEl() {
    this.cardEl.classList.add('card');
    this.cardEl.dataset.cardId = this.id;
    const latitudeText = this.latitude >= 0 ? 'N: ' : 'S: ';
    const longitudeText = this.longitude >= 0 ? 'E: ' : 'W: ';
    this.cardEl.innerHTML = `
      <div class="card-text"></div>
      <div class="card-geo">
        <div class="card-geo-lat">
          <span>${latitudeText}</span>
          <span>${Math.abs(this.latitude)}</span>
        </div>
        <div class="card-geo-lon">
          <span>${longitudeText}</span>
          <span>${Math.abs(this.longitude)}</span>
        </div>
      </div>
      <svg class="card-delete-button" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.54" fill-rule="evenodd" clip-rule="evenodd" d="M19 6.4L17.6 5L12 10.6L6.4 5L5 6.4L10.6 12L5 17.6L6.4 19L12 13.4L17.6 19L19 17.6L13.4 12L19 6.4Z" fill="currentcolor"/>
      </svg>
    `;
    this.cardEl.querySelector('.card-text').innerText = this.text;
    this.initDeleteAction();
    return true;
  }

  initDeleteAction() {
    this.cardEl.querySelector('.card-delete-button').addEventListener('click', () => {
      this.appCallback.removeCard(this.id);
      this.cardEl.remove();
    });
  }

  getCardEl() {
    return this.cardEl;
  }

  getId() {
    return this.id;
  }
}

import GeoPopup from './geopopup';

export default class Input {
  constructor(parentContainer, appCallbacks) {
    this.parentContainer = parentContainer;
    this.appCallbacks = appCallbacks;
    this.messageNoGeoText = 'Не удалось определить позицию.';
    this.text = '';
    this.popupContainer = null;
    this.state = {
      isGeoPopupOpen: false,
    };
  }

  init() {
    this.parentContainer.innerHTML = `
      <div class="input">
      <form class="input-form">
        <input class="input-input" type="text" placeholder="Пиши тут...">
        <svg class="input-mic" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.99 11L14.999 5C14.999 3.342 13.657 2 12 2C10.344 2 9 3.342 9 5V11C9 12.656 10.344 14 12 14C13.657 14 14.99 12.656 14.99 11ZM17.299 11C17.299 14 14.762 16.1 12 16.1C9.239 16.1 6.7 14 6.7 11H5C5 14.415 7.719 17.233 11 17.718V21H13V17.718C16.279 17.233 19 14.415 19 11H17.299Z" fill="currentcolor"/>
        </svg>
        <button class="input-add-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4L10.6 5.4L16.2 11H4V13H16.2L10.6 18.6L12 20L20 12L12 4Z" fill="currentcolor"/>
          </svg>
        </button>
      </form>
      <div class="popup-container"></div>
      </div>
    `;
    this.popupContainer = this.parentContainer.querySelector('.popup-container');

    this.geoPopup = new GeoPopup(this.popupContainer, {
      onCorrectInputCoord: this.onCorrectInputCoord.bind(this),
    });
    this.geoPopup.init();

    this.initListeners();
  }

  showPopup() {
    this.popupContainer.classList.add('popup-show');
    this.state.isGeoPopupOpen = true;
    this.addButton.classList.add('input-add-button--disable');
    this.input.blur();
  }

  onCorrectInputCoord(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.createCard();
    this.hidePopup();
  }

  hidePopup() {
    this.popupContainer.classList.remove('popup-show');
    this.state.isGeoPopupOpen = false;
    this.addButton.classList.remove('input-add-button--disable');
  }

  initListeners() {
    this.input = this.parentContainer.querySelector('.input-input');
    this.addButton = this.parentContainer.querySelector('.input-add-button');
    this.form = this.parentContainer.querySelector('.input-form');
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  onSubmit() {
    if (this.state.isGeoPopupOpen) {
      return;
    }
    this.text = this.input.value;
    this.getCoords();
  }

  createCard() {
    this.appCallbacks.createNewCard(this.latitude, this.longitude, this.text);
    this.reset();
  }

  reset() {
    this.form.reset();
    this.latitude = null;
    this.longitude = null;
    this.text = '';
  }

  positionDetected(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    this.createCard();
  }

  positionError() {
    this.showPopup();
  }

  getCoords() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.positionDetected.bind(this),
        this.positionError.bind(this),
      );
    } else {
      this.positionError();
    }
  }
}

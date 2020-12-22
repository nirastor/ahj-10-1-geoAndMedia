export default class GeoPopup {
  constructor(parentEl, formCallbacks) {
    this.parentEl = parentEl;
    this.formCallbacks = formCallbacks;
  }

  init() {
    this.parentEl.innerHTML = `
    <form class="geo-popup-form">
      <div class="geo-popup-title">Упс, не удалось определить координаты</div>
      <div class="geo-popup-text">Разрешите определение геопозиции или введите широту и долготу вручную.<br>Это обязательно.</div>
      <input class="geo-popup-input" type="text" placeholder="00.0000, 00.0000">
      <div class="geo-popup-error">Что-то не так</div>
      <button class="geo-popup-button" type="submit">Ок</button>
    </form>
    `;
    this.initListeners();
  }

  initListeners() {
    this.form = this.parentEl.querySelector('.geo-popup-form');
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });

    this.errorMessage = this.parentEl.querySelector('.geo-popup-error');

    this.input = this.parentEl.querySelector('.geo-popup-input');
    this.input.addEventListener('input', (e) => {
      e.preventDefault();
      this.hideErrorMessage();
    });
  }

  onSubmit() {
    const parseInput = GeoPopup.parseInput(this.input.value);
    const checkedInput = GeoPopup.parseCheck(parseInput);
    if (checkedInput.result) {
      this.formCallbacks.onCorrectInputCoord(checkedInput.latitude, checkedInput.longitude);
      this.form.reset();
    } else {
      this.showErrorMessage(checkedInput.err);
    }
  }

  static parseInput(string) {
    return string.match(/(-?\d+)/gm);
  }

  static collectDecimal(wholeStr, fractionalStr) {
    const wholeDigit = Number(wholeStr);
    const fractionalDigit = Number(fractionalStr) / 10 ** fractionalStr.length;
    if (wholeDigit < 0 || (wholeDigit === 0 && wholeStr.charAt(0) === '-')) {
      return wholeDigit - fractionalDigit;
    }
    return wholeDigit + fractionalDigit;
  }

  static parseCheck(parse) {
    if (!parse || parse.length !== 4) {
      return {
        result: false,
        err: 'Ожидаю 2 числа с целой и дробной частью',
      };
    }

    if (Number(parse[1]) < 0 || Number(parse[3]) < 0) {
      return {
        result: false,
        err: 'Дробная часть не может быть отрицательной',
      };
    }

    const latitude = GeoPopup.collectDecimal(parse[0], parse[1]);
    const longitude = GeoPopup.collectDecimal(parse[2], parse[3]);

    if (latitude > 90) {
      return {
        result: false,
        err: 'Широта не может быть больше 90',
      };
    }

    if (latitude < -90) {
      return {
        result: false,
        err: 'Широта не может быть меньше -90',
      };
    }

    if (longitude > 180) {
      return {
        result: false,
        err: 'Долгота не может быть больше 180',
      };
    }

    if (longitude < -180) {
      return {
        result: false,
        err: 'Долгота не может быть меньше -180',
      };
    }

    return {
      result: true,
      latitude,
      longitude,
    };
  }

  showErrorMessage(message) {
    this.errorMessage.innerText = message;
    this.errorMessage.style.height = `${this.errorMessage.scrollHeight}px`;
    this.errorMessage.style.marginBottom = '7px';
  }

  hideErrorMessage() {
    this.errorMessage.style.height = 0;
    this.errorMessage.style.marginBottom = 0;
  }
}

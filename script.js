const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    mute: false,
    localisation: false
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayoutDefault = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "enter",
      "done", "space", "mute", "EN", "left", "right"
    ],
      keyLayoutShift = [
      "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'",
      "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "enter",
      "done", "space", "mute", "EN", "left", "right"
    ],
      keyLayoutLocalisation = [
      "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
      "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "enter",
      "done", "space", "mute", "EN", "left", "right"
    ];

    let keyLayout = keyLayoutDefault;

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "]", "'", "enter"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {

        case "mute":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.textContent = 'Mute';
          keyElement.addEventListener("click", () => {
            soundClick('./assets/mute.mp3');
            this.properties.mute = !this.properties.mute;
            keyElement.classList.toggle("keyboard__key--active", this.properties.mute);
            document.getElementById("myTextField").focus();
          });
          break;

        case "backspace":
          keyElement.classList.add("keyboard__key--caps-wide");
          keyElement.textContent = 'Backspace';
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            soundClick('./assets/backspace.mp3');
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
            document.getElementById("myTextField").focus();
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--caps-wide", "keyboard__key--activatable");
          keyElement.textContent = 'CapsLock';
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined : soundClick('./assets/capslock.mp3');
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            document.getElementById("myTextField").focus();
          });
          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.textContent = 'Shift';
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            soundClick('./assets/shift.mp3');
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            document.getElementById("myTextField").focus();
          });
          break;

        case "EN":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.textContent = 'EN';
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            this.properties.localisation ? soundClick('./assets/click_ru.mp3') : soundClick('./assets/click_en.mp3');
            this._toggleLocalisation();
            keyElement.classList.toggle("keyboard__key--active", this.properties.localisation);
            document.getElementById("myTextField").focus();
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.textContent = 'Enter';
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            soundClick('./assets/enter.mp3');
            this.properties.value += "\n";
            this._triggerEvent("oninput");
            document.getElementById("myTextField").focus();
          });
          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.textContent = ' ';
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            this.properties.localisation ? soundClick('./assets/click_en.mp3') : soundClick('./assets/click_ru.mp3');
            this.properties.value += " ";
            this._triggerEvent("oninput");
            document.getElementById("myTextField").focus();
          });
          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--inverse");
          keyElement.innerHTML = createIconHTML("check_circle");
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            soundClick('./assets/mute.mp3');
            this.close();
            this._triggerEvent("onclose");
          });
          break;

          case "left":
          keyElement.classList.add("keyboard__key--inverse");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_left");
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            this.properties.localisation ? soundClick('./assets/click_en.mp3') : soundClick('./assets/click_ru.mp3');
            (document.getElementById("myTextField").selectionStart - 1) !== undefined ? document.getElementById("myTextField").selectionEnd = document.getElementById("myTextField").selectionStart = document.getElementById("myTextField").selectionStart - 1 : document.getElementById("myTextField").selectionEnd = document.getElementById("myTextField").selectionStart;
            document.getElementById("myTextField").focus();
          });
          break;

          case "right":
          keyElement.classList.add("keyboard__key--inverse");
          keyElement.innerHTML = createIconHTML("keyboard_arrow_right");
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            this.properties.localisation ? soundClick('./assets/click_en.mp3') : soundClick('./assets/click_ru.mp3');
            (document.getElementById("myTextField").selectionStart + 1) !== undefined ? document.getElementById("myTextField").selectionEnd = document.getElementById("myTextField").selectionStart = document.getElementById("myTextField").selectionStart + 1 : document.getElementById("myTextField").selectionEnd = document.getElementById("myTextField").selectionStart;
            document.getElementById("myTextField").focus();
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.properties.mute ? undefined :
            this.properties.localisation ? soundClick('./assets/click_en.mp3') : soundClick('./assets/click_ru.mp3');
            this.properties.value += this.properties.capsLock ? this.properties.shift ? keyElement.textContent.toLowerCase() : keyElement.textContent.toUpperCase() : this.properties.shift ? keyElement.textContent.toUpperCase() : keyElement.textContent.toLowerCase();
            this._triggerEvent("oninput");
            document.getElementById("myTextField").focus();
          });
          break;

      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock === true) {
          switch (key.textContent) {
            case "Mute": key.textContent = "Mute"; break;
            case "Backspace": key.textContent = "Backspace"; break;
            case "CapsLock": key.textContent = "CapsLock"; break;
            case "Shift": key.textContent = "Shift"; break;
            case "Enter": key.textContent = "Enter"; break;
            case "EN": key.textContent = "EN"; break;
            case "RU": key.textContent = "RU"; break;
            default: this.properties.shift ? key.textContent = key.textContent.toLowerCase() : key.textContent = key.textContent.toUpperCase(); break;
          };
          this._createKeys.keyLayout = this._createKeys.keyLayoutShift;
        } else {
          switch (key.textContent) {
            case "Mute": key.textContent = "Mute"; break;
            case "Backspace": key.textContent = "Backspace"; break;
            case "CapsLock": key.textContent = "CapsLock"; break;
            case "Shift": key.textContent = "Shift"; break;
            case "Enter": key.textContent = "Enter"; break;
            case "EN": key.textContent = "EN"; break;
            case "RU": key.textContent = "RU"; break;
            default: this.properties.shift ? key.textContent = key.textContent.toUpperCase() : key.textContent = key.textContent.toLowerCase(); break;
          }
        }
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.shift === true) {
          switch (key.textContent) {
            case "1": key.textContent = "!"; break;
            case "2": this.properties.localisation ? key.textContent = '"' : key.textContent = "@"; break;
            case "3": this.properties.localisation ? key.textContent = "№" : key.textContent = "#"; break;
            case "4": this.properties.localisation ? key.textContent = ";" : key.textContent = "$"; break;
            case "5": key.textContent = "%"; break;
            case "6": this.properties.localisation ? key.textContent = ":" : key.textContent = "^"; break;
            case "7": this.properties.localisation ? key.textContent = "?" : key.textContent = "&"; break;
            case "8": key.textContent = "*"; break;
            case "9": key.textContent = "("; break;
            case "0": key.textContent = ")"; break;

            case "`": key.textContent = "~"; break;
            case "[": key.textContent = "{"; break;
            case "]": key.textContent = "}"; break;
            case ";": key.textContent = ":"; break;
            case "'": key.textContent = '"'; break;
            case ",": this.properties.localisation ? key.textContent = "." : key.textContent = "<"; break;
            case ".": this.properties.localisation ? key.textContent = "," : key.textContent = ">"; break;
            case "?": key.textContent = "/"; break;

            case "Mute": key.textContent = "Mute"; break;
            case "Backspace": key.textContent = "Backspace"; break;
            case "CapsLock": key.textContent = "CapsLock"; break;
            case "Shift": key.textContent = "Shift"; break;
            case "Enter": key.textContent = "Enter"; break;
            case "EN": key.textContent = "EN"; break;
            case "RU": key.textContent = "RU"; break;
            default: this.properties.capsLock ? key.textContent = key.textContent.toLowerCase() : key.textContent = key.textContent.toUpperCase(); break;
          };

        } else {
          switch (key.textContent) {
            case "!": key.textContent = "1"; break;
            case "@": key.textContent = "2"; break;
            case "#": key.textContent = "3"; break;
            case "$": key.textContent = "4"; break;
            case "%": key.textContent = "5"; break;
            case "^": key.textContent = "6"; break;
            case "&": key.textContent = "7"; break;
            case "*": key.textContent = "8"; break;
            case "(": key.textContent = "9"; break;
            case ")": key.textContent = "0"; break;

            case "№" : key.textContent = "3"; break;
            case ";" : key.textContent = "4"; break;case "?" : key.textContent = "7"; break;

            case "~": key.textContent = "`"; break;
            case "{": key.textContent = "["; break;
            case "}": key.textContent = "]"; break;
            case ":": this.properties.localisation ? key.textContent = "6" : key.textContent = ";"; break;
            case '"': this.properties.localisation ? key.textContent = "2" : key.textContent = "'"; break;
            case "<": key.textContent = ","; break;
            case ">": key.textContent = "."; break;
            case "/": key.textContent = "?"; break;

            case ",": this.properties.localisation ? key.textContent = "." : null; break;
            case ".": this.properties.localisation ? key.textContent = "," : null; break;

            case "Mute": key.textContent = "Mute"; break;
            case "Backspace": key.textContent = "Backspace"; break;
            case "CapsLock": key.textContent = "CapsLock"; break;
            case "Shift": key.textContent = "Shift"; break;
            case "Enter": key.textContent = "Enter"; break;
            case "EN": key.textContent = "EN"; break;
            case "RU": key.textContent = "RU"; break;
            default: this.properties.capsLock ? key.textContent = key.textContent.toUpperCase() : key.textContent = key.textContent.toLowerCase(); break;
          }
        }
      }
    }

  },

  _toggleLocalisation() {
    this.properties.localisation = !this.properties.localisation;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.localisation === true) {
          switch (key.textContent) {
            case "`": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "ё" : key.textContent = "Ё"; break;
            case "q": key.textContent = "й"; break;
            case "w": key.textContent = "ц"; break;
            case "e": key.textContent = "у"; break;
            case "r": key.textContent = "к"; break;
            case "t": key.textContent = "е"; break;
            case "y": key.textContent = "н"; break;
            case "u": key.textContent = "г"; break;
            case "i": key.textContent = "ш"; break;
            case "o": key.textContent = "щ"; break;
            case "p": key.textContent = "з"; break;
            case "[": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "х" : key.textContent = "Х"; break;
            case "]": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "ъ" : key.textContent = "Ъ"; break;

            case "a": key.textContent = "ф"; break;
            case "s": key.textContent = "ы"; break;
            case "d": key.textContent = "в"; break;
            case "f": key.textContent = "а"; break;
            case "g": key.textContent = "п"; break;
            case "h": key.textContent = "р"; break;
            case "j": key.textContent = "о"; break;
            case "k": key.textContent = "л"; break;
            case "l": key.textContent = "д"; break;
            case ";": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "ж" : key.textContent = "Ж"; break;
            case "'": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "э" : key.textContent = "Э"; break;

            case "z": key.textContent = "я"; break;
            case "x": key.textContent = "ч"; break;
            case "c": key.textContent = "с"; break;
            case "v": key.textContent = "м"; break;
            case "b": key.textContent = "и"; break;
            case "n": key.textContent = "т"; break;
            case "m": key.textContent = "ь"; break;
            case ",": if (!this.properties.shift) {!(this.properties.shift^this.properties.capsLock) ? key.textContent = "б" : key.textContent = "Б";}; break;
            case ".": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "ю" : key.textContent = "Ю"; break;
            case "?": key.textContent = "."; break;

            case "@": this.properties.shift ? key.textContent = '"' : null; break;
            case "#": this.properties.shift ? key.textContent = "№" : null; break;
            case "$": this.properties.shift ? key.textContent = ";" : null; break;
            case "^": this.properties.shift ? key.textContent = ":" : null; break;
            case "&": this.properties.shift ? key.textContent = "?" : null; break;

            // CAPS
            case "~": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Ё" : key.textContent = "ё"; break;
            case "Q": key.textContent = "Й"; break;
            case "W": key.textContent = "Ц"; break;
            case "E": key.textContent = "У"; break;
            case "R": key.textContent = "К"; break;
            case "T": key.textContent = "Е"; break;
            case "Y": key.textContent = "Н"; break;
            case "U": key.textContent = "Г"; break;
            case "I": key.textContent = "Ш"; break;
            case "O": key.textContent = "Щ"; break;
            case "P": key.textContent = "З"; break;
            case "{": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Х" : key.textContent = "х"; break;
            case "}": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Ъ" : key.textContent = "ъ"; break;

            case "A": key.textContent = "Ф"; break;
            case "S": key.textContent = "Ы"; break;
            case "D": key.textContent = "В"; break;
            case "F": key.textContent = "А"; break;
            case "G": key.textContent = "П"; break;
            case "H": key.textContent = "Р"; break;
            case "J": key.textContent = "О"; break;
            case "K": key.textContent = "Л"; break;
            case "L": key.textContent = "Д"; break;
            case ":": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Ж" : key.textContent = "ж"; break;
            case '"': !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Э" : key.textContent = "э"; break;

            case "Z": key.textContent = "Я"; break;
            case "X": key.textContent = "Ч"; break;
            case "C": key.textContent = "С"; break;
            case "V": key.textContent = "М"; break;
            case "B": key.textContent = "И"; break;
            case "N": key.textContent = "Т"; break;
            case "M": key.textContent = "Ь"; break;
            case "<": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Б" : key.textContent = "б"; break;
            case ">": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "Ю" : key.textContent = "ю"; break;
            case "/": key.textContent = ","; break;

            case "Mute": key.textContent = "Mute"; break;
            case "Backspace": key.textContent = "Backspace"; break;
            case "CapsLock": key.textContent = "CapsLock"; break;
            case "Shift": key.textContent = "Shift"; break;
            case "Enter": key.textContent = "Enter"; break;
            case "EN": key.textContent = "RU"; break;

            default: this.properties.capsLock ? key.textContent = key.textContent.toLowerCase() : key.textContent = key.textContent.toUpperCase(); break;
          };
        } else {
          switch (key.textContent) {
            case "ё": this.properties.shift ? key.textContent = "~" : key.textContent = "`"; break;
            case "й": key.textContent = "q"; break;
            case "ц": key.textContent = "w"; break;
            case "у": key.textContent = "e"; break;
            case "к": key.textContent = "r"; break;
            case "е": key.textContent = "t"; break;
            case "н": key.textContent = "y"; break;
            case "г": key.textContent = "u"; break;
            case "ш": key.textContent = "i"; break;
            case "щ": key.textContent = "o"; break;
            case "з": key.textContent = "p"; break;
            case "х": this.properties.shift ? key.textContent = "{" : key.textContent = "["; break;
            case "ъ": this.properties.shift ? key.textContent = "}" : key.textContent = "]"; break;

            case "ф": key.textContent = "a"; break;
            case "ы": key.textContent = "s"; break;
            case "в": key.textContent = "d"; break;
            case "а": key.textContent = "f"; break;
            case "п": key.textContent = "g"; break;
            case "р": key.textContent = "h"; break;
            case "о": key.textContent = "j"; break;
            case "л": key.textContent = "k"; break;
            case "д": key.textContent = "l"; break;
            case "ж": this.properties.shift ? key.textContent = ":" : key.textContent = ";"; break;
            case "э": this.properties.shift ? key.textContent = '"' : key.textContent = "'"; break;

            case "я": key.textContent = "z"; break;
            case "ч": key.textContent = "x"; break;
            case "с": key.textContent = "c"; break;
            case "м": key.textContent = "v"; break;
            case "и": key.textContent = "b"; break;
            case "т": key.textContent = "n"; break;
            case "ь": key.textContent = "m"; break;
            case "б": this.properties.shift ? key.textContent = "<" : key.textContent = ","; break;
            case "ю": this.properties.shift ? key.textContent = ">" : key.textContent = "."; break;
            case ".": this.properties.shift ? key.textContent = "/" : key.textContent = "?"; break;

            case '"': this.properties.shift ? key.textContent = "@" : null; break;
            case "№": this.properties.shift ? key.textContent = "#" : null; break;
            case ";": this.properties.shift ? key.textContent = "$" : null; break;
            case ":": this.properties.shift ? key.textContent = "^" : null; break;
            case "?": this.properties.shift ? key.textContent = "&" : null; break;

            //CAPS
            case "Ё": this.properties.shift ? key.textContent = "~" : key.textContent = "`"; break;
            case "Й": key.textContent = "Q"; break;
            case "Ц": key.textContent = "W"; break;
            case "У": key.textContent = "E"; break;
            case "К": key.textContent = "R"; break;
            case "Е": key.textContent = "T"; break;
            case "Н": key.textContent = "Y"; break;
            case "Г": key.textContent = "U"; break;
            case "Ш": key.textContent = "I"; break;
            case "Щ": key.textContent = "O"; break;
            case "З": key.textContent = "P"; break;
            case "Х": this.properties.shift ? key.textContent = "{" : key.textContent = "["; break;
            case "Ъ": this.properties.shift ? key.textContent = "}" : key.textContent = "]"; break;

            case "Ф": key.textContent = "A"; break;
            case "Ы": key.textContent = "S"; break;
            case "В": key.textContent = "D"; break;
            case "А": key.textContent = "F"; break;
            case "П": key.textContent = "G"; break;
            case "Р": key.textContent = "H"; break;
            case "О": key.textContent = "J"; break;
            case "Л": key.textContent = "K"; break;
            case "Д": key.textContent = "L"; break;
            case "Ж": this.properties.shift ? key.textContent = ":" : key.textContent = ";"; break;
            case "Э": this.properties.shift ? key.textContent = '"' : key.textContent = "'"; break;

            case "Я": key.textContent = "Z"; break;
            case "Ч": key.textContent = "X"; break;
            case "С": key.textContent = "C"; break;
            case "М": key.textContent = "V"; break;
            case "И": key.textContent = "B"; break;
            case "Т": key.textContent = "N"; break;
            case "Ь": key.textContent = "M"; break;
            case "Б": this.properties.shift ? key.textContent = "<" : key.textContent = ","; break;
            case "Ю": this.properties.shift ? key.textContent = ">" : key.textContent = "."; break;
            case ",": this.properties.shift ? key.textContent = "/" : key.textContent = "?"; break;

            case "Mute": key.textContent = "Mute"; break;
            case "Backspace": key.textContent = "Backspace"; break;
            case "CapsLock": key.textContent = "CapsLock"; break;
            case "Shift": key.textContent = "Shift"; break;
            case "Enter": key.textContent = "Enter"; break;
            case "RU": key.textContent = "EN"; break;
            default: this.properties.capsLock ? key.textContent = key.textContent.toUpperCase() : key.textContent = key.textContent.toLowerCase(); break;
          }
        }
      }
    }

  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

document.querySelectorAll(".keyboard__keys").forEach(element => {
  element.addEventListener("click", () => {console.log('here'); document.getElementById("myTextField").focus();});
});

document.querySelectorAll(".use-keyboard-input").forEach(element => {
  element.addEventListener("keydown", setKeydownColor);
});

function setKeydownColor(e) {
  document.querySelectorAll(".keyboard__key").forEach(element => {
    if (element.textContent.toLowerCase() === e.key.toLowerCase()) {
      if (e.key.toLowerCase() === 'shift') {
        if (!Keyboard.properties.shift) {
          Keyboard._toggleShift();
          element.classList.toggle("keyboard__key--active");
          element.classList.toggle("keyboard__key--press-active");
        }
      } else {
        element.classList.toggle("keyboard__key--press-active");
        if (e.key.toLowerCase() === 'capslock') {
        Keyboard._toggleCapsLock();
        element.classList.toggle("keyboard__key--active");
        }
      }
    }
  });
};

document.querySelectorAll(".use-keyboard-input").forEach(element => {
  element.addEventListener("keyup", setKeyupColor);
});

function setKeyupColor(e) {
  document.querySelectorAll(".keyboard__key").forEach(element => {
    if (element.textContent.toLowerCase() === e.key.toLowerCase()) {
      element.classList.remove("keyboard__key--press-active");
      if (e.key.toLowerCase() === 'shift') {
        Keyboard._toggleShift();
        element.classList.remove("keyboard__key--active");
      }
    }
  });
};

function soundClick(s) {
  let audio = new Audio();
  audio.src = s;
  audio.autoplay = true;
}

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});


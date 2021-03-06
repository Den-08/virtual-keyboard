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
      "??", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "??", "??", "??", "??", "??", "??", "??", "??", "??", "??", "??", "??",
      "caps", "??", "??", "??", "??", "??", "??", "??", "??", "??", "??", "??",
      "shift", "??", "??", "??", "??", "??", "??", "??", "??", "??", ".", "enter",
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
            case "3": this.properties.localisation ? key.textContent = "???" : key.textContent = "#"; break;
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

            case "???" : key.textContent = "3"; break;
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
            case "`": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case "q": key.textContent = "??"; break;
            case "w": key.textContent = "??"; break;
            case "e": key.textContent = "??"; break;
            case "r": key.textContent = "??"; break;
            case "t": key.textContent = "??"; break;
            case "y": key.textContent = "??"; break;
            case "u": key.textContent = "??"; break;
            case "i": key.textContent = "??"; break;
            case "o": key.textContent = "??"; break;
            case "p": key.textContent = "??"; break;
            case "[": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case "]": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;

            case "a": key.textContent = "??"; break;
            case "s": key.textContent = "??"; break;
            case "d": key.textContent = "??"; break;
            case "f": key.textContent = "??"; break;
            case "g": key.textContent = "??"; break;
            case "h": key.textContent = "??"; break;
            case "j": key.textContent = "??"; break;
            case "k": key.textContent = "??"; break;
            case "l": key.textContent = "??"; break;
            case ";": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case "'": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;

            case "z": key.textContent = "??"; break;
            case "x": key.textContent = "??"; break;
            case "c": key.textContent = "??"; break;
            case "v": key.textContent = "??"; break;
            case "b": key.textContent = "??"; break;
            case "n": key.textContent = "??"; break;
            case "m": key.textContent = "??"; break;
            case ",": if (!this.properties.shift) {!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??";}; break;
            case ".": !(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case "?": key.textContent = "."; break;

            case "@": this.properties.shift ? key.textContent = '"' : null; break;
            case "#": this.properties.shift ? key.textContent = "???" : null; break;
            case "$": this.properties.shift ? key.textContent = ";" : null; break;
            case "^": this.properties.shift ? key.textContent = ":" : null; break;
            case "&": this.properties.shift ? key.textContent = "?" : null; break;

            // CAPS
            case "~": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case "Q": key.textContent = "??"; break;
            case "W": key.textContent = "??"; break;
            case "E": key.textContent = "??"; break;
            case "R": key.textContent = "??"; break;
            case "T": key.textContent = "??"; break;
            case "Y": key.textContent = "??"; break;
            case "U": key.textContent = "??"; break;
            case "I": key.textContent = "??"; break;
            case "O": key.textContent = "??"; break;
            case "P": key.textContent = "??"; break;
            case "{": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case "}": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;

            case "A": key.textContent = "??"; break;
            case "S": key.textContent = "??"; break;
            case "D": key.textContent = "??"; break;
            case "F": key.textContent = "??"; break;
            case "G": key.textContent = "??"; break;
            case "H": key.textContent = "??"; break;
            case "J": key.textContent = "??"; break;
            case "K": key.textContent = "??"; break;
            case "L": key.textContent = "??"; break;
            case ":": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case '"': !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;

            case "Z": key.textContent = "??"; break;
            case "X": key.textContent = "??"; break;
            case "C": key.textContent = "??"; break;
            case "V": key.textContent = "??"; break;
            case "B": key.textContent = "??"; break;
            case "N": key.textContent = "??"; break;
            case "M": key.textContent = "??"; break;
            case "<": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
            case ">": !!(this.properties.shift^this.properties.capsLock) ? key.textContent = "??" : key.textContent = "??"; break;
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
            case "??": this.properties.shift ? key.textContent = "~" : key.textContent = "`"; break;
            case "??": key.textContent = "q"; break;
            case "??": key.textContent = "w"; break;
            case "??": key.textContent = "e"; break;
            case "??": key.textContent = "r"; break;
            case "??": key.textContent = "t"; break;
            case "??": key.textContent = "y"; break;
            case "??": key.textContent = "u"; break;
            case "??": key.textContent = "i"; break;
            case "??": key.textContent = "o"; break;
            case "??": key.textContent = "p"; break;
            case "??": this.properties.shift ? key.textContent = "{" : key.textContent = "["; break;
            case "??": this.properties.shift ? key.textContent = "}" : key.textContent = "]"; break;

            case "??": key.textContent = "a"; break;
            case "??": key.textContent = "s"; break;
            case "??": key.textContent = "d"; break;
            case "??": key.textContent = "f"; break;
            case "??": key.textContent = "g"; break;
            case "??": key.textContent = "h"; break;
            case "??": key.textContent = "j"; break;
            case "??": key.textContent = "k"; break;
            case "??": key.textContent = "l"; break;
            case "??": this.properties.shift ? key.textContent = ":" : key.textContent = ";"; break;
            case "??": this.properties.shift ? key.textContent = '"' : key.textContent = "'"; break;

            case "??": key.textContent = "z"; break;
            case "??": key.textContent = "x"; break;
            case "??": key.textContent = "c"; break;
            case "??": key.textContent = "v"; break;
            case "??": key.textContent = "b"; break;
            case "??": key.textContent = "n"; break;
            case "??": key.textContent = "m"; break;
            case "??": this.properties.shift ? key.textContent = "<" : key.textContent = ","; break;
            case "??": this.properties.shift ? key.textContent = ">" : key.textContent = "."; break;
            case ".": this.properties.shift ? key.textContent = "/" : key.textContent = "?"; break;

            case '"': this.properties.shift ? key.textContent = "@" : null; break;
            case "???": this.properties.shift ? key.textContent = "#" : null; break;
            case ";": this.properties.shift ? key.textContent = "$" : null; break;
            case ":": this.properties.shift ? key.textContent = "^" : null; break;
            case "?": this.properties.shift ? key.textContent = "&" : null; break;

            //CAPS
            case "??": this.properties.shift ? key.textContent = "~" : key.textContent = "`"; break;
            case "??": key.textContent = "Q"; break;
            case "??": key.textContent = "W"; break;
            case "??": key.textContent = "E"; break;
            case "??": key.textContent = "R"; break;
            case "??": key.textContent = "T"; break;
            case "??": key.textContent = "Y"; break;
            case "??": key.textContent = "U"; break;
            case "??": key.textContent = "I"; break;
            case "??": key.textContent = "O"; break;
            case "??": key.textContent = "P"; break;
            case "??": this.properties.shift ? key.textContent = "{" : key.textContent = "["; break;
            case "??": this.properties.shift ? key.textContent = "}" : key.textContent = "]"; break;

            case "??": key.textContent = "A"; break;
            case "??": key.textContent = "S"; break;
            case "??": key.textContent = "D"; break;
            case "??": key.textContent = "F"; break;
            case "??": key.textContent = "G"; break;
            case "??": key.textContent = "H"; break;
            case "??": key.textContent = "J"; break;
            case "??": key.textContent = "K"; break;
            case "??": key.textContent = "L"; break;
            case "??": this.properties.shift ? key.textContent = ":" : key.textContent = ";"; break;
            case "??": this.properties.shift ? key.textContent = '"' : key.textContent = "'"; break;

            case "??": key.textContent = "Z"; break;
            case "??": key.textContent = "X"; break;
            case "??": key.textContent = "C"; break;
            case "??": key.textContent = "V"; break;
            case "??": key.textContent = "B"; break;
            case "??": key.textContent = "N"; break;
            case "??": key.textContent = "M"; break;
            case "??": this.properties.shift ? key.textContent = "<" : key.textContent = ","; break;
            case "??": this.properties.shift ? key.textContent = ">" : key.textContent = "."; break;
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


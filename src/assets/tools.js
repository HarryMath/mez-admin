class Notification {
  messageElement;
  interval;

  constructor() {
    this.messageElement = document.createElement('div');
    this.messageElement.className = 'notification unselectable';
    this.messageElement.innerHTML = `<div></div><div class="closer" onclick="message.hide()">×</div>`;
    document.body.appendChild(this.messageElement);
  }

  show(message, status) {
    this.messageElement.querySelector('div').innerHTML = message;
    if ( status === -1) {
      try {
        window.navigator.vibrate(30);
      } catch (e) {
        console.log(e);
      }
    }
    this.messageElement.classList.add('visible');
    this.interval = window.setInterval(() => {
      this.hide();
    }, 6000)
  }

  hide() {
    clearInterval(this.interval);
    this.messageElement.classList.remove('visible');
  }
}

window.message = new Notification();

window.goTo = function (elementId) {
  try {
    document.getElementById(elementId).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  } catch (e) {
    console.log('element not found')
  }
}

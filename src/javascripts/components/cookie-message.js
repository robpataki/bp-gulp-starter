'use strict';

// Vendor imports
import { TweenMax } from 'gsap';

// Module imports

export default class CookieMessage {
  constructor(options) {
    if (options && options.reset) {
      localStorage.setItem('cookie-dismissed', 'false');
    }

    this.$el = document.querySelector('.cookie-message');
    this.messageDismissed = localStorage.getItem('cookie-dismissed') === 'true';

    if (!this.messageDismissed && this.$el !== null) {
      this.$agreeButton = document.querySelector('#cookieAgreeButton');
      this.$agreeButton.addEventListener('click', _.bind(this._handleAgreeButtonClick, this), { once: true });
      this.$el.classList.remove('is-hidden');
    } else {
      if (this.$el !== null) {
        this._removeEl();
      }
    }

    return this;
  }




////////////////////////////////////
/////// Public methods
////////////////



////////////////////////////////////
/////// Private methods
////////////////

  _handleAgreeButtonClick(e) {
    e.preventDefault();

    localStorage.setItem('cookie-dismissed', 'true');
    this.messageDismissed = true;

    TweenMax.to(this.$el, 0.9, {
      alpha: 0,
      ease: Expo.easeOut,
      onComplete: _.bind(this._removeEl, this)
    })
  }

  _removeEl() {
    this.$el.parentNode.removeChild(this.$el);
    this.$el = undefined;
  }
}
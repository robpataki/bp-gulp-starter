'use strict';

// Vendor imports
import { TweenMax } from 'gsap';

// Module imports


// Singleton innit
var instance = null;

export default class WindowScroller {
  constructor() {
    if (!instance) {
      instance = this;
      this._initTriggers();
    }

    return instance;
  }




////////////////////////////////////
/////// Private methods
////////////////

  /*
    * Generic init - hook up the ws-triggers
  */
  _initTriggers() {
    this.triggers = [];
    $('.ws-trigger').each(_.bind(function(index, el) {
      const $el = $(el);

      if (typeof $el.attr('data-ws-el') !== 'undefined') {
        const selector = $el.attr('data-ws-el');
        const duration = $el.attr('data-ws-duration') || 0.9;
        
        let $targetEl = $(document).find(`#${selector}`);

        if (!$targetEl || !$targetEl.length) {
          $targetEl = $(document).find(`.${selector}`);
        }

        if (!$targetEl || !$targetEl.length) {
          $el.addClass('ws-trigger--invalid');
        } else {
          this.triggers.push({
            $el: $el,
            topPos: $targetEl.offset().top,
            duration: duration
          });
        }
      } else {
        $el.addClass('ws-trigger--invalid');
      }
    }, this));

    _.each(this.triggers, _.bind(function(trigger, index) {
      trigger.$el.on('click tap', _.bind(function(e) {
        e.preventDefault();
        this.scrollWindowToPosition(trigger.topPos, trigger.duration);
      }, this));
    }, this));
  }

  /*
    * Init the mobile and desktop 'scroll to top' buttons
  */
  _initResets() {
    this.$el = $('.window-scroller');
    this.$button = this.$el.find('.window-scroller__button');
    this.$button.on('click tap', _.bind(this._handleButtonClick, this));

    this.$mobileButton = $('.window-scroller__button--mobile');
    this.$mobileButton.on('click tap', _.bind(this._handleButtonClick, this));

    $(window).on('scroll', _.bind(this._handleScroll, this));

    this.hidden = true;
    this._handleScroll();

    return this;
  }

  _handleButtonClick(e) {
    e.preventDefault();

    var maxScrollDistance = $(document).height() - $(window).innerHeight();
    var distance = $(window).scrollTop();
    var duration = 1.2 * distance / maxScrollDistance;

    this.scrollWindowToPosition(0, duration);
  }

  _handleScroll(e) {
    var scrollTop = $(window).scrollTop();

    if (scrollTop > 250) {
      if (this.hidden) {
        this._showButton();
        this.hidden = false;
      }
    } else {
      if (!this.hidden) {
        this._hideButton();
        this.hidden = true;
      }
    }
  }

  _showButton() {
    TweenMax.set(this.$el, { y: 20 });

    TweenMax.to(this.$el, 0.5, {
      alpha: 1,
      y: 0,
      ease: Expo.easeOut,
      onStart: _.bind(function(){
        this.$el.removeClass('is-hidden');
      }, this)
    });
  }

  _hideButton() {
    TweenMax.to(this.$el, 0.3, {
      alpha: 0,
      y: 20,
      ease: Strong.easeOut,
      onComplete: _.bind(function(){
        this.$el.addClass('is-hidden');
      }, this)
    });
  }


////////////////////////////////////
/////// Public methods
////////////////

  resetScrollTop() {
    setTimeout(function(){
      $(window).scrollTop(0);
    }, 100);
  }

  scrollWindowToPosition(posY = 100, duration = 2.4) {
    var obj = {
      y: window.pageYOffset
    };

    if (duration < 0.9) {
      duration = 0.9;
    }

    TweenMax.to(obj, duration, {
      y: posY,
      ease: Strong.easeOut,
      onUpdate: _.bind(function(){
        $(window).scrollTop(obj.y);
      }, this)
    });
  }
}
'use strict';

// Vendor imports
import { TimelineMax, TweenMax, Linear } from 'gsap';
import $ from 'jquery';
import _ from 'lodash';
import Hammer from 'hammer';

const PERCENTAGE = 102;

export default class Carousel {
  constructor() {
    this._init();

    return this;
  }

  _init() {
    this.$el = $('.carousel');
    
    if (this.$el && this.$el.length) {
      this.$nav = this.$el.find('.carousel__nav');
      this.$foreground = this.$el.find('.carousel__foreground');
      this.$prevButton = this.$nav.find('.carousel__nav-button--prev');
      this.$nextButton = this.$nav.find('.carousel__nav-button--next');
      this.$slidesContainer = this.$el.find('.carousel-items');
      this.$wrapper = this.$el.find('.carousel-items-wrapper');

      this.$slides = this.$el.find('.carousel-item');
      this._resetSlides();

      this.$prevButton.on('click tap', _.bind(this._handlePrevButtonClick, this));
      this.$nextButton.on('click tap', _.bind(this._handleNextButtonClick, this));

      this.hammer = new Hammer(this.$foreground[0]);
      this.hammer.on('swipeleft', _.bind(this._handleSwipeLeft, this));
      this.hammer.on('swiperight', _.bind(this._handleSwipeRight, this));

      $(window).on('keyup', _.bind(this._handleKeyUp, this));
    }
  }

  _resetSlides() {
    this.totalSlides = this.$slides.length;
    this._updateSlideIndexes();

    this.$slides.each(_.bind(function(index, el) {
      const $slide = $(el);

      TweenMax.set($slide, {
        opacity: 0.75,
        x: index * PERCENTAGE + '%',
        z: -100
      });
    }, this));

    /*TweenMax.set(this.$slidesContainer, {
      x: -1 * this.currentSlide * PERCENTAGE + '%',
    });*/

    setTimeout(_.bind(function(){
      TweenMax.to(this.$wrapper, 0.3, {
        opacity: 1,
        ease: Quart.easeOut
      });
      this._slide();
    }, this), 500);
  }

  _updateSlideIndexes(previousSlide, currentSlide) {
    if (typeof previousSlide === 'undefined' || typeof currentSlide === 'undefined') {
      currentSlide = 1;
      previousSlide = 0;
    }

    this.currentSlide = currentSlide;
    this.$currentSlide = $(this.$slides[this.currentSlide]);

    this.previousSlide = previousSlide;
    this.$previousSlide = $(this.$slides[this.previousSlide]);

    this._updateButtons();
  }

  _updateButtons() {
    this.$prevButton.removeClass('is-active');
    this.$nextButton.removeClass('is-active');

    if (this.currentSlide > 0) {
      this.$prevButton.addClass('is-active');
    } if (this.currentSlide < this.totalSlides - 1) {
      this.$nextButton.addClass('is-active');
    }
  }

  _handleSwipeLeft() {
    this.$nextButton.addClass('clicked');
    setTimeout(_.bind(function(){
      this.$nextButton.removeClass('clicked');
    }, this), 200);
    this._handleNextButtonClick();
  }

  _handleSwipeRight() {
    this.$prevButton.addClass('clicked');
    setTimeout(_.bind(function(){
      this.$prevButton.removeClass('clicked');
    }, this), 200);
    this._handlePrevButtonClick();
  }

  _handlePrevButtonClick() {
    if (this.$prevButton.hasClass('is-active')) {
      let currentSlide = this.currentSlide;
      const previousSlide = this.currentSlide;

      if (currentSlide > 0) {
        --currentSlide;
      } else {
        currentSlide = this.totalSlides - 1;
      }

      this._updateSlideIndexes(previousSlide, currentSlide);
      this._slide();
    }
  }

  _handleNextButtonClick() {
    if (this.$nextButton.hasClass('is-active')) {
      let currentSlide = this.currentSlide;
      const previousSlide = this.currentSlide;

      if (currentSlide + 1 < this.totalSlides) {
        ++currentSlide;
      } else {
        currentSlide = 0;
      }

      this._updateSlideIndexes(previousSlide, currentSlide);
      this._slide();
    }
  }

  _handleKeyUp(e) {
    if (e.keyCode === 37) {
      this._handlePrevButtonClick();
    } else if (e.keyCode === 39) {
      this._handleNextButtonClick();
    }
  }

  _slide() {
    const tl = new TimelineMax();
    tl.to(this.$slidesContainer, 0.8, {
      x: -1 * this.currentSlide * PERCENTAGE + '%',
      ease: Quart.easeOut
    }, 'anim');

    tl.to(this.$previousSlide, 0.6, {
      opacity: 0.6,
      z: -100,
      ease: Strong.easeOut
    }, 'anim');

    tl.to(this.$currentSlide, 0.3, {
      opacity: 1,
      z: 0,
      ease: Strong.easeOut
    }, 'anim+=0.1');

    this.$previousSlide.removeClass('is-active');
    this.$currentSlide.addClass('is-active');
  }
}
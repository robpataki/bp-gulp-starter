'use strict';

// Vendor imports
import { TweenMax } from 'gsap';
import $ from 'jquery';
import _ from 'lodash';

// Module imports
const BREWSER = require('brewser/dist/brewser.min').br;

import json from '../../html/data/global.json';

// Singleton innit
var instance = null;

export default class VideoOverlay {
  constructor() {
    if (!instance) {
      instance = this;
      this._init();
    }

    return instance;
  }





////////////////////////////////////
/////// Private methods
////////////////

  _init() {
    const icon = `${json.doc_root}/images/icon__x-white.svg`;
    const dom =  `<div class="video-overlay is-hidden">
                  <div class="close-screen-button">
                    <span class="sprite -x-white icon" aria-hidden="true">
                      <img src="${icon}" width="60" height="60"/>
                    </span>
                  </div>
                  <div class="video-overlay__background"></div>
                    <div class="video-overlay__embed-wrapper">
                      <iframe src="" data-src="" data-type="" width="1920" height="1080" frameborder="0" allowfullscreen></iframe>
                    </div>
                  </div>
                </div>`;

    this.$el = $(dom);
    $('body').append(this.$el);
    
    this.$bg = this.$el.find('.video-overlay__background');
    this.$embedWrapper = this.$el.find('.video-overlay__embed-wrapper');
    this.$iframe = this.$el.find('iframe');
    this.$closeButton = this.$el.find('.close-screen-button');

    this._initTriggers();

    this._reset();
  }

  
  _initTriggers() {
    this.triggers = [];
    $('.vo-trigger').each(_.bind(function(index, el) {
      if (typeof $(el).attr('data-vo-id') !== 'undefined' && typeof $(el).attr('data-vo-type') !== 'undefined') {
        this.triggers.push({
          $el: $(el),
          id: $(el).attr('data-vo-id'),
          type: $(el).attr('data-vo-type'),
          width: $(el).attr('data-vo-width'),
          height: $(el).attr('data-vo-height')
        });
      } else {
        $(el).addClass('vo-trigger--invalid');
      }
    }, this));

    _.each(this.triggers, _.bind(function(trigger, index) {
      trigger.$el.on('click tap', _.bind(function(e) {
        e.preventDefault();
        this._open(trigger.id, trigger.type);
      }, this));
    }, this));
  }


  _reset () {
    TweenMax.set(this.$closeButton, {
      opacity: 0,
      rotationZ: -180,
    });

    TweenMax.set(this.$bg, { opacity: 0 });
    this.$el.addClass('is-hidden');
    $('html').removeClass('is-video-overlay-open');

    this.$embedWrapper.hide();
    TweenMax.set(this.$embedWrapper, {
      opacity: 0,
      y: 20
    });

    this.$iframe.attr('src', '');
  }

  
  _setupIframe(videoID, embedType) {
    let iframeSource = `//player.vimeo.com/video/${videoID}?&badge=0&byline=0&title=0&loop=0&autoplay=1`;
    if(embedType  === VideoOverlay.EmbedTypes.YOUTUBE) {
      iframeSource = `//youtube.com/embed/${videoID}?&rel=0&showinfo=0&loop=0&autoplay=1&controls=1`;
    }

    this.$iframe.attr('src', iframeSource);
  }

  
  _open (id, type) {
    this.resize();

    $(window).on('keyup', _.bind(this._handleKeyUp, this));

    this.$el.removeClass('is-hidden');
    $('html').addClass('is-video-overlay-open');

    TweenMax.to(this.$bg, 0.9, {
      opacity: 1,
      ease: Strong.easeOut
    });

    this.$bg.one('click tap', _.bind(function() {
      this._close();
    }, this));

    TweenMax.to(this.$closeButton, 1.2, {
      opacity: 1,
      rotationZ: 0,
      ease: Strong.easeInOut,
      delay: 0
    });
    this.$closeButton.one('click tap', _.bind(this._handleCloseButtonClick, this));

    TweenMax.to(this.$embedWrapper, 0.9, {
      opacity: 1,
      y: 0,
      ease: Strong.easeInOut,
      onStart: _.bind(function() {
        this.$embedWrapper.show();
      }, this),
      onComplete: _.bind(function() {
        this._setupIframe(id, type);
      }, this)
    });
  }

  
  _close () {
    $(window).off('keyup', _.bind(this._handleKeyUp, this));

    TweenMax.to(this.$closeButton, 0.9, {
      opacity: 0,
      rotationZ: 180,
      ease: Strong.easeOut,
    });
    
    TweenMax.to(this.$embedWrapper, 0.6, {
      opacity: 0,
      y: 20,
      ease: Strong.easeInOut
    });

    TweenMax.to(this.$bg, 0.4, {
      opacity: 0,
      delay: 0.3,
      ease: Strong.easeOut,
      onComplete: _.bind(function(){
        this._reset();
      }, this)
    });
  }

  _handleCloseButtonClick(e) {
    $('html').removeClass('is-video-overlay-open');
    this._close();
  }

  _handleKeyUp(e) {
    if (e.keyCode === 27) {
      this._close();
    }
  }



////////////////////////////////////
/////// Public methods
////////////////

  resize() {
    const winWidth = BREWSER.windowWidth;
    const winHeight = BREWSER.windowHeight;
    const screenWidth = BREWSER.screenWidth;
    const screenHeight = BREWSER.screenHeight;

    this.cachedWinWidth = winWidth;
    this.cachedWinHeight = winHeight;

    var boxWidth = BREWSER.device.touch ? screenWidth : winWidth;
    var boxHeight = BREWSER.device.touch ? screenHeight : winHeight;

    // Resize EMBEDDED VIDEO
    var minElWidth = 480;
    var minElHeight = 270;
    if(BREWSER.device.phone && winWidth <= 400) {
      minElWidth = 280;
      minElHeight = 156;
    }

    // Resize the video to fit within the box of the window with 100px padding around the edges and keeping the aspect ratio
    VideoOverlay.containInBox({
      $el: this.$embedWrapper,
      elWidth: VideoOverlay.VideoDimensions.WIDTH,
      elHeight: VideoOverlay.VideoDimensions.HEIGHT,
      boxWidth: boxWidth,
      boxHeight: boxHeight,
      minElWidth: minElWidth,
      minElHeight: minElHeight,
      padding: 100
    });
  }




////////////////////////////////////
/////// Event handlers
////////////////

 
}





////////////////////////////////////
/////// Static class vars
////////////////

/**
 * Resize media to contain within the box
 *
 * @param {Object}  options
 * @param {Number}  options.$el             The element to be resized
 * @param {Number}  options.elWidth         The original width of the media
 * @param {Number}  options.elHeight        The original height of the media
 * @param {Boolean} options.boxWidth        The width of the box
 * @param {Boolean} options.boxHeight       The height of the box
 * @param {Boolean} options.padding         Padding
 * @param {Boolean} options.scale           Adds extra scale
*/
VideoOverlay.containInBox = function(options) {
  if(!_.size(options)) {
    console.error('[VideoOverlay] - containInBox() - missing some arguments for proper resize, quitting.');
    return;
  }
  
  // Calculate the image dimensions based on the window dimensions
  var $el = options.$el;
  var scale = options.scale || 1;
  var naturalWidth = options.elWidth;
  var naturalHeight = options.elHeight;
  var padding = options.padding || 0;
  var boxWidth = options.boxWidth - padding * 2;
  var boxHeight = options.boxHeight - padding * 2;
  var elWidth = Math.ceil(boxWidth);
  var dimensionRatio = naturalWidth / naturalHeight;
  var elHeight = Math.ceil(boxWidth / dimensionRatio);

  var minElWidth = options.minElWidth || 480;
  var minElHeight = options.minElHeight || 270;

  if(elHeight > boxHeight) {
    elHeight = Math.ceil(boxHeight);
    elWidth = Math.ceil(elHeight * dimensionRatio);
  }

  // Multiply the calculated values (to cover off gaps around edges for instance)
  elWidth *= scale;
  elHeight *= scale;

  if(elWidth < minElWidth || elHeight < minElHeight) {
    elWidth = minElWidth;
    elHeight = minElHeight;
  }

  elWidth = Math.round(elWidth);
  elHeight = Math.round(elHeight);

  $el.css({
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'width': elWidth,
    'height': elHeight,
    'margin-top': Math.round(elHeight * -0.5),
    'margin-left': Math.round(elWidth * -0.5)
  });
}


/**
 * Resize media to cover the box (like background-size: cover)
 *
 * @param {Object}  options
 * @param {Number}  options.$el             The element to be resized
 * @param {Number}  options.elWidth         The original width of the media
 * @param {Number}  options.elHeight        The original height of the media
 * @param {Boolean} options.boxWidth        The width of the box
 * @param {Boolean} options.boxHeight       The height of the box
 * @param {Boolean} options.padding         Padding
 * @param {Boolean} options.scale           Adds extra scale
*/
VideoOverlay.fitToBox = function(options) {
  if(!_.size(options)) {
    console.error('[VideoOverlay] - fitToBox() - missing some arguments for proper resize, quitting.');
    return;
  }
  
  // Calculate the image dimensions based on the window dimensions
  var $el = options.$el;
  var scale = options.scale || 1;
  var naturalWidth = options.elWidth;
  var naturalHeight = options.elHeight;
  var padding = options.padding || 0;
  var boxWidth = options.boxWidth - padding * 2;
  var boxHeight = options.boxHeight - padding * 2;
  var elWidth = Math.ceil(boxWidth);
  var dimensionRatio = naturalWidth / naturalHeight;
  var elHeight = Math.ceil(elWidth / dimensionRatio);

  if(boxWidth / boxHeight < dimensionRatio) {
    elHeight = Math.ceil(boxHeight);
    elWidth = Math.ceil(elHeight * dimensionRatio);
  }

  // Multiply the calculated values (to cover off gaps around edges for instance)
  elWidth *= scale;
  elHeight *= scale;

  elWidth = Math.round(elWidth);
  elHeight = Math.round(elHeight);

  $el.css({
    'position': 'absolute',
    'top': '50%',
    'left': '50%',
    'width': elWidth,
    'height': elHeight,
    'margin-top': Math.round(elHeight * -0.5),
    'margin-left': Math.round(elWidth * -0.5)
  });
}




//
VideoOverlay.EmbedTypes = {
  VIMEO: 'vimeo',
  YOUTUBE: 'youtube'
};

VideoOverlay.VideoDimensions = {
    WIDTH: 1920,
    HEIGHT: 1080
  };
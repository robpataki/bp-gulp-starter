'use strict';

// Vendor imports
import { TweenMax } from 'gsap';
const BREWSER = require('brewser/dist/brewser.min').br;

import SocialSharingButtons from 'social-sharing-buttons';
import VideoOverlay from 'video-overlay';
import RPMenu from 'rp-menu';

// Module imports

export default class MCP {
  constructor(app) {
    if (!app) {
      console.error('[MCP] - `app` is required!');
      return;
    }

    this.app = app;

    this._initUI();

    // this._resetScrollTop();

    $(window).on(MCP.Events.RESIZE, _.bind(this._handleResize, this));
    this._handleResize();
  }





////////////////////////////////////
/////// Private methods
////////////////
  _initUI() {
    // Responsive menu (only an example, will be removed)
    this.rpMenu = new RPMenu();

    // Social sharing buttons
    this.socialSharingButtons = new SocialSharingButtons();

    // Video overlay
    this.videoOverlay = new VideoOverlay();
  }


  _resetScrollTop() {
    setTimeout(function(){
      $(window).scrollTop(0);
    }, 100);
  }

  _scrollWindowToPosition(posY = 100, duration = 2.4) {
    var obj = {
      y: window.pageYOffset
    };

    TweenMax.to(obj, duration, {
      y: posY,
      ease: Strong.easeInOut,
      onUpdate: _.bind(function(){
        $(window).scrollTop(obj.y);
      }, this)
    });
  }





////////////////////////////////////
/////// Event handlers
////////////////

  _handleResize(e) {
    $(this.eventDispatcher).trigger(MCP.Events.RESIZE);

    if(this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);        
    }

    // Resize the video overlay
    if (this.videoOverlay) {
      this.videoOverlay.resize();
    }

    this._resizeTimeout = setTimeout(_.bind(this._handleDelayedResize, this), MCP.RESIZE_DELAY);
  }

  _handleDelayedResize(e) {
    $(this.eventDispatcher).trigger(MCP.Events.DELAYED_RESIZE);
  }
}





////////////////////////////////////
/////// Static class vars
////////////////

// Events
MCP.Events = {
  RESIZE: 'resize',
  DELAYED_RESIZE: 'debouncedResize',
};

MCP.RESIZE_DELAY = 500;
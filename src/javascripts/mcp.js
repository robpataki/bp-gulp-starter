'use strict';

// Vendor imports
const BREWSER = require('brewser/dist/brewser.min').br;
import RPMenu from 'rp-menu';

// Component imports
import SocialSharingButtons from 'social-sharing-buttons';
import VideoOverlay from 'video-overlay';
import WindowScroller from 'window-scroller';
import CookieMessage from 'cookie-message';
import Carousel from 'carousel';
// import SideNav from 'side-nav';
// import SubNav from 'sub-nav';
// import Form from 'form';

// Module imports
export default class MCP {
  constructor(app) {
    if (!app) {
      console.error('[MCP] - `app` is required!');
      return;
    }

    this.app = app;

    this._init();
  }





////////////////////////////////////
/////// Private methods
////////////////
  _init() {
    // Cookie message
    this.cookieMessage = new CookieMessage({ reset: true });

    
    // Window scroller
    this.windowScroller = new WindowScroller();

    
    // Video overlay
    this.videoOverlay = new VideoOverlay();


    // Social sharing buttons
    this.socialSharingButtons = new SocialSharingButtons();

    
    // Responsive menu (only an example, will be removed)
    this.rpMenu = new RPMenu();

    
    // Image carousel
    this.carousel = new Carousel();

    
    $(window).on(MCP.Events.RESIZE, _.bind(this._handleResize, this));
    this._handleResize();
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

    // Trigger delayed resize event
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
'use strict';

// Vendor import
const BREWSER = require('brewser/dist/brewser.min').br;

// Module imports
import MCP from 'modules/mcp';

import json from '../html/data/global.json';

// Cache some globals
window.BREWSER = BREWSER;
window.$ = $;

window._app = window._app || {};
window._app.data = json;
window._app.DEVICE_MODES = {
  PHONE: 'phone',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};

window._app.start = function() {
  // Set up touch devices
  if(BREWSER.device.touch) {
    FastClick.attach(document.body);
    $('html').addClass('is-touch');
  }

  // Cache device mode on the app instance
  var deviceMode = _app.DEVICE_MODES.DESKTOP;
  if(BREWSER.device.phone) {
    deviceMode = _app.DEVICE_MODES.PHONE;
    $('html').addClass('is-phone');
  } else if(BREWSER.device.tablet) {
    deviceMode = _app.DEVICE_MODES.TABLET;
    $('html').addClass('is-tablet');
  } else {
    $('html').addClass('is-desktop');
  }
  _app.phoneDeviceMode = deviceMode === _app.DEVICE_MODES.PHONE;
  _app.tabletDeviceMode = deviceMode === _app.DEVICE_MODES.TABLET;
  _app.desktopDeviceMode = deviceMode === _app.DEVICE_MODES.DESKTOP;

  // Initialise the MCP
  window._app.mcp = new MCP(window._app);
}

// On Ready
$(document).ready(function() {
  window._app.start();
});

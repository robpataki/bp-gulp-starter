'use strict';

// Module imports
import json from '../../html/data/global.json';
const SOCIAL_META_DATA = json.site_meta.social;

const POP_UP_SETTINGS = {
  width: 520,
  height: 350
};

export default class SocialSharingButtons {
  constructor() {

    this.$el = $('.social-sharing-buttons');

    if (!this.$el || !this.$el.length) {
      return;
    }

    this._init();

    return this;
  }




////////////////////////////////////
/////// Private methods
////////////////

  _init() {
    this.$facebookButton = this.$el.find('.social-sharing-button--facebook');
    this.$twitterButton = this.$el.find('.social-sharing-button--twitter');
    this.$linkedinButton = this.$el.find('.social-sharing-button--linkedin');
    this.$googlePlusButton = this.$el.find('.social-sharing-button--google-plus');

    this.$facebookButton.on('click tap', _.bind(this._openFacebookSharer, this));
    this.$twitterButton.on('click tap', _.bind(this._openTwitterSharer, this));
    this.$linkedinButton.on('click tap', _.bind(this._openLinkedInSharer, this));
    this.$googlePlusButton.on('click tap', _.bind(this._openGooglePlusSharer, this));
  }

  _getPopUpOptions() {
    const winWidth = POP_UP_SETTINGS.width;
    const winHeight = POP_UP_SETTINGS.height;
    const winTop = Math.round((BREWSER.windowHeight / 2) - (winHeight / 2));
    const winLeft = Math.round((BREWSER.windowWidth / 2) - (winWidth / 2));
    const windowOptions = 'width=' + winWidth + ',height=' + winHeight + ',top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,scrollbars=1';

    return windowOptions;
  }

  _openSharerPopUp(url, title, options) {
    window.open(url, title, options);
  }

  _openFacebookSharer(e) {
    e.preventDefault();

    const windowOptions = this._getPopUpOptions();
    const windowURL = window.location.href;
    const url = '//facebook.com/sharer.php?m2w&s=100&p[url]=' + windowURL;

    this._openSharerPopUp(url, 'facebook', windowOptions);
  }

  _openTwitterSharer(e) {
    e.preventDefault();

    const windowOptions = this._getPopUpOptions();
    const windowURL = window.location.href;
    const twitterMeta = SOCIAL_META_DATA.twitter;
    const url = `//twitter.com/intent/tweet?text=${twitterMeta.tweet}&hashtags=${twitterMeta.hashtags.join(',')}&url=${windowURL}&via=${twitterMeta.handle}`;

    this._openSharerPopUp(url, 'twitter', windowOptions);
  }

  _openLinkedInSharer(e) {
    e.preventDefault();

    const windowOptions = this._getPopUpOptions();
    const windowURL = window.location.href;
    const linkedInMeta = SOCIAL_META_DATA.linkedin;
    const url = `//linkedin.com/shareArticle?mini=true&url=${windowURL}&title=${linkedInMeta.title}&summary=${linkedInMeta.summary}&source=${linkedInMeta.source}`

    this._openSharerPopUp(url, 'linkedin', windowOptions);
  }

  _openGooglePlusSharer(e) {
    e.preventDefault();

    const windowOptions = this._getPopUpOptions();
    const windowURL = window.location.href;
    const url = `//plus.google.com/share?url=${windowURL}`;

    this._openSharerPopUp(url, 'googleplus', windowOptions);
  }
}
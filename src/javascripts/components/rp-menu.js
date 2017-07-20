'use strict';

let _instance = null;

export default class RPMenu {
  constructor() {
    if (!_instance) {
      _instance = this;
      
      this._init();

      return RPMenu.getInstance();
    } else {
      return false;
    }
  }

////////////////////////////////////
/////// Private methods
////////////////

  _init() {
    this.$html = $('html');
    this.$el = $('.rp-menu');
    
    this.$desktopMenu = this.$el.find('.menu--desktop');
    this.$handyMenu = this.$el.find('.menu--handy');

    this.$handyBody = this.$handyMenu.find('.menu__body');
    this.$handyTitle = this.$handyMenu.find('.menu__title');
    this.$handyLinkGroups = this.$handyMenu.find('.menu__list .menu__list');

    this.$burger = this.$handyMenu.find('.menu__burger');

    this.$burger.on('click tap', this._handleBurgerClick.bind(this));

    this.$handyLinkGroups.each(function(id, group){
      const $group = $(group);
      const $firstLi = $group.find('li').first();

      $firstLi.on('click tap', _instance._handleMenuGroupClick.bind(_instance));
    });

    this.$handyBody.hide();

    $(window).on('resize', this._handleWindowResize.bind(this));
    this._handleWindowResize();
  }

  _closeMenuGroups($currentMenuGroup) {
    const $toggledGroups = this.$handyMenu.find('.menu__list.is-toggled');
    if (typeof $currentMenuGroup !== 'undefined' && $currentMenuGroup.length) {

      $toggledGroups.each(function(id, group){
        const $group = $(group);
        
        if ($group.index() !== $currentMenuGroup.index()) {
          $group.toggleClass('is-toggled');
        }
      })
    } else {
      $toggledGroups.toggleClass('is-toggled');
    }
  }

  _handleWindowResize(e) {
    const windowWidth = window.innerWidth;

    this.mobileMode = this.$handyMenu.css('display') === 'block';
    if (this.mobileMode) {
      this.$el.addClass('is-handy-active');
    } else {
      this.$el.removeClass('is-handy-active');
      if (this.isMenuOpen) {
        this._handleBurgerClick();
      }
    }
  }

  _handleBurgerClick(e) {
    this.$html.toggleClass('is-rp-menu-open');

    if (this.$html.hasClass('is-rp-menu-open')) {
      this._closeMenuGroups();
      this.open();
    } else {
      this.close();
    }
  }

  _handleMenuGroupClick(e) {
    const $currentMenuGroup = $(e.currentTarget).parent();

    // Close all
    this._closeMenuGroups($currentMenuGroup);

    // Leave the current one open
    $currentMenuGroup.toggleClass('is-toggled');
  }

////////////////////////////////////
/////// Public methods
////////////////

  open() {
    this.isMenuOpen = true;

    this.$handyBody.show();

    // Open the active menu group
    const $activeMenuItem = this.$handyMenu.find('.menu__list > li.is-active');
    if ($activeMenuItem.length) {
      $activeMenuItem.parent().addClass('is-toggled');
    }

    this.$handyBody.scrollTop(0);
    const bodyTop = this.$handyBody.offset().top;
    const currentMenuGroupTop = $activeMenuItem.parent().offset().top;
    const targetBodyTop = currentMenuGroupTop - bodyTop;

    this.$handyBody.scrollTop(targetBodyTop);
  }

  close() {
    this.isMenuOpen = false;

    this.$handyBody.hide();
  }
}

////////////////////////////////////
/////// Static class methods
////////////////

RPMenu.getInstance = () => {
  return _instance;
}
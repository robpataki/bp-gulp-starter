'use strict';

let _instance = null;

export default class Menu {
  constructor() {
    if (!_instance) {
      _instance = this;
      
      this._init();

      return Menu.getInstance();
    } else {
      return false;
    }
  }

////////////////////////////////////
/////// Private methods
////////////////

  _init() {
    this.$html = $('html');
    this.$menubar = $('.menubar');
    this.$mobiMenuWrapper = this.$menubar.find('.mobi-menu__wrapper');
    this.$desktopNav = this.$menubar.find('.desktop-nav');
    this.$mobiNav = this.$menubar.find('.mobi-nav');

    this.$mobiMenu = this.$menubar.find('.mobi-menu');
    this.$mobiMenuTitle = this.$mobiMenu.find('.mobi-menu__title');
    this.$burger = this.$mobiMenu.find('.burger');

    this.$burger.on('click tap', this._handleBurgerClick.bind(this));

    $('.mobi-menu__items .mobi-menu__items').each(function(id, group){
      const $group = $(group);
      const $firstLi = $group.find('li').first();

      $firstLi.on('click tap', _instance._handleMenuGroupClick.bind(_instance));
    });

    this.$mobiMenuWrapper.hide();

    $(window).on('resize', this._handleWindowResize.bind(this));
    this._handleWindowResize();
  }

  _closeMenuGroups($currentMenuGroup) {
    if (typeof $currentMenuGroup !== 'undefined' && $currentMenuGroup.length) {
      $('.mobi-menu__items.is-toggled').each(function(id, group){
        const $group = $(group);
        
        if ($group.index() !== $currentMenuGroup.index()) {
          $group.toggleClass('is-toggled');
        }
      })
    } else {
      $('.mobi-menu__items.is-toggled').toggleClass('is-toggled');
    }
  }

  _handleWindowResize(e) {
    const windowWidth = window.innerWidth;

    this.mobileMode = windowWidth <= 768;

    if (this.mobileMode) {
      this.$menubar.addClass('menubar--mobi');
      this.$mobiNav.show();
      this.$desktopNav.hide();
    } else {
      this.$menubar.removeClass('menubar--mobi');
      if (this.isMenuOpen) {
        this._handleBurgerClick();
      }
      this.$mobiNav.hide();
      this.$desktopNav.show();
    }
  }

  _handleBurgerClick(e) {
    this.$html.toggleClass('is-menu-open');

    if (this.$html.hasClass('is-menu-open')) {
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

    // Hide the title
    this.$mobiMenuTitle.css({
      opacity: 0
    });

    // Show the menu items
    this.$mobiMenuWrapper.scrollTop = 0;
    this.$mobiMenuWrapper.show();
  }

  close() {
    this.isMenuOpen = false;

    // Show the title
    this.$mobiMenuTitle.css({
      opacity: 1
    });

    // Hide the menu items
    this.$mobiMenuWrapper.hide();
  }
}

////////////////////////////////////
/////// Static class methods
////////////////

Menu.getInstance = () => {
  return _instance;
}
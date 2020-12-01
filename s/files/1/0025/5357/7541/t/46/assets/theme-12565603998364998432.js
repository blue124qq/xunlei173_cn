window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Get the query params in a Url
   * Ex
   * https://mysite.com/search?q=noodles&b
   * getParameterByName('q') = "noodles"
   * getParameterByName('b') = "" (empty value)
   * getParameterByName('test') = null (absent)
   */
  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  keyboardKeys: {
    TAB: 9,
    ENTER: 13
  }
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element
      .first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element
        .first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on(
      'click',
      function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventsName = {
      focusin: options.namespace ? 'focusin.' + options.namespace : 'focusin',
      focusout: options.namespace
        ? 'focusout.' + options.namespace
        : 'focusout',
      keydown: options.namespace
        ? 'keydown.' + options.namespace
        : 'keydown.handleFocus'
    };

    /**
     * Get every possible visible focusable element
     */
    var $focusableElements = options.$container.find(
      $(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      ).filter(':visible')
    );
    var firstFocusable = $focusableElements[0];
    var lastFocusable = $focusableElements[$focusableElements.length - 1];

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    function _manageFocus(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

      /**
       * On the last focusable element and tab forward,
       * focus the first element.
       */
      if (evt.target === lastFocusable && !evt.shiftKey) {
        evt.preventDefault();
        firstFocusable.focus();
      }
      /**
       * On the first focusable element and tab backward,
       * focus the last element.
       */
      if (evt.target === firstFocusable && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventsName.focusout, function() {
      $(document).off(eventsName.keydown);
    });

    $(document).on(eventsName.focusin, function(evt) {
      if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

      $(document).on(eventsName.keydown, function(evt) {
        _manageFocus(evt);
      });
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  },

  /**
   * Add aria-describedby attribute to external and new window links
   *
   * @param {object} options - Options to be used
   * @param {object} options.messages - Custom messages to be used
   * @param {jQuery} options.$links - Specific links to be targeted
   */
  accessibleLinks: function(options) {
    var body = document.querySelector('body');

    var idSelectors = {
      newWindow: 'a11y-new-window-message',
      external: 'a11y-external-message',
      newWindowExternal: 'a11y-new-window-external-message'
    };

    if (options.$links === undefined || !options.$links.jquery) {
      options.$links = $('a:not([aria-describedby])');
    }

    function generateHTML(customMessages) {
      if (typeof customMessages !== 'object') {
        customMessages = {};
      }

      var messages = $.extend(
        {
          newWindow: 'Opens in a new window.',
          external: 'Opens external website.',
          newWindowExternal: 'Opens external website in a new window.'
        },
        customMessages
      );

      var container = document.createElement('ul');
      var htmlMessages = '';

      for (var message in messages) {
        htmlMessages +=
          '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
      }

      container.setAttribute('hidden', true);
      container.innerHTML = htmlMessages;

      body.appendChild(container);
    }

    function _externalSite($link) {
      var hostname = window.location.hostname;

      return $link[0].hostname !== hostname;
    }

    $.each(options.$links, function() {
      var $link = $(this);
      var target = $link.attr('target');
      var rel = $link.attr('rel');
      var isExternal = _externalSite($link);
      var isTargetBlank = target === '_blank';

      if (isExternal) {
        $link.attr('aria-describedby', idSelectors.external);
      }
      if (isTargetBlank) {
        if (rel === undefined || rel.indexOf('noopener') === -1) {
          $link.attr('rel', 'noopener');
        }
        $link.attr('aria-describedby', idSelectors.newWindow);
      }
      if (isExternal && isTargetBlank) {
        $link.attr('aria-describedby', idSelectors.newWindowExternal);
      }
    });

    generateHTML(options.messages);
  }
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      'change',
      this._onSelectChange.bind(this)
    );
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function(element) {
          var $element = $(element);
          var type = $element.attr('type');
          var currentOption = {};

          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    }
  });

  return Variants;
})();


/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {
  function Drawer(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $('#PageContainer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + ' ' + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + ' ' + this.config.openClass
    );

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.unbindEvents();

    // Run function when draw closes if set
    if (
      this.config.onDrawerClose &&
      typeof this.config.onDrawerClose === 'function'
    ) {
      this.config.onDrawerClose();
    }
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();


/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.Header = (function() {
  var selectors = {
    body: 'body',
    navigation: '#AccessibleNav',
    siteNavHasDropdown: '.site-nav--has-dropdown',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.site-nav--active-dropdown',
    siteNavLinkMain: '.site-nav__link--main',
    siteNavChildLink: '.site-nav__link--last'
  };

  var config = {
    activeClass: 'site-nav--active-dropdown',
    childLinkClass: 'site-nav__child-link'
  };

  var cache = {};

  function init() {
    cacheSelectors();

    cache.$parents.on('click.siteNav', function() {
      var $el = $(this);

      $el.hasClass(config.activeClass) ? hideDropdown($el) : showDropdown($el);
    });

    // check when we're leaving a dropdown and close the active dropdown
    $(selectors.siteNavChildLink).on('focusout.siteNav', function() {
      setTimeout(function() {
        if (
          $(document.activeElement).hasClass(config.childLinkClass) ||
          !cache.$activeDropdown.length
        ) {
          return;
        }

        hideDropdown(cache.$activeDropdown);
      });
    });

    // close dropdowns when on top level nav
    cache.$topLevel.on('focus.siteNav', function() {
      if (cache.$activeDropdown.length) {
        hideDropdown(cache.$activeDropdown);
      }
    });

    cache.$subMenuLinks.on('click.siteNav', function(evt) {
      // Prevent click on body from firing instead of link
      evt.stopImmediatePropagation();
    });
  }

  function cacheSelectors() {
    cache = {
      $nav: $(selectors.navigation),
      $topLevel: $(selectors.siteNavLinkMain),
      $parents: $(selectors.navigation).find(selectors.siteNavHasDropdown),
      $subMenuLinks: $(selectors.siteNavChildLinks),
      $activeDropdown: $(selectors.siteNavActiveDropdown)
    };
  }

  function showDropdown($el) {
    $el.addClass(config.activeClass);

    // close open dropdowns
    if (cache.$activeDropdown.length) {
      hideDropdown(cache.$activeDropdown);
    }

    cache.$activeDropdown = $el;

    // set expanded on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'true');

    setTimeout(function() {
      $(window).on('keyup.siteNav', function(evt) {
        if (evt.keyCode === 27) {
          hideDropdown($el);
        }
      });

      $(selectors.body).on('click.siteNav', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown($el) {
    // remove aria on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'false');
    $el.removeClass(config.activeClass);

    // reset active dropdown
    cache.$activeDropdown = $(selectors.siteNavActiveDropdown);

    $(selectors.body).off('click.siteNav');
    $(window).off('keyup.siteNav');
  }

  function unload() {
    $(window).off('.siteNav');
    cache.$parents.off('.siteNav');
    cache.$subMenuLinks.off('.siteNav');
    cache.$topLevel.off('.siteNav');
    $(selectors.siteNavChildLink).off('.siteNav');
    $(selectors.body).off('.siteNav');
  }

  return {
    init: init,
    unload: unload
  };
})();

window.theme = window.theme || {};

theme.MobileNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLinkWrapper: 'mobile-nav__item',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };
  var cache = {};
  var isTransitioning;
  var $activeSubNav;
  var $activeTrigger;
  var menuLevel = 1;
  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  var mediaQuerySmall = 'screen and (max-width: 749px)';

  function init() {
    cacheSelectors();

    cache.$mobileNavToggle.on('click', toggleMobileNav);
    cache.$subNavToggleBtn.on('click.subNav', toggleSubNav);

    // Close mobile nav when unmatching mobile breakpoint
    enquire.register(mediaQuerySmall, {
      unmatch: function() {
        if (cache.$mobileNavContainer.hasClass(classes.navOpen)) {
          closeMobileNav();
        }
      }
    });
  }

  function toggleMobileNav() {
    if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function cacheSelectors() {
    cache = {
      $pageContainer: $('#PageContainer'),
      $siteHeader: $('.site-header'),
      $mobileNavToggle: $('.js-mobile-nav-toggle'),
      $mobileNavContainer: $('.mobile-nav-wrapper'),
      $mobileNav: $('#MobileNav'),
      $sectionHeader: $('#shopify-section-header'),
      $subNavToggleBtn: $('.' + classes.subNavToggleBtn)
    };
  }

  function openMobileNav() {
    var translateHeaderHeight = cache.$siteHeader.outerHeight();

    cache.$mobileNavContainer.prepareTransition().addClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(' + translateHeaderHeight + 'px)'
    });

    cache.$pageContainer.css({
      transform:
        'translate3d(0, ' + cache.$mobileNavContainer[0].scrollHeight + 'px, 0)'
    });

    slate.a11y.trapFocus({
      $container: cache.$sectionHeader,
      $elementToFocus: cache.$mobileNavToggle,
      namespace: 'navFocus'
    });

    cache.$mobileNavToggle
      .addClass(classes.mobileNavCloseIcon)
      .removeClass(classes.mobileNavOpenIcon)
      .attr('aria-expanded', true);

    // close on escape
    $(window).on('keyup.mobileNav', function(evt) {
      if (evt.which === 27) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    cache.$mobileNavContainer.prepareTransition().removeClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(-100%)'
    });

    cache.$pageContainer.removeAttr('style');

    slate.a11y.trapFocus({
      $container: $('html'),
      $elementToFocus: $('body')
    });

    cache.$mobileNavContainer.one(
      'TransitionEnd.navToggle webkitTransitionEnd.navToggle transitionend.navToggle oTransitionEnd.navToggle',
      function() {
        slate.a11y.removeTrapFocus({
          $container: cache.$mobileNav,
          namespace: 'navFocus'
        });
      }
    );

    cache.$mobileNavToggle
      .addClass(classes.mobileNavOpenIcon)
      .removeClass(classes.mobileNavCloseIcon)
      .attr('aria-expanded', false)
      .focus();

    $(window).off('keyup.mobileNav');

    scrollTo(0, 0);
  }

  function toggleSubNav(evt) {
    if (isTransitioning) {
      return;
    }

    var $toggleBtn = $(evt.currentTarget);
    var isReturn = $toggleBtn.hasClass(classes.return);
    isTransitioning = true;

    if (isReturn) {
      // Close all subnavs by removing active class on buttons
      $(
        '.' + classes.subNavToggleBtn + '[data-level="' + (menuLevel - 1) + '"]'
      ).removeClass(classes.subNavActive);

      if ($activeTrigger && $activeTrigger.length) {
        $activeTrigger.removeClass(classes.subNavActive);
      }
    } else {
      $toggleBtn.addClass(classes.subNavActive);
    }

    $activeTrigger = $toggleBtn;

    goToSubnav($toggleBtn.data('target'));
  }

  function goToSubnav(target) {
    /*eslint-disable shopify/jquery-dollar-sign-reference */

    var $targetMenu = target
      ? $('.mobile-nav__dropdown[data-parent="' + target + '"]')
      : cache.$mobileNav;

    menuLevel = $targetMenu.data('level') ? $targetMenu.data('level') : 1;

    if ($activeSubNav && $activeSubNav.length) {
      $activeSubNav.prepareTransition().addClass(classes.subNavClosing);
    }

    $activeSubNav = $targetMenu;

    /*eslint-enable shopify/jquery-dollar-sign-reference */

    var translateMenuHeight = $targetMenu.outerHeight();

    var openNavClass =
      menuLevel > 2 ? classes.thirdNavShowing : classes.subNavShowing;

    cache.$mobileNavContainer
      .css('height', translateMenuHeight)
      .removeClass(classes.thirdNavShowing)
      .addClass(openNavClass);

    if (!target) {
      // Show top level nav
      cache.$mobileNavContainer
        .removeClass(classes.thirdNavShowing)
        .removeClass(classes.subNavShowing);
    }

    /* if going back to first subnav, focus is on whole header */
    var $container = menuLevel === 1 ? cache.$sectionHeader : $targetMenu;

    var $menuTitle = $targetMenu.find('[data-menu-title=' + menuLevel + ']');
    var $elementToFocus = $menuTitle ? $menuTitle : $targetMenu;

    // Focusing an item in the subnav early forces element into view and breaks the animation.
    cache.$mobileNavContainer.one(
      'TransitionEnd.subnavToggle webkitTransitionEnd.subnavToggle transitionend.subnavToggle oTransitionEnd.subnavToggle',
      function() {
        slate.a11y.trapFocus({
          $container: $container,
          $elementToFocus: $elementToFocus,
          namespace: 'subNavFocus'
        });

        cache.$mobileNavContainer.off('.subnavToggle');
        isTransitioning = false;
      }
    );

    // Match height of subnav
    cache.$pageContainer.css({
      transform: 'translateY(' + translateMenuHeight + 'px)'
    });

    $activeSubNav.removeClass(classes.subNavClosing);
  }

  return {
    init: init,
    closeMobileNav: closeMobileNav
  };
})(jQuery);

window.theme = window.theme || {};

theme.Search = (function() {
  var selectors = {
    search: '.search',
    searchSubmit: '.search__submit',
    searchInput: '.search__input',

    siteHeader: '.site-header',
    siteHeaderSearchToggle: '.site-header__search-toggle',
    siteHeaderSearch: '.site-header__search',

    searchDrawer: '.search-bar',
    searchDrawerInput: '.search-bar__input',

    searchHeader: '.search-header',
    searchHeaderInput: '.search-header__input',
    searchHeaderSubmit: '.search-header__submit',

    searchResultSubmit: '#SearchResultSubmit',
    searchResultInput: '#SearchInput',
    searchResultMessage: '[data-search-error-message]',

    mobileNavWrapper: '.mobile-nav-wrapper'
  };

  var classes = {
    focus: 'search--focus',
    hidden: 'hide',
    mobileNavIsOpen: 'js-menu--is-open'
  };

  function init() {
    if (!$(selectors.siteHeader).length) {
      return;
    }

    this.$searchResultInput = $(selectors.searchResultInput);
    this.$searchErrorMessage = $(selectors.searchResultMessage);

    initDrawer();

    var searchQuery = slate.utils.getParameterByName('q');

    if (searchQuery !== null) {
      validateSearchResultForm.call(this);
    }

    $(selectors.searchResultSubmit).on(
      'click',
      validateSearchResultForm.bind(this)
    );

    $(selectors.searchHeaderInput)
      .add(selectors.searchHeaderSubmit)
      .on('focus blur', function() {
        $(selectors.searchHeader).toggleClass(classes.focus);
      });

    $(selectors.siteHeaderSearchToggle).on('click', function() {
      var searchHeight = $(selectors.siteHeader).outerHeight();
      var searchOffset = $(selectors.siteHeader).offset().top - searchHeight;

      $(selectors.searchDrawer).css({
        height: searchHeight + 'px',
        top: searchOffset + 'px'
      });
    });
  }

  function initDrawer() {
    // Add required classes to HTML
    $('#PageContainer').addClass('drawer-page-content');
    $('.js-drawer-open-top')
      .attr('aria-controls', 'SearchDrawer')
      .attr('aria-expanded', 'false')
      .attr('aria-haspopup', 'dialog');

    theme.SearchDrawer = new theme.Drawers('SearchDrawer', 'top', {
      onDrawerOpen: searchDrawerFocus,
      onDrawerClose: searchDrawerFocusClose
    });
  }

  function searchDrawerFocus() {
    searchFocus($(selectors.searchDrawerInput));

    if ($(selectors.mobileNavWrapper).hasClass(classes.mobileNavIsOpen)) {
      theme.MobileNav.closeMobileNav();
    }
  }

  function searchFocus($el) {
    $el.focus();
    // set selection range hack for iOS
    $el[0].setSelectionRange(0, $el[0].value.length);
  }

  function searchDrawerFocusClose() {
    $(selectors.siteHeaderSearchToggle).focus();
  }

  /**
   * Remove the aria-attributes and hide the error messages
   */
  function hideErrorMessage() {
    this.$searchErrorMessage.addClass(classes.hidden);
    this.$searchResultInput
      .removeAttr('aria-describedby')
      .removeAttr('aria-invalid');
  }

  /**
   * Add the aria-attributes and show the error messages
   */
  function showErrorMessage() {
    this.$searchErrorMessage.removeClass(classes.hidden);
    this.$searchResultInput
      .attr('aria-describedby', 'error-search-form')
      .attr('aria-invalid', true);
  }

  function validateSearchResultForm(evt) {
    var isInputValueEmpty = this.$searchResultInput.val().trim().length === 0;

    if (!isInputValueEmpty) {
      hideErrorMessage.call(this);
      return;
    }

    if (typeof evt !== 'undefined') {
      evt.preventDefault();
    }

    searchFocus(this.$searchResultInput);
    showErrorMessage.call(this);
  }

  return {
    init: init
  };
})();

(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    wrapper: 'slideshow-wrapper',
    slideshow: 'slideshow',
    currentSlide: 'slick-current',
    video: 'slideshow__video',
    videoBackground: 'slideshow__video--background',
    closeVideoBtn: 'slideshow__video-control--close',
    pauseButton: 'slideshow__pause',
    isPaused: 'is-paused'
  };

  function slideshow(el) {
    this.$slideshow = $(el);
    this.$wrapper = this.$slideshow.closest('.' + classes.wrapper);
    this.$pause = this.$wrapper.find('.' + classes.pauseButton);

    this.settings = {
      accessibility: true,
      arrows: false,
      dots: true,
      fade: true,
      draggable: true,
      touchThreshold: 20,
      autoplay: this.$slideshow.data('autoplay'),
      autoplaySpeed: this.$slideshow.data('speed')
    };

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11y.bind(this));
    this.$slideshow.slick(this.settings);

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11y(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    var $wrapper = this.$wrapper;
    var autoplay = this.settings.autoplay;

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    $wrapper.on('focusin', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.attr('aria-live', 'polite');

      if (autoplay) {
        $slider.slick('slickPause');
      }
    });

    // Resume autoplay
    $wrapper.on('focusout', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.removeAttr('aria-live');

      if (autoplay) {
        // Manual check if the focused element was the video close button
        // to ensure autoplay does not resume when focus goes inside YouTube iframe
        if ($(evt.target).hasClass(classes.closeVideoBtn)) {
          return;
        }

        $slider.slick('slickPlay');
      }
    });

    // Add arrow key support when focused
    if (obj.$dots) {
      obj.$dots.on('keydown', function(evt) {
        if (evt.which === 37) {
          $slider.slick('slickPrev');
        }

        if (evt.which === 39) {
          $slider.slick('slickNext');
        }

        // Update focus on newly selected tab
        if (evt.which === 37 || evt.which === 39) {
          obj.$dots.find('.slick-active button').focus();
        }
      });
    }
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $slider = slick.$slider;
    var $currentSlide = $slider.find('.' + classes.currentSlide);
    var $nextSlide = $slider.find(
      '.slideshow__slide[data-slick-index="' + nextSlide + '"]'
    );

    if (isVideoInSlide($currentSlide)) {
      var $currentVideo = $currentSlide.find('.' + classes.video);
      var currentVideoId = $currentVideo.attr('id');
      theme.SlideshowVideo.pauseVideo(currentVideoId);
      $currentVideo.attr('tabindex', '-1');
    }

    if (isVideoInSlide($nextSlide)) {
      var $video = $nextSlide.find('.' + classes.video);
      var videoId = $video.attr('id');
      var isBackground = $video.hasClass(classes.videoBackground);
      if (isBackground) {
        theme.SlideshowVideo.playVideo(videoId);
      } else {
        $video.attr('tabindex', '0');
      }
    }
  }

  function isVideoInSlide($slide) {
    return $slide.find('.' + classes.video).length;
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused);
      $(slideshowSelector).slick('slickPlay');
    } else {
      this.$pause.addClass(classes.isPaused);
      $(slideshowSelector).slick('slickPause');
    }
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.SlideshowVideo.loadVideos();
}

theme.SlideshowVideo = (function() {
  var autoplayCheckComplete = false;
  var autoplayAvailable = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    slideshowWrapper: 'slideshow-wrapper',
    slide: 'slideshow__slide',
    slideBackgroundVideo: 'slideshow__slide--background-video',
    slideDots: 'slick-dots',
    videoChrome: 'slideshow__video--chrome',
    videoBackground: 'slideshow__video--background',
    playVideoBtn: 'slideshow__video-control--play',
    closeVideoBtn: 'slideshow__video-control--close',
    currentSlide: 'slick-current',
    slickClone: 'slick-cloned',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay'
  };

  /**
   * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status: $video.data('type') === 'chrome' ? 'closed' : 'background', // closed, open, background
      videoSelector: $video.attr('id'),
      $parentSlide: $video.closest('.' + classes.slide),
      $parentSlideshowWrapper: $video.closest('.' + classes.slideshowWrapper),
      controls: $video.data('type') === 'background' ? 0 : 1,
      slideshow: $video.data('slideshow')
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  function customPlayVideo(playerId) {
    // Do not autoplay just because the slideshow asked you to.
    // If the slideshow asks to play a video, make sure
    // we have done the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (
      videoPlayers[playerId] &&
      typeof videoPlayers[playerId].pauseVideo === 'function'
    ) {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var args = $.extend({}, videoOptions, videos[key]);
        args.playerVars.controls = args.controls;
        videoPlayers[key] = new YT.Player(key, args);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function loadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);

    initEvents();
  }

  /**
   * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $slide = videos[id].$parentSlide;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || (autoplayCheckComplete && autoplayAvailable)) {
      // Play if autoplay is available or clicked to play
      $slide.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    }

    // Check for autoplay if not already done
    if (!autoplayCheckComplete) {
      autoplayCheckFunction(player, $slide);
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported
      ? classes.supportsAutoplay
      : classes.supportsNoAutoplay;
    $(document.documentElement).addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function autoplayCheckFunction(player, $slide) {
    // attempt to play video
    player.playVideo();

    autoplayTest(player)
      .then(function() {
        setAutoplaySupport(true);
      })
      .fail(function() {
        // No autoplay available (or took too long to start playing).
        // Show fallback image. Stop video for safety.
        setAutoplaySupport(false);
        player.stopVideo();
      })
      .always(function() {
        autoplayCheckComplete = true;
        $slide.removeClass(classes.loading);
      });
  }

  function autoplayTest(player) {
    var deferred = $.Deferred();
    var wait;
    var timeout;

    wait = setInterval(function() {
      if (player.getCurrentTime() <= 0) {
        return;
      }

      autoplayAvailable = true;
      clearInterval(wait);
      clearTimeout(timeout);
      deferred.resolve();
    }, 500);

    timeout = setTimeout(function() {
      clearInterval(wait);
      deferred.reject();
    }, 4000); // subjective. test up to 8 times over 4 seconds

    return deferred;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if ($(window).width() < 750) {
      playOnClick = true;
    } else if (window.mobileCheck()) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);

    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();

    // Customize based on options from the video ID
    switch (videoData.type) {
      case 'background-chrome':
      case 'background':
        evt.target.mute();
        // Only play the video if it is in the active slide
        if (videoData.$parentSlide.hasClass(classes.currentSlide)) {
          privatePlayVideo(videoData.id);
        }
        break;
    }

    videoData.$parentSlide.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);

    switch (evt.data) {
      case 0: // ended
        setAsFinished(videoData);
        break;
      case 1: // playing
        setAsPlaying(videoData);
        break;
      case 2: // paused
        setAsPaused(videoData);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'background-chrome':
        videoPlayers[videoData.id].seekTo(0);
        closeVideo(videoData.id);
        break;
      case 'chrome':
        closeVideo(videoData.id);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    $slide.removeClass(classes.loading);

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    switch (videoData.type) {
      case 'chrome':
      case 'background-chrome':
        $slideshow.removeClass(classes.paused).addClass(classes.playing);
        $slide.removeClass(classes.paused).addClass(classes.playing);
        break;
    }

    // Update focus to the close button so we stay within the slide
    $slide.find('.' + classes.closeVideoBtn).focus();
  }

  function setAsPaused(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    if (videoData.type === 'background-chrome') {
      closeVideo(videoData.id);
      return;
    }

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.status !== 'closed' && videoData.type !== 'background') {
      $slideshow.addClass(classes.paused);
      $slide.addClass(classes.paused);
    }

    if (videoData.type === 'chrome' && videoData.status === 'closed') {
      $slideshow.removeClass(classes.paused);
      $slide.removeClass(classes.paused);
    }

    $slideshow.removeClass(classes.playing);
    $slide.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;
    var classesToRemove = [classes.pause, classes.playing].join(' ');

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'background-chrome':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
      case 'chrome':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
    }

    $slideshow.removeClass(classesToRemove);
    $slide.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    return videos[evt.target.h.id];
  }

  function startVideoOnClick(playerId) {
    var videoData = videos[playerId];
    // add loading class to slide
    videoData.$parentSlide.addClass(classes.loading);

    videoData.status = 'open';

    switch (videoData.type) {
      case 'background-chrome':
        unsetBackgroundVideo(playerId, videoData);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
      case 'chrome':
        privatePlayVideo(playerId, true);
        break;
    }

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      if (evt.keyCode === 27) {
        closeVideo(playerId);
      }
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.videoBackground).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($player) {
    var $slide = $player.closest('.' + classes.slide);
    // Ignore cloned slides
    if ($slide.hasClass(classes.slickClone)) {
      return;
    }
    var slideWidth = $slide.width();
    var playerWidth = $player.width();
    var playerHeight = $player.height();

    // when screen aspect ratio differs from video, video must center and underlay one dimension
    if (slideWidth / videoOptions.ratio < playerHeight) {
      playerWidth = Math.ceil(playerHeight * videoOptions.ratio); // get new player width
      $player
        .width(playerWidth)
        .height(playerHeight)
        .css({
          left: (slideWidth - playerWidth) / 2,
          top: 0
        }); // player width is greater, offset left; reset top
    } else {
      // new video width < window width (gap to right)
      playerHeight = Math.ceil(slideWidth / videoOptions.ratio); // get new player height
      $player
        .width(slideWidth)
        .height(playerHeight)
        .css({
          left: 0,
          top: (playerHeight - playerHeight) / 2
        }); // player height is greater, offset top; reset left
    }

    $player.prepareTransition().addClass(classes.loaded);
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background-chrome to a chrome-only player once played
    $('#' + playerId)
      .removeAttr('style')
      .removeClass(classes.videoBackground)
      .addClass(classes.videoChrome);

    videos[playerId].$parentSlideshowWrapper
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].$parentSlide
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    // Switch back to background-chrome when closed
    var $player = $('#' + playerId)
      .addClass(classes.videoBackground)
      .removeClass(classes.videoChrome);

    videos[playerId].$parentSlide.addClass(classes.slideBackgroundVideo);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($player);
  }

  function initEvents() {
    $(document).on('click.videoPlayer', '.' + classes.playVideoBtn, function(
      evt
    ) {
      var playerId = $(evt.currentTarget).data('controls');
      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', '.' + classes.closeVideoBtn, function(
      evt
    ) {
      var playerId = $(evt.currentTarget).data('controls');
      closeVideo(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on(
      'resize.videoPlayer',
      $.debounce(250, function() {
        if (youtubeLoaded) {
          sizeBackgroundVideos();
        }
      })
    );
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  return {
    init: init,
    loadVideos: loadVideos,
    loadVideo: loadVideo,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();

window.theme = window.theme || {};

theme.FormStatus = (function() {
  var selectors = {
    statusMessage: '[data-form-status]'
  };

  function init() {
    this.$statusMessage = $(selectors.statusMessage);

    if (!this.$statusMessage) return;

    this.$statusMessage.focus();
  }

  return {
    init: init
  };
})();


/* ================ TEMPLATES ================ */
(function() {
  var $filterBy = $('#BlogTagFilter');

  if (!$filterBy.length) {
    return;
  }

  $filterBy.on('change', function() {
    location.href = $(this).val();
  });
})();

window.theme = theme || {};

theme.customerTemplates = (function() {
  function initEventListeners() {
    // Show reset password form
    $('#RecoverPassword').on('click', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });

    // Hide reset password form
    $('#HideRecoverPasswordLink').on('click', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $newAddressForm.toggleClass('hide');
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      $('#EditAddress_' + formId).toggleClass('hide');
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        Shopify.postLink('/account/addresses/' + formId, {
          parameters: { _method: 'delete' }
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  return {
    init: function() {
      checkUrlHash();
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();


/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    edit: '.js-edit-toggle',
    inputQty: '.cart__qty-input',
    thumbnails: '.cart__image',
    item: '.cart__row'
  };

  var config = {
    showClass: 'cart__update--show',
    showEditClass: 'cart__edit--active',
    cartNoCookies: 'cart--no-cookies'
  };

  function Cart(container) {
    this.$container = $(container);
    this.$edit = $(selectors.edit, this.$container);
    this.$inputQuantities = $(selectors.inputQty, this.$container);
    this.$thumbnails = $(selectors.thumbnails, this.$container);

    if (!this.cookiesEnabled()) {
      this.$container.addClass(config.cartNoCookies);
    }

    this.$edit.on('click', this._onEditClick);
    this.$inputQuantities.on('change', this._handleInputQty);

    this.$thumbnails.css('cursor', 'pointer');
    this.$thumbnails.on('click', this._handleThumbnailClick);
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      this.$edit.off('click', this._onEditClick);
    },

    _onEditClick: function(evt) {
      var $evtTarget = $(evt.target);
      var $updateLine = $('.' + $evtTarget.data('target'));
      var isExpanded = $evtTarget.attr('aria-expanded') === 'true';

      $evtTarget
        .toggleClass(config.showEditClass)
        .attr('aria-expanded', !isExpanded);
      $updateLine.toggleClass(config.showClass);
    },

    _handleInputQty: function(evt) {
      var $input = $(evt.target);
      var value = $input.val();
      var itemKey = $input.data('quantity-item');
      var $itemQtyInputs = $('[data-quantity-item=' + itemKey + ']');
      $itemQtyInputs.val(value);
    },

    _handleThumbnailClick: function(evt) {
      var url = $(evt.target).data('item-url');

      window.location.href = url;
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

window.theme = window.theme || {};

theme.Filters = (function() {
  var settings = {
    // Breakpoints from src/stylesheets/global/variables.scss.liquid
    mediaQueryMediumUp: 'screen and (min-width: 750px)'
  };

  var constants = {
    SORT_BY: 'sort_by'
  };

  var selectors = {
    mainContent: '#MainContent',
    filterSelection: '#FilterTags',
    sortSelection: '#SortBy',
    defaultSort: '#DefaultSortBy'
  };

  function Filters(container) {
    var $container = (this.$container = $(container));

    this.$filterSelect = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add(
      $(selectors.sortSelection, $container)
    );

    this.defaultSort = this._getDefaultSortValue();
    this.$selects.removeClass('hidden');

    this.$filterSelect.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
    this._initBreakpoints();
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {
    _initBreakpoints: function() {
      var self = this;

      enquire.register(settings.mediaQueryMediumUp, {
        match: function() {
          self._resizeSelect(self.$selects);
        }
      });
    },

    _onSortChange: function() {
      var sort = this._sortValue();
      var url = window.location.href.replace(window.location.search, '');

      if (sort.length) {
        var urlStripped = url.replace(window.location.hash, '');
        window.location.href = urlStripped + '?' + sort + selectors.mainContent;
      } else {
        // clean up our url if the sort value is blank for default
        window.location.href = url;
      }
    },

    _onFilterChange: function() {
      var filter = this._getFilterValue();

      // remove the 'page' parameter to go to the first page of results
      var search = document.location.search.replace(/\?(page=\w+)?&?/, '');

      // only add the search parameters to the url if they exist
      search = search !== '' ? '?' + search : '';

      document.location.href = filter + search + selectors.mainContent;
    },

    _getFilterValue: function() {
      return this.$filterSelect.val();
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return $(selectors.defaultSort, this.$container).val();
    },

    _sortValue: function() {
      var sort = this._getSortValue();
      var query = '';

      if (sort !== this.defaultSort) {
        query = constants.SORT_BY + '=' + sort;
      }

      return query;
    },

    _resizeSelect: function($selection) {
      $selection.each(function() {
        var $this = $(this);
        var arrowWidth = 10;
        // create test element
        var text = $this.find('option:selected').text();
        var $test = $('<span>').html(text);

        // add to body, get width, and get out
        $test.appendTo('body');
        var width = $test.width();
        $test.remove();

        // set select width
        $this.width(width + arrowWidth);
      });
    },

    onUnload: function() {
      this.$filterSelect.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
    }
  });

  return Filters;
})();

window.theme = window.theme || {};

theme.HeaderSection = (function() {
  function Header() {
    theme.Header.init();
    theme.MobileNav.init();
    theme.Search.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    }
  });

  return Header;
})();

theme.Maps = (function() {
  var config = {
    zoom: 14
  };
  var apiStatus = null;
  var mapsToLoad = [];

  var errors = {
    addressNoResults: theme.strings.addressNoResults,
    addressQueryLimit: theme.strings.addressQueryLimit,
    addressError: theme.strings.addressError,
    authError: theme.strings.authError
  };

  var selectors = {
    section: '[data-section-type="map"]',
    map: '[data-map]',
    mapOverlay: '[data-map-overlay]'
  };

  var classes = {
    mapError: 'map-section--load-error',
    errorMsg: 'map-section__error errors text-center'
  };

  // Global function called by Google on auth errors.
  // Show an auto error message on all map instances.
  // eslint-disable-next-line camelcase, no-unused-vars
  window.gm_authFailure = function() {
    if (!Shopify.designMode) {
      return;
    }

    $(selectors.section).addClass(classes.mapError);
    $(selectors.map).remove();
    $(selectors.mapOverlay).after(
      '<div class="' +
        classes.errorMsg +
        '">' +
        theme.strings.authError +
        '</div>'
    );
  };

  function Map(container) {
    this.$container = $(container);
    this.$map = this.$container.find(selectors.map);
    this.key = this.$map.data('api-key');

    if (typeof this.key === 'undefined') {
      return;
    }

    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript(
            'https://maps.googleapis.com/maps/api/js?key=' + this.key
          ).then(function() {
            apiStatus = 'loaded';
            initAllMaps();
          });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$map;

      return geolocate($map)
        .then(
          function(results) {
            var mapOptions = {
              zoom: config.zoom,
              center: results[0].geometry.location,
              draggable: false,
              clickableIcons: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              disableDefaultUI: true
            };

            var map = (this.map = new google.maps.Map($map[0], mapOptions));
            var center = (this.center = map.getCenter());

            //eslint-disable-next-line no-unused-vars
            var marker = new google.maps.Marker({
              map: map,
              position: map.getCenter()
            });

            google.maps.event.addDomListener(
              window,
              'resize',
              $.debounce(250, function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
                $map.removeAttr('style');
              })
            );
          }.bind(this)
        )
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = errors.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = errors.addressQueryLimit;
              break;
            case 'REQUEST_DENIED':
              errorMessage = errors.authError;
              break;
            default:
              errorMessage = errors.addressError;
              break;
          }

          // Show errors only to merchant in the editor.
          if (Shopify.designMode) {
            $map
              .parent()
              .addClass(classes.mapError)
              .html(
                '<div class="' +
                  classes.errorMsg +
                  '">' +
                  errorMessage +
                  '</div>'
              );
          }
        });
    },

    onUnload: function() {
      if (this.$map.length === 0) {
        return;
      }
      google.maps.event.clearListeners(this.map, 'resize');
    }
  });

  return Map;
})();

/* eslint-disable no-new */
theme.Product = (function() {
  function Product(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');

    this.settings = {
      // Breakpoints from src/stylesheets/global/variables.scss.liquid
      mediaQueryMediumUp: 'screen and (min-width: 750px)',
      mediaQuerySmall: 'screen and (max-width: 749px)',
      bpSmall: false,
      enableHistoryState: $container.data('enable-history-state') || false,
      namespace: '.slideshow-' + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false
    };

    this.selectors = {
      addToCart: '#AddToCart-' + sectionId,
      addToCartText: '#AddToCartText-' + sectionId,
      errorQuantityMessage: '#error-quantity-' + sectionId,
      quantity: '#Quantity-' + sectionId,
      SKU: '.variant-sku',
      productStatus: '[data-product-status]',
      originalSelectorId: '#ProductSelect-' + sectionId,
      productImageWraps: '.product-single__photo',
      productThumbImages: '.product-single__thumbnail--' + sectionId,
      productThumbs: '.product-single__thumbnails-' + sectionId,
      productFeaturedImage: '.product-featured-img',
      productThumbsWrapper: '.thumbnails-wrapper',
      saleLabel: '.product-price__sale-label-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId,
      shopifyPaymentButton: '.shopify-payment-button',
      priceContainer: '[data-price]',
      regularPrice: '[data-regular-price]',
      salePrice: '[data-sale-price]'
    };

    this.classes = {
      hidden: 'hide',
      productOnSale: 'price--on-sale',
      productUnavailable: 'price--unavailable'
    };

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$('#ProductJson-' + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      document.getElementById('ProductJson-' + sectionId).innerHTML
    );

    this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass(
      'js-zoom-enabled'
    );

    this._initBreakpoints();
    this._stringOverrides();
    this._initVariants();
    this._initImageSwitch();
    this._initAddToCart();
    this._setActiveThumbnail();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    _stringOverrides: function() {
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings);
    },

    _initBreakpoints: function() {
      var self = this;

      enquire.register(this.settings.mediaQuerySmall, {
        match: function() {
          // initialize thumbnail slider on mobile if more than three thumbnails
          if ($(self.selectors.productThumbImages).length > 3) {
            self._initThumbnailSlider();
          }

          // destroy image zooming if enabled
          if (self.settings.zoomEnabled) {
            $(self.selectors.productImageWraps).each(function() {
              _destroyZoom(this);
            });
          }

          self.settings.bpSmall = true;
        },
        unmatch: function() {
          if (self.settings.sliderActive) {
            self._destroyThumbnailSlider();
          }

          self.settings.bpSmall = false;
        }
      });

      enquire.register(this.settings.mediaQueryMediumUp, {
        match: function() {
          if (self.settings.zoomEnabled) {
            $(self.selectors.productImageWraps).each(function() {
              _enableZoom(this);
            });
          }
        }
      });
    },

    _initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState:
          this.$container.data('enable-history-state') || false,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on(
        'variantChange' + this.settings.namespace,
        this._updateAvailability.bind(this)
      );
      this.$container.on(
        'variantImageChange' + this.settings.namespace,
        this._updateImages.bind(this)
      );
      this.$container.on(
        'variantPriceChange' + this.settings.namespace,
        this._updatePrice.bind(this)
      );
      this.$container.on(
        'variantSKUChange' + this.settings.namespace,
        this._updateSKU.bind(this)
      );
    },

    _initImageSwitch: function() {
      if (!$(this.selectors.productThumbImages).length) {
        return;
      }

      var self = this;

      $(this.selectors.productThumbImages)
        .on('click', function(evt) {
          evt.preventDefault();
          var $el = $(this);

          var imageId = $el.data('thumbnail-id');

          self._switchImage(imageId);
          self._setActiveThumbnail(imageId);
        })
        .on('keyup', self._handleImageFocus.bind(self));
    },

    _initAddToCart: function() {
      var self = this;
      var $quantityInput = $(self.selectors.quantity);

      if ($quantityInput.length === 0) return;

      $(self.selectors.addToCart).on('click', function(evt) {
        var isInvalidQuantity = $quantityInput.val() <= 0;

        $(self.selectors.errorQuantityMessage).toggleClass(
          self.classes.hidden,
          !isInvalidQuantity
        );

        if (isInvalidQuantity) {
          $quantityInput
            .attr(
              'aria-describedby',
              'error-quantity-' + self.settings.sectionId
            )
            .attr('aria-invalid', true);
          $(self.selectors.errorQuantityMessage).focus();
          evt.preventDefault();
        } else {
          $quantityInput
            .removeAttr('aria-describedby')
            .removeAttr('aria-invalid');
        }
      });
    },

    _setActiveThumbnail: function(imageId) {
      var activeClass = 'active-thumb';

      // If there is no element passed, find it by the current product image
      if (typeof imageId === 'undefined') {
        imageId = $(this.selectors.productImageWraps + ":not('.hide')").data(
          'image-id'
        );
      }

      var $thumbnail = $(
        this.selectors.productThumbImages +
          "[data-thumbnail-id='" +
          imageId +
          "']"
      );

      $(this.selectors.productThumbImages)
        .removeClass(activeClass)
        .removeAttr('aria-current');

      $thumbnail.addClass(activeClass);
      $thumbnail.attr('aria-current', true);
    },

    _switchImage: function(imageId) {
      var $newImage = $(
        this.selectors.productImageWraps + "[data-image-id='" + imageId + "']",
        this.$container
      );
      var $otherImages = $(
        this.selectors.productImageWraps +
          ":not([data-image-id='" +
          imageId +
          "'])",
        this.$container
      );

      $newImage.removeClass(this.classes.hidden);
      $otherImages.addClass(this.classes.hidden);
    },

    _handleImageFocus: function(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;

      $(this.selectors.productFeaturedImage + ':visible').focus();
    },

    _initThumbnailSlider: function() {
      var options = {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: false,
        prevArrow: '.thumbnails-slider__prev--' + this.settings.sectionId,
        nextArrow: '.thumbnails-slider__next--' + this.settings.sectionId,
        responsive: [
          {
            breakpoint: 321,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      };

      $(this.selectors.productThumbs).slick(options);

      // Accessibility concerns not yet fixed in Slick Slider
      $(this.selectors.productThumbsWrapper, this.$container)
        .find('.slick-list')
        .removeAttr('aria-live');
      $(this.selectors.productThumbsWrapper, this.$container)
        .find('.slick-disabled')
        .removeAttr('aria-disabled');

      this.settings.sliderActive = true;
    },

    _destroyThumbnailSlider: function() {
      $(this.selectors.productThumbs).slick('unslick');
      this.settings.sliderActive = false;

      // Accessibility concerns not yet fixed in Slick Slider
      $(this.selectors.productThumbsWrapper, this.$container)
        .find('[tabindex="-1"]')
        .removeAttr('tabindex');
    },

    _liveRegionText: function(variant) {
      // Dummy content for live region
      var liveRegionText = '[Availability] [Regular] [$$] [Sale] [$]';

      if (!variant) {
        liveRegionText = theme.strings.unavailable;
        return liveRegionText;
      }

      // Update availability
      var availability = variant.available ? '' : theme.strings.soldOut + ',';
      liveRegionText = liveRegionText.replace('[Availability]', availability);

      // Update pricing information
      var regularLabel = '';
      var regularPrice = theme.Currency.formatMoney(
        variant.price,
        theme.moneyFormat
      );
      var saleLabel = '';
      var salePrice = '';

      if (variant.compare_at_price > variant.price) {
        regularLabel = theme.strings.regularPrice;
        regularPrice =
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          ) + ',';
        saleLabel = theme.strings.sale;
        salePrice = theme.Currency.formatMoney(
          variant.price,
          theme.moneyFormat
        );
      }

      liveRegionText = liveRegionText
        .replace('[Regular]', regularLabel)
        .replace('[$$]', regularPrice)
        .replace('[Sale]', saleLabel)
        .replace('[$]', salePrice)
        .trim();

      return liveRegionText;
    },

    _updateLiveRegion: function(evt) {
      var variant = evt.variant;
      var liveRegion = this.container.querySelector(
        this.selectors.productStatus
      );
      liveRegion.textContent = this._liveRegionText(variant);
      liveRegion.setAttribute('aria-hidden', false);

      // hide content from accessibility tree after announcement
      setTimeout(function() {
        liveRegion.setAttribute('aria-hidden', true);
      }, 1000);
    },

    _updateAddToCart: function(evt) {
      var variant = evt.variant;

      if (variant) {
        if (variant.available) {
          console.log("if")
          $(this.selectors.addToCart).prop('disabled', false);
          $(this.selectors.addToCartText).text(theme.strings.addToCart );
           var bodyClass = $("body").attr("class");
            if(bodyClass == "template-product")
            {
                    var img = $('<img id="dynamic">'); 
                      img.attr('src', '//cdn.shopifycdn.net/s/files/1/0025/5357/7541/t/9/assets/white-bag.png?2046582749248740112');
                      img.appendTo(this.selectors.addToCartText);
            }
          if(bodyClass == "template-index")
            {
                   var imgplus =$('<i class="fas fa-plus"></i>');
               		imgplus.appendTo(this.selectors.addToCartText);
            }
          
          $(this.selectors.shopifyPaymentButton, this.$container).show();
        } else {
           console.log("else")
          // The variant doesn't exist, disable submit button and change the text.
          // This may be an error or notice that a specific variant is not available.
          $(this.selectors.addToCart).prop('disabled', true);
          $(this.selectors.addToCartText).text(theme.strings.soldOut);
          $(this.selectors.shopifyPaymentButton, this.$container).hide();
        }
      } else {
         console.log("ifelse")
        $(this.selectors.addToCart).prop('disabled', true);
        $(this.selectors.addToCartText).text(theme.strings.unavailable);
        $(this.selectors.shopifyPaymentButton, this.$container).hide();
      }
    },

    _updateAvailability: function(evt) {
      // update form submit
      this._updateAddToCart(evt);
      // update live region
      this._updateLiveRegion(evt);

      this._updatePrice(evt);
    },

    _updateImages: function(evt) {
      var variant = evt.variant;
      var imageId = variant.featured_image.id;

      this._switchImage(imageId);
      this._setActiveThumbnail(imageId);
    },

    _updatePrice: function(evt) {
      var variant = evt.variant;

      var $priceContainer = $(this.selectors.priceContainer, this.$container);
      var $regularPrice = $(this.selectors.regularPrice, $priceContainer);
      var $salePrice = $(this.selectors.salePrice, $priceContainer);

      // Reset product price state
      $priceContainer
        .removeClass(this.classes.productUnavailable)
        .removeClass(this.classes.productOnSale)
        .removeAttr('aria-hidden');

      // Unavailable
      if (!variant) {
        $priceContainer
          .addClass(this.classes.productUnavailable)
          .attr('aria-hidden', true);
        return;
      }

      // On sale
      if (variant.compare_at_price > variant.price) {
        $regularPrice.html(
          theme.Currency.formatMoney(
            variant.compare_at_price,
            theme.moneyFormat
          )
        );
        $salePrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
          $priceContainer.addClass(this.classes.productOnSale);
         var a= Math.round((( variant.compare_at_price - variant.price )* 100)/ variant.compare_at_price)*100;
       
		var ttx= theme.Currency.formatMoney(a, theme.moneyFormat);
        var valtxt = ttx.replace('.00', '').replace('£', '').replace('$', '').replace('€', '');
            
       	$(".save").text("SAVE "+ valtxt +"%");
         $(".save").css("display","block");
      } else {
        // Regular price
        $regularPrice.html(
          theme.Currency.formatMoney(variant.price, theme.moneyFormat)
        );
         $(".save").css("display","none");
      }
    },

    _updateSKU: function(evt) {
      var variant = evt.variant;

      // Update the sku
      $(this.selectors.SKU).html(variant.sku);
    },

    onUnload: function() {
      this.$container.off(this.settings.namespace);
    }
  });

  function _enableZoom(el) {
    var zoomUrl = $(el).data('zoom');
    $(el).zoom({
      url: zoomUrl
    });
  }

  function _destroyZoom(el) {
    $(el).trigger('zoom.destroy');
  }

  return Product;
})();

theme.Quotes = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideCount: 0
  };
  var defaults = {
    accessibility: true,
    arrows: false,
    dots: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  function Quotes(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.quotes-wrapper');
    var slider = (this.slider = '#Quotes-' + sectionId);
    var $slider = $(slider, wrapper);

    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, defaults);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Quotes;
})();

theme.slideshows = {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var slideshow = (this.slideshow = '#Slideshow-' + sectionId);

    $('.slideshow__video', slideshow).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn(
  {},
  theme.SlideshowSection.prototype,
  {
    onUnload: function() {
      delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
      var $slideshow = $(this.slideshow);

      // Ignore the cloned version
      var $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
      // Resume autoplay
      $(this.slideshow).slick('slickPlay');
    }
  }
);


$(document).ready(function() {
  var sections = new theme.Sections();

  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('collection-template', theme.Filters);
  sections.register('product-template', theme.Product);
  sections.register('header-section', theme.HeaderSection);
  sections.register('map', theme.Maps);
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('quotes', theme.Quotes);
});

theme.init = function() {
  theme.customerTemplates.init();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'scrollable-wrapper'
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"],' +
    '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
    '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'video-wrapper'
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  slate.a11y.accessibleLinks({
    messages: {
      newWindow: theme.strings.newWindow,
      external: theme.strings.external,
      newWindowExternal: theme.strings.newWindowExternal
    },
    $links: $('a:not([aria-describedby], .product-single__thumbnail)')
  });

  theme.FormStatus.init();
};

$(theme.init);


/*** donation code ***/

$(document).ready(function(){ 
  
    var product_variant_donations,donation_index,donation_amt;

    product_variant_donations = $('.product_variant_donations').val();
    donation_index = $('.donation_index').val();
    donation_amt = $('.donation_amt').val();
    var fixedAmountButtons = $('[name="donation-fixed-amount"]'),
      donationVariableAmount = $('.donation-variable-amount__input'),
      cartCountSelector = 'body .cart, #cart-count a:first, #gocart p a, #cart .checkout em, .item-count',
      cartFormButtons = $('form[action="/cart"]').find('[name="update"], [name="checkout"], [name="goto_pp"], [name="goto_gc"]'),
      data = { updates: {} },
      qty = 0,
      variantId,
      isFixedAmount = true,
      updateDonation = function() {
        isFixedAmount = false;
        fixedAmountButtons.each(function() {
          variantId = $(this).val();
          if (variantId) {
            if ($(this).is(':checked')) {
              data['updates'][variantId] = 1;
              isFixedAmount = true;
            }
            else {
              data['updates'][variantId] = 0;
            }
          }
        });    
        if (isFixedAmount) {
          donationVariableAmount.val('');
          data['updates'][product_variant_donations] = 0;
        }
        else {
          qty = parseInt(donationVariableAmount.val().replace(/[^0-9.,]/,''), 10) || 0;
          data['updates'][product_variant_donations] = qty;
        }
        $.ajax({
          type: 'POST',
          url: '/cart/update.js', 
          data: $('form[action="/cart"]').serialize(),
          dataType: 'json',
          success: function() {
            $.ajax({
              type: 'POST',
              url: '/cart/update.js',
              data: data,
              dataType: 'json',
              success: function() {
                window.location.href = '/cart';
              }
            });
          }      
        });
      };

    // Hide quantity box in cart form for variable donation amount.
    // Update cart item count too, so that a variable amount counts as 1 item.
    
    if(donation_amt > 0){
      jQuery('form[action="/cart"] [name^="updates"]:eq(donation_index)').css('visibility', 'hidden');
      if (cartCountSelector && jQuery(cartCountSelector).size()) {
        var value = $(cartCountSelector).first().html();
        var cart_json = $('.cart_json').html();
        $(cartCountSelector).first().html(value.replace(/[0-9]+/, cart_json));
      }      
    }

    // Automatically add the donation when a button is clicked or variable amount changes.
    fixedAmountButtons.bind('click', function() {
      if ($(this).is('.active')) {
        $(this).prop('checked', false);
        $(this).removeClass('active');
        if ($(this).val()) {
          updateDonation();
        }
        else {
          donationVariableAmount.val('');
          donationVariableAmount.prop('disabled', true).addClass('donation-variable-amount__input--disabled');
          updateDonation();
        }
      }
      else {
        fixedAmountButtons.removeClass('active');
        $(this).addClass('active');
        if ($(this).val()) {
          updateDonation();
        }
        else {
          donationVariableAmount.prop('disabled', false).removeClass('donation-variable-amount__input--disabled').get(0).focus();
        }
      }
    });

    // If Enter key is pressed while input box has focus, update donation.
    donationVariableAmount.bind('keypress', function(e) {
      if (e.which === 13) {
        updateDonation();
        return false;
      }
    });

    // If Donation amount has changed, update donation.
    donationVariableAmount.bind('change, blur', function() {
      cartFormButtons.prop('disabled', true);
      updateDonation();
    });
  
    $("#gift_aid").change(function() {
       var donation_price = $('.donate_price').val();
       var ischecked= $(this).is(':checked');
      
      if(ischecked == true){
         $('.ordernotes_giftaid').html(donation_price);
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: {note: donation_price},
            dataType: 'json',
            success: function(response){
            },
            error: function(xhr) { // if error occured
             alert(xhr.statusText + xhr.responseText);
            },
            complete: function() {
            }
          });
        Shopify.updateCartAttributes({'Gift Aid declaration' : "Yes"}, function(){});
      }else{
        $('.ordernotes_giftaid').html("");
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: {note: " "},
            dataType: 'json',
            success: function(response){
            },
            error: function(xhr) { // if error occured
             alert(xhr.statusText + xhr.responseText);
            },
            complete: function() {
            }
          });
      
        Shopify.updateCartAttributes({'Gift Aid declaration' : "No"}, function(){});        
      }
     //alert('uncheckd ' + $(this).val());
    });
     
  });


$(document).ready(function() {
  
 // Product Accordion 
  
  $('.accordion-body').hide();
  $('.accordion-header').click(function() {
    if($(this).hasClass('current')) {
      $(this).removeClass('current');
      $(this).siblings('.accordion-body').slideUp(700);
    }
    else {
      $(this).siblings('.accordion-body').slideUp(700);
      $(this).siblings().removeClass('current');
      $(this).addClass('current');
      $(this).next().slideDown(700);
    }
  });
  
  $('.product-aggregate-review').click(function(e){
    e.preventDefault();
    var current = $('.review_header').attr("class");
    if(current.indexOf("current")!=-1){
    }else{
      $('.accordion-header').removeClass('current');
      $('.accordion-body').slideUp(700);
      $('.review_header').addClass('current');
      $('.review_header').next().slideDown(700);
    }    
    $('html, body').animate({
     scrollTop: $(".product-accordion").offset().top - 126
    }, 500);
    
  });
  
  
  
//Qty
  
  $(".quanBtn1").click(function(e){   
   var getId =  $(this).attr("data-val");
    var cartQuan = $(".proquan-"+getId).val();

    if($(this).attr("value")=="-")
    {
     var valget1 = parseInt(cartQuan)-1;
      
    	if(valget1<1)
        { 
        	valget1=1;
        }
      
    }
    else{
       var valget1 = parseInt(cartQuan)+1
    }
   $(".proquan-"+getId).attr("value",valget1);
    
  });
  
  
 

  
  $(".quanBtn").click(function(e){   
   var getId =  $(this).attr("data-val");
    var cartQuan = $(".cartquan-"+getId).val();
  
    if($(this).attr("value")=="-")
    {
     var valget = parseInt(cartQuan)-1;
      
    	if(valget<1)
        { 
        	//valget=1;
          $(".cartid-"+getId).remove();
         console.log( $(this).parentsUntil('tr').attr('class'))
        }
      
    }
    else{
       var valget = parseInt(cartQuan)+1
    }
       $(".cartquan-"+getId).attr("value",valget)
   
   jQuery.post('/cart/update.js', "updates["+getId+"]="+valget); 
    setTimeout(function(){
           
  	 window.location.href = 'https://battersea-shop.myshopify.com/cart';
   // window.location.reload();
     
    }, 100);   
  });
  
  //// End QTY Button
  
  
  
  /// Stricky Cart Start
  
  /*  Cart - should be sticky start */

if($('body').attr('class') == "template-cart"){
  
  var rightwidth = $('.prd-sticky-anchor').width();
  var fixmeTop = $('.cartslider').offset().top;

  
	$(window).scroll(function() {
         var currentScroll = $(window).scrollTop();
      var a=$('.prd-sticky-anchor').height();
      var b=$('.cartslider').height();
      if(a > b){
       		 if (currentScroll >= fixmeTop) {
            		$('.cartslider').css({
                	position: 'fixed',
                	top:10,
                	width:283
           		});
      
    		} else {
              $('.cartslider').css({
                  position: 'static',
                  width:283
              });
    		}
      }
      else{
      }
  	var cart_height = $(".cartslider").height();
  	var div1 = $(".cartslider");
  	var div5 = $(".empty-page-content");
    var div4 = $("#shopify-section-footer ");
    var div3 = $("#shopify-section-newsletter");
     var div2 = $(".related-products");
      var div2_text = div2.html();
      var div1_top = div1.offset().top;
      if(div2_text!= undefined){
         var div2_top = div2.offset().top;
      }else{
        var div2_top = 700.5;
      }
    var div1_bottom = div1_top + div1.height();
    var div2_bottom = div2_top + div2.height()+ div3.height() + div4.height()+ div5.height();
 	var ppadding = 0; 
   	var pfooter_top = $(".stop-sticky").offset().top;
    if (div1_bottom >= div2_top && div1_top < div2_bottom) {
      //console.log("touch");
       $('.cartslider').css({top: (currentScroll + cart_height - pfooter_top + ppadding -0) * -1})
       
    }
  
});
}
 
  
  // Account Tab 
  $(".tab-content").hide();
  $(".tab-content:first").show();
  $('.account-tab-header li:first').addClass('active');
  $('.account-tab-header li').click(function() {
    var tabActive = $(this).attr('data-tab');
    console.log(tabActive);
    if ($(this).hasClass('active')) {
      
    }
    else {
      $('.account-tab-header li').removeClass('active');
      $(this).addClass('active');
      $(".tab-content").hide();
      $('#'+ tabActive).show();
    }
  });
  

  
});


//slick slider

$(document).ready(function(){
  
  console.log("wid"+$(window).width())

  
	if( $(window).width() <= 749 )
    {
      $('.mobileViewSlider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      infinite: true, 
      arrows : false
    	});								
    
    }
  else
  {
    $('.descktopView').slick({
      vertical : true,
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: false,
      infinite: true, 
      arrows : true,
      centerMode: false
 
    });
  }


});




///// Mobile Menu Fixed

//$(document).ready(function() {
$("#menu_icon").click(function() {
	//alert("");
  $("nav").removeClass("js-menu--is-open");
  $("nav").toggleClass("menu_show");
  //$("nav").removeClass("menu_show");
  $("#PageContainer").addClass("margin_top");
  
});
//});
$(document).ready(function() {
  //$("ul").css({dispaly:none});
		$("#mobile-nav-accordian button").click(function() {
				var link = $(this);
				var closest_ul = link.closest("ul");
				var parallel_active_links = closest_ul.find(".active")
				var closest_li = link.closest("li");
				var link_status = closest_li.hasClass("active");
				var count = 0;

				closest_ul.find("ul").slideUp(function() {
						if (++count == closest_ul.find("ul").length)
								parallel_active_links.removeClass("active");
				});

				if (!link_status) {
						closest_li.children("ul").slideDown();
						closest_li.addClass("active");
				}
		})
        
        var deviceHeight = $(window).height();
          var headerHeight = $(".mobile_site_header").height();
          var mobileNavHeight = deviceHeight - headerHeight;
    	  
  		  $(".mobile-nav-wrapper").css({'height': mobileNavHeight+"px", 'overflow': "auto" });
})







$(document).ready(function(){
  
   $('.related_prod').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: false,
      infinite: true, 
      arrows : true,
      responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 749,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    
  ]
    });
  
  


});


//Slidy Cart
$(document).ready(function()
{
  	var cart_co;  
	overlayfun();
	$('.Slidy_overlay').hide();
  	$('.homepageProduct').submit(function(){
    	var id = $('#ProductSelect-1537885202901').val();   
   		var qty = 1;
    	var data_content = {  quantity: qty,  id: id };    
        $.ajax({
              type: 'POST',
               url: '/cart/add.js',
               data: data_content,
               dataType: 'json',
               beforeSend: function() {          
                  $(".loading").css("display","block");
              },
               success: function(response){
                    sliderhtml(); 
                    overlayshowfun();                     
          },
          error: function(response){
           console.log(response)
          }
        });
   		 return false;    
  	});
  
  
  	$('.product-form-product-template').submit(function(){
    	var id = $('#ProductSelect-product-template').val();   
   		var qty = $('#Quantity').val();
    	var data_content = {  quantity: qty,  id: id };    
        $.ajax({
              type: 'POST',
               url: '/cart/add.js',
               data: data_content,
               dataType: 'json',
               beforeSend: function() {          
                  $(".loading").css("display","block");
               },
               success: function(response){
                    sliderhtml(); 
                    overlayshowfun(); 
                    
          },
          error: function(response){
           console.log(response) 
          }
        });
   		 return false;    
  	});

	$(".site-header__cart").on("click",function(){
  		sliderhtml();
    	overlayshowfun();
  	});
    $(document).on("click",".closeimag,.Slidy_overlay", function(){
	//$(".closeimag,.Slidy_overlay").on("click",function(){
  		overlayfun();
    });  
});


function overlayshowfun() {
    $(".slide-cart").css('transform','translateX(0px)');
    $(".slide-cart").css('-ms-transform','translateX(0px)');
    $(".slide-cart").css('-webkit-transform','translateX(0px)');
    $(".slide-cart").css('-moz-transform','translateX(0px)');
    $(".slide-cart").css('z-index','99999');
    $('.Slidy_overlay').show();
}

function overlayfun() {
    $(".slide-cart").css('transform','translateX(500px)');
    $(".slide-cart").css('-webkit-transform','translateX(500px)');
    $(".slide-cart").css('-ms-transform','translateX(500px)');
    $(".slide-cart").css('-moz-transform','translateX(500px)');
    $('.Slidy_overlay').hide();
}

function sliderhtml(){
  	var cart_html = "";
  	$('.slidy_content').html("");
    $('.donation-check').removeClass("active");
    $('#gift_aid').prop("checked",false);
     var slide_header = '<h3 class="text-center">My bag <img class="closeimag" src="//cdn.shopifycdn.net/s/files/1/0025/5357/7541/t/9/assets/close.png?4877218738186141121"> </h3>';
    $(".slide-cart_header").html(slide_header);
  	$.getJSON('/cart.js', function(cart) {   
      var cart_co = cart.item_count;
      if(cart_co == 0)
         {
           $('.slide-cart-form').hide();
           $('.empty-page-content').show();
         }else{
           $('.empty-page-content').hide();
           $('.slide-cart-form').show();
         }
       var donate = false;
       var donate_co = 0;
       var donate_price = '';
        for(var $t=0; $t<cart.items.length; $t++){
          if(cart.items[$t].product_title == "Donation"){
               donate_co = parseInt(donate_co) + parseInt(1);
          }
        }
      var curr_count = 0;
     	for(var $t=0; $t<cart.items.length; $t++){
          	var var_id = cart.items[$t].variant_id;
          	var cart_url = cart.items[$t].url;
            if(cart.items[$t].product_title == "Donation"){
              donate = "true";
              curr_count = parseInt(curr_count) + parseInt(1);
              var qun_price = cart.items[$t].price * cart.items[$t].quantity;
              var donprice = theme.Currency.formatMoney(qun_price, theme.moneyFormat);
              donate_price += donprice;
              if(curr_count!=donate_co){
                donate_price += ',';
              }
            }
          	cart_url = cart_url.split('?variant=');
              $('.donation-'+var_id).addClass("active");  
              $('.donation-'+var_id).prop("checked",false);
              $.getJSON(''+cart_url[0]+'.js', function(product) { 
                var comprice = theme.Currency.formatMoney(product.compare_at_price, theme.moneyFormat);
                var hidprice = '<input type="hidden" name="comprice" class="com-price com-price-'+var_id+'" value="'+comprice+'">';
                $('body').append(hidprice);
              });
        }	
      $('.donate_price').val('Donation - '+donate_price);
      if(donate == "true"){
        $('.declaration').show();
        
      }else{
        $('.declaration').hide();
      }
   	});
    $.getJSON('/cart.js', function(cart) {
    	var curr = $('select.currency-picker').val();
        var cart__total = theme.Currency.formatMoney(cart.total_price, theme.moneyFormat);
        var sub = "<span>"+cart__total+"</span>";
        var cart_co = cart.item_count;
        $("#CartCount span").text(cart_co);
        $('.cart__subtotal').html(sub);
      
        if(cart_co == 0)
         {           
           $("#CartCount span").css("color","#000");
           $("#Path_2").css({ fill: "#000",stroke: "#000" });
           $(".site-header__cart svg").find("path").css({ fill: "#000",stroke: "#000" });         
         }
         else

         {
           $("#CartCount span").css("color","#fc511f");
                      $("#Path_2").css({ fill: "#fc511f",stroke: "#fc511f" });
          $(".site-header__cart svg").find("path").css({ fill: "#fc511f",stroke: "#fc511f" });

          $('.ajax-donation').show();
         }
        var $line = 1;
        for($t=0; $t<cart.items.length; $t++){
            var loop_in = parseInt($t)+parseInt(1);
            cart_html += '<tr class="cart__row cart-items-slide" data-vid="'+cart.items[$t].variant_id+'" data-url="'+cart.items[$t].url+'">';
              if(cart.items[$t].product_title == "Donation"){
                var url = 'javascript:void(0);';
              }else{
                var url = cart.items[$t].url;
              }
            if(cart.items[$t].image!=null){
              cart_html +='<td class="cart__image-wrapper"><a href="'+url+'"><img class="cart__image" src="'+cart.items[$t].image+'" alt="'+cart.items[$t].product_title+'"></a></td>';
            }else{
              cart_html +='<td class="cart__image-wrapper"><a href="'+url+'"><img class="cart__image" src="https://cdn.shopifycdn.net/s/assets/no-image-100-c91dd4bdb56513f2cbf4fc15436ca35e9d4ecd014546c8d421b1aece861dfecf_95x95@2x.gif" alt="'+cart.items[$t].product_title+'"></a></td>';
            }
            cart_html +='<td class="cart__meta slide_item_content">';
            cart_html +='<div class="product_title">';
            cart_html += '<a href="'+url+'"><span class="slide_title">'+cart.items[$t].product_title+'</span></a>';
            cart_html += '</div>';
            var compr = $('.com-price-'+cart.items[$t].variant_id).val();
            var cart_url = cart.items[$t].url;
            cart_url = cart_url.split('?variant=');
            cart_html += '<div class="slide_comprice">';
            cart_html += '<span class="item-id-'+cart.items[$t].variant_id+'"></span>';
            cart_html += '</div>';
          
            var product_title = cart.items[$t].product_title;
            if(product_title == "Donation" || cart.items[$t].variant_options[0] == "Default Title"){
            }else{
                var options = cart.items[$t].variant_options;
                if(options == null)
                {
                  cart_html += '<div class="item_size"></div>';
                }
                else
                {
                  for($op=0; $op<cart.items[$t].variant_options.length; $op++){
                    cart_html += '<div class="item_size">'+cart.items[$t].variant_options[$op]+'</div>';
                  }
                }
            }
            cart_html += '<div class="cart__price-wrapper">';
            var slideprice = theme.Currency.formatMoney(cart.items[$t].price, theme.moneyFormat);
            cart_html +='<span class="money">'+slideprice+'</span>';
            cart_html +='</div>';
          
            cart_html += '<div class="cart__quantity__total">';
            cart_html += '<span class="cart__quantity slide_qty">';
            cart_html += '<div class="cart__qty">';
            cart_html +='<span lenit="'+cart.items.length+'"  class="quantity_minus quanBtn1slider" value="-" data-val="'+cart.items[$t].variant_id+'"> <i class="fas fa-minus"></i> </span>';
			cart_html +='<input  id="Quantity" name="quantity" value="'+cart.items[$t].quantity+'" min="1" class="cart__qty-input product-form__input proquanslider-'+cart.items[$t].variant_id+'" pattern="[0-9]*" disabled>';
            cart_html +='<span lenit="'+cart.items.length+'" class="quantity_add quanBtn1slider" value="+" data-val="'+cart.items[$t].variant_id+'">  <i class="fas fa-plus"></i> </span>';
            cart_html += '</div>';
            cart_html += '</span>';
          
            cart_html += '<div class="cart__total">';
            var totamnt = cart.items[$t].quantity * cart.items[$t].price;                 
            var totalprice = theme.Currency.formatMoney(totamnt, theme.moneyFormat);
            cart_html +='<span class="money totprice">'+totalprice+'</span>';
            cart_html +='</div>'; 
          
            cart_html += '</div>';
            cart_html += '<div len="'+cart.items.length+'" data-line="'+$line+'" datid="'+cart.items[$t].variant_id+'" class="cart__remove">Remove</div>';
            $line++;
            cart_html += '</div>';
            cart_html += '</div>';
            cart_html += '</td>';
            cart_html += '</tr>';  
         }      
            $('.slidy_content').html(cart_html);
          jQuery.post('/cart/update.js', {note: ""});
          $(".loading").css("display","none");
      
      
	});
  
   
   $('.cart-items-slide').each(function(){
         var url = $(this).attr("data-url");
         var id = $(this).attr("data-vid");
         url = url.split('?variant=');
         $.getJSON(''+url[0]+'.js', function(product) { 
           var comprice = theme.Currency.formatMoney(product.compare_at_price, theme.moneyFormat);
           $('.item-id-'+id).html(comprice);
         });
   });
  $(document).on("change",".slide_qty", function(){
        var qt = $(this).val();
        var cl = $(this).attr("data-id");
        var data_content = "updates["+cl+"]="+qt;
        if(cl!=undefined){
          $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: data_content,
            dataType: 'json',
            beforeSend: function() {          
                $(".loading").css("display","block");
            },
            success: function(response){
              sliderhtml(); 
              var content = $('.slidy_content').html();
            },
            error: function(xhr) { // if error occured
             alert(xhr.statusText + xhr.responseText);
             $(".loading").css("display","none");
            },
            complete: function() {
              //$(".loading").css("display","none");
            }
          });
        }
  });
    
 $(document).on("click touchstart",".cart__remove",function(){ 
     
     var productId= $(this).attr("datid");
     var qtv = 0;
     var data_content = "updates["+productId+"]="+qtv;
     var lengthcart = $(this).attr("len")-1;
   
     $.ajax({
       type: 'POST',
       url: '/cart/update.js',
       data: data_content,
       dataType: 'json',
       beforeSend: function() {          
          $(".loading").css("display","block");
       },
       success: function(response){
         if(lengthcart == 0)
         {
           overlayfun();
           $("#CartCount span").text(lengthcart);
           $("#CartCount span").css("color","#000");
            $(".site-header__cart svg").find("path").css({ fill: "#000",stroke: "#000" }); 
		}
         else
         {
           sliderhtml(); 
           $("#CartCount span").text(lengthcart);
           $("#CartCount span").css("color","#fc511f");
           $(".site-header__cart svg").find("path").css({ fill: "#fc511f",stroke: "#fc511f" });
         }
         if(productId == "17919252791365"){
           $('#donation-variable').removeClass('active');
           $('#donation-variable').prop('checked',false);
           $('.donation-variable-amount__input').val(0);
         }
       },
       error: function(xhr) { // if error occured
       	 alert(xhr.statusText + xhr.responseText);
         $(".loading").css("display","none");
        },
        complete: function() {
          //$(".loading").css("display","none");
        }
     }); 
  }); 
  
   $(document).on('click', '.quanBtn1slider', function(e){ 
     var getId =  $(this).attr("data-val");
     var cartQuanslider = $(".proquanslider-"+getId).val();
     var lengthcart1 = $(this).attr("lenit")-1;
     if($(this).attr("value")=="-")
     {
       var valget1 = parseInt(cartQuanslider)-1;
       if(lengthcart1 == 0 && valget1 == 0)
         {
           overlayfun();
           $("#CartCount span").text(lengthcart1);
            $("#CartCount span").css("color","#000");
           $("#Path_2").css({ fill: "#000",stroke: "#000" });
            $(".site-header__cart svg").find("path").css({ fill: "#000",stroke: "#000" });
         }
     }
     else
     {
       var valget1 = parseInt(cartQuanslider)+1
     }
     $(".cartquanslider-"+getId).attr("value",valget1);
     var data_content = "updates["+getId+"]="+valget1;
     if(getId!=undefined){
       $.ajax({
         type: 'POST',
         url: '/cart/update.js',
         data: data_content,
         dataType: 'json',
         beforeSend: function() {          
            $(".loading").css("display","block");
         },
         success: function(response){
           sliderhtml(); 
           var content = $('.slidy_content').html();
         },
           error: function(xhr) { // if error occured
             alert(xhr.statusText + xhr.responseText);
            
          },
          complete: function() {
            //$(".loading").css("display","none");
          }
       });
     }
  });
    $('.Slidy_chkout').click(function(){
      window.location.href="/cart";
      return false;
    });
}
// End Slidy Cart Function
 
$(document).ready(function() {

     
  
$('.feature-collection-slider').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 749,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    
  ]
});
  
    //hang on event of form with id=myform
    $("#create_customer").submit(function(e) {
      
       var flag = 1;
      var result=true;
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
       var email = $('#Email').val();
      var message = $('#CreatePassword').val();
      var pass=/^[a-zA-Z0-9]{5,}/;
      var msg = '';
      
      if(!regex.test(email)){
        flag=0;
        msg += '<li>Invalid email address</li>';
      }
      if(!pass.test(message)){
        flag=0;
        msg += '<li>Minimum 5 characters needed</li>';
      }  
  /*    
      if($('.condition_agree input').is(":checked") == false)
      {
        flag=0;
        msg += '<li>Please check checkbox</li>';
         
      }*/
   
 
      if(flag == '1'){
        
         return result;
      }
        
	else{
      	$('.errors ul').html('');
      	$('.errors ul').html(msg);
        $('.errors').show();

       
      console.log('dsd');
      
        return false;
      }
    });
  


  /*  collection top - should be sticky start */
  
  
  
  //// Search Sort By
  	$(function(){
      // bind change event to select
      $('#searchSortBy').on('change', function () {
          var url = $(this).val(); // get selected value
          if (url) { // require a URL
              window.location = 'collections/all?sort_by='+ url +'#MainContent' // redirect
          }
          return false;
      });
    });
  
  //// End Search Sort by



  
  function fixed_filterbar(){ 
  
if($('body').attr('class') == "template-collection"){  
  //$('.sticky-sorting').hide();
 $('.filter-sticky').removeAttr('style');
    var ftwdistance = $('.filters-toolbar-wrapper').offset().top;
    var no_jerk_margin = 15;
  
  		var fixmeTop = $('.site-header').height();
  $window = $(window);
	$window.scroll(function() {
     
         var currentScroll = $(window).scrollTop();
       		 if (currentScroll >= (ftwdistance - fixmeTop - no_jerk_margin)) {
               //$('.sticky-sorting').show();
                $('.non-sticky').addClass("fixed");
              // $('.fixed').show();
            		$('.fixed').css({
                	position: 'fixed',
                	top:fixmeTop,
                	
           		});
      
    		} else {
               $('.non-sticky').removeClass("fixed"); 
               //$('.sticky-sorting').hide();
              $('.non-sticky').css({
                  position: 'static',
                  top:0,
                  
              });
              
    		}
  	var cart_height = $(".non-sticky").height();
  	var div1 = $(".non-sticky");
  	var div3 = $("#shopify-section-footer");
    var div2 = $("#shopify-section-newsletter");
    
    var div1_top = div1.offset().top;
      
    var div2_top = div2.offset().top;
      
    var div1_bottom = div1_top + div1.height();
      //console.log(div1_bottom);
    var div2_bottom = div2_top + div2.height() + div3.height();
     
 	var ppadding = 0; 
   	var pfooter_top = $("#shopify-section-footer").offset().top;
       	var pfooter_top = $(".stop-sticky").offset().top;
    if (div1_bottom >= div2_top && div1_top <= div2_bottom) {
      $('.non-sticky').removeClass("fixed");
      //console.log("touch");
       //$('.sticky-sorting').hide();
       $('.non-sticky').css({top: (currentScroll + cart_height - pfooter_top - ppadding) * -1})
       
    }
  
});

} 
}
  /*  collection top - should be sticky end */  
  
  fixed_filterbar();
  
/*  collection top - should be sticky end */
  $(window).resize(function () {

    fixed_filterbar();
  });
  
});


   
$(window).bind("load", function() {
  var headerHeight = $('.site-header').outerHeight(); 
  $('.site-header').css('position', 'fixed');
  $('.page-container').css('padding-top', headerHeight+'px');
  
});

$(document).ready(function(){
  	
  var wishlist = GetURLParameter('wishlist');
  
    if(wishlist!=undefined){
      $(".tab-content").hide();
      $('.account-tab-header li').removeClass("active");
      $('.wishlist-tab').addClass("active");
      $('#account-whislist').show(); 
    }
  
jQuery.getJSON('/cart.js', function(cart) {
  if(cart.item_count == 0)
    
  {           
    $("#CartCount span").css("color","#000");
    
    $(".site-header__cart svg").find("path").css({ fill: "#000",stroke: "#000" });        
  }
  else

  {
    
    $("#CartCount span").css("color","#fc511f");
    $(".site-header__cart svg").find("path").css({ fill: "#fc511f",stroke: "#fc511f" });
  }
} );


});

function GetURLParameter(sParam)
  {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++)
      {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam)
          {
              return sParameterName[1];
          }
      }
  }


// Read more less Start//

$(document).ready(function() {

   var showChar = 200;
   var ellipsestext = "...";

   $(".truncate-product").each(function() {
     var content = $(this).html();
     console.log(content.length,showChar)
     if (content.length > showChar) {
       var c = content.substr(0, showChar);
       var h = content;
      
       var main_div =
         '<div class="truncate-text">' +
         h +
         '&nbsp;&nbsp;<a href="" class="moreless1 less">Read Less</a></span></div>';
        var truncate_div='<div class="truncate-text" style="display:block">' +
         c +
         '<span class="moreellipses">' +
         ellipsestext +
         '&nbsp;&nbsp;<a href="" class="moreless1 more">Read More</a></span></span></div>';

       $(this).html(truncate_div);
      //  console.log(truncate_div)
        $(this).next('.main-div1').html(main_div);
       $(this).prev('.truncate-div1').html(truncate_div);
     }

   });
   $(".moreless1").click(function() {
   
     var thisEl = $(this);
     console.log($(this))
     var cT = thisEl.closest(".truncate-text");
     var tX = ".truncate-text";

     if (thisEl.hasClass("less")) {
   
       $(this).closest('.main-div1').hide();
       $(this).closest('.main-div1').prev('div').prev('div').show();

     } 
     if (thisEl.hasClass("more")) {

     //   $(this).closest('.truncate-div1').hide();
      //  $(this).closest('.truncate-div1').next().next().show();
       $('.truncate-div1,.truncate-product').hide();
       $('.main-div1').show();
      
     }
     return false;
   });
});
// Read more less End//


// Account creation checkbox Start //
$(document).ready(function() {

    $("#registerCheck").click(function() {

        if ($("#registerCheck").prop("checked") == true) {
            $("#registerCheck,#registerCheckHid").attr("value", "Yes");
            $('#accepts_marketing').attr('checked', true);
            $('#accepts_marketing').attr('value', true);
        } else if ($("#registerCheck").prop("checked") == false) {
            $("#registerCheck,#registerCheckHid").attr("value", "No");
            $('#accepts_marketing').attr('checked', false);
            $('#accepts_marketing').attr('value', false);
        }


    });
  
  //Header sticky after scroll
	var distance = $('header.site-header').offset().top;
	$('header.site-header').css({'position':'absolute'});
    $(window).scroll(function () {

        var sticky = $('.cart-wrapper'),
        scroll = $(window).scrollTop();

        if (scroll >= distance) {
        		$('header.site-header').css({'position':'fixed', 'top':'0'});
        } else {
        	$('header.site-header').css({'position':'absolute', 'top': distance+'px'});
        }

    });
	
	// Hide custom section
	$('.custom-hidden-section').parent('div.shopify-section').hide();
  
});
// Account creation checkbox End //


$(window).resize(function(){
    $('header.site-header').removeAttr('style');
    $('header.site-header').css({'position':'absolute'});
	var distance = $('header.site-header').offset().top;
      $(window).scroll(function () {

          var sticky = $('.cart-wrapper'),
          scroll = $(window).scrollTop();

          if (scroll >= distance) {
          		$('header.site-header').css({'position':'fixed', 'top':'0'});
          } else {
          	$('header.site-header').css({'position':'absolute', 'top': distance+'px'});
          }

      });
});

// Open external links in new tabs //
$(document).ready( function() {
$('a[href^="http"]').not('a[href^="'+location.protocol+'//'+location.hostname+'"]').not('a[href^="/"]').attr('target', '_blank');
});
// Open external links in new tabs End //
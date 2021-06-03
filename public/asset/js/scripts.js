"use strict";

// Global functions
var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

function openPopupOverlay() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
  if ($('.pace-popup-overlay').length) return;
  $('body').append('<div class="pace-popup-overlay"></div>');
  $('body').addClass('is-lock').css('paddingRight', scrollbarWidth);
  $('.pace-popup-overlay').fadeIn(speed);
}

function closePopupOverlay() {
  var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
  $('.pace-popup-overlay').fadeOut(speed);
  setTimeout(function () {
    $('.pace-popup-overlay').remove();
  }, speed);
  $('body').removeClass('is-lock').css('padding-right', '');
}

function getRootVars() {
  var root = document.querySelector(":root");
  root.style.setProperty("--vh", window.innerHeight / 100 + "px");
} // Main functions


(function ($) {
  $.pace_noti = function (html) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2500;
    if ($('.pace-noti').length) return;
    $('body').append('<div class="pace-noti">' + html + '</div>');
    setTimeout(function () {
      $('.pace-noti').addClass('opening');
    }, 10);
    setTimeout(function () {
      $('.pace-noti').removeClass('opening');
    }, time);
    setTimeout(function () {
      $('.pace-noti').remove();
    }, time + 400);
  };

  function handleWordpressAdminMode() {
    if ($('#wpadminbar').length && $('.js-pace-navbar').length && $(window).width() <= 600) {
      $(window).on('scroll', function () {
        var top = $(window).scrollTop(),
            offsetTop = 46 - top > 0 ? 46 - top : 0;
        $('.js-pace-navbar').css('margin-top', offsetTop);
      });
    }
  }

  function initLazyLoad() {
    $('.lazy').Lazy({
      afterLoad: function afterLoad(el) {
        $(el).css('visibility', 'visible');
        handleIE();
      }
    });
  }

  function initSelect2() {
    $('.ginput_container_select select').select2({
      width: "100%",
      minimumResultsForSearch: -1
    });
  }

  function initPopup() {
    $('[data-popup-target]').on('click', function (e) {
      e.prepacetDefault();
      var popupTarget = $(this).data('popup-target'),
          popupContent = $('[data-popup-content="' + popupTarget + '"]');
      if (popupContent.length == 0) return;
      popupContent.addClass('is-active');
      openPopupOverlay();
    });
    $('[data-popup-close]').on('click', function (e) {
      e.prepacetDefault();
      $(this).closest('[data-popup-content]').removeClass('is-active');
      closePopupOverlay();
    });
    $(document).on('click', '.pace-popup-overlay', function (e) {
      $('[data-popup-content]').removeClass('is-active');
      closePopupOverlay();
    });
  }

  function handleIE() {
    var userAgent, ieReg, ie;
    userAgent = window.navigator.userAgent;
    ieReg = /msie|Trident.*rv[ :]*11\./gi;
    ie = ieReg.test(userAgent);

    if (ie) {
      $('.pace-img-drop').each(function () {
        var $container = $(this),
            imgLazy = $(this).find('img').attr('src'),
            picLazy = $(this).find('source').attr('srcset'),
            imgUrl = picLazy ? picLazy : imgLazy;

        if (imgUrl) {
          $container.css('backgroundImage', 'url(' + imgUrl + ')').addClass('custom-object-fit');
        }
      });
    }
  }

  function initAnchorScroll() {
    $('a.js-anchor-scroll[href*=\\#]:not([href=\\#])').click(function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

        if (target.length) {
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  }

  function initFormFloatLabel() {
    $('.ginput_container_select select').closest('.gfield').addClass('has-select');
    $('.pace-form-group select').closest('.pace-form-group').addClass('has-select');
    var formFields = $('.gfield, .pace-form-group');
    formFields.each(function () {
      var field = $(this);
      var input = field.find('input:not([type="radio"]):not([type="checkbox"]), textarea');
      var label = field.find('label');
      input.focus(function () {
        label.addClass('freeze');
      });
      input.focusout(function () {
        checkInput();
      });

      if (input.val() && input.val().length) {
        label.addClass('freeze');
      }

      function checkInput() {
        var valueLength = input.val().length;

        if (valueLength > 0) {
          label.addClass('freeze');
        } else {
          label.removeClass('freeze');
        }
      }

      input.change(function () {
        checkInput();
      });
    });
  }

  $(function () {
    getRootVars();
    initLazyLoad();
    initSelect2();
    initPopup();
    handleWordpressAdminMode(); // initFormFloatLabel();
    // initAnchorScroll();
  });
  $(window).on('resize', function () {
    getRootVars();
  });
})(jQuery);

(function ($) {
  function initCartPopupScrollbar() {
    $('.pace-cart-popup__inner').addClass('scrollbar-macosx').scrollbar();
  }

  $(function () {
    initCartPopupScrollbar();
  });
})(jQuery);

(function ($) {
  function DemoAdminBarMode() {
    $('#enable-admin-bar').on('change', function () {
      var adminBarModeStatus = $(this).prop('checked');

      if (adminBarModeStatus) {
        $('html').addClass('admin-bar-html');
        $('body').append('<div id="wpadminbar">WP Admin bar</div>').addClass('admin-bar');
      } else {
        $('html').removeClass('admin-bar-html');
        $('body').removeClass('admin-bar');
        $('#wpadminbar').remove();
        $('.js-pace-navbar').css('margin-top', '');
      }

      if ($(window).width() <= 600) {
        DemoNavbarMove();
        $(window).on('scroll', function () {
          DemoNavbarMove();
        });
      }

      function DemoNavbarMove() {
        var top = $(window).scrollTop(),
            offsetTop = 46 - top > 0 ? 46 - top : 0;

        if ($('#wpadminbar').length && $('.js-pace-navbar').length) {
          $('.js-pace-navbar').css('margin-top', offsetTop);
        } else {
          $('.js-pace-navbar').css('margin-top', '');
        }
      }
    });
  }

  $(function () {
    DemoAdminBarMode();
  });
})(jQuery);

(function ($) {
  function handleNavCollapse() {
    $('.navbar-toggler').on('click', function () {
      $(this).toggleClass('show');
      $('.navbar').toggleClass('show');
      $('body').toggleClass('is-lock');
    });
  }

  function handleNavbarFixed() {
    var navbar = $('.navbar');
    $(window).on('scroll', function () {
      if ($(window).scrollTop() > navbar.outerHeight()) {
        navbar.addClass('is-active');
      } else {
        navbar.removeClass('is-active');
      }
    });
  }

  $(function () {
    handleNavCollapse();
    handleNavbarFixed();
  });
})(jQuery);

(function ($) {
  function epacetChangeQuanlity() {
    $(document).on('click', 'body.woocommerce-cart .pace-box-quantity .pace-box-quantity__minus', function () {
      var qtyBox = $(this).closest('.pace-box-quantity');
      var qty = qtyBox.find('input').val();
      qty = eval(qty) > 1 ? eval(qty) - 1 : 1;
      qtyBox.find('input').val(qty);
      triggerUpdateCart();
    });
    $(document).on('click', 'body.woocommerce-cart .pace-box-quantity .pace-box-quantity__plus', function () {
      var qtyBox = $(this).closest('.pace-box-quantity');
      var qtyMax = qtyBox.find('input').attr('max');

      if (qtyMax == "") {
        qtyMax = 999;
      }

      var qty = qtyBox.find('input').val();
      qty = eval(qty) < 0 ? 1 : eval(qty) < eval(qtyMax) ? eval(qty) + 1 : qty;
      qtyBox.find('input').val(qty);
      triggerUpdateCart();
    });
    $(document).on('change', 'body.woocommerce-cart .pace-box-quantity input', function () {
      if ($(this).val() < 1) {
        $(this).val(1);
      }

      triggerUpdateCart();
    });
  }

  function triggerUpdateCart() {
    $("#update_cart").removeAttr('disabled');
    $("#update_cart").trigger('click');
  }

  $(function () {
    epacetChangeQuanlity();
  });
})(jQuery);

(function ($) {
  var buttonOrder = $('#checkout-order-trigger'),
      checkoutContent = $('.pace-checkout__content'),
      countError = 0;

  function initTermsBoxScrollbar() {
    var elBox = $('.pace-checkout-terms-box');

    if (elBox.length) {
      elBox.addClass('scrollbar-macosx');
      elBox.scrollbar();
    }
  }

  function handleCheckoutSteps() {
    $(document).on('click', '.checkout-next-step-trigger', function () {
      var currentStep = $(this).closest('.pace-checkout-steps__item'),
          blockForm = $('.pace-checkout-steps__form', currentStep),
          blockData = $('.pace-checkout-steps__data', currentStep);

      if (currentStep.data('type') == 'shipping') {
        countError = 0;

        if ($('.pace-checkout-steps__item[data-type="shipping"] .validate-required').length > 0) {
          $('.pace-checkout-steps__item[data-type="shipping"] .validate-required').each(function () {
            var thisInput = $(this);
            countError = $.validateInput(thisInput, countError);
          });
        }

        if (countError > 0) {
          $(".show-shipping-normal").trigger("click");
          return;
        }

        var shippingFirstName = $("#shipping_first_name").val(),
            shippingLastName = $("#shipping_last_name").val(),
            shippingCompany = $("#shipping_company").val(),
            shippingPhone = $("#shipping_phone").val(),
            shippingAddress = $("#shipping_address_1").val(),
            //shippingUnit = $("#shipping_address_2").val(),
        shippingCity = $("#shipping_city").val(),
            shippingPostcode = $("#shipping_postcode").val(),
            shippingState = $("#shipping_state :selected").text();

        if ($("#shipping_country").is('input')) {
          var shippingCountry = $("#shipping_country").closest('.woocommerce-input-wrapper').find('strong').text();
        } else {
          var shippingCountry = $("#shipping_country :selected").text();
        }

        var addressShipto = shippingAddress + (shippingAddress.length > 0 ? ", " : "") + shippingCity + (shippingCity.length > 0 ? ", " : "") + shippingState + (shippingState.length > 0 && shippingPostcode.length < 1 ? ", " : " ") + shippingPostcode + (shippingPostcode.length > 0 ? ", " : "") + shippingCountry;
        var fullName = shippingFirstName + ' ' + shippingLastName;
        $('#shipping-info').html(fullName + (shippingCompany.length > 0 ? '<br>' + shippingCompany : shippingCompany) + '<br>' + addressShipto + '<br>' + shippingPhone);
        $(document.body).trigger('update_checkout');
      } else if (currentStep.data('type') == 'shipping-method') {
        if ($('.shipping_method:checked').length > 0) {
          var shipping_label = $('.shipping_method:checked').closest('.pace-checkout-delivery__item').find('label .pace-checkout-delivery__title').length > 0 ? $('.shipping_method:checked').closest('.pace-checkout-delivery__item').find('label .pace-checkout-delivery__title').html() : '';
          var shipping_price = $('.shipping_method:checked').closest('.pace-checkout-delivery__item').find('label .pace-checkout-delivery__price').length > 0 ? $('.shipping_method:checked').closest('.pace-checkout-delivery__item').find('label .pace-checkout-delivery__price').html() : '';
          var shipping_description = $('.shipping_method:checked').closest('.pace-checkout-delivery__item').find('label .pace-checkout-delivery__description').length > 0 ? $('.shipping_method:checked').closest('.pace-checkout-delivery__item').find('label .pace-checkout-delivery__description').html() : '';
          $('#shipping-method-review').html(shipping_label + ' ' + (shipping_description.length > 0 ? '(' + shipping_description + ') ' : '') + shipping_price);
        }
      }

      handleCheckoutNextStep(currentStep, blockForm, blockData);
    });
    $(document).on('click', '.checkout-edit-step-trigger', function () {
      var currentStep = $(this).closest('.pace-checkout-steps__item'),
          blockForm = $('.pace-checkout-steps__form', currentStep),
          blockData = $('.pace-checkout-steps__data', currentStep);
      handleCheckoutEditStep(currentStep, blockForm, blockData);
    });
    /*$('.pace-checkout-steps__item').each(function () {
        var currentStep = $(this),
            buttonNext = $('.checkout-next-step-trigger', currentStep),
            buttonEdit = $('.checkout-edit-step-trigger', currentStep),
            blockForm = $('.pace-checkout-steps__form', currentStep),
            blockData = $('.pace-checkout-steps__data', currentStep);
          buttonEdit.on('click', function () {
            handleCheckoutEditStep(currentStep, blockForm, blockData);
        });
          buttonOrder.on('click', function () {
            handleCheckoutValidator();
        });
    });*/
  }

  function handleCheckoutNextStep(currentStep, currentForm, currentData) {
    currentStep.addClass('is-checked');
    $('.pace-checkout-steps__item.is-checked').last().next().find('.pace-checkout-steps__body').slideDown(300);
    currentForm.slideUp(300);
    currentData.slideDown(300);
    $('.pace-checkout-steps__item').removeClass('is-current');
    $('.pace-checkout-steps__item.is-checked').last().next().addClass('is-current');
  }

  function handleCheckoutEditStep(currentStep, currentForm, currentData) {
    $('.pace-checkout-steps__item').removeClass('is-current');
    $('.pace-checkout-steps__item:not(".is-checked")').find('.pace-checkout-steps__body:visible').slideUp(300);
    $('.pace-checkout-steps__item.is-checked .pace-checkout-steps__data').show();
    $('.pace-checkout-steps__item.is-checked .pace-checkout-steps__form').hide();
    currentStep.addClass('is-current');
    currentForm.slideDown(300);
    currentData.slideUp(300);
  }

  function handleCheckoutValidator() {
    $('body').addClass('is-loading-overlay is-lock');
  }

  function toggleBillingAddress() {
    var billingAddressCheckBox = $('#checkout-billing-address'),
        billingAddressContent = $('.pace-checkout-billing__body');

    if (billingAddressCheckBox.prop("checked")) {
      setBillingCountry();
    }

    billingAddressCheckBox.prop('checked') ? billingAddressContent.hide() : billingAddressContent.show();
    billingAddressCheckBox.on('change', function () {
      billingAddressCheckBox.prop('checked') ? billingAddressContent.slideUp(300) : billingAddressContent.slideDown(300);
    });
  }

  function toggleCheckoutDetail() {
    var elToggleTrigger = $('.pace-checkout__summary'),
        elToggleContent = $('.pace-checkout__sidebar');
    elToggleTrigger.on('click', function () {
      $(this).toggleClass('is-active');

      if ($(this).hasClass('is-active')) {
        elToggleContent.stop().slideDown(300);
      } else {
        elToggleContent.stop().slideUp(300);
      }
    });
  }
  /**
   * Apply coupon
   */


  function applyCoupon() {
    $(document).on('click', '#btn_coupon_code_edit', function (e) {
      e.prepacetDefault();
      var coupon = $("#coupon_code_edit").val(),
          url = $("form.woocommerce-form-coupon-edit").data("url") + "/?wc-ajax=apply_coupon",
          security_code = $("form.woocommerce-form-coupon-edit").data("nonce");

      if (coupon.length < 1) {
        return;
      }

      $.post(url, {
        coupon_code: coupon,
        security: security_code
      }, function (res) {
        $(document.body).trigger('update_checkout');
        $.pace_noti(res, 3000);
      });
    });
  }

  function showShippingManual() {
    $(".show-shipping-normal").on('click', function (e) {
      e.prepacetDefault();
      initSelect2('#shipping_state');
      $(".pace-form-manual").removeClass("d-none");
      $("#shipping_address_google").closest(".form-row").addClass("d-none");
      $(".pace-checkout-shipping-information").remove();
      var formFields = $('.gfield, .pace-form-group, .woocommerce-form-row');
      formFields.each(function () {
        var field = $(this);
        var input = field.find('input, textarea');
        var label = field.find('label');
        input.focus(function () {
          label.addClass('freeze');
        });
        input.focusout(function () {
          checkInput();
        });

        if (input.val() && input.val().length) {
          label.addClass('freeze');
        }

        function checkInput() {
          var valueLength = input.val().length;

          if (valueLength > 0) {
            label.addClass('freeze');
          } else {
            label.removeClass('freeze');
          }
        }

        input.change(function () {
          checkInput();
        });
      });
    });
  }

  function initSelect2(element) {
    if ($(element).is('select')) {
      $(element).select2({
        width: "100%",
        minimumResultsForSearch: -1
      });
    }
  }
  /**
   * Initialize google map
   */


  function initGoogleMap() {
    if ($("#google-map").length > 0) {
      $("#google-map").attr("src", $("#google-map").attr("data-src"));
    }
  }
  /**
  * Autocomplate address
  */


  function initAutocomplateAddress(element) {
    if (element.length < 1) return; //Location Lookup

    var input = element[0],
        autocomplete;

    (function pacSelectFirst(input) {
      // store the original epacet binding function
      var _addEpacetListener = input.addEpacetListener ? input.addEpacetListener : input.attachEpacet;

      function addEpacetListenerWrapper(type, listener) {
        if (type == "keydown") {
          var orig_listener = listener;

          listener = function listener(epacet) {
            var suggestion_selected = $(".pac-item-selected").length > 0;

            if (epacet.which == 13 && !suggestion_selected) {
              var simulated_downarrow = $.Epacet("keydown", {
                keyCode: 40,
                which: 40
              });
              orig_listener.apply(input, [simulated_downarrow]);
            }

            orig_listener.apply(input, [epacet]);
          };
        }

        _addEpacetListener.apply(input, [type, listener]);
      }

      input.addEpacetListener = addEpacetListenerWrapper;
      input.attachEpacet = addEpacetListenerWrapper;
      autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: {
          country: $('#shipping_country').length > 0 ? $('#shipping_country').val() : 'au'
        }
      });
    })(input);

    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();
      var adr_address = place.adr_address;
      var formatted_address = place.formatted_address;
      var name = place.name;

      if (!place.geometry) {
        return;
      }

      var premise,
          subpremise,
          street_number,
          route,
          locality,
          administrative_area_level_1,
          administrative_area_level_1_short,
          administrative_area_level_2,
          administrative_area_level_2_short,
          postal_code,
          country,
          country_short,
          address = '',
          address_2 = '';

      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];

        if (addressType == "premise") {
          premise = place.address_components[i].long_name;
        } else if (addressType == "subpremise") {
          subpremise = place.address_components[i].long_name;
        } else if (addressType == "street_number") {
          street_number = place.address_components[i].long_name;
        } else if (addressType == "route") {
          route = place.address_components[i].long_name;
        } else if (addressType == "locality") {
          locality = place.address_components[i].long_name;
        } else if (addressType == "administrative_area_level_1") {
          administrative_area_level_1 = place.address_components[i].long_name;
          administrative_area_level_1_short = place.address_components[i].short_name;
        } else if (addressType == "administrative_area_level_2") {
          administrative_area_level_2 = place.address_components[i].long_name;
          administrative_area_level_2_short = place.address_components[i].short_name;
        } else if (addressType == "postal_code") {
          postal_code = place.address_components[i].long_name;
        } else if (addressType == "country") {
          country = place.address_components[i].long_name;
          country_short = place.address_components[i].short_name;
        }
      }

      if (typeof subpremise != 'undefined') {
        address += subpremise + '/';
      }

      if (typeof premise != 'undefined') {
        address += premise + ' ';
      }

      if (typeof street_number != 'undefined') {
        address += street_number + ' ';
      }

      if (typeof route != 'undefined') {
        address += route;
      }

      $("#shipping_address_1").val(address);

      if ($("#shipping_address_2").length > 0) {
        $("#shipping_address_2").val(address_2);
      } //element.val(formatted_address);


      if ($("#shipping_state_field").attr('style') == 'display: block;') {
        if (typeof administrative_area_level_1 != 'undefined') {
          if ($("#shipping_state").is('input')) {
            $("#shipping_state").val(administrative_area_level_1);
          } else {
            $("#shipping_state").val(administrative_area_level_1_short).trigger('change');
          }
        }
      } else {
        if (typeof administrative_area_level_1 != 'undefined') {
          if (typeof administrative_area_level_2 != 'undefined') {
            administrative_area_level_1 = administrative_area_level_1.length > 0 ? administrative_area_level_2 + ', ' + administrative_area_level_1 : administrative_area_level_2;
          }

          $("#shipping_city").val(administrative_area_level_1);
        } else {
          $("#shipping_city").val("");
        }
      }

      if (typeof locality != 'undefined') {
        $("#shipping_city").val(locality);
      }

      if (typeof postal_code != 'undefined') {
        $("#shipping_postcode").val(postal_code);
      } else {
        $("#shipping_postcode").val("");
      } //Open manual input after selected address
      //$(".show-shipping-normal").trigger("click");

    });
    $(document).on('change', '#shipping_country', function () {
      if ($(this).val() != "") {
        setBillingCountry();
        autocomplete.setComponentRestrictions({
          'country': $(this).val()
        });
      }
    });
    $(document).on('change', '#shipping_state', function () {
      if ($(this).val() != "") {
        setBillingCountry();
      }
    });
  }

  function setBillingCountry() {
    $('.pace-form-group select').closest('.pace-form-group').addClass('has-select');
    var shipping = $('#shipping_country').val();
    var shipping_state = $('#shipping_state').val();

    if ($("#checkout-billing-address:checked").length > 0) {
      $('#billing_country').val(shipping).trigger('change');
      $('#billing_state').val(shipping_state).trigger('change');
    }
  }

  function guestCheckout() {
    $('.continue-as-guest').click(function () {
      $('.pace-user-form').addClass('d-none');
      $('.checkout.woocommerce-checkout').removeClass('d-none');
    });
  }

  function switchCheckoutLogin() {
    $('.checkout-login-target').on('click', function (e) {
      e.prepacetDefault();
      var $target = $(this).attr('href');
      $('.pace-checkout-login.is-active').removeClass('is-active');
      $($target).addClass('is-active');
    });
  }

  $(function () {
    initGoogleMap();
    $("#google-map").on("load", function () {
      initAutocomplateAddress($("#shipping_address_google"));
    });
    initTermsBoxScrollbar();
    handleCheckoutSteps();
    toggleBillingAddress();
    toggleCheckoutDetail();
    setBillingCountry();
    applyCoupon();
    showShippingManual();
    guestCheckout();
    switchCheckoutLogin();
  });
})(jQuery);

(function ($) {
  var isLogin = false;

  (function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
  /* Init Login Facebook */


  window.fbAsyncInit = function () {
    FB.init({
      appId: '3349125235150681',
      cookie: true,
      // Enable cookies to allow the server to access the session.
      xfbml: true,
      // Parse social plugins on this webpage.
      version: 'v5.0' // Use this Graph API version for this call.

    });
  };

  $(function () {
    $('.ec-btn-facebook').on('click', function () {
      if (isLogin) {
        return;
      }

      isLogin = true;
      FB.login(function (response) {
        if (response.status === 'connected') {
          facebook_login_connected_callback();
        }
      }, {
        scope: 'public_profile,email'
      });
    });
    /* Call Ajax Register Login By Facebook */

    function facebook_login_connected_callback() {
      FB.api('/me', {
        fields: 'id,name,first_name,last_name,picture,verified,email'
      }, function (response) {
        var provide_id = '';
        var first_name = '';
        var last_name = '';
        var name = '';
        var email = '';
        var picture = '';

        if (typeof response.id === "undefined") {
          console.log("Can not get provide id ");
          isLogin = false;
          return false;
        } else {
          provide_id = response.id;
        }

        if (typeof response.first_name !== "undefined") {
          first_name = response.first_name;
        }

        if (typeof response.last_name !== "undefined") {
          last_name = response.last_name;
        }

        if (typeof response.name !== "undefined") {
          name = response.name;
        }

        if (typeof response.email === "undefined") {
          console.log("Can not get provide id ");
          isLogin = false;
          return false;
        } else {
          email = response.email;
        }

        if (typeof response.picture.data.url !== "undefined") {
          picture = response.picture.data.url;
        }

        jQuery.ajax({
          url: wp_vars['rest_url'] + 'api/v1/auth/register',
          type: 'POST',
          cache: false,
          data: {
            "type": "facebook",
            "id": provide_id,
            "first_name": first_name,
            "last_name": last_name,
            "display_name": name,
            "email": email,
            "picture": picture
          }
        }).done(function (response) {
          location.reload();
        }).fail(function (res) {
          isLogin = false;
          var message = typeof res.responseJSON.message != 'undefined' ? res.responseJSON.message : '';

          if (message !== "") {
            $.pace_noti(message, 3000);
          }
        });
      });
    }

    $('#form-login').on('submit', function (epacet) {
      epacet.prepacetDefault();
      var form = $(this);
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var message = '';
      var email = form.find('input[name="email"]');
      var password = form.find('input[name="password"]');
      form.find('.pace-form-group--error').removeClass('pace-form-group--error');
      form.find('.invalid-message').remove();

      if (email.val() == "") {
        message = 'Email address is required.';
        email.closest(".pace-form-group").addClass('pace-form-group--error');
        email.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      } else if (!regex.test(email.val())) {
        message = 'Please enter a valid email address.';
        email.closest(".pace-form-group").addClass('pace-form-group--error');
        email.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      }

      if (password.val() == "") {
        message = 'Password is required.';
        password.closest(".pace-form-group").addClass('pace-form-group--error');
        password.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      }

      var data = form.serialize();
      $.ajax({
        url: wp_vars['rest_url'] + 'api/v1/auth/login',
        type: 'POST',
        dataType: 'json',
        cache: false,
        data: data,
        beforeSend: function beforeSend(xhr) {
          form.find('.is-loading').removeClass('is-loading');
          form.find('button').addClass('is-loading');
        }
      }).done(function (response) {
        var formdata = {};
        form.serializeArray().map(function (x) {
          formdata[x.name] = x.value;
        });
        form.find('.is-loading').removeClass('is-loading');
        var url_referer = typeof formdata.url_referer !== 'undefined' && formdata.url_referer != '' ? formdata.url_referer : '';

        if (url_referer != "") {
          window.location.href = url_referer;
        } else {
          location.reload();
        }
      }).fail(function (res) {
        form.find('.is-loading').removeClass('is-loading');
        var message = typeof res.responseJSON.message != 'undefined' ? res.responseJSON.message : '';

        if (message !== "") {
          $.pace_noti(message, 3000);
        }
      });
      ;
    });
  });
})(jQuery);

(function ($) {
  function signUpWidthEmail() {
    if ($('#form-register').length < 1) return;
    $('#form-register').on('submit', function (epacet) {
      epacet.prepacetDefault();
      var form = $(this);
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var message = '';
      var email = form.find('input[name="email"]');
      var password = form.find('input[name="password"]');
      var confPassword = form.find('input[name="conf-password"]');
      form.find('.pace-form-group--error').removeClass('pace-form-group--error');
      form.find('.invalid-message').remove();

      if (email.val() == "") {
        message = 'Email address is required.';
        email.closest(".pace-form-group").addClass('pace-form-group--error');
        email.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      } else if (!regex.test(email.val())) {
        message = 'Please enter a valid email address.';
        email.closest(".pace-form-group").addClass('pace-form-group--error');
        email.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      }

      if (password.val() == "") {
        message = 'Password is required.';
        password.closest(".pace-form-group").addClass('pace-form-group--error');
        password.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      }

      if (confPassword.val() == "") {
        message = 'Confirm password is required.';
        confPassword.closest(".pace-form-group").addClass('pace-form-group--error');
        confPassword.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      } else if (confPassword.val() != password.val()) {
        message = 'Password and confirm password does not match';
        confPassword.closest(".pace-form-group").addClass('pace-form-group--error');
        confPassword.closest(".pace-form-group").append('<div class="invalid-message">' + message + '</div>');
        return false;
      }

      var data = form.serialize();
      $.ajax({
        url: wp_vars['rest_url'] + 'api/v1/auth/register',
        type: 'POST',
        dataType: 'json',
        cache: false,
        data: data,
        beforeSend: function beforeSend(xhr) {
          form.find('.is-loading').removeClass('is-loading');
          form.find('button').addClass('is-loading');
        }
      }).done(function (response) {
        var formdata = {};
        form.serializeArray().map(function (x) {
          formdata[x.name] = x.value;
        });
        var url_referer = typeof formdata.url_referer !== 'undefined' && formdata.url_referer != '' ? formdata.url_referer : '';
        form.find('.is-loading').removeClass('is-loading');

        if (url_referer != "") {
          window.location.href = url_referer;
        } else {
          location.reload();
        }
      }).fail(function (res) {
        form.find('.is-loading').removeClass('is-loading');
        var message = typeof res.responseJSON.message != 'undefined' ? res.responseJSON.message : '';

        if (message !== "") {
          $.pace_noti(message, 3000);
        }
      });
      ;
    });
  }

  $(function () {
    signUpWidthEmail();
  });
})(jQuery);

(function ($) {
  $(function () {});
})(jQuery);

function initWooSelect2() {
  $('.pace-form-group select').select2({
    width: "100%"
  });
}

(function ($) {
  $(function () {
    initWooSelect2();
  });
})(jQuery);

(function ($) {
  function epacetChangeQuanlity() {
    $(document).on('click', 'form.cart .pace-box-quantity .pace-box-quantity__minus', function () {
      var qtyBox = $(this).closest('.pace-box-quantity');
      var qty = qtyBox.find('input').val();
      qty = eval(qty) > 1 ? eval(qty) - 1 : 1;
      qtyBox.find('input').val(qty);
    });
    $(document).on('click', 'form.cart .pace-box-quantity .pace-box-quantity__plus', function () {
      var qtyBox = $(this).closest('.pace-box-quantity');
      var qtyMax = qtyBox.find('input').attr('max');

      if (qtyMax == "") {
        qtyMax = 999;
      }

      var qty = qtyBox.find('input').val();
      qty = eval(qty) < 0 ? 1 : eval(qty) < eval(qtyMax) ? eval(qty) + 1 : qty;
      qtyBox.find('input').val(qty);
    });
  }

  function addToCart() {
    if ($('form.cart').length < 1) return;
    $('form.cart').on('submit', function (epacet) {
      epacet.prepacetDefault();
      var form = $(this);
      var data = form.serialize();
      $.ajax({
        //url: wp_vars.ajax_url,
        url: wp_vars.home_url + '/?wc-ajax=add_to_cart',
        type: 'POST',
        //dataType: 'json',
        cache: false,
        data: data,
        beforeSend: function beforeSend(xhr) {
          form.find('button[type="submit"]').addClass('is-loading');
        }
      }).done(function (res) {
        form.find('button[type="submit"]').removeClass('is-loading');

        if (res.error && res.error == true) {
          var message = 'This product cannot be added to cart';
          $.pace_noti(message, 3000);
        } else {
          $(document.body).trigger('wc_fragment_refresh');
          form.find('.pace-btn-add-cart').addClass('is-active');
          setTimeout(function () {
            form.find('.pace-btn-add-cart').removeClass('is-active');
          }, 2000);
          var title = typeof res.data.title != 'undefined' ? res.data.title : '';

          if (title != '') {
            $('#cart-notification-content .text-gradient').html(title);
            showCartNotification();
          } else {
            var message = 'This product added to cart.';
            $.pace_noti(message, 3000);
          }
        }
        /*$(document.body).trigger('wc_fragment_refresh');
          var title = (typeof res.data.title != 'undefined') ? res.data.title : '';
        if(title != '') {
        	$('#cart-notification-content .text-gradient').html(title);
        	showCartNotification();
        } else {
        	var message = 'This product added to cart.';
        	$.pace_noti(message, 3000);
        }*/

      }).fail(function (res) {
        var message = typeof res.responseJSON.data.message != 'undefined' ? res.responseJSON.data.message : 'This product cannot be added to cart';
        var messageElement = $('<div class="message-element">' + message + '</div>');
        messageElement.find('a').remove();
        message = messageElement.text();
        form.find('button[type="submit"]').removeClass('is-loading');
        $.pace_noti(message, 3000);
      });
    });
  }

  function buyNow() {
    if ($('form.cart').length < 1) return;
    $(document).on('click', 'form.cart .btn-buy-now', function (epacet) {
      epacet.prepacetDefault();
      var element = $(this);
      var form = element.closest('form.cart');
      var redirect = element.data('redirect');
      var productID = form.find('input[name="product_id"]').val();
      var data = {
        action: 'pace_add_to_cart',
        quantity: 1,
        product_id: productID
      };
      $.ajax({
        //url: wp_vars.ajax_url,
        url: wp_vars.home_url + '/?wc-ajax=add_to_cart',
        type: 'POST',
        //dataType: 'json',
        cache: false,
        data: data,
        beforeSend: function beforeSend(xhr) {
          element.addClass('is-loading');
        }
      }).done(function (res) {
        if (redirect != "") {
          window.location.href = redirect;
        } else {
          element.removeClass('is-loading');
          var title = typeof res.data.title != 'undefined' ? res.data.title : '';

          if (title != '') {
            $('#cart-notification-content .text-gradient').html(title);
          } else {
            var message = 'This product added to cart.';
            $.pace_noti(message, 3000);
          }
        }
      }).fail(function (res) {
        element.removeClass('is-loading');
        var message = typeof res.responseJSON.data.message != 'undefined' ? res.responseJSON.data.message : 'This product cannot be added to cart';
        var messageElement = $('<div class="message-element">' + message + '</div>');
        messageElement.find('a').remove();
        message = messageElement.text();
        $.pace_noti(message, 3000);
      });
    });
  }

  $(function () {
    epacetChangeQuanlity();
    addToCart();
    buyNow();
  });
})(jQuery);
/* global wc_stripe_params */


jQuery(function ($) {
  'use strict';

  if (typeof wc_stripe_params == 'undefined') return;

  try {
    var stripe = Stripe(wc_stripe_params.key);
  } catch (error) {
    console.log(error);
    return;
  }

  var stripe_elements_options = Object.keys(wc_stripe_params.elements_options).length ? wc_stripe_params.elements_options : {},
      sepa_elements_options = Object.keys(wc_stripe_params.sepa_elements_options).length ? wc_stripe_params.sepa_elements_options : {},
      elements = stripe.elements(stripe_elements_options),
      iban = elements.create('iban', sepa_elements_options),
      stripe_card,
      stripe_exp,
      stripe_cvc,
      count_error;
  /**
   * Object to handle Stripe elements payment form.
   */

  var wc_stripe_form = {
    /**
     * Get WC AJAX endpoint URL.
     *
     * @param  {String} endpoint Endpoint.
     * @return {String}
     */
    getAjaxURL: function getAjaxURL(endpoint) {
      return wc_stripe_params.ajaxurl.toString().replace('%%endpoint%%', 'wc_stripe_' + endpoint);
    },

    /**
     * Unmounts all Stripe elements when the checkout page is being updated.
     */
    unmountElements: function unmountElements() {
      if ('yes' === wc_stripe_params.inline_cc_form) {
        stripe_card.unmount('#stripe-card-element');
      } else {
        stripe_card.unmount('#stripe-card-element');
        stripe_exp.unmount('#stripe-exp-element');
        stripe_cvc.unmount('#stripe-cvc-element');
      }
    },

    /**
     * Mounts all elements to their DOM nodes on initial loads and updates.
     */
    mountElements: function mountElements() {
      if (!$('#stripe-card-element').length) {
        return;
      }

      if ('yes' === wc_stripe_params.inline_cc_form) {
        return stripe_card.mount('#stripe-card-element');
      }

      stripe_card.mount('#stripe-card-element');
      stripe_exp.mount('#stripe-exp-element');
      stripe_cvc.mount('#stripe-cvc-element');
    },

    /**
     * Creates all Stripe elements that will be used to enter cards or IBANs.
     */
    createElements: function createElements() {
      var elementStyles = {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          fontSize: '15px',
          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      };
      var elementClasses = {
        focus: 'focused',
        empty: 'empty',
        invalid: 'invalid'
      };
      elementStyles = wc_stripe_params.elements_styling ? wc_stripe_params.elements_styling : elementStyles;
      elementClasses = wc_stripe_params.elements_classes ? wc_stripe_params.elements_classes : elementClasses;

      if ('yes' === wc_stripe_params.inline_cc_form) {
        stripe_card = elements.create('card', {
          style: elementStyles,
          hidePostalCode: true
        });
        stripe_card.addEpacetListener('change', function (epacet) {
          wc_stripe_form.onCCFormChange();

          if (epacet.error) {
            $(document.body).trigger('stripeError', epacet);
          }
        });
      } else {
        stripe_card = elements.create('cardNumber', {
          style: elementStyles,
          classes: elementClasses
        });
        stripe_exp = elements.create('cardExpiry', {
          style: elementStyles,
          classes: elementClasses
        });
        stripe_cvc = elements.create('cardCvc', {
          style: elementStyles,
          classes: elementClasses
        });
        stripe_card.addEpacetListener('change', function (epacet) {
          wc_stripe_form.onCCFormChange();
          wc_stripe_form.updateCardBrand(epacet.brand);

          if (epacet.error) {
            $(document.body).trigger('stripeError', epacet);
          }
        });
        stripe_exp.addEpacetListener('change', function (epacet) {
          wc_stripe_form.onCCFormChange();

          if (epacet.error) {
            $(document.body).trigger('stripeError', epacet);
          }
        });
        stripe_cvc.addEpacetListener('change', function (epacet) {
          wc_stripe_form.onCCFormChange();

          if (epacet.error) {
            $(document.body).trigger('stripeError', epacet);
          }
        });
      }
      /**
       * Only in checkout page we need to delay the mounting of the
       * card as some AJAX process needs to happen before we do.
       */


      if ('yes' === wc_stripe_params.is_checkout) {
        $(document.body).on('updated_checkout', function () {
          // Don't re-mount if already mounted in DOM.
          if ($('#stripe-card-element').children().length) {
            return;
          } // Unmount prior to re-mounting.


          if (stripe_card) {
            wc_stripe_form.unmountElements();
          }

          wc_stripe_form.mountElements();

          if ($('#stripe-iban-element').length) {
            iban.mount('#stripe-iban-element');
          }
        });
      } else if ($('form#add_payment_method').length || $('form#order_review').length) {
        wc_stripe_form.mountElements();

        if ($('#stripe-iban-element').length) {
          iban.mount('#stripe-iban-element');
        }
      }
    },

    /**
     * Updates the card brand logo with non-inline CC forms.
     *
     * @param {string} brand The identifier of the chosen brand.
     */
    updateCardBrand: function updateCardBrand(brand) {
      var brandClass = {
        'visa': 'stripe-visa-brand',
        'mastercard': 'stripe-mastercard-brand',
        'amex': 'stripe-amex-brand',
        'discover': 'stripe-discover-brand',
        'diners': 'stripe-diners-brand',
        'jcb': 'stripe-jcb-brand',
        'unknown': 'stripe-credit-card-brand'
      };
      var imageElement = $('.stripe-card-brand'),
          imageClass = 'stripe-credit-card-brand';

      if (brand in brandClass) {
        imageClass = brandClass[brand];
      } // Remove existing card brand class.


      $.each(brandClass, function (index, el) {
        imageElement.removeClass(el);
      });
      imageElement.addClass(imageClass);
    },

    /**
     * Initialize epacet handlers and UI state.
     */
    init: function init() {
      // Initialize tokenization script if on change payment method page and pay for order page.
      if ('yes' === wc_stripe_params.is_change_payment_page || 'yes' === wc_stripe_params.is_pay_for_order_page) {
        $(document.body).trigger('wc-credit-card-form-init');
      } // checkout page


      if ($('form.woocommerce-checkout').length) {
        this.form = $('form.woocommerce-checkout');
      }

      $('form.woocommerce-checkout').on('checkout_place_order_stripe checkout_place_order_stripe_bancontact checkout_place_order_stripe_sofort checkout_place_order_stripe_giropay checkout_place_order_stripe_ideal checkout_place_order_stripe_alipay checkout_place_order_stripe_sepa', this.onSubmit); // pay order page

      if ($('form#order_review').length) {
        this.form = $('form#order_review');
      }

      $('form#order_review, form#add_payment_method').on('submit', this.onSubmit); // add payment method page

      if ($('form#add_payment_method').length) {
        this.form = $('form#add_payment_method');
      }

      $('form.woocommerce-checkout').on('change', this.reset);
      $(document).on('stripeError', this.onError).on('checkout_error', this.reset); // SEPA IBAN.

      iban.on('change', this.onSepaError); //Get Review source stripe

      $("#check-stripe-payment-method").on('click', this.getCardReview); // Subscription early renewals modal.

      $('#early_renewal_modal_submit').on('click', this.onEarlyRenewalSubmit);
      wc_stripe_form.createElements(); // Listen for hash changes in order to handle payment intents

      window.addEpacetListener('hashchange', wc_stripe_form.onHashChange);
      wc_stripe_form.maybeConfirmIntent();
    },

    /**
     * Check to see if Stripe in general is being used for checkout.
     *
     * @return {boolean}
     */
    isStripeChosen: function isStripeChosen() {
      return $('#payment_method_stripe, #payment_method_stripe_bancontact, #payment_method_stripe_sofort, #payment_method_stripe_giropay, #payment_method_stripe_ideal, #payment_method_stripe_alipay, #payment_method_stripe_sepa, #payment_method_stripe_eps, #payment_method_stripe_multibanco').is(':checked') || $('#payment_method_stripe').is(':checked') && 'new' === $('input[name="wc-stripe-payment-token"]:checked').val() || $('#payment_method_stripe_sepa').is(':checked') && 'new' === $('input[name="wc-stripe-payment-token"]:checked').val();
    },

    /**
     * Currently only support saved cards via credit cards and SEPA. No other payment method.
     *
     * @return {boolean}
     */
    isStripeSaveCardChosen: function isStripeSaveCardChosen() {
      return $('#payment_method_stripe').is(':checked') && $('input[name="wc-stripe-payment-token"]').is(':checked') && 'new' !== $('input[name="wc-stripe-payment-token"]:checked').val() || $('#payment_method_stripe_sepa').is(':checked') && $('input[name="wc-stripe_sepa-payment-token"]').is(':checked') && 'new' !== $('input[name="wc-stripe_sepa-payment-token"]:checked').val();
    },

    /**
     * Check if Stripe credit card is being used used.
     *
     * @return {boolean}
     */
    isStripeCardChosen: function isStripeCardChosen() {
      return $('#payment_method_stripe').is(':checked');
    },

    /**
     * Check if Stripe Bancontact is being used used.
     *
     * @return {boolean}
     */
    isBancontactChosen: function isBancontactChosen() {
      return $('#payment_method_stripe_bancontact').is(':checked');
    },

    /**
     * Check if Stripe Giropay is being used used.
     *
     * @return {boolean}
     */
    isGiropayChosen: function isGiropayChosen() {
      return $('#payment_method_stripe_giropay').is(':checked');
    },

    /**
     * Check if Stripe iDeal is being used used.
     *
     * @return {boolean}
     */
    isIdealChosen: function isIdealChosen() {
      return $('#payment_method_stripe_ideal').is(':checked');
    },

    /**
     * Check if Stripe SOFORT is being used used.
     *
     * @return {boolean}
     */
    isSofortChosen: function isSofortChosen() {
      return $('#payment_method_stripe_sofort').is(':checked');
    },

    /**
     * Check if Stripe Alipay is being used used.
     *
     * @return {boolean}
     */
    isAlipayChosen: function isAlipayChosen() {
      return $('#payment_method_stripe_alipay').is(':checked');
    },

    /**
     * Check if Stripe SEPA Direct Debit is being used used.
     *
     * @return {boolean}
     */
    isSepaChosen: function isSepaChosen() {
      return $('#payment_method_stripe_sepa').is(':checked');
    },

    /**
     * Check if Stripe P24 is being used used.
     *
     * @return {boolean}
     */
    isP24Chosen: function isP24Chosen() {
      return $('#payment_method_stripe_p24').is(':checked');
    },

    /**
     * Check if Stripe EPS is being used used.
     *
     * @return {boolean}
     */
    isEpsChosen: function isEpsChosen() {
      return $('#payment_method_stripe_eps').is(':checked');
    },

    /**
     * Check if Stripe Multibanco is being used used.
     *
     * @return {boolean}
     */
    isMultibancoChosen: function isMultibancoChosen() {
      return $('#payment_method_stripe_multibanco').is(':checked');
    },

    /**
     * Checks if a source ID is present as a hidden input.
     * Only used when SEPA Direct Debit is chosen.
     *
     * @return {boolean}
     */
    hasSource: function hasSource() {
      return 0 < $('input.stripe-source').length;
    },

    /**
     * Check whether a mobile device is being used.
     *
     * @return {boolean}
     */
    isMobile: function isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      }

      return false;
    },

    /**
     * Blocks payment forms with an overlay while being submitted.
     */
    block: function block() {
      if (!wc_stripe_form.isMobile()) {
        wc_stripe_form.form.block({
          message: null,
          overlayCSS: {
            background: '#fff',
            opacity: 0.6
          }
        });
      }
    },

    /**
     * Removes overlays from payment forms.
     */
    unblock: function unblock() {
      wc_stripe_form.form && wc_stripe_form.form.unblock();
    },

    /**
     * Returns the selected payment method HTML element.
     *
     * @return {HTMLElement}
     */
    getSelectedPaymentElement: function getSelectedPaymentElement() {
      return $('.payment_methods input[name="payment_method"]:checked');
    },

    /**
     * Retrieves "owner" data from either the billing fields in a form or preset settings.
     *
     * @return {Object}
     */
    getOwnerDetails: function getOwnerDetails() {
      var first_name = $('#billing_first_name').length ? $('#billing_first_name').val() : wc_stripe_params.billing_first_name,
          last_name = $('#billing_last_name').length ? $('#billing_last_name').val() : wc_stripe_params.billing_last_name,
          owner = {
        name: '',
        address: {},
        email: '',
        phone: ''
      };
      owner.name = first_name;

      if (first_name && last_name) {
        owner.name = first_name + ' ' + last_name;
      } else {
        owner.name = $('#stripe-payment-data').data('full-name');
      }

      owner.email = $('#billing_email').val();
      owner.phone = $('#billing_phone').val();
      /* Stripe does not like empty string values so
       * we need to remove the parameter if we're not
       * passing any value.
       */

      if (typeof owner.phone === 'undefined' || 0 >= owner.phone.length) {
        delete owner.phone;
      }

      if (typeof owner.email === 'undefined' || 0 >= owner.email.length) {
        if ($('#stripe-payment-data').data('email').length) {
          owner.email = $('#stripe-payment-data').data('email');
        } else {
          delete owner.email;
        }
      }

      if (typeof owner.name === 'undefined' || 0 >= owner.name.length) {
        delete owner.name;
      }

      owner.address.line1 = $('#billing_address_1').val() || wc_stripe_params.billing_address_1;
      owner.address.line2 = $('#billing_address_2').val() || wc_stripe_params.billing_address_2;
      owner.address.state = $('#billing_state').val() || wc_stripe_params.billing_state;
      owner.address.city = $('#billing_city').val() || wc_stripe_params.billing_city;
      owner.address.postal_code = $('#billing_postcode').val() || wc_stripe_params.billing_postcode;
      owner.address.country = $('#billing_country').val() || wc_stripe_params.billing_country;
      return {
        owner: owner
      };
    },

    /**
     * Initiates the creation of a Source object.
     *
     * Currently this is only used for credit cards and SEPA Direct Debit,
     * all other payment methods work with redirects to create sources.
     */
    createSource: function createSource() {
      var extra_details = wc_stripe_form.getOwnerDetails(); // Handle SEPA Direct Debit payments.

      if (wc_stripe_form.isSepaChosen()) {
        extra_details.currency = $('#stripe-sepa_debit-payment-data').data('currency');
        extra_details.mandate = {
          notification_method: wc_stripe_params.sepa_mandate_notification
        };
        extra_details.type = 'sepa_debit';
        return stripe.createSource(iban, extra_details).then(wc_stripe_form.sourceResponse);
      } // Handle card payments.


      return stripe.createSource(stripe_card, extra_details).then(wc_stripe_form.sourceResponse);
    },

    /**
     * Handles responses, based on source object.
     *
     * @param {Object} response The `stripe.createSource` response.
     */
    sourceResponse: function sourceResponse(response) {
      if (response.error) {
        return $(document.body).trigger('stripeError', response);
      }

      wc_stripe_form.reset();
      wc_stripe_form.form.append($('<input type="hidden" />').addClass('stripe-source').attr('name', 'stripe_source').val(response.source.id));

      if ($('form#add_payment_method').length) {
        $(wc_stripe_form.form).off('submit', wc_stripe_form.form.onSubmit);
      }

      wc_stripe_form.form.submit();
    },

    /**
     * Performs payment-related actions when a checkout/payment form is being submitted.
     *
     * @return {boolean} An indicator whether the submission should proceed.
     *                   WooCommerce's checkout.js stops only on `false`, so this needs to be explicit.
     */
    onSubmit: function onSubmit() {
      if (!wc_stripe_form.isStripeChosen()) {
        return true;
      } // If a source is already in place, submit the form as usual.


      if (wc_stripe_form.isStripeSaveCardChosen() || wc_stripe_form.hasSource()) {
        return true;
      } // For methods that needs redirect, we will create the source server side so we can obtain the order ID.


      if (wc_stripe_form.isBancontactChosen() || wc_stripe_form.isGiropayChosen() || wc_stripe_form.isIdealChosen() || wc_stripe_form.isAlipayChosen() || wc_stripe_form.isSofortChosen() || wc_stripe_form.isP24Chosen() || wc_stripe_form.isEpsChosen() || wc_stripe_form.isMultibancoChosen()) {
        return true;
      }

      wc_stripe_form.block();
      wc_stripe_form.createSource();
      return false;
    },

    /**
     * If a new credit card is entered, reset sources.
     */
    onCCFormChange: function onCCFormChange() {
      wc_stripe_form.reset();
    },

    /**
     * Removes all Stripe errors and hidden fields with IDs from the form.
     */
    reset: function reset() {
      $('.wc-stripe-error, .stripe-source').remove();
    },

    /**
     * Displays a SEPA-specific error message.
     *
     * @param {Epacet} e The epacet with the error.
     */
    onSepaError: function onSepaError(e) {
      var errorContainer = wc_stripe_form.getSelectedPaymentElement().parents('li').eq(0).find('.stripe-source-errors');

      if (!e.error) {
        return $(errorContainer).html('');
      }

      console.log(e.error.message); // Leave for troubleshooting.

      $(errorContainer).html('<ul class="woocommerce_error woocommerce-error wc-stripe-error"><li /></ul>');
      $(errorContainer).find('li').text(e.error.message); // Prepacet XSS
    },
    getCardReview: function getCardReview(e) {
      if ($("#payment_method_stripe:checked").length > 0) {
        if ($('input[name="wc-stripe-payment-token"]:checked').length > 0 && $('input[name="wc-stripe-payment-token"]:checked').val() != "new") {
          var stripe_element = $('input[name="wc-stripe-payment-token"]:checked');
          var card_type = stripe_element.closest(".woocommerce-SavedPaymentMethods-token").find('.card-info .card-type').text();
          var last_4digit = stripe_element.closest(".woocommerce-SavedPaymentMethods-token").find('.card-info .last4').text();
          $('.card-number-hidden').removeClass('d-none');
          $('.card-number-show').removeClass('d-none');
          $('.card-number-image').addClass(card_type);
          $('.card-number-show').html(last_4digit);
          wc_stripe_form.getBillingAddress();
          wc_stripe_form.closeSection();
        } else {
          var extra_details = wc_stripe_form.getOwnerDetails(); // Handle SEPA Direct Debit payments.

          if (wc_stripe_form.isSepaChosen()) {
            extra_details.currency = $('#stripe-sepa_debit-payment-data').data('currency');
            extra_details.mandate = {
              notification_method: wc_stripe_params.sepa_mandate_notification
            };
            extra_details.type = 'sepa_debit';
            stripe.createSource(iban, extra_details).then(wc_stripe_form.sourceResponse);
          } // Handle card payments.


          stripe.createSource(stripe_card, extra_details).then(function (response) {
            if (response.source && response.source.card) {
              $('.card-number-hidden').removeClass('d-none');
              $('.card-number-show').removeClass('d-none');
              $('.card-number-image').addClass(response.source.card.brand);
              $('.card-number-show').html(response.source.card.last4);
              wc_stripe_form.getBillingAddress();
              wc_stripe_form.closeSection();
            }
          });
        }
      } else if ($("#payment_method_afterpay:checked").length > 0) {
        $('.card-number-image').addClass('afterpay');
        wc_stripe_form.getBillingAddress();
        wc_stripe_form.closeSection();
      } else {
        $('.card-number-image').addClass('paypal');
        $('.card-number-hidden').addClass('d-none');
        $('.card-number-show').addClass('d-none');
        wc_stripe_form.getBillingAddress();
        wc_stripe_form.closeSection();
      }
    },
    handleCheckoutNextStep: function handleCheckoutNextStep(currentStep, currentForm, currentData) {
      currentStep.addClass('is-checked');
      $('.pace-checkout-steps__item.is-checked').last().next().find('.pace-checkout-steps__body').slideDown(300);
      currentForm.slideUp(300);
      currentData.slideDown(300);
    },
    getBillingAddress: function getBillingAddress(e) {
      if ($("#checkout-billing-address:checked").length > 0) {
        var shippingFirstName = $("#shipping_first_name").val(),
            shippingLastName = $("#shipping_last_name").val(),
            shippingCompany = $("#shipping_company").val(),
            shippingPhone = $("#shipping_phone").val(),
            shippingAddress = $("#shipping_address_1").val(),
            shippingUnit = $("#shipping_address_2").val(),
            shippingCity = $("#shipping_city").val(),
            shippingPostcode = $("#shipping_postcode").val(),
            shippingState = $("#shipping_state :selected").text();

        if ($("#shipping_country").is('input')) {
          var shippingCountry = $("#shipping_country").closest('.woocommerce-input-wrapper').find('strong').text();
        } else {
          var shippingCountry = $("#shipping_country :selected").text();
        }
      } else {
        var shippingFirstName = $("#billing_first_name").val(),
            shippingLastName = $("#billing_last_name").val(),
            shippingCompany = $("#billing_company").val(),
            shippingPhone = $("#billing_phone").val(),
            shippingAddress = $("#billing_address_1").val(),
            shippingUnit = $("#billing_address_2").val(),
            shippingCity = $("#billing_city").val(),
            shippingPostcode = $("#billing_postcode").val(),
            shippingState = $("#billing_state :selected").text();

        if ($("#billing_country").is('input')) {
          var shippingCountry = $("#billing_country").closest('.woocommerce-input-wrapper').find('strong').text();
        } else {
          var shippingCountry = $("#billing_country :selected").text();
        }
      }

      var addressShipto = shippingAddress + (shippingAddress.length > 0 ? ", " : "") + shippingCity + (shippingCity.length > 0 ? ", " : "") + shippingState + (shippingState.length > 0 && shippingPostcode.length < 1 ? ", " : " ") + shippingPostcode + (shippingPostcode.length > 0 ? ", " : "") + shippingCountry;
      var fullName = shippingFirstName + ' ' + shippingLastName;
      $('#billing-review').html(fullName + (shippingCompany.length > 0 ? '<br>' + shippingCompany : shippingCompany) + '<br>' + addressShipto + '<br>' + shippingPhone);
    },
    closeSection: function closeSection(e) {
      var currentStep = $('#check-stripe-payment-method').closest('.pace-checkout-steps__item'),
          blockForm = $('.pace-checkout-steps__form', currentStep),
          blockData = $('.pace-checkout-steps__data', currentStep),
          countError = 0;

      if ($('#checkout-billing-address:checked').length < 1) {
        countError = 0;

        if ($('.pace-checkout-steps__item[data-type="payment-billing"] .validate-required').length > 0) {
          $('.pace-checkout-steps__item[data-type="payment-billing"] .validate-required').each(function () {
            var thisInput = $(this);
            countError = $.validateInput(thisInput, countError);
          });
        }
      }

      if (countError > 0) {
        return;
      }

      wc_stripe_form.handleCheckoutNextStep(currentStep, blockForm, blockData);
    },

    /**
     * Displays stripe-related errors.
     *
     * @param {Epacet}  e      The jQuery epacet.
     * @param {Object} result The result of Stripe call.
     */
    onError: function onError(e, result) {
      var message = result.error.message;
      var selectedMethodElement = wc_stripe_form.getSelectedPaymentElement().closest('li');
      var savedTokens = selectedMethodElement.find('.woocommerce-SavedPaymentMethods-tokenInput');
      var errorContainer;

      if (savedTokens.length) {
        // In case there are saved cards too, display the message next to the correct one.
        var selectedToken = savedTokens.filter(':checked');

        if (selectedToken.closest('.woocommerce-SavedPaymentMethods-new').length) {
          // Display the error next to the CC fields if a new card is being entered.
          errorContainer = $('#wc-stripe-cc-form .stripe-source-errors');
        } else {
          // Display the error next to the chosen saved card.
          errorContainer = selectedToken.closest('li').find('.stripe-source-errors');
        }
      } else {
        // When no saved cards are available, display the error next to CC fields.
        errorContainer = selectedMethodElement.find('.stripe-source-errors');
      }
      /*
       * If payment method is SEPA and owner name is not completed,
       * source cannot be created. So we need to show the normal
       * Billing name is required error message on top of form instead
       * of inline.
       */


      if (wc_stripe_form.isSepaChosen()) {
        if ('invalid_owner_name' === result.error.code && wc_stripe_params.hasOwnProperty(result.error.code)) {
          var error = '<ul class="woocommerce-error"><li /></ul>';
          error.find('li').text(wc_stripe_params[result.error.code]); // Prepacet XSS

          return wc_stripe_form.submitError(error);
        }
      } // Notify users that the email is invalid.


      if ('email_invalid' === result.error.code) {
        message = wc_stripe_params.email_invalid;
      } else if (
      /*
       * Customers do not need to know the specifics of the below type of errors
       * therefore return a generic localizable error message.
       */
      'invalid_request_error' === result.error.type || 'api_connection_error' === result.error.type || 'api_error' === result.error.type || 'authentication_error' === result.error.type || 'rate_limit_error' === result.error.type) {
        message = wc_stripe_params.invalid_request_error;
      }

      if ('card_error' === result.error.type && wc_stripe_params.hasOwnProperty(result.error.code)) {
        message = wc_stripe_params[result.error.code];
      }

      if ('validation_error' === result.error.type && wc_stripe_params.hasOwnProperty(result.error.code)) {
        message = wc_stripe_params[result.error.code];
      }

      wc_stripe_form.reset();
      $('.woocommerce-NoticeGroup-checkout').remove();
      console.log(result.error.message); // Leave for troubleshooting.

      $(errorContainer).html('<ul class="woocommerce_error woocommerce-error wc-stripe-error"><li/></ul>');
      $(errorContainer).find('li').text(message); // Prepacet XSS			

      if ($('.wc-stripe-error').length) {
        $('html, body').animate({
          scrollTop: $('.wc-stripe-error').offset().top - 200
        }, 200);
      }

      wc_stripe_form.unblock();
      $.unblockUI(); // If arriving via Payment Request Button.
    },

    /**
     * Displays an error message in the beginning of the form and scrolls to it.
     *
     * @param {Object} error_message An error message jQuery object.
     */
    submitError: function submitError(error_message) {
      console.log(error_message);
      $('.woocommerce-NoticeGroup-checkout, .woocommerce-error, .woocommerce-message').remove();
      wc_stripe_form.form.prepend('<div class="woocommerce-NoticeGroup woocommerce-NoticeGroup-checkout">' + error_message + '</div>');
      wc_stripe_form.form.removeClass('processing').unblock();
      wc_stripe_form.form.find('.input-text, select, input:checkbox').blur();
      var selector = '';

      if ($('#add_payment_method').length) {
        selector = $('#add_payment_method');
      }

      if ($('#order_review').length) {
        selector = $('#order_review');
      }

      if ($('form.checkout').length) {
        selector = $('form.checkout');
      }

      if (selector.length) {
        $('html, body').animate({
          scrollTop: selector.offset().top - 100
        }, 500);
      }

      $(document.body).trigger('checkout_error');
      wc_stripe_form.unblock();
    },

    /**
     * Handles changes in the hash in order to show a modal for PaymentIntent/SetupIntent confirmations.
     *
     * Listens for `hashchange` epacets and checks for a hash in the following format:
     * #confirm-pi-<intentClientSecret>:<successRedirectURL>
     *
     * If such a hash appears, the partials will be used to call `stripe.handleCardPayment`
     * in order to allow customers to confirm an 3DS/SCA authorization, or stripe.handleCardSetup if
     * what needs to be confirmed is a SetupIntent.
     *
     * Those redirects/hashes are generated in `WC_Gateway_Stripe::process_payment`.
     */
    onHashChange: function onHashChange() {
      var partials = window.location.hash.match(/^#?confirm-(pi|si)-([^:]+):(.+)$/);

      if (!partials || 4 > partials.length) {
        return;
      }

      var type = partials[1];
      var intentClientSecret = partials[2];
      var redirectURL = decodeURIComponent(partials[3]); // Cleanup the URL

      window.location.hash = '';
      wc_stripe_form.openIntentModal(intentClientSecret, redirectURL, false, 'si' === type);
    },
    maybeConfirmIntent: function maybeConfirmIntent() {
      if (!$('#stripe-intent-id').length || !$('#stripe-intent-return').length) {
        return;
      }

      var intentSecret = $('#stripe-intent-id').val();
      var returnURL = $('#stripe-intent-return').val();
      wc_stripe_form.openIntentModal(intentSecret, returnURL, true, false);
    },

    /**
     * Opens the modal for PaymentIntent authorizations.
     *
     * @param {string}  intentClientSecret The client secret of the intent.
     * @param {string}  redirectURL        The URL to ping on fail or redirect to on success.
     * @param {boolean} alwaysRedirect     If set to true, an immediate redirect will happen no matter the result.
     *                                     If not, an error will be displayed on failure.
     * @param {boolean} isSetupIntent      If set to true, ameans that the flow is handling a Setup Intent.
     *                                     If false, it's a Payment Intent.
     */
    openIntentModal: function openIntentModal(intentClientSecret, redirectURL, alwaysRedirect, isSetupIntent) {
      stripe[isSetupIntent ? 'handleCardSetup' : 'handleCardPayment'](intentClientSecret).then(function (response) {
        if (response.error) {
          throw response.error;
        }

        var intent = response[isSetupIntent ? 'setupIntent' : 'paymentIntent'];

        if ('requires_capture' !== intent.status && 'succeeded' !== intent.status) {
          return;
        }

        window.location = redirectURL;
      })["catch"](function (error) {
        if (alwaysRedirect) {
          return window.location = redirectURL;
        }

        $(document.body).trigger('stripeError', {
          error: error
        });
        wc_stripe_form.form && wc_stripe_form.form.removeClass('processing'); // Report back to the server.

        $.get(redirectURL + '&is_ajax');
      });
    },

    /**
     * Prepacets the standard behavior of the "Renew Now" button in the
     * early renewals modal by using AJAX instead of a simple redirect.
     *
     * @param {Epacet} e The epacet that occured.
     */
    onEarlyRenewalSubmit: function onEarlyRenewalSubmit(e) {
      e.prepacetDefault();
      $.ajax({
        url: $('#early_renewal_modal_submit').attr('href'),
        method: 'get',
        success: function success(html) {
          var response = $.parseJSON(html);

          if (response.stripe_sca_required) {
            wc_stripe_form.openIntentModal(response.intent_secret, response.redirect_url, true, false);
          } else {
            window.location = response.redirect_url;
          }
        }
      });
      return false;
    }
  };
  wc_stripe_form.init();
});

(function ($) {
  /**
    * Check if input, select is valid
    */
  $.validateInput = function (e, countError) {
    var wrapper = $(e).find('.woocommerce-input-wrapper'),
        input = $(e).find('input'),
        select = $(e).find('select'),
        label = $(e).find('label').clone() //clone the element
    .children() //select all the children
    .remove() //remove all the children
    .end() //again go back to selected element
    .text(),
        error_msg = $(e).find('.invalid-message');

    if (input.val() || select.val()) {
      wrapper.removeClass('pace-form-group--error');
      error_msg.remove(); //Check email

      if (input.attr('id') == "shipping_email" || input.attr('id') == "billing_email") {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!regex.test(input.val())) {
          if (!wrapper.hasClass('pace-form-group--error')) {
            wrapper.append('<div class="invalid-message">Please enter a valid email address.</div>');
          }

          wrapper.addClass('pace-form-group--error');
          countError = parseInt(countError) + 1;
        }
      } //Check phone


      if (input.attr('id') == "shipping_phone" || input.attr('id') == "billing_phone") {
        if (isNaN(input.val())) {
          if (!wrapper.hasClass('pace-form-group--error')) {
            wrapper.append('<div class="invalid-message">Please enter a valid phone number.</div>');
          }

          wrapper.addClass('pace-form-group--error');
          countError = parseInt(countError) + 1;
        }
      }
    } else {
      if (!wrapper.hasClass('pace-form-group--error')) {
        wrapper.append('<div class="invalid-message">' + label + 'is required</div>');
      }

      wrapper.addClass('pace-form-group--error');
      countError = parseInt(countError) + 1;
    }

    return countError;
  };

  $(function () {});
})(jQuery);
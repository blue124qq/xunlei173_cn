(function ($) {
  Drupal.behaviors.batterseaIntake = {
    attach: function (context, settings) {
      // Show reason textarea
      if(jQuery("#edit-distance-between-people-1").is(':checked')){
         jQuery(".distance-between-people-reason-wrapper").removeClass('disabled');
      };
      if(jQuery("#edit-social-distancing-1").is(':checked')){
         jQuery(".popup-text").removeClass('disabled');
      };

      jQuery("#edit-distance-between-people-0").click(function(){
          jQuery(".distance-between-people-reason-wrapper").addClass('disabled');
      });
      jQuery("#edit-distance-between-people-1").click(function(){
          jQuery(".distance-between-people-reason-wrapper").removeClass('disabled');
      });

      jQuery("#edit-social-distancing-1").click(function(){
          jQuery(".popup-text").removeClass('disabled');
      });
      jQuery("#edit-social-distancing-0").click(function(){
          jQuery(".popup-text").addClass('disabled');
          //jQuery(".social_error").hide();
         // jQuery(".form-item-social-distancing").removeClass('error-text-div');
      });

      // Validation for overview form
      $('#battersea-intake-start-form .overview-form-submit').click(function () {
        var uncheckedCount = 0;
        $('#battersea-intake-start-form input[type=checkbox]').each(function () {
          if (!$(this).prop('checked') == true) {
            $(this).parent('div').addClass('error-text-div');
            uncheckedCount++;
          } else {
            $(this).parent('div').removeClass('error-text-div');
          }
        });
        
        if(!jQuery("#edit-distance-between-people-1").is(':checked') && !jQuery("#edit-distance-between-people-0").is(':checked')){
          jQuery("#edit-distance-between-people-0").parent('div').addClass('error-text-div');
          jQuery("#edit-distance-between-people-1").parent('div').addClass('error-text-div');
            uncheckedCount++;
        }
        else if(jQuery('#edit-distance-between-people-1').is(':checked') && jQuery("#edit-distance-between-people-reason").val() == ''){
          jQuery("#edit-distance-between-people-reason").parent('div').addClass('error-text-div');
          uncheckedCount++;
        }
        else{
          jQuery("#edit-distance-between-people-0").parent('div').removeClass('error-text-div');
          jQuery("#edit-distance-between-people-1").parent('div').removeClass('error-text-div');
          jQuery("#edit-distance-between-people-reason").parent('div').removeClass('error-text-div');
        }


        if(!jQuery("#edit-social-distancing-1").is(':checked') && !jQuery("#edit-social-distancing-0").is(':checked')){
          jQuery(".form-item-social-distancing").addClass('error-text-div');
          jQuery(".social_error").show();
          uncheckedCount++;
        }
        else if(jQuery('#edit-social-distancing-1').is(':checked')){
          jQuery(".form-item-social-distancing").addClass('error-text-div');
          jQuery(".social_error").show();
          uncheckedCount++;
        }
        else{
          jQuery(".social_error").hide();
          jQuery(".form-item-social-distancing").removeClass('error-text-div');
        }        
        if (uncheckedCount > 0) {
          return false;
        } else {
          return true;
        }
      });
      
      // Validation for user detail form
      $('#battersea-intake-user-details-form .user-details-form-submit').click(function () {
        var validationCount = 0;
        $('#battersea-intake-user-details-form input[type=text]').not($('#edit-mail')).each(function () {
          if ($(this).val().length === 0) {
            var label = $(this).prev('label').clone().children().remove().end().text();
            $(this).addClass('error');
            $(this).next('div.error-message').remove();
            $(this).after('<div class="error-message">' + label + ' field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).next('div.error-message').remove();
          }
        });

        /*if (!validateEmail($('#edit-mail').val())) {
          $('#edit-mail').addClass('error');
          $("#edit-mail").closest(".form-item-mail").find('.error-message').remove();
          $("#edit-mail").closest(".form-item-mail").append('<div class="error-message">Email is invalid</div>');
          validationCount++;
        } else {
          $('#edit-mail').removeClass('error');
          $("#edit-mail").closest(".form-item-mail").find('.error-message').remove();
        }*/

        $('#battersea-intake-user-details-form select').each(function () {
          if ($(this).val() === "_none") {
            var label = $(this).prev('label').clone().children().remove().end().text();
            $(this).addClass('error');
            $(this).next('div.error-message').remove();
            $(this).after('<div class="error-message">' + label + ' field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).next('div.error-message').remove();
          }
        });

        if (!$('#edit-field-us-mobile-und-0-value').val().match(/^[0-9 ]+$/)) {
          $("#edit-field-us-mobile-und-0-value").addClass('error');
          $("#edit-field-us-mobile-und-0-value").closest(".form-item-field-us-mobile-und-0-value").find('.error-message').remove();
          $("#edit-field-us-mobile-und-0-value").closest(".form-item-field-us-mobile-und-0-value").append('<div class="error-message">Phone number is invalid</div>');
          validationCount++;
        } else {
          $("#edit-field-us-mobile-und-0-value").removeClass('error');
          $("#edit-field-us-mobile-und-0-value").closest(".form-item-field-us-mobile-und-0-value").find('.error-message').remove();
        }

        /*
         * Validate the number of characters for following fields according to SalesForce API
         * - First name: 40 chars
         * - Lastname: 80 chars
         * - Phone: 40 chars
         * - Postcode: 20 chars
         * - Street Add: 255 chars
         * - Town: 40 chars
         * - Email: 80 chars
         */

        if ($('#edit-field-us-first-name-und-0-value').val().length > 40) {
          $('#edit-field-us-first-name-und-0-value').addClass('error');
          $('#edit-field-us-first-name-und-0-value').next('div.error-message').remove();
          $('#edit-field-us-first-name-und-0-value').after('<div class="error-message">You can\'t use more then 40 characters</div>');
          validationCount++;
        }

        if ($('#edit-field-us-last-name-und-0-value').val().length > 80) {
          $('#edit-field-us-last-name-und-0-value').addClass('error');
          $('#edit-field-us-last-name-und-0-value').next('div.error-message').remove();
          $('#edit-field-us-last-name-und-0-value').after('<div class="error-message">You can\'t use more then 80 characters</div>');
          validationCount++;
        }

        if ($('#edit-mail').val().length > 80) {
          $('#edit-mail').addClass('error');
          $('#edit-mail').next('div.error-message').remove();
          $('#edit-mail').after('<div class="error-message">You can\'t use more then 80 characters</div>');
          validationCount++;
        }

        if ($('#edit-field-us-mobile-und-0-value').val().length > 40) {
          $('#edit-field-us-mobile-und-0-value').addClass('error');
          $('#edit-field-us-mobile-und-0-value').next('div.error-message').remove();
          $('#edit-field-us-mobile-und-0-value').after('<div class="error-message">You can\'t use more then 40 characters</div>');
          validationCount++;
        }

        if ($('#edit-field-us-intake-postal-code').val().length > 20) {
          $('#edit-field-us-intake-postal-code').addClass('error');
          $('#edit-field-us-intake-postal-code').next('div.error-message').remove();
          $('#edit-field-us-intake-postal-code').after('<div class="error-message">You can\'t use more then 20 characters</div>');
          validationCount++;
        }

        if ($('#edit-field-us-intake-street').val().length > 255) {
          $('#edit-field-us-intake-street').addClass('error');
          $('#edit-field-us-intake-street').next('div.error-message').remove();
          $('#edit-field-us-intake-street').after('<div class="error-message">You can\'t use more then 255 characters</div>');
          validationCount++;
        }

        if ($('#edit-field-us-intake-town').val().length > 40) {
          $('#edit-field-us-intake-town').addClass('error');
          $('#edit-field-us-intake-town').next('div.error-message').remove();
          $('#edit-field-us-intake-town').after('<div class="error-message">You can\'t use more then 40 characters</div>');
          validationCount++;
        }

        /*
         * END OF VALIDATION
         */
        if (grecaptcha.getResponse() == '') {
          $('.g-recaptcha').addClass('error');
          $(".g-recaptcha").next('div.error-message').remove();
          $('.g-recaptcha').after('<div class="error-message">You must complete the antispam verification</div>');
          validationCount++;
        } else {
          $(".g-recaptcha").removeClass('error');
          $(".g-recaptcha").next('div.error-message').remove();
        }

        if (validationCount > 0) {
          $('.error:first').focus();
          return false;
        } else {
          return true;
        }

      });

      $('#intake-dog-details-entityform-edit-form').find('textarea').trigger('keyup');

      $('#intake-dog-details-entityform-edit-form').find('textarea').keyup(function (event) {
        if (this.id == 'edit-field-giving-up-reason-und-0-value') {
          validate_word_length(this, 200);
        } else if (this.id == 'edit-field-other-detail-und-0-value' || this.id == 'edit-field-surgery-treatment-detail-und-0-value' || this.id == 'edit-field-medical-issues-detail-und-0-value') {
          validate_word_length(this, 100);
        } else {
          validate_word_length(this, 300);
        }
        validate_char_length(this, 3000);
      });
      
      $("#edit-reason").keyup(function (event) {
        validate_word_length(this, 100);         
      });

      /*function validateEmail(emailField) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(emailField) == false) {
          return false;
        }
        return true;
      }*/

      function validate_word_length(field, length) {

        if (field.value.length === 0) {
          $(field).closest('.textarea-block').find('.warning-message').children('span').text(length);
          $(field).closest(".textarea-block").removeClass('warning-wrapper');

        } else {
          $(field).closest(".textarea-block").find('.error-message').remove();
          var words = field.value.match(/\S+/g).length;

          if ((words >= length) && (event.keyCode != 8)) {
            $(field).closest(".textarea-block").addClass('warning-wrapper');
            // Split the string on first length words and rejoin on spaces
            var trimmed = $(field).val().split(/\s+/, length).join(" ");
            // Add a space at the end to keep new typing making new words
            $(field).val(trimmed + " ");
            $(field).closest('.textarea-block').find('.warning-message').children('span').text(0);
          } else {
            $(field).closest('.textarea-block').find('.warning-message').children('span').text(length - words);
            $(field).closest(".textarea-block").removeClass('warning-wrapper');
            if ((words - length) == 0) {
              $(field).closest(".textarea-block").addClass('warning-wrapper');
            }
          }
        }
      }

      function validate_char_length(field, length) {
        if (field.value.length != 0) {
          var val = $(field).val();
          var maxLength = length;
          if ((val.length > maxLength)) {
            $(field).val((val).substring(0, maxLength));
            $(field).closest('.textarea-block').find('.char-warning-message').show();
          } else {
            $(field).closest('.textarea-block').find('.char-warning-message').hide();
          }
        }
      }
    
      // Validation for dog detail form
      $('#intake-dog-details-entityform-edit-form .dog-details-form-submit').click(function () {
        var validationCount = 0;
        $('#intake-dog-details-entityform-edit-form input[type=text]').not($("#edit-field-age-number-und-0-value")).each(function () {
          if ($(this).val().length === 0) {
            var label = $(this).prev('label').clone().children().remove().end().text();
            $(this).addClass('error');
            $(this).next('div.error-message').not($(".unit")).remove();
            $(this).after('<div class="error-message">' + label + ' field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).next('div.error-message').not($(".unit")).remove();
          }
        });

        $('#intake-dog-details-entityform-edit-form').find('textarea').not($("#edit-field-other-detail-und-0-value")).each(function () {
          if ($(this).val().length === 0) {
            $(this).addClass('error');
            $(this).closest(".textarea-block").find('.error-message').remove();
            $(this).closest(".textarea-block").append('<div class="error-message">This field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).closest(".textarea-block").find('.error-message').remove();
          }
        });

        if ($('input[name="field_gender[und]"]:checked').length > 0) {
          $("#edit-field-gender-und").find('.error-message').remove();
          $("#edit-field-gender-und").find('.form-radio:first').removeClass('error');
        } else {
          $("#edit-field-gender-und").find('.error-message').remove();
          $("#edit-field-gender-und").append('<div class="error-message">Gender field is required</div>');
          $("#edit-field-gender-und").find('.form-radio:first').addClass('error');

          validationCount++;
        }

        if ($('input[name="field_dog_neuter_check[und]"]:checked').length > 0) {
          $("#edit-field-dog-neuter-check-und").find('.error-message').remove();
          $("#edit-field-dog-neuter-check-und").find('.form-radio:first').removeClass('error');
        } else {
          $("#edit-field-dog-neuter-check-und").find('.error-message').remove();
          $("#edit-field-dog-neuter-check-und").append('<div class="error-message">This field is required</div>');
          $("#edit-field-dog-neuter-check-und").find('.form-radio:first').addClass('error');
          validationCount++;
        }

        $('#intake-dog-details-entityform-edit-form #edit-field-age-unit-und').each(function () {
          if (($(this).val() == "_none") || ($(this).val() == "")) {
            var label = $(this).prev('label').clone().children().remove().end().text();
            $(this).addClass('error');
            $(this).closest(".field-type-list-text ").next('div.error-message').remove();
            $(this).closest(".field-type-list-text ").after('<div class="error-message unit">' + label + ' field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).closest(".field-type-list-text ").next('div.unit').remove();
          }
        });

        $('#intake-dog-details-entityform-edit-form #edit-field-breed-und').each(function () {
          if (($(this).val() == "_none") || ($(this).val() == "")) {
            var label = $(this).prev('label').clone().children().remove().end().text();
            $(this).addClass('error');
            $(this).closest(".form-type-select").next('div.unit').remove();
            $(this).closest(".form-type-select").after('<div class="error-message unit">' + label + ' field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).closest(".form-type-select").next('div.unit').remove();
          }
        });

        $('#intake-dog-details-entityform-edit-form #edit-field-age-und').each(function () {
          if (($(this).val() == "_none") || ($(this).val() == "")) {
            var label = $(this).prev('label').clone().children().remove().end().text();
            $(this).addClass('error');
            $(this).closest(".form-type-select").next('div.unit').remove();
            $(this).closest(".form-type-select").after('<div class="error-message unit">' + label + ' field is required</div>');
            validationCount++;
          } else {
            $(this).removeClass('error');
            $(this).closest(".form-type-select").next('div.unit').remove();
          }
        });

        /*
         * Validate the number of characters for form fields according to SalesForce API
         * - Name: 40 chars
         */
        if ($('#edit-field-name-und-0-value').val().length > 40) {
          $('#edit-field-name-und-0-value').addClass('error');
          $('#edit-field-name-und-0-value').next('div.error-message').remove();
          $('#edit-field-name-und-0-value').after('<div class="error-message">You can\'t use more then 40 characters</div>');
          validationCount++;
        }

        if (validationCount > 0) {
          $('.error:first').focus();
          return false;
        } else {
          return true;
        }
      });

      // Show loading image on form submit to prevent creation of multiple cases
      $(".intake_review_form #edit-submit").bind( "click", function(e) {
        var loadingMessage = 'Please wait while we submit your answers.';
        $('.rehoming-submit-loading p').html(loadingMessage);
        $("#spinnerGif").show();
      });
      // show popup social distancing
      $('.intake-section .field_popup_info').append('<div class="close-field_popup"></div>');
      $(".intake-section .close-field_popup").click(function(){
      	$(".intake-section .field_popup").addClass('disabled');
      });
    }
  }
})(jQuery);
;

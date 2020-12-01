var actionNames = {
    single: {
        donationAmount: 'Step - Change Donation Amount - Form - One Off',
        donationType: 'Step - Donation Type - {{replace}} - One off',
        donationSource: 'Step - Donation Source - {{replace}} - One off',
        coverFees: 'Step - Cover Fees - One off',
        giftAid: 'Step - Gift Aid - One off',
        aboutYou: 'Step - About You - One off',
        address: 'Step - Your Address - One off',
        contactPreferences: 'Step - Contact Preferences - One off',
        paymentMethods: {
            paypal: 'Submission - PayPal - One off',
            directDebit: 'Submission - Card Payment - One off',
            apple: 'Submission - ApplePay - One off',
            google: 'Submission - GooglePay - One off'
        },
        paymentDetails: {
            paypal: 'Step - Payment Details - PayPal - One off',
            directDebit: 'Step - Payment Details - Card Payment - One off',
            apple: 'Step - Payment Details - ApplePay - One off',
            google: 'Step - Payment Details - GooglePay - One off'
        }
    },
    regular: {
        donationAmount: 'Step - Change Donation Amount - Form - Regular',
        donationType: 'Step - Donation Type - {{replace}} - Regular',
        giftAid: 'Step - Gift Aid - Regular',
        contactPreferences: 'Step - Contact Preferences - Regular',
        paymentDetails: 'Step - Payment Details - Regular',
        aboutYou: 'Step - About You - Regular',
        address: 'Step - Your Address - Regular',
        submit: 'Submission - Direct Debit (Summary) - Regular',
        summary: {
            amend: 'Step - Amend Details - Regular',
            previous: 'Step - Return to previous step - Regular',
            submit: 'Submission - Direct Debit (Complete) - Regular'
        }
    }
};

var getKeepInTouchOptionList = function () {
    var str = [];
    if ($('#donation_DonatorEmailContactOptIn').is(':checked')) str.push('Email');
    if ($('#donation_DonatorTextContactOptIn').is(':checked')) str.push('Text');
    if ($('#donation_DonatorPhoneContactOptIn').is(':checked')) str.push('Phone');
    return str.join();
}

var lastEventAction = window.dataLayer !== undefined && window.dataLayer[window.dataLayer.length - 1] !== undefined ? window.dataLayer[window.dataLayer.length - 1].eventAction : "",
    lastEventLabel = window.dataLayer !== undefined && window.dataLayer[window.dataLayer.length - 1] !== undefined ? window.dataLayer[window.dataLayer.length - 1].eventLabel : "",
    lastEventValue = window.dataLayer !== undefined && window.dataLayer[window.dataLayer.length - 1] !== undefined ? window.dataLayer[window.dataLayer.length - 1].eventValue : "";


//new functions
function addNewItemToDataLayer(action, label, value) {

    if (dataLayerChanged(action, label, value)) {
        window.dataLayer.push({
            'event': 'eventGA',
            'eventCategory': 'Forms',
            'eventAction': action,
            'eventLabel': label,
            'eventValue': value,
            'eventNonInteraction': 'False'
        });
        lastEventAction = action;
        lastEventLabel = label;
        lastEventValue = value;
        console.log(window.dataLayer);
    }
}

function dataLayerChanged(newAction, newLabel, newValue) {
    if (newAction !== lastEventAction || newLabel !== lastEventLabel || newValue !== lastEventValue) {
        return true;
    }
    else {
        return false;
    }
}

function updateDataLayerEventAction(action) {
    lastEventAction = action;
}

function updateDataLayerEventLabel(label) {
    lastEventLabel = label;
}

function updateDataLayerEventValue(value) {
    lastEventValue = value;
}

function isValid($val) {
    return $val.hasClass('valid');
}

function logValidFields($targets) {
    $targets.each(function () {
        console.log($(this).attr('name'));
    });
}

function eventHandler($t, event, totalRequired, label) {
    var eventSent = false;
    $t.on(event, function () {
        var totalValid = 0;
        $t.each(function () {
            if (isValid($(this))) {
                totalValid++;
            }
        });
        if (totalRequired === totalValid && !eventSent) {
            eventSent = true;
            addNewItemToDataLayer(label, lastEventLabel, lastEventValue);
        }
    });
}

function dataLayerContainsAction(action) {
    if (window.dataLayer === undefined) {
        return false;
    }
    for (var i in window.dataLayer) {
        if (window.dataLayer[i].eventAction === action) {
            return true;
        }
    }
    return false;
}
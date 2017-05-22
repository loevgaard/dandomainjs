(function($, dandomainjs, window){
    "use strict";

    var queue;

    dandomainjs.facebook = {
        events: {
            addPaymentInfo: function (data) {
                dandomainjs.facebook.pushEvent('AddPaymentInfo', data);
            },
            addToCart: function (data) {
                dandomainjs.facebook.pushEvent('AddToCart', data);
            },
            addToWishlist: function (data) {
                dandomainjs.facebook.pushEvent('AddToWishlist', data);
            },
            completeRegistration: function (data) {
                dandomainjs.facebook.pushEvent('CompleteRegistration', data);
            },
            initiateCheckout: function (data) {
                dandomainjs.facebook.pushEvent('InitiateCheckout', data);
            },
            lead: function (data) {
                dandomainjs.facebook.pushEvent('Lead', data);
            },
            purchase: function (data) {
                if(!data) {
                    data = {
                        value: dandomainjs.getters.page.purchase.total(),
                        currency: dandomainjs.getters.currency()
                    };
                }
                dandomainjs.facebook.pushEvent('Purchase', data);
            },
            search: function (data) {
                dandomainjs.facebook.pushEvent('Search', data);
            },
            viewContent: function (data) {
                dandomainjs.facebook.pushEvent('ViewContent', data);
            }
        },
        pushEvent: function (event, data) {
            if(!event) {
                console.error('No event supplied');
                return false;
            }
            if(window.hasOwnProperty('fbq')) {
                fbq('track', event, data);
            } else {
                initQueue();
                queue.push({
                    event: event,
                    data: data
                });
            }

        }
    };

    dandomainjs.page.addSubscriber(dandomainjs.page.PURCHASE, dandomainjs.facebook.events.purchase());
    dandomainjs.page.events.addSubscriber(dandomainjs.page.events.names.ADD_TO_CART, dandomainjs.facebook.events.addToCart());

    function initQueue() {
        if(!$.isArray(queue)) {
            queue = [];
        }
        setInterval(function () {
            if(!queue.length) {
                return;
            }

            if(!window.hasOwnProperty('fbq')) {
                console.warn('fbq is not defined. Include Facebook Pixel JS');
                return;
            }

            var eventObj = queue.shift();
            fbq('track', eventObj.event, eventObj.data);
        }, 500);
    }
})(jQuery, dandomainjs, window);
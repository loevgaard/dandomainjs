(function($, dandomainjs, window){
    "use strict";

    dandomainjs.events.FACEBOOK_PRE_PUSH = 'facebook_pre_push';
    dandomainjs.events.FACEBOOK_POST_PUSH = 'facebook_post_push';

    dandomainjs.facebook = {
        // see facebook events here: https://developers.facebook.com/docs/ads-for-websites/pixel-events/v2.9
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
                if(!data) {
                    var contentType, contentIds = [], products = [];

                    if(dandomainjs.page.isProduct()) {
                        contentType = 'product';
                        contentIds = [dandomainjs.getters.page.product.id()];
                    } else if(dandomainjs.page.isCategory()) {
                        contentType = 'product';
                        dandomainjs.getters.page.category.products().forEach(function (product) {
                            contentIds.push(product.getId());
                        });
                    } else if(dandomainjs.page.isBasket()) {
                        contentType = 'product';
                        dandomainjs.getters.page.basket.products().forEach(function (product) {
                            contentIds.push(product.getId());
                        });
                    } else if(dandomainjs.page.isPurchase()) {
                        contentType = 'product';
                        dandomainjs.getters.page.purchase.products().forEach(function (product) {
                            contentIds.push(product.getId());
                        });
                    }

                    if(contentType) {
                        data = {
                            content_type: contentType,
                            content_ids: contentIds
                        };
                    }
                }
                dandomainjs.facebook.pushEvent('ViewContent', data);
            }
        },
        pushEvent: function (event, data) {
            if(!event) {
                console.error('No event supplied');
                return false;
            }
            dandomainjs.eventManager.fire(dandomainjs.events.FACEBOOK_PRE_PUSH, [event, data]);
            if(window.hasOwnProperty('fbq')) {
                fbq('track', event, data);
            } else {
                initQueue();
                queue.push({
                    event: event,
                    data: data
                });
            }
            dandomainjs.eventManager.fire(dandomainjs.events.FACEBOOK_POST_PUSH, [event, data]);

        }
    };

    dandomainjs.eventManager.addListener(dandomainjs.events.PAGE_VIEW, function () {
        dandomainjs.facebook.events.viewContent();
    });
    dandomainjs.eventManager.addListener(dandomainjs.events.PAGE_VIEW_PURCHASE, function () {
        dandomainjs.facebook.events.purchase();
    });
    dandomainjs.eventManager.addListener(dandomainjs.events.ADD_TO_CART, function () {
        dandomainjs.facebook.events.addToCart();
    });

    var queue, interval;
    function initQueue() {
        if(interval !== undefined) {
            return;
        }
        if(!$.isArray(queue)) {
            queue = [];
        }
        interval = setInterval(function () {
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
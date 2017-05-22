(function($, window){
    "use strict";

    var dandomainjs = {};

    dandomainjs.languageIdToCurrency = {};

    dandomainjs.init = function(options) {
        if(options) {
            if(options.hasOwnProperty('languageIdToCurrency')) {
                dandomainjs.languageIdToCurrency = options.languageIdToCurrency;
            } else {
                console.error('The options object needs to have a languageIdToCurrency property which maps language ids to currencies');
            }
        } else {
            console.error('You need to include an options object with the init method');
        }

        if(window.AddedToBasketMessageTriggered) {
            dandomainjs.page.events.notifySubscribers(dandomainjs.page.events.names.ADD_TO_CART);
        }

        dandomainjs.page.notifySubscribers();
    };

    dandomainjs.moneyToFloat = function (money) {
        return parseInt(money.replace(/[^0-9]+/ig, '')) / 100;
    };
    
    dandomainjs.getters = {
        page: {
            product: {
                id: function () {
                    if(window.ProductVariantMasterID) {
                        return window.ProductVariantMasterID;
                    }

                    return window.ProductNumber;
                },
                name: function () {
                    return $('h1:first').text();
                },
                price: function () {
                    return dandomainjs.moneyToFloat($('[itemprop="price"]').text());
                },
                brand: $.noop(),
                category: $.noop(),
                variant: function () {
                    if(!window.ProductVariantMasterID) {
                        return '';
                    }

                    return window.ProductNumber.replace(window.ProductVariantMasterID + '-', '');
                }
            },
            purchase: {
                total: function () {
                    return parseFloat($('#transaction-value').text());
                }
            }
        },
        currency: function () {
            var languageId = parseInt(window.LanguageID);
            if(!dandomainjs.languageIdToCurrency.hasOwnProperty(languageId)) {
                console.error('No language id mapping for language id: ' + window.LanguageID);
                return '';
            }

            return dandomainjs.languageIdToCurrency[languageId];
        }
    };
    
    dandomainjs.page = {
        FRONTPAGE: 'frontpage',
        PRODUCT: 'product',
        PRODUCT_LIST: 'productList',
        CART: 'basket',
        BASKET: 'basket',
        PURCHASE: 'purchase',
        subscribers: {},
        addSubscriber: function (page, fn) {
            if(!this.subscribers.hasOwnProperty(page)) {
                this.subscribers[page] = [];
            }

            this.subscribers[page].push(fn);
        },
        notifySubscribers: function () {
            var currentPage = this.getCurrentPage();
            if(!this.subscribers.hasOwnProperty(currentPage)) {
                return;
            }
            this.subscribers[currentPage].forEach(function (subscriber) {
                subscriber.call();
            });
        },
        getCurrentPage: function () {
            if(this.isProduct()) {
                return this.PRODUCT;
            }

            if(this.isProductList()) {
                return this.PRODUCT_LIST;
            }

            if(this.isBasket()) {
                return this.BASKET;
            }

            if(this.isPurchase()) {
                return this.PURCHASE;
            }

            if(this.isFrontpage()) {
                return this.FRONTPAGE;
            }
        },
        events: {
            names: {
                ADD_TO_CART: 'addToCart'
            },
            subscribers: {},
            addSubscriber: function (event, fn) {
                if(!this.subscribers.hasOwnProperty(event)) {
                    this.subscribers[event] = [];
                }

                this.subscribers[event].push(fn);
            },
            notifySubscribers: function (event) {
                if(!this.subscribers.hasOwnProperty(event)) {
                    return;
                }
                this.subscribers[event].forEach(function (subscriber) {
                    subscriber.call();
                });
            },
            addToCart: function () {
                this.notifySubscribers(this.names.ADD_TO_CART);
            }
        },
        /**
         * Returns true if the current page is the frontpage (i.e. url contains /shop/frontpage.html)
         *
         * @param url
         * @returns boolean
         */
        isFrontpage: function (url) {
            if(!url) {
                url = window.location.href;
            }
            return url.match(/\/shop\/frontpage\.html/i) !== null;
        },

        /**
         * Matches a product page (i.e. 1234p.html)
         *
         * @param url
         * @returns boolean
         */
        isProduct: function (url) {
            if(!url) {
                url = window.location.href;
            }
            return url.match(/\-[0-9]+p\.html/i) !== null;
        },

        /**
         * A product list is either a category page (.*-1234c1.html) or a category page with sub categories (.*-1234s1.html)
         *
         * @param url
         * @returns boolean
         */
        isProductList: function (url) {
            if(!url) {
                url = window.location.href;
            }
            return url.match(/\-[0-9]+s|c[0-9]+\.html/i) !== null;
        },

        /**
         * A search results pages (i.e. search-1.html)
         *
         * @param url
         * @returns boolean
         */
        isSearch: function (url) {
            if(!url) {
                url = window.location.href;
            }
            return url.match(/search\-[0-9]+\.html/i) !== null;
        },

        /**
         * This is an alias of isBasket
         *
         * @param url
         * @returns boolean
         */
        isCart: function (url) {
            return this.isBasket(url);
        },

        /**
         * Returns true if the current page is the basket (i.e. url contains /shop/showbasket.html)
         *
         * @param url
         * @returns boolean
         */
        isBasket: function (url) {
            if(!url) {
                url = window.location.href;
            }
            return url.match(/\/shop\/showbasket\.html/i) !== null;
        },
        
        /**
         * Returns true if the customer completed a purchase (i.e. url contains /shop/order4.html)
         *
         * @param url
         * @returns boolean
         */
        isPurchase: function (url) {
            if(!url) {
                url = window.location.href;
            }
            return url.match(/\/shop\/order4\.html/i) !== null;
        }
    };

    window.dandomainjs = dandomainjs;
})(jQuery, window);
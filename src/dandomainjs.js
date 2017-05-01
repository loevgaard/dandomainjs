(function($, window){
    "use strict";

    var dandomainjs = {};
    
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
                    return parseInt($('[itemprop="price"]').text().replace(/[^0-9]+/ig, '')) / 100;
                },
                brand: $.noop(),
                category: $.noop(),
                variant: function () {
                    if(!window.ProductVariantMasterID) {
                        return '';
                    }

                    return window.ProductNumber.replace(window.ProductVariantMasterID + '-', '');
                }
            }
        }
    };
    
    dandomainjs.page = {
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
         * Returns true if the current page is the cart (i.e. url contains /shop/showbasket.html)
         *
         * @param url
         * @returns boolean
         */
        isCart: function (url) {
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
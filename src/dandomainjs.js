(function($, window){
    "use strict";

    var dandomainjs = {};

    dandomainjs.languageIdToCurrency = {};
    dandomainjs.debug = false;

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

        this.eventManager.fire(dandomainjs.events.INIT);
    };

    /**
     * Takes a strings that resemble money, i.e.
     *
     * - 100,50
     * - 100.50
     * - 1.000,50
     * - 1,000.50
     *
     * and transforms them into a float
     *
     * @param {String} money
     * @return {number}
     */
    dandomainjs.moneyToFloat = function (money) {
        return parseInt(money.replace(/[^0-9]+/ig, '')) / 100;
    };

    dandomainjs.events = {
        INIT: 'init',
        PAGE_VIEW: 'page_view',
        PAGE_VIEW_FRONTPAGE: 'page_view_frontpage',
        PAGE_VIEW_PRODUCT: 'page_view_product',
        PAGE_VIEW_CATEGORY: 'page_view_category',
        PAGE_VIEW_BASKET: 'page_view_basket',
        PAGE_VIEW_SEARCH: 'page_view_search',
        PAGE_VIEW_PURCHASE: 'page_view_purchase',
        ADD_TO_CART: 'add_to_cart'
    };

    dandomainjs.selectors = {
        page: {
            basket: {
                product: 'ul.ShowBasket_Custom_UL li'
            },
            category: {
                product: 'ul.ProductList_Custom_UL li'
            },
            purchase: {
                product: 'tr.BasketLine_OrderStep4'
            }
        }
    };

    dandomainjs.getters = {
        page: {
            basket: {
                products: function () {
                    var products = [];
                    $(dandomainjs.selectors.page.basket.product).each(function () {
                        products.push(new window.BasketProduct($(this)));
                    });

                    return products;
                }
            },
            category: {
                products: function () {
                    var products = [];
                    $(dandomainjs.selectors.page.category.product).each(function () {
                        products.push(new window.CategoryProduct($(this)));
                    });

                    return products;
                }
            },
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
                products: function () {
                    var products = [];
                    $(dandomainjs.selectors.page.purchase.product).each(function () {
                        products.push(new window.PurchaseProduct($(this)));
                    });

                    return products;
                },
                total: function () {
                    var $obj = $('#transaction-value');
                    if(!$obj.length) {
                        console.error('You need to add this tag to the code field on step 4: <div id="transaction-value" style="display:none">[[AdWordsSubTotalInclVAT]]</div>');
                    }
                    return parseFloat($obj.text());
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
        PRODUCT_LIST: 'category',
        CATEGORY: 'category',
        CART: 'basket',
        BASKET: 'basket',
        PURCHASE: 'purchase',
        SEARCH: 'search',
        OTHER: 'other',
        /**
         * Returns the current page as a string
         *
         * @return String
         */
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

            return this.OTHER;
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
         * Alias to isCategory
         *
         * @param url
         * @returns boolean
         */
        isProductList: function (url) {
            return this.isCategory(url);
        },

        /**
         * A category is either a category page (.*-1234c1.html) or a category page with sub categories (.*-1234s1.html)
         *
         * @param url
         * @returns boolean
         */
        isCategory: function (url) {
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

    dandomainjs.eventManager = {
        listeners: {},
        addListener: function (name, fn) {
            if(!this.listeners.hasOwnProperty(name)) {
                this.listeners[name] = [];
            }

            dandomainjs.log('Listener added to event: ' + name);

            this.listeners[name].push(fn);
        },
        // @todo implement removeListener method
        fire: function (name, args) {
            if(!this.listeners.hasOwnProperty(name)) {
                return;
            }

            dandomainjs.log("Event '" + name + "' fired with arguments:", args);

            this.listeners[name].forEach(function (listener) {
                listener.apply(window, args || []);
            });
        }
    };

    dandomainjs.log = function (message, data) {
        if(this.debug) {
            console.info('[dandomainjs] ' + message);
            if(data) {
                console.info(data);
            }
        }
    };

    // base product
    window.Product = function ($container) {
        this.$container = $container;
    };

    // category product
    window.CategoryProduct = function ($container) {
        Product.call(this, $container);
        
        this.getId = function () {
            return this.$container.find('input[name="ProductID"]').val();
        };
    };

    window.CategoryProduct.prototype = Object.create(window.Product.prototype);
    window.CategoryProduct.prototype.constructor = window.CategoryProduct;

    // basket product
    window.BasketProduct = function ($container) {
        Product.call(this, $container);

        this.getId = function () {
            return this.$container.find('.product-number').text();
        };
    };

    window.BasketProduct.prototype = Object.create(window.Product.prototype);
    window.BasketProduct.prototype.constructor = window.BasketProduct;

    // purchase product
    window.PurchaseProduct = function ($container) {
        Product.call(this, $container);

        this.getId = function () {
            return this.$container.find("td:eq(2)").text();
        };

        this.getTotal = function () {
            return dandomainjs.moneyToFloat(this.$container.find("td:eq(6)").text());
        };
    };

    window.PurchaseProduct.prototype = Object.create(window.Product.prototype);
    window.PurchaseProduct.prototype.constructor = window.PurchaseProduct;

    $(function() {
        dandomainjs.eventManager.fire(dandomainjs.events.PAGE_VIEW);

        var currentPageViewEvent = 'PAGE_VIEW_' + dandomainjs.page.getCurrentPage().toUpperCase();
        if(dandomainjs.events.hasOwnProperty(currentPageViewEvent)) {
            dandomainjs.eventManager.fire(dandomainjs.events[currentPageViewEvent]);
        }

        if(window.AddedToBasketMessageTriggered) {
            dandomainjs.eventManager.fire(dandomainjs.events.ADD_TO_CART);
        }
    });

    window.dandomainjs = dandomainjs;
})(jQuery, window);
(function($, dandomainjs, window){
    "use strict";

    if(!dandomainjs.hasOwnProperty('gtm')) {
        console.error('Remember to include dandomainjs.gtm.js before including this library');
        return false;
    }

    dandomainjs.gtm.ecommerce = {
        productImpressions: function (obj) {
            dandomainjs.gtm.push(obj, 'productImpressions');
        },
        createProductImpressions: function(impressions, currencyCode) {
            var obj = {
                ecommerce: {
                    impressions: impressions
                }
            };

            if(currencyCode) {
                obj.ecommerce.currencyCode = currencyCode;
            }

            return obj;
        },
        createProductImpression: function (id, name, price, brand, category, variant, list, position) {
            if(!id && !name) {
                console.error('Either id or name is required');
                return false;
            }

            var obj = {};

            if(id) {
                obj.id = id;
            }

            if(name) {
                obj.name = name;
            }

            if(price) {
                obj.price = price;
            }

            if(brand) {
                obj.brand = brand;
            }

            if(category) {
                obj.category = category;
            }

            if(variant) {
                obj.variant = variant;
            }

            if(list) {
                obj.list = list;
            }

            if(position) {
                obj.position = position;
            }

            return obj;
        }
    };
})(jQuery, dandomainjs, window);
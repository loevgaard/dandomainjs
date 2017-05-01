(function($, dandomainjs, window){
    "use strict";

    dandomainjs.gtm = {
        dataLayerName: 'dataLayer',

        push: function (obj, event) {
            if(event) {
                obj.event = event;
            }
            window[this.dataLayerName].push(obj);
        }
    };
})(jQuery, dandomainjs, window);
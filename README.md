# dandomainjs - A library making things easier on the Dandomain webshop

[![Software License][ico-license]](LICENSE)

The intention of this library is make common tasks easy to accomplish, i.e. facebook tracking, ecommerce tracking.

It includes some nice utilities also that eases your javascripting with the Dandomain platform.

## Structure
The source files are located in the `src` folder, and the tests are located in `tests`

## Install
Install using bower.io:
``` bash
$ bower install dandomainjs --save
```

or download the files directly from the `src` directory.

## Usage
``` html
<script src="dandomainjs.js"></script>
<script src="dandomainjs.facebook.js"></script>
<script>
// for full usage capabilities, run the init method with a mapping for
// your language ids to currencies
dandomainjs.init({
    languageIdToCurrency: {
        26: 'DKK',
        27: 'SEK',
        28: '...'
    }
});
</script>
```

In the code field for order step 4 in the Dandomain admin, insert these tags:
``` html
<div id="transaction-order-id" style="display:none">[[OrderID]]</div>
<div id="transaction-value" style="display:none">[[AdWordsSubTotalInclVAT]]</div>
<div id="transaction-value-excl-vat" style="display:none">[[AdWordsSubTotalExclVAT]]</div>
<div id="transaction-shipping" style="display:none">[[ShippingFeeInclVAT]]</div>
<div id="transaction-shipping-excl-vat" style="display:none">[[ShippingFeeExclVAT]]</div>
```


## Testing
We use QUnit for unit testing. You can run the tests by opening the html files in the `tests` folder.

You are more than welcome to add more tests.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
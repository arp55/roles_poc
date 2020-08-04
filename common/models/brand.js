'use strict';

module.exports = function (Brand) {
    Brand.validatesUniquenessOf('name');
};

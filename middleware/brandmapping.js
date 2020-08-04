var app = require('../server/server');

module.exports = async function mapping(req, res, user, next) {

    var SuperBrand = app.models.super_brand;
    var Brand = app.models.brand;
    var Store = app.models.store;

    if (req.headers.role == 'admin') {
        //mapping to superbrands
        user.superBrands.create({
            name: req.body.brand
        }, function (err, brand) {
            if (err) throw err;

            console.log('Created superbrand mapping:', brand);
        });
    }
    else if (req.headers.role == 'brandadmin') {
        //apply logic to check if the user is really an admin applied in auth.js
        let sid = req.token.id;
        const superbrandId = await SuperBrand.find({ where: { ownerId: sid } });
        console.log(superbrandId[0].id);
        user.brands.create({
            name: req.body.brand,
            superBrandId: superbrandId[0].id
        }, function (err, brand) {
            if (err) throw err;

            console.log("Created brand mapping", brand);
        });
    }
    else if (req.headers.role == 'brandmanager') {
        //mapping stores
        // console.log("tokenis:", req.token);
        // let bid = req.token.id;
        // const brandId = await Brand.find({ where: { ownerId: bid } });
        // console.log(brandId);

        //searching for brandname which has to be inserted since if admin is creating a brand then the brand name has to mentioned

        const brandname = req.body.brand;
        const brand = await Brand.find({ where: { name: brandname } });
        console.log("Brand is:", brand);

        user.stores.create({
            name: req.body.brand,
            location: req.body.location,
            brandId: brand[0].id
        }, function (err, store) {
            if (err) throw err;

            console.log("Created store mapping", store);
        })
    }
    else if (req.headers.role == 'brandwaiter') {
        //mapping waiter to store
        // console.log("tokenis:", req.token);
        // let stid = req.token.id;
        // const storeId = await Store.find({ where: { ownerId: stid } });
        // console.log(storeId);

        const location = req.body.store;
        const brand = req.body.brand;
        const store = await Store.find({ where: { name: brand, location: location } });
        console.log("Store is:", store);


        user.waiters.create({
            mobile: req.body.phone,
            storeId: store[0].id
        }, function (err, waiter) {
            if (err) throw err;

            console.log("Created waiter mapping", waiter);
        })
    }
}
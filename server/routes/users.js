// var app = require('../../server/server');

// module.exports = function () {
//     const express = require('express');
//     app.use(express.json());

//     const bcrypt = require('bcrypt');

//     var User = app.models.user;
//     var Role = app.models.Role;
//     var RoleMapping = app.models.RoleMapping;
//     var SuperBrand = app.models.super_brand;

//     // User.observe('after save', function function_name(ctx, next) {
//     //     if (ctx.instance) {
//     //         console.log(ctx.instance)
//     //         if (ctx.isNewInstance) {

//     //             // look up role based on type
//     //             //
//     //             Role.create({ name: 'superadmin' }, function (err, role) {
//     //                 if (err) { return console.log(err); }

//     //                 RoleMapping.create({
//     //                     principalType: "USER",
//     //                     principalId: ctx.instance.id,
//     //                     roleId: role.id
//     //                 }, function (err, roleMapping) {

//     //                     if (err) { return console.log(err); }

//     //                     console.log('User assigned RoleID ' + role.id + ' (' + ctx.instance.type + ')');

//     //                 })

//     //             });

//     //         }
//     //     }
//     //     next();
//     // });

//     app.get('/users', async (req, res) => {
//         const users = await User.find();
//         res.status(200).send(users)
//     })

//     app.post('/createUser', async (req, res) => {

//         const salt = await bcrypt.genSalt(10);
//         const password = await bcrypt.hash(req.body.password, salt);

//         const user = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             password: password,
//         })

//         // const superbrand = await SuperBrand.create({
//         //     name: req.body.superbrand
//         // })

//         if (user) {
//             console.log("User is:");
//             console.log("admin id:", user)
//             const roleid = await Role.find({ where: { name: req.headers.role } })
//             console.log("adminid", roleid);
//             //make bob an admin
//             roleid[0].principals.create({
//                 principalType: RoleMapping.USER,
//                 principalId: user.id
//             }, function (err, principal) {
//                 if (err) throw err;

//                 console.log('Created principal:', principal);
//             });
//         }

//         if (superbrand) {
//             console.log("superbrand:", superbrand);
//             user.superBrands.create({
//                 name: req.body.superbrand
//             }, function (err, brand) {
//                 if (err) throw err;

//                 console.log('Created brand mapping:', brand);
//             });
//         }

//         res.status(200).send(user);
//     })

//     app.post('/createRole', async (req, res) => {
//         let role = await Role.find({ where: { name: req.body.name } })
//         console.log(role);
//         if (role.length < 1) {
//             let adminrole = await Role.create({ name: req.body.name });
//             if (adminrole) {
//                 console.log("Role created");
//                 res.status(200).send("Role created")
//             }
//             else {
//                 console.log("not created");
//             }
//         }
//     })
// }
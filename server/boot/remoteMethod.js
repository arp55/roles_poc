var app = require('../../server/server');

module.exports = function () {
    const express = require('express');
    app.use(express.json());

    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    const config = require('config');

    const auth = require('../../middleware/auth');

    const mapping = require('../../middleware/brandmapping');

    var User = app.models.user;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    var SuperBrand = app.models.super_brand;
    var AccessToken = app.models.AccessToken;

    app.get('/users', async (req, res) => {
        console.log("request", req.route.path);
        try {
            const users = await User.find();
            console.log(users)
            res.status(200).send(users);
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    })

    app.post('/createUser', auth, async (req, res) => {
        try {

            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
            })
            const role = req.headers.role;
            console.log("admin id:", user)
            const roleid = await Role.find({ where: { name: role } })
            console.log("adminid", roleid);

            //mapping user to role
            roleid[0].principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
            }, function (err, principal) {
                if (err) {
                    throw err;
                }
                console.log('Created principal:', principal);
            });

            mapping(req, res, user);

            return res.status(200).send(user);
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err.message);
        }
    })

    app.post('/createRole', auth, async (req, res) => {
        let role = await Role.find({ where: { name: req.body.name } })
        if (role.length < 1) {
            let adminrole = await Role.create({ name: req.body.name });
            if (adminrole) {
                console.log("Role created");
                res.status(200).send("Role created")
            }
            else {
                console.log("not created");
            }
        }
        else {
            res.status(400).send("Role already exists!")
        }
    })

    app.post('/userlogin', async (req, res) => {
        let user = await User.find({ where: { email: req.body.email } })
        console.log(user);
        const validpass = await bcrypt.compare(req.body.password, user[0].password);
        console.log(validpass);
        if (!validpass) res.status(400).send("Invalid email or password!");

        const roleid = await RoleMapping.find({ where: { principalId: user[0].id } });
        console.log("rolemapping:", roleid);

        const role = await Role.find({ where: { id: roleid[0].roleId } });
        console.log("role:", role[0].name);

        let token = jwt.sign({ id: user[0].id, role: role[0].name }, config.get('jwtPrivateKey'));

        user[0].accessTokens.create({
            id: token
        }, function (err, token) {
            if (err) throw err;

            console.log('Created token:', token);
        });

        res.status(200).send(token);
    })
}
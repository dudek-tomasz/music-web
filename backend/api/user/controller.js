const User = require('./schema.js');
const USER_ENDPOINT = 'users';
const ObjectID = require('mongodb').ObjectID;
const authGuard = require('../../auth.guard');
const authService = require('../../auth.service');

module.exports = function (router) {
    router.get(`/${USER_ENDPOINT}`, (req, res) => {
        User.find({}).exec(function (error, result) {
            if (error) {
                res.status(400).json(
                    {
                        message: "Users not found",
                        error: error
                    }
                );

            } else {
                res.status(200).json(result);
            }
        });
    });
    router.post(`/${USER_ENDPOINT}`, async (req, res) => {
        let password = req.body.password;

        let newUser = new User();
        newUser.login = req.body.login;
        newUser.name = req.body.name;
        newUser.password = await authService.hashPassword(password);
        newUser.save((error, result) => {
            if (error) {
                res.status(400).json(error);
            } else {
                res.status(200).json({
                    message: "New user created!",
                    user: newUser
                });
                console.log("Dodano jeden element")
            }
        });

    });

    router.get(`/${USER_ENDPOINT}/:id`, (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        User.findById(id)
            .exec()
            .then(doc => {
                console.log("From Database", doc);
                if (doc) {
                    res.status(200).json(doc.name);
                } else {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    });

    router.put(`/${USER_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        const id = req.params.id;
        if(decodedTokenData.data.userId===id) {
            User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) throw err;
                res.json(post);
            });
        } else res.status(401).json('You have no permissions')
    });

    router.post(`/${USER_ENDPOINT}/login`, async (req, res) => {
        let passwordFromRequest = req.body.password;
        let loginFromRequest = req.body.login;

        User.findOne({login: loginFromRequest}, async function (err, foundUser) {
            if (err) {
                res.status(500).json(err);
            }

            if (!foundUser) {
                res.status(404).json('User not found');
            }

            if (await authService.verifyUserPassword(passwordFromRequest, foundUser.password)) {
                res.status(200).json({
                    _id: foundUser._id,
                    login: foundUser.login,
                    name: foundUser.name,
                    token: await authService.createAuthToken(foundUser._id)
                });
            } else {
                res.status(403).json({message: "Password not match"});
            }
        });
    });
};

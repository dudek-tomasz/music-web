const Grade = require('./schema');
const Band = require('../band/schema');
const Track = require('../track/schema');
const Joi =require('joi');
const GRADE_ENDPOINT = 'grades';
const USER_ENDPOINT = 'users';
const BAND_ENDPOINT = 'bands';
const TRACK_ENDPOINT = 'tracks';
const mongoUrl = 'mongodb+srv://test:test123@cluster0-y4xir.gcp.mongodb.net/Musicweb';
const ObjectID = require('mongodb').ObjectID;
const authGuard = require('../../auth.guard');
const authService = require('../../auth.service');

module.exports = function (router) {
    router.post(`/${BAND_ENDPOINT}/:id/${GRADE_ENDPOINT}`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        const id = req.params.id;
        let newGrade = new Grade();
        newGrade.comment = req.body.comment;
        newGrade.grade = req.body.grade;
        newGrade.targetId = id;
        newGrade.userId = decodedTokenData.data.userId;
        Band.findById(id)
            .exec()
            .then(doc => {
                if (doc) {
                    newGrade.type="BAND";
                    newGrade.save((error, result) => {
                        if (error) {
                            res.status(400).json(error);
                        } else {
                            res.status(200).json({
                                message: "New grade created!",
                                grade: newGrade
                            });
                            console.log("Dodano ocenę")
                        }
                    });
                } else {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });

    });
    router.post(`/${TRACK_ENDPOINT}/:id/${GRADE_ENDPOINT}`, authGuard, async  (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        const id = req.params.id;
        let newGrade = new Grade();
        newGrade.comment = req.body.comment;
        newGrade.grade = req.body.grade;
        newGrade.targetId = id;
        newGrade.userId = decodedTokenData.data.userId;
        Track.findById(id)
            .exec()
            .then(doc => {
                if (doc) {
                    newGrade.type="TRACK";
                    newGrade.save((error, result) => {
                        if (error) {
                            res.status(400).json(error);
                        } else {
                            res.status(200).json({
                                message: "New grade created!",
                                grade: newGrade
                            });
                            console.log("Dodano ocenę")
                        }
                    });
                } else {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    });
    /////////////////////////////////////////////////////////
    router.delete(`/${GRADE_ENDPOINT}/:id`,  authGuard, async (req, res) => {
        const id = req.params.id;
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        const details = {'_id': new ObjectID(id)};
        myQuery = {_id: id};
        Grade.findOne(details, (err, obj) => {
            if (err) {
                throw err;
            } else {
                const gradeUserId=obj.userId;
                if(decodedTokenData.data.userId===gradeUserId) {
                    Grade.deleteOne(myQuery, function (err, obj) {
                        if (err) throw err;
                        console.log("1 document deleted");
                    });
                } else res.status(401).json('You have no permissions');
            }
        })
    });
    /////////////////////////////////////////////////////////
    router.get(`/${USER_ENDPOINT}/:id/${GRADE_ENDPOINT}`,(req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        //where foreach Grade.userId = id;
        Grade.find({userId: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No entries found!"});
            } else {
                res.status(200).json(result);
            }
        });
    });

    router.get(`/${BAND_ENDPOINT}/:id/${GRADE_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};

        //where foreach Grade.targetId = id;
        Grade.find({targetId: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No entries found!"});
            } else {
                res.status(200).json(result);
            }
        });
    });
    router.get(`/${TRACK_ENDPOINT}/:id/${GRADE_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};

        //where foreach Grade.targetId = id;
        Grade.find({targetId: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No entries found!"});
            } else {
                res.status(200).json(result);
            }
        });
    });

}

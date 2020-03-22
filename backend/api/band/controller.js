const Band = require('./schema');
const Joi =require('joi');
const BAND_ENDPOINT = 'bands';
const USER_ENDPOINT = 'users';
const ObjectID = require('mongodb').ObjectID;
const authGuard = require('../../auth.guard');
const authService = require('../../auth.service');
const adminId= "5e302faed25650441cf7e8cb";
const adminPass= "admin123";

module.exports = function (router) {

    router.get(`/${BAND_ENDPOINT}`, async ({query}, res, next) => {
        const qValidtor = Joi.object({
            limit: Joi.number().integer().max(15).default(10),
            skip: Joi.number().integer().default(0),
            category: Joi.string().valid(['Rock/Metal', 'POP', 'HIP-HOP/RAP/TRAP', 'DANCE/ELECTRONIC/HOUSE', 'CLASICAL/OPERA', 'R&B', 'SOUL/BLUES']),
            name: Joi.string()
        }).validate(query);

        if (qValidtor.error) {
            return res.status(400).end();
        }

        const {skip, limit, category, name} = qValidtor.value;
        const mongoQuery = {};

        if (category){
            mongoQuery.category = category
        };
        if (name){
            mongoQuery.name = name
        };

        let results = [];
        try {
            results = await Promise.all([
                Band
                    .find({name: new RegExp(mongoQuery.name, 'i'),category: new RegExp(mongoQuery.category, 'i')})
                    .skip(skip)
                    .limit(limit),
                Band.countDocuments(mongoQuery)
            ]);
        } catch (err) {
            return next(err)
        }

        return res
            .status(200)
            .set('X-Total-Count', results[1])               // Ile jest wszystkich potencjalnych wynikow pasujacych do query
            .set('X-Result-Count', results[0].length)       // Ile zwrocono wynikow, opcjonalne, ale przydatne jesli klient nie zna limitu domyslnego
            .json(results[0]);
    });
    router.post(`/${BAND_ENDPOINT}`, authGuard, async(req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if(decodedTokenData.data.userId===adminId) {
            let newBand = new Band();
            newBand.name = req.body.name;
            newBand.category = req.body.category;
            newBand.description = req.body.description;
            newBand.save((error, result) => {
                if (error) {
                    res.status(400).json(error);
                } else {
                    res.status(200).json({
                        message: "New band created!",
                        band: newBand
                    });
                    console.log("Dodano jeden element")
                }
            });
        }
    });
    router.delete(`/${BAND_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        myQuery = {_id: id};
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if(decodedTokenData.data.userId===adminId) {
            Band.findOne(details, (err, obj) => {
                 if(obj) {
                     if (err) {
                         throw err;
                     }else
                    Band.deleteOne(myQuery, function (err, obj) {
                        if (err) throw err;
                        res.status(200).json({message:"Successfully deleted!"});
                    });
                } else res.status(404).json({message: "No valid entry found for provided ID"});

            })
        }
    });

    router.get(`/${BAND_ENDPOINT}/:id`, (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        Band.findById(id)
            .exec()
            .then(doc => {
                console.log("From Database", doc);
                if (doc) {
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    });

    router.put(`/${BAND_ENDPOINT}/:id`, authGuard, async (req, res) => {
        const decodedTokenData = await authService.decodeTokenFromHeaders(req);
        if(decodedTokenData.data.userId===adminId) {
            Band.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) {
                    throw err;
                    res.status(404).json({message: "No valid entry found for provided ID"});
                }
                res.json(post);
            });
        }
    });

    router.get(`/${USER_ENDPOINT}/:id/${BAND_ENDPOINT}`, (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};

        Band.find({usersFavList: {$in: [id]}}).exec(function (error, result) {
            if (error) {
                res.status(400).json({message: "No entries found"});
            } else {
                res.status(200).json(result);
            }
        });
    });

}

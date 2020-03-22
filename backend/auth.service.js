const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'WIMIP';

const checkToken = async (req) => {
    try {
        const decodedDataFromToken = await decodeTokenFromHeaders(req);
        return !!decodedDataFromToken;
    } catch (e) {
        throw e;
    }
};

const hashPassword = async (password) => {
    return await new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    reject(new Error('Create hash error'));
                }

                resolve(hash);
            });
        });
    });
};

const verifyUserPassword = async (password, userPasswordHash) => {
    return await new Promise((resolve, reject) => {
        bcrypt.compare(password, userPasswordHash, (_err, result) => {
            if (_err) {
                reject(new Error('Password error'));
            } else {
                resolve(result);
            }
        });
    });
};

const createAuthToken = async (userId) => {
    const authToken = jwt.sign({
        // 1h
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: {
            userId: userId
        }
    }, SECRET);

    return authToken;
};

const decodeTokenFromHeaders = async (req) => {
    return await new Promise(async (resolve, reject) => {
        const authToken = req.headers['authorization'];
        if (!authToken) {
            reject(new Error('Auth token not found'));
        } else {
            const jwtAuthToken = authToken.replace('Bearer ', '');

            jwt.verify(jwtAuthToken, SECRET, function (err, decodedData) {
                if (err) {
                    reject(new Error('Token verification error'));
                } else {
                    resolve(decodedData);
                }
            });
        }
    });
};


module.exports = {
    checkToken: checkToken,
    hashPassword: hashPassword,
    verifyUserPassword: verifyUserPassword,
    createAuthToken: createAuthToken,
    decodeTokenFromHeaders: decodeTokenFromHeaders
};

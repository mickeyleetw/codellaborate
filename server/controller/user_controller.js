const crypto = require('crypto');
const { selectFromtable, insertTableset, updateTable } = require('../model/editor_model.js');
// -------------------------------sign up------------------------------------------
const signup = async (req, res) => {
    const valid = validationUp(req);
    if (valid) {

        let result = await selectFromtable('email', 'users', 'email', req.body.email)
        if (result.length == 0) {
            const { token, expiry } = GetTokenExpiry();
            const salt = crypto.randomBytes(20).toString('hex');
            const hashedPassword = hashPassword(req.body.password, salt);
            let users = {
                provider: 'native',
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                token: token,
                expiry: expiry,
                salt: salt,
            };
            await insertTableset('users', users);
            let userSignup = await selectFromtable('*', 'users', 'email', users.email);
            const results = {
                data: {
                    access_token: userSignup.token,
                    access_expired: 3600,
                    user: {
                        id: userSignup.id,
                        provider: userSignup.provider,
                        name: userSignup.name,
                        email: userSignups.email,
                    }
                }
            }
            return res.json(results);
        } else {
            return res.status(403).send('Email Exits')
        }
    }
}
// -------------------------------sign in------------------------------------------
const signin = async (req, res) => {
    const valid = validationIn(req);
    if (valid == 'native') {
        let result = await selectFromtable('*', 'users', 'email', req.body.email)
        let userin = result[0];
        if (result.length > 0) {
            const hashedPassword = hashPassword(req.body.password, userin.salt);
            if (hashedPassword == userin.password) {
                const { token, expiry } = GetTokenExpiry();
                await updateTable('users', 'token=?,expiry = ?', 'id', [token,expiry,userin.id]);
                const results = {
                    data: {
                        access_token: token,
                        access_expired: 3600,
                        user: {
                            id: userin.id,
                            provider: userin.provider,
                            name: userin.name,
                            email: userin.email,
                        }
                    }
                }
                return res.json(results);
            } else {
                return res.status(403).send('Wrong Password,Please Try again');
            }
        }
        else {
            return res.status(403).send('Invalid email.');
        }

    }
}
// -------------------------------profile------------------------------------------
const profile = async (req, res) => {
    const token = GetToken(req);
    let result = await selectFromtable('*', 'users', 'token', token)

    if (result.length > 0) {
        let userp = result[0];
        const resultp = {
            data: {
                id: userp.id,
                token: userp.token,
                name: userp.name,
                email: userp.email,
            }
        }
        return res.json(resultp);
    } else {
        return res.status(403).send('Invalid access.');
    }
}
// -------------------------------userfile------------------------------------------
const userfile = async (req, res) => {
    const token = req.body.token;
    let userID = (await selectFromtable('id', 'users', 'token', token))[0].id;
    let result = (await selectFromtable('*', 'userFile', 'userID', userID));
    let fileArr = [];
    for (let numfile = 0; numfile < result.length; numfile++) {
        let filetmp = {
            "title": result[numfile].title,
            "saveTime": result[numfile].saveTime,
            "fileID": result[numfile].fileID
        }
        fileArr.push(filetmp);
    }
    return res.json(fileArr);
}
// -------------------------------------------------------------------------
function hashPassword(password, salt) {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}
// -------------------------------------------------------------------------
function GetTokenExpiry() {
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = Date.now() + 36000000; // 1 hour
    return { token, expiry };
}
// -------------------------------------------------------------------------
function GetToken(req) {
    const authorization = req.get('authorization');
    if (authorization) {
        const token = authorization.split(' ')[1];
        return token;
    } else {
        res.status(400).send('No access token.')
    }
}
// -------------------------------------------------------------------------
function validationUp(req) {
    let returnmessage = {};
    const contentType = req.get('Content-Type');
    if (contentType === 'application/json') {
        if (req.body.name && req.body.email && req.body.password) {
            return true;
        } else {
            return returnmessage = { 'status': 400, 'msg': 'Insufficient Request fields' };
        }
    } else {
        return returnmessage = { 'status': 400, 'msg': 'Invalid' };
     }
}
// -------------------------------------------------------------------------
function validationIn(req) {
    let returnmessage = {};
    const contentType = req.get('Content-Type');
    if (contentType === 'application/json') {
        if (req.body.provider == 'native' && req.body.email && req.body.password) {
            return 'native';
        } else {
            return returnmessage = { 'status': 400, 'msg': 'Insufficient Request fields' };
        }
    } else {
        return returnmessage = { 'status': 400, 'msg': 'Invalid' };
    }
}
// -------------------------------------------------------------------------
module.exports = {
    hashPassword,
    GetTokenExpiry,
    GetToken,
    signup,
    signin,
    profile,
    userfile
}
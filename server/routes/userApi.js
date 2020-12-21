const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const functions = require('../../util/functions');
const fetch = require('node-fetch');

// -------------------------------------------------------------------------
router.post('/signup', async (req, res) => {
    function validation() {
        const contentType = req.get('Content-Type');
        //application/json can only be used from postman,from signUp.html may accept application/pplication/x-www-form-urlencoded
        if (contentType === 'application/json') {
            if (req.body.name && req.body.email && req.body.password) {
                return true;
            } else {
                res.status(400).send('Insufficient Request fields')
            }
        } else {
            res.status(400).send('Invalid')
        }
    }

    const valid = validation();
    if (valid) {
        const sqlue = `SELECT email FROM users WHERE email = '${req.body.email}'`;
        let result = await functions.sqlquery(sqlue);

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
            const sqlu = 'INSERT INTO users SET ?';
            let idpk = (await functions.sqlquery(sqlu, users));
            const sqluu = `SELECT * FROM users WHERE email = '${users.email}'`;
            let resultu = (await functions.sqlquery(sqluu))[0];
            const results = {
                data: {
                    access_token: resultu.token,
                    access_expired: 3600,
                    user: {
                        id: resultu.id,
                        provider: resultu.provider,
                        name: resultu.name,
                        email: resultu.email,
                    }
                }
            }
            console.log("OKOK");
            console.log(results);
            return res.json(results);
        } else {
            return res.status(403).send('Email Exits')
        }
    }
})

// -------------------------------------------------------------------------
router.post('/signin', async (req, res) => {
    function validation() {
        const contentType = req.get('Content-Type');
        //application/json can only be used from postman,from signUp.html may accept application/pplication/x-www-form-urlencoded
        if (contentType === 'application/json') {
            if (req.body.provider == 'native' && req.body.email && req.body.password) {
                return 'native';
            } else {
                res.status(400).send('Insufficient Request fields')
            }
        } else {
            res.status(400).send('Invalid')
        }
    }

    const valid = validation();
    if (valid == 'native') {
        const sqluein = `SELECT * FROM users WHERE email = '${req.body.email}'`;
        let resultn = await functions.sqlquery(sqluein);
        let userin = resultn[0];

        if (resultn.length > 0) {
            const hashedPassword = hashPassword(req.body.password, userin.salt);


            if (hashedPassword == userin.password) {
                const { token, expiry } = GetTokenExpiry();
                sqluin = `UPDATE users SET token = '${token}', expiry = '${expiry}' WHERE id = ${userin.id};`
                await functions.sqlquery(sqluin);

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
            // res.redirect('/user/signin.html')
        }

    }

})
// -------------------------------------------------------------------------
router.get('/profile', async (req, res) => {
    function GetToken() {
        const authorization = req.get('authorization');
        if (authorization) {
            const token = authorization.split(' ')[1];
            return token;
        } else {
            res.status(400).send('No access token.')
        }
    }

    const token = GetToken();
    let sqlup = `SELECT * FROM users WHERE token = '${token}'`;
    let result = await functions.sqlquery(sqlup);

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
})
// -------------------------------------------------------------------------
router.post('/userFile', async (req, res) => {
    const token = req.body.token;
    let sql = "SELECT id FROM users WHERE token = ?;"
    const userID = (await functions.sqlquery(sql, token))[0].id;
    let sqluf = "SELECT * FROM userFile WHERE userID = ?;"
    const result = (await functions.sqlquery(sqluf, userID));
    let fileArr=[];
    for(let numfile=0;numfile<result.length;numfile++){
        let filetmp={
            "title":result[numfile].title,
            "saveTime":result[numfile].saveTime,
            "fileID":result[numfile].fileID
        }
        fileArr.push(filetmp);
    }
    // console.log(res.json(fileArr));
    return res.json(fileArr);
})
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

module.exports = router;
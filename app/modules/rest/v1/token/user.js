'use strict';

let express = require('express'),
	app = module.exports = express(),
	crypto = require('crypto'),
    load = require('project-require');

let User   = load('/app/models').User,
    Client = load('/app/models').Client,
    Token  = load('/app/models').Token;

app.post('/', (req, res) => {
	return createContext(req)
    .then(checkClient)
    .then(checkUser)
    .then(handleGrantType)
    .then(context => {
        if (context.error) {
            return Promise.reject(context.error);
        }

        return res.send(context.token);
    })
    .catch(err => {
        if (!err.error) {
            console.log(err.stack || err);
            return res.send(response.unknownError);
        }

        res.status(400).send(err);
    })
});

function createContext(req) {
    return new Promise((resolve, reject) => {
        let body = req.body;

        let context = {
            grant       : body.grant_type,
            client      : null,
            clientId    : body.client_id,
            secret      : body.client_secret,
            user: {
                username: body.username,
                password: body.password
            },
            token       : null,
            error       : null,
            headers     : req.headers,
            ip          : req.headers['X-Real-IP'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
        };

        return resolve(context);
    });
}

function checkClient(context) {
    return new Promise((resolve, reject) => {
        Client.findOne({ id: context.clientId, secret: context.secret }, (err, client) => {
            if (err) {
                context.error = err;
                return reject(context.error);
            }

            if (!client) {
                context.error = {status: 400};
                return reject(context.error);
            }

    		context.client = client;
            return resolve (context);

        });
    });
}

function handleGrantType(context) {
    if (context.error) {
        return Promise.reject(context.error);
    }

    return Promise.resolve(handlerGrantType[context.grant](context));
}

function checkUser(context) {
    return new Promise((resolve, reject) => {
        if (context.error) return reject(context);

        User.findOne({ username: context.user.username }, (err, user) => {
            if (err) {
                context.error = err;
                return reject(context.error);
            }

            if (!user) {
                context.error = {status: 400};
                return reject(context.error);
            }

            if (!user.verifyPassword(context.user.password)) {
            	context.error = { message: 'wrong password' };
            	return reject(context.error);
            }

    		context.user = user;
            return resolve(context);
        });
    });
}

let handlerGrantType = {
    password: context => {
        let tokenPool = [];
        tokenPool.push(destroyToken(Token, context.client.id, context.user.id));

        return Promise.all(tokenPool)
        .then(() => {
            let tokenPool = [];
            let tokenValue = crypto.randomBytes(32).toString('base64');

            tokenPool.push(createToken(Token, tokenValue, context.client.id, context.user.id));

            return Promise
            .all(tokenPool)
            .then(() => {
                context.token = {
                    access_token : tokenValue,
                    token_type   : "Bearer",
                    user: {
                        id       : context.user.id,
                        username : context.user.username
                    }
                };

                return context;
            });
        });
    }
}

function destroyToken(model, clientId, userId) {
    model.find({ userId: userId, clientId: clientId }).remove().exec();
    return true; 
}

function createToken(model, token, clientId, userId) {
	let accessToken = new Token({
        value   : token,
        clientId: clientId,
        userId  : userId
  	});

	accessToken.save((err, data) => {
		if (err) console.log(err);
		else return data;
	});
}
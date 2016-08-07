'use strict';

let express = require('express'),
	app = module.exports = express(),
	crypto = require('crypto');

app.post('/', (req, res) => {
	return createContext(req)
    .then(checkClient)
    .then(handleGrantType)
    .then(checkUser)
    .then(context => {
        if (context.error) {
            return Promise.reject(context.error);
        }

        return loggingAttempt({
            context: context,
            successful: true
        }).then(() => {
            res.send(context.token);
        });
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
        let body   = req.body;

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
    Client.findOne({ id: context.clientId, secret: context.secret }, (err, client) => {
        if (err) return context.error = err;

        if (!client) return context.error = {status: 400};

		context.client = client;
        return context;

    });
}

function checkUser(context) {
    User.findOne({ username: context.user.username }, (err, user) => {
        if (err) return context.error = err;

        if (!user) return context.error = {status: 400};

        if (!user.verifyPassword(context.user.password)) {
        	context.error = { message: 'wrong password' };
        	return context;
        }

		context.user = user;
        return context;

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
    model.find({ userId: userId, clientId: clientId }, (err, data) => {
    	if (data) data.remove();

    	return true; 
    });
}

function createToken(model, token, clientId, userId) {
	let accessToken = new Token({
	    value: value,
	    clientId: clientId,
	    userId: userId
  	});

	accessToken.save((err, data) => {
		if (err) console.log(err);
		else return data;
	});
}
'use strict';

let passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    load = require('project-require');

let security = load('/config').security;

let User   = load('/app/models').User,
    Client = load('/app/models').Client,
    Token  = load('/app/models').Token;

function bearerToken() {
    if (security.checkBearer) {
        return passport.authenticate('bearer', { session: false });
    }

    return function(req, res, next) {
        next();
    }
}

module.exports = {
    bearerToken: bearerToken
}

passport.use(new BearerStrategy(
    (accessToken, done) => {
        Token.findOne({value: accessToken }, (err, token) => {
            if (err) return callback(err);
            if (!token) {
                return done(null, false);
            }

            Client.findOne({ id: token.clientId }, (err, client) => {
                if (err) return done(err);
                if (!client) return done(null, false);

                User.findOne({ _id: token.userId }, (err, user) => {
                    if (err) return done(err);
                    if (!user) return done(null, false);

                    done(null, user, { scope: '*' });
                });
            });
        });
    }
));
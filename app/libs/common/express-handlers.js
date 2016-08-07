'use strict';

module.exports = {
    header: () => {
        return (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            next();
        }
    },
    promise: () => {
        return (req, res, next) => {
            let expressSend = res.send.bind(res);

            res.error = (error) => {
                let errorAnswer;

                if (error instanceof Error) {
                    if (!(error.name === 'Fail')) {
                        errorAnswer = { code: 'unknown_error' };
                    } else {
                        errorAnswer = error;
                    }
                } else {
                    errorAnswer = error;
                }

                console.log(error);
                expressSend(errorAnswer);
            };

            next();
        }
    },
    response: () => {
        return (req, res, next) => {
            let expressSend = res.send.bind(res);

            res.send = (answer) => {
                expressSend(answer);
            };

            next();
        }
    },
    outOfPromise: () => {
        return (error, req, res, next) => {
            console.log(error);
            res.error(error);
        };
    }
};

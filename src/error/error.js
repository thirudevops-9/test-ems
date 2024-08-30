"use strict";
module.exports = class HTTPError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
};

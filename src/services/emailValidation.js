"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidator = void 0;
const expression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const emailValidator = (email) => {
    const result = expression.test(email);
    return result;
};
exports.emailValidator = emailValidator;

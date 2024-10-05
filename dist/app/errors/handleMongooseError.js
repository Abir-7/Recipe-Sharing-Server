"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongooseDuplicateError = exports.handleMongooseCastError = exports.handleMongooseError = void 0;
//validation error
const handleMongooseError = (err) => {
    const errorSource = Object.values(err.errors).map((value) => {
        return {
            path: value === null || value === void 0 ? void 0 : value.path,
            message: value === null || value === void 0 ? void 0 : value.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Mongoose Error",
        errorSource,
    };
};
exports.handleMongooseError = handleMongooseError;
//cast error
const handleMongooseCastError = (err) => {
    const errorSource = [
        {
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err === null || err === void 0 ? void 0 : err.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Mongoose Error",
        errorSource,
    };
};
exports.handleMongooseCastError = handleMongooseCastError;
//dpulicate error
const handleMongooseDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/) ||
        err.erroData.errorResponse.errmsg.match(/"([^"]*)"/);
    const message = match && match[1];
    const errorSource = [
        {
            path: "",
            message: `${message} is duplicated`,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Mongoose duplicate Error",
        errorSource,
    };
};
exports.handleMongooseDuplicateError = handleMongooseDuplicateError;

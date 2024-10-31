"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const misc_1 = require("../utils/misc");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    let data = {
        message: err.message || "Internal Server Error",
        data: [],
        status: 500,
    };
    return (0, misc_1.HttpResponse)(res, data);
};
exports.errorHandler = errorHandler;

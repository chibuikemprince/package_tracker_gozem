"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogError = exports.HttpResponse = void 0;
const stream_1 = require("stream");
const HttpResponse = (res, data) => {
    data.status =
        data.status == undefined || data.status == null ? 500 : data.status;
    data.message = data.message.replace(/[\\/\"']/g, "");
    let dataToJson = JSON.stringify(data);
    //res.status(data.status).json(data);
    res.writeHead(data.status, {
        "Content-Length": Buffer.byteLength(dataToJson),
        "Content-Type": "application/json",
    });
    var stream = new stream_1.Readable();
    stream.push(dataToJson); // stream apparently does not accept objects
    stream.push(null); // this
    stream.pipe(res);
    return;
};
exports.HttpResponse = HttpResponse;
const LogError = (err) => {
    //'fatal', 'error', 'warn', 'info', 'debug'
    let loggerOrder = "warn";
    if (err.status == "STRONG") {
        loggerOrder = "fatal";
    }
    else if (err.status == "INFO") {
        loggerOrder = "info";
    }
    console.log(err);
    return;
};
exports.LogError = LogError;

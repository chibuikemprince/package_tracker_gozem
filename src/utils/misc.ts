import { Response } from "express";
import { ErrorDataType, RESPONSE_TYPE } from "./types";
import { Readable } from "stream";

export const HttpResponse = (res: Response, data: RESPONSE_TYPE) => {
  data.status =
    data.status == undefined || data.status == null ? 500 : data.status;
  data.message = data.message.replace(/[\\/\"']/g, "");

  let dataToJson = JSON.stringify(data);

  //res.status(data.status).json(data);
  res.writeHead(data.status, {
    "Content-Length": Buffer.byteLength(dataToJson),
    "Content-Type": "application/json",
  });
  var stream = new Readable();
  stream.push(dataToJson); // stream apparently does not accept objects
  stream.push(null); // this

  stream.pipe(res);

  return;
};

export const LogError = (err: ErrorDataType) => {
  //'fatal', 'error', 'warn', 'info', 'debug'
  let loggerOrder = "warn";
  if (err.status == "STRONG") {
    loggerOrder = "fatal";
  } else if (err.status == "INFO") {
    loggerOrder = "info";
  }

  console.log(err);
  return;
};

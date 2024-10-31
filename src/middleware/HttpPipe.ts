import { Application, Request, Response, NextFunction } from "express";

export const HttpPipe = (app: Application) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.body = { ...req.query, ...req.body };

    if (req.body.hasOwnProperty("start")) {
      req.body.start = Number(req.body.start);
    }

    if (req.body.hasOwnProperty("stop")) {
      req.body.stop = Number(req.body.stop);
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    //:
    next();
  });
};

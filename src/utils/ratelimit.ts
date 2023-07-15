import rateLimitPkg from "express-rate-limit";

interface Options {
  windowMs: number;
  max: number;
}

function rateLimit(options: Options) {
  return rateLimitPkg({
    windowMs: options.windowMs,
    max: options.max,
    handler: function (req, res) {
      res.status(429).json({
        error: true,
        message: "Too many requests",
        code: 429,
      });
    },
    keyGenerator: function (req) {
      // @ts-ignore
      return req.cf_ip || req.ip;
    },
  });
}

export default rateLimit;

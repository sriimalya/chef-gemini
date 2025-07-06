import rateLimit from 'express-rate-limit'

export const recipeRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
    error: "Too many requests from this IP, please try again after an hour.", },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,
  message: 'Too many login/signup attempts. Try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
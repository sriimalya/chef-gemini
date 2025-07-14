export const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL_PRODUCTION,
    process.env.FRONTEND_URL_LOCAL,
  ];
  const origin = req.headers.origin;
  // 1. No ‘Access-Control-Allow-Origin’ Header
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    console.warn(`Blocked request from disallowed origin: ${origin}`);
    return res.status(403).json({ error: "CORS error: Origin not allowed" });
  }

  // 2. Credentials Not Allowed
  res.header("Access-Control-Allow-Credentials", "true");

  // 3. Method Not Allowed
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // 4. No ‘Access-Control-Allow-Headers’ Header
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 5. Preflight Request Handling (OPTIONS request)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};

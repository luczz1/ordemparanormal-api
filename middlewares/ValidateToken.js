import { tokenConfig } from "../config/ValidateToken.js";

import pkg from 'jsonwebtoken';
const { verify } = pkg;

export default function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  verify(token, tokenConfig.secret, (err, user) => {
    if (err) return res.sendStatus(401);

    req.user = user;
    next();
  });
}

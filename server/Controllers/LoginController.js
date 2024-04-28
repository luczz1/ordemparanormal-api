import pool from "../../connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { tokenConfig } from "../../config/ValidateToken.js";

import moment from 'moment';

dotenv.config();

class LoginController {
  async sendLogin(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json("Preencha todos os campos obrigatórios.");
    }

    try {
      const [res] = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (res.length > 0) {
        const user = res[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const date = moment().format('YYYY-MM-DD HH:mm:ss');

          await pool.execute("UPDATE users SET lastlogin = ? WHERE id = ?", [
            date, user.id
          ]);

          const token = generateAccessToken({ userid: user.id });
          response.status(200).json(token);
        } else {
          response.status(400).json("Email ou senha inválidos");
        }
      } else {
        response.status(400).json("Email ou senha inválidos");
      }
    } catch (err) {
      console.error(err);
      response.status(500).json("Erro interno do servidor");
    }
  }

  async postUsers(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json("Preencha os campos obrigatórios.");
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const date = moment().format('YYYY-MM-DD HH:mm:ss');

      const [res] = await pool.query(
        "INSERT INTO users (name, email, password, lastlogin, created_at) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, date, date]
      );

      const token = generateAccessToken({ userid: res.insertId });
      response.status(200).json(token);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      response.status(500).json("Internal Server Error");
    }
  }

  async whoami(req, res) {
    try {
      if (!req.user) {
        return res.status(200).json("Token inválido ou usuário inexistente");
      }

      const userId = req.user.userid;

      const [user] = await pool.query(
        "SELECT id, name, email FROM users WHERE id = ?",
        [userId]
      );

      if (!user.length) {
        return res.status(404).json("Usuário não encontrado");
      }

      res.status(200).json(user[0].name);
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      res.status(500).json("Erro interno do servidor");
    }
  }
}

function generateAccessToken(userid) {
  return jwt.sign(userid, tokenConfig.secret, { expiresIn: "365d" });
}

export default new LoginController();

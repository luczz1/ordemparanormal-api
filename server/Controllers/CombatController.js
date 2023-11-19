import pool from "../../connection.js";

class CombatController {
  async getAttacks(req, res) {
    const characterId = req.params.characterid;

    try {
      const [attackResults] = await pool.execute(
        "SELECT * FROM attacks WHERE character_id = ?",
        [characterId]
      );

      if (attackResults.length === 0) {
        res.status(200).json("Nenhum ataque encontrado.");
        return;
      }

      res.json(attackResults);
    } catch (error) {
      console.error("Erro ao obter ataques:", error);
      res.status(500).json("Erro ao obter ataques");
    }
  }

  async getAttackByID(req, res) {
    const id = req.params.id;

    try {
      const [attackResults] = await pool.execute(
        "SELECT * FROM attacks WHERE id = ?",
        [id]
      );

      if (attackResults.length === 0) {
        res.status(200).json("Ataque não encontrado.");
        return;
      }

      res.json(attackResults);
    } catch (error) {
      console.error("Erro ao obter ataque:", error);
      res.status(500).json("Erro ao obter ataque");
    }
  }

  async getDefenseByID(req, res) {
    const id = req.params.id;

    try {
      const [defenseResults] = await pool.execute(
        "SELECT * FROM defense WHERE id = ?",
        [id]
      );

      if (defenseResults.length === 0) {
        res.status(200).json("Proteção não encontrada.");
        return;
      }

      res.json(defenseResults);
    } catch (error) {
      console.error("Erro ao obter proteção:", error);
      res.status(500).json("Erro ao obter proteção");
    }
  }

  async addAttacks(req, res) {
    try {
      const attackItem = req.body;
      const characterId = req.params.characterid;

      const [attackItemResult] = await pool.execute(
        "INSERT INTO attacks (attack_name, test, damage, critical_or_range_or_special, character_id) VALUES (?, ?, ?, ?, ?)",
        [
          attackItem.attack_name,
          attackItem.test,
          attackItem.damage,
          attackItem.critical_or_range_or_special,
          characterId,
        ]
      );

      const attackItemId = attackItemResult.insertId;

      res.json({
        id: attackItemId,
        ...attackItem,
      });
    } catch (error) {
      console.error("Erro ao criar um adicionar um ataque:", error);
      res.status(500).json("Erro ao criar um adicionar um ataque");
    }
  }

  async editAttack(req, res) {
    try {
      const attackItem = req.body;
      const attackId = req.params.id;

      await pool.execute(
        "UPDATE attacks SET attack_name = ?, test = ?, damage = ?, critical_or_range_or_special = ? WHERE id = ?",
        [
          attackItem.attack_name,
          attackItem.test,
          attackItem.damage,
          attackItem.critical_or_range_or_special,
          attackId,
        ]
      );

      res.json({
        message: "Atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao criar editar ataque:", error);
      res.status(500).json("Erro ao editar ataque");
    }
  }

  async editDefense(req, res) {
    try {
      const defenseItem = req.body;
      const defenseId = req.params.id;

      await pool.execute("UPDATE defense SET protection = ? WHERE id = ?", [
        defenseItem.protection_value,
        defenseId,
      ]);

      res.json({
        message: "Atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao criar editar defesa:", error);
      res.status(500).json("Erro ao editar defesa");
    }
  }

  async deleteAttacks(req, res) {
    const { id } = req.params;

    try {
      await pool.execute("DELETE FROM attacks WHERE id = ?", [id]);

      res.json({ message: "Ataque excluído." });
    } catch (error) {
      console.error("Erro ao excluir ataque:", error);
      res.status(500).json("Erro ao excluir ataque");
    }
  }

  async getDefenses(req, res) {
    const characterId = req.params.characterid;

    try {
      const [defenseResults] = await pool.execute(
        "SELECT * FROM defense WHERE character_id = ?",
        [characterId]
      );

      if (defenseResults.length === 0) {
        res.status(200).json("Nenhuma defesa encontrada.");
        return;
      }

      res.json(defenseResults);
    } catch (error) {
      console.error("Erro ao obter defesas:", error);
      res.status(500).json("Erro ao obter defesas");
    }
  }

  async addDefenses(req, res) {
    try {
      const defenseItem = req.body;
      const characterId = req.params.characterid;

      const [defenseItemResult] = await pool.execute(
        "INSERT INTO defense (protection, character_id) VALUES (?, ?)",
        [defenseItem.protection, characterId]
      );

      const defenseItemId = defenseItemResult.insertId;

      res.json({
        id: defenseItemId,
        ...defenseItem,
      });
    } catch (error) {
      console.error("Erro ao criar um adicionar uma defesa:", error);
      res.status(500).json("Erro ao criar um adicionar uma defesa");
    }
  }

  async deleteDefenses(req, res) {
    const { id } = req.params;

    try {
      await pool.execute("DELETE FROM defense WHERE id = ?", [id]);

      res.json({ message: "Defesa excluído." });
    } catch (error) {
      console.error("Erro ao excluir defesa:", error);
      res.status(500).json("Erro ao excluir defesa");
    }
  }

  async getTotalDefense(req, res) {
    const characterId = req.params.characterid;

    try {
      const [defenseResults] = await pool.execute(
        "SELECT * FROM character_defense WHERE character_id = ?",
        [characterId]
      );

      if (defenseResults.length === 0) {
        res.status(200).json("Nenhuma defesa encontrada.");
        return;
      }

      res.json(defenseResults);
    } catch (error) {
      console.error("Erro ao obter defesas:", error);
      res.status(500).json("Erro ao obter defesas");
    }
  }

  async editTotalDefense(req, res) {
    try {
      const characterId = req.params.id;
      const updatedDefense = req.params.defense_total;

      await pool.execute(
        "UPDATE character_defense SET defense_total = ? WHERE character_id = ?",
        [updatedDefense, characterId]
      );

      res.status(200).json({ message: "Defesa atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar defesa:", error);
      res.status(500).json("Erro ao atualizar defesa");
    }
  }
}

export default new CombatController();

import pool from "../../connection.js";

class AbilitiesController {
  async getAbilities(req, res) {
    try {
      const characterId = req.params.id;

      const [abilitiesResult] = await pool.execute(
        "SELECT * FROM abilities WHERE character_id = ?",
        [characterId]
      );

      if (abilitiesResult.length === 0) {
        res.status(200).json("Habilidades não encontradas");
        return;
      }

      const abilities = abilitiesResult;

      res.json({ abilities });
    } catch (error) {
      console.error("Erro ao obter habilidades:", error);
      res.status(500).json("Erro ao obter habilidades");
    }
  }

  async getAbilityByID(req, res) {
    try {
      const abilityID = req.params.id;

      const [result] = await pool.execute(
        "SELECT * FROM abilities WHERE id = ?",
        [abilityID]
      );

      if (result.length === 0) {
        res.status(200).json("Habilidade não encontrada");
        return;
      }

      const ability = result;

      res.json(ability[0]);
    } catch (error) {
      console.error("Erro ao obter habilidade:", error);
      res.status(500).json("Erro ao obter habilidade");
    }
  }

  async getRituals(req, res) {
    try {
      const characterId = req.params.id;

      const [powersResult] = await pool.execute(
        "SELECT * FROM powers WHERE character_id = ?",
        [characterId]
      );

      if (powersResult.length === 0) {
        res.status(200).json("Rituais não encontrados");
        return;
      }

      const powers = powersResult;

      res.json({ powers });
    } catch (error) {
      console.error("Erro ao obter rituais:", error);
      res.status(500).json("Erro ao obter rituais");
    }
  }

  async getRitualByID(req, res) {
    try {
      const ritualID = req.params.id;

      const [result] = await pool.execute("SELECT * FROM powers WHERE id = ?", [
        ritualID,
      ]);

      if (result.length === 0) {
        res.status(200).json("Ritual não encontrado");
        return;
      }

      const powers = result;

      res.json(powers[0]);
    } catch (error) {
      console.error("Erro ao obter ritual:", error);
      res.status(500).json("Erro ao obter ritual");
    }
  }

  async addAbilities(req, res) {
    try {
      const characterId = req.params.id;
      const ability = req.body;

      await pool.execute(
        "INSERT INTO abilities (character_id, name, description, page) VALUES (?, ?, ?, ?)",
        [characterId, ability.name, ability.description, ability.page]
      );

      res.status(200).json({ message: "Habilidade criada com sucesso" });
    } catch (error) {
      console.error("Erro ao criar nova habilidade:", error);
      res.status(500).json("Erro ao criar nova habilidade");
    }
  }

  async addRituals(req, res) {
    try {
      const characterId = req.params.id;
      const power = req.body;

      await pool.execute(
        "INSERT INTO powers (character_id, name, description, price, page, element, circle, target, duration, resistance, execution, reach) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          characterId,
          power.name,
          power.description,
          power.price,
          power.page,
          power.element,
          power.circle,
          power.target,
          power.duration,
          power.resistance,
          power.execution,
          power.reach,
        ]
      );

      res.status(200).json({ message: "Ritual criado com sucesso" });
    } catch (error) {
      console.error("Erro ao criar novo ritual:", error);
      res.status(500).json("Erro ao criar novo ritual");
    }
  }

  async updateAbility(req, res) {
    try {
      const abilityId = req.params.abilityId;
      const updatedAbility = req.body;

      await pool.execute(
        "UPDATE abilities SET name=?, description=?, page=? WHERE id=?",
        [
          updatedAbility.name,
          updatedAbility.description,
          updatedAbility.page,
          abilityId,
        ]
      );

      res.status(200).json({ message: "Habilidade atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar habilidade:", error);
      res.status(500).json("Erro ao atualizar habilidade");
    }
  }

  async updateRitual(req, res) {
    try {
      const ritualId = req.params.ritualId;
      const updatedRitual = req.body;

      await pool.execute(
        "UPDATE powers SET name=?, description=?, price=?, page=?, element=?, circle=?, target=?, duration=?, resistance=?, execution=?, reach=? WHERE id=?",
        [
          updatedRitual.name,
          updatedRitual.description,
          updatedRitual.price,
          updatedRitual.page,
          updatedRitual.element,
          updatedRitual.circle,
          updatedRitual.target,
          updatedRitual.duration,
          updatedRitual.resistance,
          updatedRitual.execution,
          updatedRitual.reach,
          ritualId,
        ]
      );

      res.status(200).json({ message: "Ritual atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar ritual:", error);
      res.status(500).json("Erro ao atualizar ritual");
    }
  }

  async updateRitualDT(req, res) {
    try {
      const character_id = req.params.characterid;
      const newDT = req.params.dt;

      console.log(req.params);

      await pool.execute("UPDATE characters SET dt=? WHERE id=?", [
        newDT,
        character_id,
      ]);

      res.status(200).json({ message: "DT atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar DT:", error);
      res.status(500).json("Erro ao atualizar DT");
    }
  }

  async deleteAbilities(req, res) {
    try {
      const characterId = req.params.id;
      const itemId = req.params.itemId;

      await pool.execute(
        "DELETE FROM abilities WHERE character_id = ? AND id = ?",
        [characterId, itemId]
      );

      res.status(200).json({ message: "Habilidade excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir habilidade:", error);
      res.status(500).json("Erro ao excluir habilidade");
    }
  }

  async deleteRituals(req, res) {
    try {
      const characterId = req.params.id;
      const itemId = req.params.itemId;

      await pool.execute(
        "DELETE FROM powers WHERE character_id = ? AND id = ?",
        [characterId, itemId]
      );

      res.status(200).json({ message: "Ritual excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir um ritual:", error);
      res.status(500).json("Erro ao excluir ritual");
    }
  }
}

export default new AbilitiesController();

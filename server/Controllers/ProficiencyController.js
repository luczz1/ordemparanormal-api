import pool from "../../connection.js";

class ProficiencyController {
  async getProficiencies(req, res) {
    try {
      const characterId = req.params.id;

      const [proficiencesResult] = await pool.execute(
        "SELECT * FROM proficiency WHERE character_id = ?",
        [characterId]
      );

      if (proficiencesResult.length === 0) {
        res.status(200).json("Proficiências não encontradas");
        return;
      }

      const proficiences = proficiencesResult;

      res.json(proficiences);
    } catch (error) {
      console.error("Erro ao obter proficiências:", error);
      res.status(500).json("Erro ao obter proficiências");
    }
  }

  async editProficiences(req, res) {
    try {
      const proficiencyID = req.params.id;
      const updatedProficiency = req.body;

      await pool.execute(
        "UPDATE proficiency SET simple_weapon = ?, tactical_weapon = ?, heavy_weapon = ?, light_armor = ?, heavy_armor = ? WHERE id = ?",
        [
          updatedProficiency.simple_weapon,
          updatedProficiency.tactical_weapon,
          updatedProficiency.heavy_weapon,
          updatedProficiency.light_armor,
          updatedProficiency.heavy_armor,
          proficiencyID,
        ]
      );

      res.status(200).json({ message: "Proficiências atualizadas." });
    } catch (error) {
      console.error("Erro ao atualizar proficiência:", error);
      res.status(500).json("Erro ao atualizar proficiência");
    }
  }
}

export default new ProficiencyController();

import pool from "../../connection.js";

class AboutController {
  async getCharacterAbout(req, res) {
    try {
      const characterId = req.params.characterId;

      const [aboutResult] = await pool.execute(
        "SELECT * FROM character_about WHERE character_id = ?",
        [characterId]
      );

      if (aboutResult.length === 0) {
        res.status(200).json([]);
        return;
      }

      const characterAbout = aboutResult[0];

      res.json(characterAbout);
    } catch (error) {
      console.error("Erro ao obter informações do personagem:", error);
      res.status(500).json("Erro ao obter informações do personagem");
    }
  }

  async editCharacterAbout(req, res) {
    try {
      const characterId = req.params.characterId;
      const updatedCharacterAbout = req.body;

      await pool.execute(
        "UPDATE character_about SET `history` = ?, personality = ?, goals = ? WHERE character_id = ?",
        [
          updatedCharacterAbout.history,
          updatedCharacterAbout.personality,
          updatedCharacterAbout.goals,
          characterId,
        ]
      );

      res.status(200).json({
        message: "Informações de personagem atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar informações de personagem:", error);
      res.status(500).json("Erro ao atualizar informações de personagem");
    }
  }
}

export default new AboutController();

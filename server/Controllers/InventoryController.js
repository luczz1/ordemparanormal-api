import pool from "../../connection.js";

class InventoryController {
  async getInventoryInfo(req, res) {
    try {
      const characterId = req.params.characterId;

      const [inventoryInfoResult] = await pool.execute(
        "SELECT * FROM inventory_infos WHERE character_id = ?",
        [characterId]
      );

      if (inventoryInfoResult.length === 0) {
        res.status(200).json("Informações do inventário não encontradas");
        return;
      }

      const inventoryInfo = inventoryInfoResult[0];

      res.json({ inventoryInfo });
    } catch (error) {
      console.error("Erro ao obter informações do inventário:", error);
      res.status(500).json("Erro ao obter informações do inventário");
    }
  }

  async editInventoryInfos(req, res) {
    try {
      const characterId = req.params.characterId;
      const updatedInventoryInfo = req.body;

      await pool.execute(
        "UPDATE inventory_infos SET prestige_points = ?, patent = ?, item_limit_1 = ?, item_limit_2 = ?, item_limit_3 = ?, item_limit_4 = ?, credit_limit = ?, max_load = ?, max_spc_load = ? WHERE character_id = ?",
        [
          updatedInventoryInfo.prestige_points,
          updatedInventoryInfo.patent,
          updatedInventoryInfo.item_limit_1,
          updatedInventoryInfo.item_limit_2,
          updatedInventoryInfo.item_limit_3,
          updatedInventoryInfo.item_limit_4,
          updatedInventoryInfo.credit_limit,
          updatedInventoryInfo.max_load,
          updatedInventoryInfo.max_spc_load,
          characterId,
        ]
      );

      res.status(200).json({
        message: "Informações de inventário atualizadas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar informações de inventário:", error);
      res.status(500).json("Erro ao atualizar informações de inventário");
    }
  }

  async getInventoryItems(req, res) {
    const characterId = req.params.characterid;

    try {
      const [inventoryItems] = await pool.query(
        "SELECT * FROM inventory_items WHERE character_id = ?",
        [characterId]
      );

      res.json({
        inventory_items: inventoryItems,
      });
    } catch (error) {
      console.error("Erro ao obter itens do inventário:", error);
      res.status(500).json("Erro ao obter itens do inventário");
    }
  }

  async getInventoryTotalWeight(req, res) {
    const characterId = req.params.characterid;

    try {
      const [inventoryItems] = await pool.query(
        "SELECT * FROM inventory_items WHERE character_id = ?",
        [characterId]
      );

      const [inventoryInfos] = await pool.query(
        "SELECT * FROM inventory_infos WHERE character_id = ?",
        [characterId]
      );

      const cargaAtual = inventoryItems.reduce((acc, total) => {
        acc += total.slots;
        return acc;
      }, 0);

      const cargaTotal = inventoryInfos[0].max_spc_load;

      res.json({
        atual: cargaAtual,
        total: cargaTotal,
        status: cargaAtual <= cargaTotal ? "Normal" : "Sobrecarga",
      });
    } catch (error) {
      console.error("Erro ao obter peso do inventário:", error);
      res.status(500).json("Erro ao obter peso do inventário");
    }
  }

  async addInventoryItems(req, res) {
    try {
      const newInventoryItem = req.body;
      const characterId = req.params.characterid;

      if (!newInventoryItem.item_name || !newInventoryItem.category || !newInventoryItem.slots) {
        res.status(500).json("Todos os campos são obrigatórios.");
        return;
      }

      const sqlInsert =
        "INSERT INTO inventory_items (item_name, category, slots, character_id) VALUES (?, ?, ?, ?)";
      const sqlUpdate = `
        UPDATE characters
        SET weight = weight + ?
        WHERE id = ?
      `;

      const [inventoryItemResult] = await pool.execute(sqlInsert, [
        newInventoryItem.item_name,
        newInventoryItem.category,
        newInventoryItem.slots,
        characterId,
      ]);

      const newInventoryItemId = inventoryItemResult.insertId;

      await pool.execute(sqlUpdate, [newInventoryItem.slots, characterId]);

      res.json({
        inventory_item: {
          id: newInventoryItemId,
          ...newInventoryItem,
        },
      });
    } catch (error) {
      console.error("Erro ao criar um novo item do inventário:", error);
      res.status(500).json("Erro ao criar um novo item do inventário");
    }
  }

  async deleteInventoryItems(req, res) {
    try {
      const itemId = req.params.id;

      const sqlSelect =
        "SELECT character_id, slots FROM inventory_items WHERE item_id = ?";
      const sqlDelete = "DELETE FROM inventory_items WHERE item_id = ?";
      const sqlUpdate = `
        UPDATE characters
        SET weight = weight - ?
        WHERE id = ?
      `;

      const [characterResult] = await pool.execute(sqlSelect, [itemId]);
      const { character_id, slots } = characterResult[0];

      await pool.execute(sqlDelete, [itemId]);
      await pool.execute(sqlUpdate, [slots, character_id]);

      res.json({ message: "Item do inventário excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir item do inventário:", error);
      res.status(500).json("Erro ao excluir item do inventário");
    }
  }
}

export default new InventoryController();

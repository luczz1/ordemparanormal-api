import pool from "../../connection.js";

import abilitiesMap from "../../models/abilitiesMap.js";
import abilitiesNexMap from "../../models/abilitiesNexMap.js";
import skillsMap from "../../models/skillsMap.js";

import fs from "fs";
import path from "path";
import mediaPath from "../../server.js";

class CharacterController {
  async getCharacters(req, res) {
    try {
      const userid = req.user.userid;

      const [characterResults] = await pool.execute(
        `SELECT * FROM characters WHERE user_id = ${userid}`
      );

      if (characterResults.length === 0) {
        res.status(200).json({ characters: [] });
        return;
      }

      const characters = characterResults.map((character) => {
        character.weight = character.weight.toFixed(2);
        return character;
      });

      res.json({ characters });
    } catch (error) {
      console.error("Erro ao obter personagens:", error);
      res.status(500).json("Erro ao obter personagens");
    }
  }

  async getCharacterByID(req, res) {
    try {
      const characterId = req.params.id;

      const [characterResult] = await pool.execute(
        "SELECT * FROM characters WHERE id = ?",
        [characterId]
      );

      if (characterResult.length === 0) {
        res.status(404).json("Personagem não encontrado");
        return;
      }

      const character = characterResult[0];
      character.weight = character.weight.toFixed(2);

      res.json({ character });
    } catch (error) {
      console.error("Erro ao obter personagem:", error);
      res.status(500).json("Erro ao obter personagem");
    }
  }

  async addCharacter(req, res) {
    const userid = req.user.userid;

    try {
      const newCharacter = req.body;

      let {
        name,
        current_life,
        max_life,
        current_sanity,
        max_sanity,
        current_effort,
        max_effort,
        charClass,
        image_url,
        nex,
        weight,
        age,
        occupation,
        path,
        player,
        displacement,
        origin,
        pe_round,
        agility,
        strength,
        intellect,
        stamina,
        presence,
      } = newCharacter;

      const lowerCharClass = charClass.toLowerCase();

      if (lowerCharClass === "ocultista") {
        max_life = 12 + stamina;
        max_effort = 4 + presence;
        max_sanity = 20;
      } else if (lowerCharClass === "combatente") {
        max_life = 20 + stamina;
        max_effort = 2 + presence;
        max_sanity = 12;
      } else if (lowerCharClass === "especialista") {
        max_life = 16 + stamina;
        max_effort = 3 + presence;
        max_sanity = 16;
      } else {
        max_life = 8 + stamina;
        max_effort = 1 + presence;
        max_sanity = 8;

        nex = 0;
      }

      current_life = max_life;
      current_effort = max_effort;
      current_sanity = max_sanity;

      pe_round = nex / 5;
      if (pe_round <= 0) pe_round = 1;

      const [characterResult] = await pool.execute(
        "INSERT INTO characters (name, current_life, max_life, current_sanity, max_sanity, current_effort, max_effort, class, image_url, nex, weight, age, occupation, `path`, player, displacement, hidden_life, hidden_sanity, hidden_effort, origin, user_id, pe_round) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          current_life,
          max_life,
          current_sanity,
          max_sanity,
          current_effort,
          max_effort,
          charClass,
          "",
          nex,
          weight,
          age,
          occupation,
          path,
          player,
          displacement,
          0,
          0,
          0,
          origin,
          userid,
          pe_round,
        ]
      );

      const newCharacterId = characterResult.insertId;

      if (image_url) {
        const imageUrlLink = await saveBase64ImageToDisk(
          image_url,
          newCharacterId
        );

        await pool.execute("UPDATE characters SET image_url = ? where id = ?", [
          imageUrlLink,
          newCharacterId,
        ]);
      }

      await pool.execute(
        "INSERT INTO attributes (id, agility, strength, intellect, stamina, presence) VALUES (?, ?, ?, ?, ?, ?)",
        [newCharacterId, agility, strength, intellect, stamina, presence]
      );

      const skillsName = [
        "artes",
        "atletismo",
        "atualidades",
        "ciências",
        "diplomacia",
        "enganação",
        "fortitude",
        "furtividade",
        "iniciativa",
        "intuição",
        "intimidação",
        "investigação",
        "luta",
        "medicina",
        "ocultismo",
        "percepção",
        "pilotagem",
        "pontaria",
        "prestidigitação",
        "profissão",
        "reflexos",
        "religião",
        "sobrevivência",
        "tática",
        "tecnologia",
        "vontade",
        "crime",
      ];

      const skillsData = skillsName.map((skill) => [
        newCharacterId,
        skill,
        0,
        0,
        0,
      ]);

      const query =
        "INSERT INTO skills (character_id, name, value, favorite, training) VALUES ?";
      await pool.query(query, [skillsData]);

      await pool.execute(
        "INSERT INTO inventory_infos (prestige_points, patent, item_limit_1, item_limit_2, item_limit_3, item_limit_4, credit_limit, max_load, max_spc_load, character_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [0, "", 2, null, null, null, "", 0, 0, newCharacterId]
      );

      await pool.execute(
        "INSERT INTO character_defense (defense_total, character_id) VALUES (?, ?)",
        [10 + agility, newCharacterId]
      );

      await pool.execute(
        "INSERT INTO character_about (`history`, personality, goals, character_id) VALUES (?, ?, ?, ?)",
        ["", "", "", newCharacterId]
      );

      const PROFICIENCY_VALUES_MAP = {
        ocultista: [1, 0, 0, 0, 0],
        combatente: [1, 1, 0, 1, 0],
        especialista: [1, 0, 0, 1, 0],
        mundano: [1, 0, 0, 0, 0],
      };

      const proficiencyValues =
        PROFICIENCY_VALUES_MAP[lowerCharClass.toLowerCase()] ||
        PROFICIENCY_VALUES_MAP.default;

      await pool.execute(
        "INSERT INTO proficiency (simple_weapon, tactical_weapon, heavy_weapon, light_armor, heavy_armor, character_id) VALUES (?, ?, ?, ?, ?, ?)",
        [...proficiencyValues, newCharacterId]
      );

      origin = origin.replace(/\s/g, "");
      origin = origin.replaceAll(".", " ");

      let abilities = abilitiesMap.find((obj) => obj[origin]);
      let skills = skillsMap.find((obj) => obj[origin]);

      if (abilities) {
        abilities = abilities[origin];

        const abilitiesData = {
          name: abilities[0],
          desc: abilities[1],
          id: newCharacterId,
          page: null,
        };

        await pool.execute(
          "INSERT INTO abilities (name, description, character_id, page, type) VALUES (?, ?, ?, ?, ?)",
          [
            abilitiesData.name,
            abilitiesData.desc,
            abilitiesData.id,
            abilitiesData.page,
            'default'
          ]
        );
      }

      if (skills) {
        skills = skills[origin];

        skills.map(async (skill) => {
          await pool.execute(
            "UPDATE skills SET training = ?, value = ?, favorite = ? WHERE name = ? AND character_id = ?",
            [5, 5, 1, skill.toLowerCase(), newCharacterId]
          );
        });
      }

      if (lowerCharClass === "ocultista") {
        ["Ocultismo", "Vontade"].forEach(async (skill) => {
          await pool.execute(
            "UPDATE skills SET training = ?, value = ?, favorite = ? WHERE name = ? AND character_id = ?",
            [5, 5, 1, skill.toLowerCase(), newCharacterId]
          );
        });
      }

      const dt = 10 + presence;

      await pool.execute("UPDATE characters SET dt = ? WHERE id = ?", [
        dt,
        newCharacterId,
      ]);

      let abilitiesNex = abilitiesNexMap.find((obj) => obj[charClass]);
      abilitiesNex = abilitiesNex[charClass];

      await pool.execute(
        "INSERT INTO abilities (name, description, character_id, page, type) VALUES (?, ?, ?, ?, ?)",
        [abilitiesNex[0], abilitiesNex[1], newCharacterId, null, 'class']
      );

      res.json({
        character: {
          id: newCharacterId,
          ...newCharacter,
        },
      });
    } catch (error) {
      console.error("Erro ao criar um novo personagem:", error);
      res.status(500).json("Erro ao criar um novo personagem");
    }
  }

  async deleteCharacter(req, res) {
    try {
      const characterId = req.params.id;

      const filesInMedia = fs.readdirSync(mediaPath);
      const filesToDelete = filesInMedia.filter((file) =>
        file.startsWith(`${characterId}-`)
      );

      filesToDelete.forEach((file) => {
        const filePath = path.join(mediaPath, file);
        fs.unlinkSync(filePath);
      });

      await pool.execute("DELETE FROM attributes WHERE id = ?", [characterId]);
      await pool.execute("DELETE FROM powers WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM abilities WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM skills WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM inventory_items WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM inventory_infos WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM defense WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM attacks WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute(
        "DELETE FROM character_defense WHERE character_id = ?",
        [characterId]
      );
      await pool.execute("DELETE FROM character_about WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM proficiency WHERE character_id = ?", [
        characterId,
      ]);
      await pool.execute("DELETE FROM characters WHERE id = ?", [characterId]);

      res.json({ message: "Personagem deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar o personagem:", error);
      res.status(500).json("Erro ao deletar o personagem");
    }
  }

  async editCharacterStatus(req, res) {
    try {
      const characterId = req.params.id;
      const updatedCharacter = req.body;

      await pool.execute(
        "UPDATE characters SET name = ?, current_life = ?, max_life = ?, current_sanity = ?, max_sanity = ?, current_effort = ?, max_effort = ?, pe_round = ? WHERE id = ?",
        [
          updatedCharacter.name,
          updatedCharacter.current_life,
          updatedCharacter.max_life,
          updatedCharacter.current_sanity,
          updatedCharacter.max_sanity,
          updatedCharacter.current_effort,
          updatedCharacter.max_effort,
          updatedCharacter.pe_round,
          characterId,
        ]
      );

      res.status(200).json({ message: "Personagem atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar personagem:", error);
      res.status(500).json("Erro ao atualizar personagem");
    }
  }

  async editCharacter(req, res) {
    const userid = req.user.userid;

    try {
      const characterId = req.params.id;
      const updatedCharacter = req.body;
      let imageUrlLink = updatedCharacter.image_url;

      if (!imageUrlLink) {
        const filesInMedia = fs.readdirSync(mediaPath);
        const filesToDelete = filesInMedia.filter((file) =>
          file.startsWith(`${characterId}-`)
        );

        filesToDelete.forEach((file) => {
          const filePath = path.join(mediaPath, file);
          fs.unlinkSync(filePath);
        });
      }

      if (imageUrlLink && imageUrlLink.startsWith("data:image")) {
        imageUrlLink = await saveBase64ImageToDisk(
          updatedCharacter.image_url,
          characterId
        );
      }

      const [attrResult] = await pool.execute(
        "SELECT * FROM attributes WHERE id = ?",
        [characterId]
      );

      await pool.execute(
        "DELETE FROM abilities WHERE character_id = ? AND type = ?",
        [characterId, 'class']
      );

      let abilitiesNex = abilitiesNexMap.find((obj) => obj[updatedCharacter.charClass]);
      abilitiesNex = abilitiesNex[updatedCharacter.charClass];

      await pool.execute(
        "INSERT INTO abilities (name, description, character_id, page, type) VALUES (?, ?, ?, ?, ?)",
        [abilitiesNex[0], abilitiesNex[1], characterId, null, 'class']
      );

      if (updatedCharacter.charClass === "Mundano") {
        updatedCharacter.nex = 0;

        updatedCharacter.max_life = (8 + attrResult[0].stamina);
        updatedCharacter.max_effort = (1 + attrResult[0].presence);
        updatedCharacter.max_sanity = 8;
      } else {
        const levels = (updatedCharacter.nex / 5) - 1;

        switch (updatedCharacter.charClass) {
          case "Ocultista":
            updatedCharacter.max_life = (12 + attrResult[0].stamina) + ((2 + attrResult[0].stamina) * levels);
            updatedCharacter.max_effort = (4 + attrResult[0].presence) + ((4 + attrResult[0].presence) * levels);
            updatedCharacter.max_sanity = 20 + 5 * levels;
            break;
          case "Especialista":
            updatedCharacter.max_life = (16 + attrResult[0].stamina) + ((3 + attrResult[0].stamina) * levels);
            updatedCharacter.max_effort = (3 + attrResult[0].presence) + ((3 + attrResult[0].presence) * levels);
            updatedCharacter.max_sanity = 16 + 4 * levels;
            break;
          case "Combatente":
            updatedCharacter.max_life = (20 + attrResult[0].stamina) + ((4 + + attrResult[0].stamina) * levels);
            updatedCharacter.max_effort = (2 + attrResult[0].presence) + ((2 + attrResult[0].presence) * levels);
            updatedCharacter.max_sanity = 12 + 3 * levels;
            break;
        }
      }

      updatedCharacter.pe_round = updatedCharacter.nex / 5;

      updatedCharacter.current_life = updatedCharacter.max_life;
      updatedCharacter.current_effort = updatedCharacter.max_effort;
      updatedCharacter.current_sanity = updatedCharacter.max_sanity;

      await pool.execute(
        "UPDATE characters SET name = ?, current_life = ?, max_life = ?, current_sanity = ?, max_sanity = ?, current_effort = ?, max_effort = ?, class = ?, image_url = ?, nex = ?, weight = ?, age = ?, occupation = ?, `path` = ?, player = ?, displacement = ?, origin = ?, pe_round = ?, user_id = ? WHERE id = ?",
        [
          updatedCharacter.name,
          updatedCharacter.current_life,
          updatedCharacter.max_life,
          updatedCharacter.current_sanity,
          updatedCharacter.max_sanity,
          updatedCharacter.current_effort,
          updatedCharacter.max_effort,
          updatedCharacter.charClass,
          imageUrlLink,
          updatedCharacter.nex,
          updatedCharacter.weight,
          updatedCharacter.age,
          updatedCharacter.occupation,
          updatedCharacter.path,
          updatedCharacter.player,
          updatedCharacter.displacement,
          updatedCharacter.origin,
          updatedCharacter.pe_round,
          userid,
          characterId,
        ]
      );

      res.status(200).json({ message: "Personagem atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar personagem:", error);
      res.status(500).json("Erro ao atualizar personagem");
    }
  }

  async occultStatus(req, res) {
    try {
      const characterId = req.params.id;
      const updatedCharacter = req.body;

      await pool.execute(
        "UPDATE characters SET hidden_life = ?, hidden_sanity = ?, hidden_effort = ? WHERE id = ?",
        [
          updatedCharacter.hidden_life,
          updatedCharacter.hidden_sanity,
          updatedCharacter.hidden_effort,
          characterId,
        ]
      );

      res.status(200).json({ message: "Personagem atualizado com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar personagem:", error);
      res.status(500).json("Erro ao atualizar personagem");
    }
  }

  async getClasses(req, res) {
    try {
      const [classesResults] = await pool.execute("SELECT * FROM classes");

      if (classesResults.length === 0) {
        res.status(200).json("Nenhuma classe encontrada");
        return;
      }

      res.json(classesResults);
    } catch (error) {
      console.error("Erro ao obter classe:", error);
      res.status(500).json("Erro ao obter classes");
    }
  }

  async getTracks(req, res) {
    try {
      const classId = req.params.id;

      const [trackResult] = await pool.execute(
        "SELECT * FROM tracks WHERE class_id = ?",
        [classId]
      );

      if (trackResult.length === 0) {
        res.status(404).json("Trilha não encontrada");
        return;
      }

      res.json(trackResult);
    } catch (error) {
      console.error("Erro ao obter trilha:", error);
      res.status(500).json("Erro ao obter trilhas");
    }
  }

  async getOrigins(req, res) {
    try {
      const [originsResults] = await pool.execute("SELECT * FROM origins");

      if (originsResults.length === 0) {
        res.status(200).json("Nenhuma origem encontrada");
        return;
      }

      res.json(originsResults);
    } catch (error) {
      console.error("Erro ao obter origem:", error);
      res.status(500).json("Erro ao obter origens");
    }
  }
}

async function saveBase64ImageToDisk(base64String, characterId) {
  try {
    const filesInMedia = fs.readdirSync(mediaPath);

    const filesToDelete = filesInMedia.filter((file) =>
      file.startsWith(`${characterId}-`)
    );

    const filename = `${characterId}-${Date.now()}`;

    filesToDelete.forEach((file) => {
      const filePath = path.join(mediaPath, file);
      fs.unlinkSync(filePath);
    });

    const image = base64String.replace(/^data:image\/\w+;base64,/, "");
    const bitmap = Buffer.from(image, "base64");
    const newFilePath = path.join(mediaPath, `${filename}.jpg`);

    fs.writeFileSync(newFilePath, bitmap);

    return `http://localhost:3000/media/${filename}.jpg`;
  } catch (error) {
    console.error("Erro ao salvar imagem no disco:", error);
    return null;
  }
}

export default new CharacterController();

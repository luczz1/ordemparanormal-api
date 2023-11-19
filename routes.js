import { Router } from "express";
import ValidateToken from "./middlewares/ValidateToken.js";


import InventoryController from "./server/Controllers/InventoryController.js";
import CombatController from "./server/Controllers/CombatController.js";
import CharacterController from "./server/Controllers/CharacterController.js";
import AttributtesController from "./server/Controllers/AttributtesController.js";
import AbilitiesController from "./server/Controllers/AbilitiesController.js";
import AboutController from "./server/Controllers/AboutController.js";
import ProficiencyController from "./server/Controllers/ProficiencyController.js";
import loginController from './server/Controllers/LoginController.js'


const routes = Router();

//inventario
routes.get("/characters/inventory_infos/:characterId", ValidateToken, InventoryController.getInventoryInfo);
routes.put("/characters/inventory_infos/:characterId", ValidateToken, InventoryController.editInventoryInfos);
routes.get("/characters/inventory_items/:characterid", ValidateToken, InventoryController.getInventoryItems);
routes.get("/characters/inventory_items/total_weight/:characterid", ValidateToken, InventoryController.getInventoryTotalWeight);
routes.post("/characters/inventory_items/:characterid", ValidateToken, InventoryController.addInventoryItems);
routes.delete("/characters/inventory_items/:id", ValidateToken, InventoryController.deleteInventoryItems);

//combate
routes.get("/characters/attacks/:characterid", ValidateToken, CombatController.getAttacks);
routes.get("/characters/attack/:id", ValidateToken, CombatController.getAttackByID);
routes.post("/characters/attacks/:characterid", ValidateToken, CombatController.addAttacks);
routes.put("/characters/attack/:id", ValidateToken, CombatController.editAttack);
routes.delete("/characters/attacks/:id", ValidateToken, CombatController.deleteAttacks);
routes.get("/characters/defenses/:characterid", ValidateToken, CombatController.getDefenses);
routes.get("/characters/defenses/e/:id", ValidateToken, CombatController.getDefenseByID);
routes.post("/characters/defenses/:characterid", ValidateToken, CombatController.addDefenses);
routes.put("/characters/defenses/e/:id", ValidateToken, CombatController.editDefense);
routes.delete("/characters/defenses/:id", ValidateToken, CombatController.deleteDefenses);
routes.get("/characters/defense/:characterid", ValidateToken, CombatController.getTotalDefense);
routes.put("/characters/defense/:id/:defense_total", ValidateToken, CombatController.editTotalDefense);

//personagem
routes.get("/characters", ValidateToken, CharacterController.getCharacters);
routes.get("/characters/:id", ValidateToken, CharacterController.getCharacterByID);
routes.post("/characters/create", ValidateToken, CharacterController.addCharacter);
routes.delete("/characters/:id", ValidateToken, CharacterController.deleteCharacter);
routes.put("/characters/:id", ValidateToken, CharacterController.editCharacterStatus);
routes.put("/characters/edit/:id", ValidateToken, CharacterController.editCharacter);
routes.put("/characters/hidden-status/:id", ValidateToken, CharacterController.occultStatus);
routes.get("/classes", ValidateToken, CharacterController.getClasses);
routes.get("/tracks/:id", ValidateToken, CharacterController.getTracks);
routes.get("/origins", ValidateToken, CharacterController.getOrigins);

//atributos e pericias
routes.get("/characters/attributes/:id", ValidateToken, AttributtesController.getAttributes);
routes.get("/characters/skills/:id", ValidateToken, AttributtesController.getSkills);
routes.put("/characters/attributes/:id/:attribute/:value", ValidateToken, AttributtesController.editAttributes);
routes.put("/characters/skills/:id/:skillId/:newValue", ValidateToken, AttributtesController.editSkills);
routes.put("/characters/skills/t/:id/:skillId/:newValue", ValidateToken, AttributtesController.editSkillsTraining);
routes.put("/characters/skills/:skillId/:newValue", ValidateToken, AttributtesController.favoriteSkill);

//habilidades e rituais
routes.get("/characters/abilities/:id", ValidateToken, AbilitiesController.getAbilities);
routes.get("/characters/powers/:id", ValidateToken, AbilitiesController.getRituals);
routes.get("/characters/abilities/q/:id", ValidateToken, AbilitiesController.getAbilityByID);
routes.get("/characters/powers/q/:id", ValidateToken, AbilitiesController.getRitualByID);
routes.post("/characters/abilities/:id", ValidateToken, AbilitiesController.addAbilities);
routes.post("/characters/powers/:id", ValidateToken, AbilitiesController.addRituals);
routes.put("/abilities/:abilityId", ValidateToken, AbilitiesController.updateAbility);
routes.put("/rituals/:ritualId", ValidateToken, AbilitiesController.updateRitual);
routes.delete("/characters/abilities/:id/:itemId", ValidateToken, AbilitiesController.deleteAbilities);
routes.delete("/characters/powers/:id/:itemId", ValidateToken, AbilitiesController.deleteRituals);
routes.put("/characters/dt/:characterid/:dt", ValidateToken, AbilitiesController.updateRitualDT);

//sobre
routes.get("/characters/about/:characterId", ValidateToken, AboutController.getCharacterAbout);
routes.put("/characters/about/:characterId", ValidateToken, AboutController.editCharacterAbout);

//proficiências
routes.get("/characters/proficiency/:id", ValidateToken, ProficiencyController.getProficiencies);
routes.put("/characters/proficiency/:id", ValidateToken, ProficiencyController.editProficiences);

//login
routes.post("/login", loginController.sendLogin);
routes.post("/register", loginController.postUsers);
routes.get("/whoami", ValidateToken, loginController.whoami);


export default routes;

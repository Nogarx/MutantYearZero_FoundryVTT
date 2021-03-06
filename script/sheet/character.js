import { MutantYearZeroActorSheet } from "./actor.js";
import { RollDialog } from "../dialog/roll-dialog.js";

export class MutantYearZeroCharacterSheet extends MutantYearZeroActorSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mutant-year-zero", "sheet", "actor"],
      template: "systems/mutant-year-zero/model/character.html",
      width: 620,
      height: 740,
      resizable: false,
      scrollY: [
        ".armors .item-list .items",
        ".critical-injuries .item-list .items",
        ".gears.item-list .items",
        ".mutations .item-list .items",
        ".talents .item-list .items",
        ".weapons .item-list .items",
      ],
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "main",
        },
      ],
    });
  }

  getData() {
    const data = super.getData();
    this.computeSkills(data);
    this.computeItems(data);
    this.capValues(data);
    return data;
  }

  capValues(data) {
    // Cap attribute scores
    for (let attribute of Object.values(data.data.attribute)) {
      if (attribute.max > 5) { attribute.max = 5; }
      if (attribute.max < 2) { attribute.max = 2; }
      if (attribute.value > attribute.max) { attribute.value = attribute.max; }
      if (attribute.value < 0) { attribute.value = 0; }
    }

    //Cap Skill scores
    for (let skill of Object.values(data.data.skill)) {
      if (skill.value > skill.max) { skill.value = skill.max; }
      if (skill.value < skill.min) { skill.value = skill.min; }
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-create").click((ev) => {
      this.onItemCreate(ev);
    });
    html.find(".condition").click(async (ev) => {
      const conditionName = $(ev.currentTarget).data("condition");
      const conditionValue = this.actor.data.data.condition[conditionName].value;
      if (conditionName === "sleepless") {
        this.actor.update({"data.condition.sleepless.value": !conditionValue,});
      } else if (conditionName === "dehydrated") {
        this.actor.update({ "data.condition.dehydrated.value": !conditionValue });
      } else if (conditionName === "starving") {
        this.actor.update({ "data.condition.starving.value": !conditionValue });
      } else if (conditionName === "hypothermic") {
        this.actor.update({ "data.condition.hypothermic.value": !conditionValue });
      }
      this._render();
    });
    html.find(".roll-armor.specific").click((ev) => {
      const itemId = $(ev.currentTarget).data("itemId");
      const armor = this.actor.getOwnedItem(itemId);
      let testName = armor.data.name;
      let base;
      let skill;
      if (armor.data.data.part === 'shield') {
        base = {
          name: game.i18n.localize(game.i18n.localize(this.actor.data.data.attribute.strength.label)), 
          value: this.actor.data.data.attribute.strength.value
        };
        skill = {
          name: game.i18n.localize(game.i18n.localize(this.actor.data.data.skill.fight.label)), 
          value: this.actor.data.data.skill.fight.value
        };
      } else {
        base = 0;
        skill = 0;
      }
      RollDialog.prepareRollDialog(testName, base, skill, armor.data.data.bonus.value, 0, 0, this.diceRoller);
    });
    html.find(".roll-armor.total").click((ev) => {
      let armorTotal = 0;
      const items = this.actor.items;
      items.forEach((item) => {
        if (item.type === "armor" && item.data.data.part !== 'shield') {
          armorTotal += parseInt(item.data.data.bonus.value, 10);
        }
      });
      let testName = game.i18n.localize("HEADER.ARMOR").toUpperCase();
      RollDialog.prepareRollDialog(testName, 0, 0, armorTotal, 0, this.diceRoller);
    });
    html.find(".roll-consumable").click((ev) => {
      const consumableName = $(ev.currentTarget).data("consumable");
      const consumable = this.actor.data.data.consumable[consumableName];
      this.diceRoller.rollConsumable(consumable);
    });
  }

  computeSkills(data) {
    for (let skill of Object.values(data.data.skill)) {
      skill.hasStrength = skill.attribute === "strength";
      skill.hasAgility = skill.attribute === "agility";
      skill.hasWits = skill.attribute === "wits";
      skill.hasEmpathy = skill.attribute === "empathy";
      skill.isCommonSkill = skill.requiresClass === "none";
      skill.hasRequiredClass = skill.requiresClass === this.actor.data.data.bio.role.value;
    }
  }

  computeItems(data) {
    for (let item of Object.values(data.items)) {
      item.isTalent = item.type === "talent";
      item.isWeapon = item.type === "weapon";
      item.isArmor = item.type === "armor";
      item.isGear = item.type === "gear";
      item.isScrap = item.type === "scrap";
      item.isMutation = item.type === "mutation";
      item.isCriticalInjury = item.type === "criticalInjury";
      item.isArtifact = item.type === "artifact";
    }
  }

  onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data, { renderSheet: true });
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();

    if (this.actor.owner) {
      buttons = [
        {
          label: "Roll",
          class: "custom-roll",
          icon: "fas fa-dice",
          onclick: (ev) => RollDialog.prepareRollDialog("Roll", 0, 0, 0, 0, 0, this.diceRoller),
        },
        {
          label: "Push",
          class: "push-roll",
          icon: "fas fa-skull",
          onclick: (ev) => this.diceRoller.push(),
        },
      ].concat(buttons);
    }

    return buttons;
  }
}
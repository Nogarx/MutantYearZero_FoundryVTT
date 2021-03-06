export class MutantYearZeroActor extends Actor {
    createEmbeddedEntity(embeddedName, data, options) {
      // Replace randomized attributes like "[[d6]] days" with a roll
      let newData = duplicate(data);
      const inlineRoll = /\[\[(\/[a-zA-Z]+\s)?([^\]]+)\]\]/gi;
      if (newData.data) {
        for (let key of Object.keys(newData.data)) {
          if (typeof newData.data[key] === "string") {
            newData.data[key] = newData.data[key].replace(inlineRoll, (match, contents, formula) => new Roll(formula).roll().total);
          }
        }
      }
      super.createEmbeddedEntity(embeddedName, newData, options);
    }
  }
  
  export class MutantYearZeroItem extends Item {
    async sendToChat() {
      const itemData = duplicate(this.data);
      if (itemData.img.includes("/mystery-man")) {
        itemData.img = null;
      }
      itemData.isArmor = itemData.type === "armor";
      itemData.isBuilding = itemData.type === "building";
      itemData.isCriticalInjury = itemData.type === "criticalInjury";
      itemData.isGear = itemData.type === "gear";
      itemData.isHireling = itemData.type === "vip";
      itemData.isMonsterAttack = itemData.type === "monsterAttack";
      itemData.isMonsterTalent = itemData.type === "monsterTalent";
      itemData.isScrap = itemData.type === "scrap";
      itemData.isMutation = itemData.type === "mutation";
      itemData.isTalent = itemData.type === "talent";
      itemData.isWeapon = itemData.type === "weapon";
      itemData.isArtifact = itemData.type === "artifact";
      const html = await renderTemplate("systems/mutant-year-zero/chat/item.html", itemData);
      const chatData = {
        user: game.user._id,
        rollMode: game.settings.get("core", "rollMode"),
        content: html,
      };
      if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
        chatData.whisper = ChatMessage.getWhisperIDs("GM");
      } else if (chatData.rollMode === "selfroll") {
        chatData.whisper = [game.user];
      }
      ChatMessage.create(chatData);
    }
  }
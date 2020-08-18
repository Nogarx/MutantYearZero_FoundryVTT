function preloadHandlebarsTemplates() {
  const templatePaths = [
    "systems/mutant-year-zero/chat/item.html",
    "systems/mutant-year-zero/chat/roll.html",
    "systems/mutant-year-zero/chat/consumable.html",
    "systems/mutant-year-zero/model/character.html",
    "systems/mutant-year-zero/model/monster.html",
    "systems/mutant-year-zero/model/weapon.html",
    "systems/mutant-year-zero/model/armor.html",
    "systems/mutant-year-zero/model/monster-talent.html",
    "systems/mutant-year-zero/model/monster-attack.html",
    "systems/mutant-year-zero/model/gear.html",
    "systems/mutant-year-zero/model/raw-material.html",
    "systems/mutant-year-zero/model/talent.html",
    "systems/mutant-year-zero/model/mutation.html",
    "systems/mutant-year-zero/model/critical-injury.html",
    "systems/mutant-year-zero/model/tab/main.html",
    "systems/mutant-year-zero/model/tab/combat.html",
    "systems/mutant-year-zero/model/tab/combat-monster.html",
    "systems/mutant-year-zero/model/tab/talent.html",
    "systems/mutant-year-zero/model/tab/mutation.html",
    "systems/mutant-year-zero/model/tab/gear.html",
    "systems/mutant-year-zero/model/tab/gear-monster.html",
    "systems/mutant-year-zero/model/tab/bio.html",
    "systems/mutant-year-zero/model/tab/building-stronghold.html",
    "systems/mutant-year-zero/model/tab/hireling-stronghold.html",
    "systems/mutant-year-zero/model/tab/gear-stronghold.html",
    "systems/mutant-year-zero/model/tab/artifact.html",
  ];
  return loadTemplates(templatePaths);
}

function registerHandlebarsHelpers() {

  Handlebars.registerHelper("skulls", function (current, max, block) {
    var acc = "";
    for (var i = 0; i < max; ++i) {
      block.data.index = i;
      block.data.damaged = i >= current;
      acc += block.fn(this);
    }
    return acc;
  });

  Handlebars.registerHelper("armorPart", function (part) {
    part = normalize(part, "body");
    switch (part) {
      case "body":
        return game.i18n.localize("ARMOR.BODY");
      case "helmet":
        return game.i18n.localize("ARMOR.HELMET");
      case "shield":
        return game.i18n.localize("ARMOR.SHIELD");
    }
  });

  Handlebars.registerHelper("itemWeight", function (weight) {
    weight = normalize(weight, "regular");
    switch (weight) {
      case "tiny":
        return game.i18n.localize("WEIGHT.TINY");
      case "light":
        return game.i18n.localize("WEIGHT.LIGHT");
      case "regular":
        return game.i18n.localize("WEIGHT.REGULAR");
      case "heavy":
        return game.i18n.localize("WEIGHT.HEAVY");
    }
  });

  Handlebars.registerHelper("weaponCategory", function (category) {
    category = normalize(category, "melee");
    switch (category) {
      case "melee":
        return game.i18n.localize("WEAPON.MELEE");
      case "ranged":
        return game.i18n.localize("WEAPON.RANGED");
    }
  });

  Handlebars.registerHelper("weaponGrip", function (grip) {
    grip = normalize(grip, "1h");
    switch (grip) {
      case "1h":
        return game.i18n.localize("WEAPON.1H");
      case "2h":
        return game.i18n.localize("WEAPON.2H");
    }
  });

  Handlebars.registerHelper("weaponRange", function (range) {
    range = normalize(range, "arm");
    switch (range) {
      case "arm":
        return game.i18n.localize("RANGE.ARM");
      case "near":
        return game.i18n.localize("RANGE.NEAR");
      case "short":
        return game.i18n.localize("RANGE.SHORT");
      case "long":
        return game.i18n.localize("RANGE.LONG");
      case "distant":
        return game.i18n.localize("RANGE.DISTANT");
    }
  });

  Handlebars.registerHelper("isBroken", function (item) {
    if (parseInt(item.data.bonus.max, 10) > 0 && parseInt(item.data.bonus.value, 10) === 0) {
      return "broken";
    } else {
      return "";
    }
  });

  Handlebars.registerHelper('plaintextToHTML', function(value) {
    // strip tags, add <br/> tags
    return new Handlebars.SafeString(value.replace(/(<([^>]+)>)/gi, "").replace(/(?:\r\n|\r|\n)/g, '<br/>'));
  });
}

function normalize(data, defaultValue) {
  if (data) {
    return data.toLowerCase();
  } else {
    return defaultValue;
  }
}

export const initializeHandlebars = () => {
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
};

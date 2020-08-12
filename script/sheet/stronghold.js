import { MutantYearZeroActorSheet } from "./actor.js";

export class MutantYearZeroStrongholdSheet extends MutantYearZeroActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mutant-year-zero", "sheet", "actor"],
      template: "systems/mutant-year-zero/model/stronghold.html",
      width: 600,
      height: 700,
      resizable: false,
      scrollY: [".buildings.item-list .items", ".hirelings.item-list .items", ".gears.item-list .items"],
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "building",
        },
      ],
    });
  }

  getData() {
    const data = super.getData();
    this.computeItems(data);
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-create").click((ev) => {
      this.onItemCreate(ev);
    });
  }

  computeItems(data) {
    for (let item of Object.values(data.items)) {
      item.isWeapon = item.type === "weapon";
      item.isArmor = item.type === "armor";
      item.isGear = item.type === "gear";
      item.isRawMaterial = item.type === "rawMaterial";
      item.isBuilding = item.type === "building";
      item.isHireling = item.type === "hireling";
    }
  }

  onItemCreate(event) {
    event.preventDefault();
    let header = event.currentTarget;
    let data = duplicate(header.dataset);
    data["name"] = `New ${data.type.capitalize()}`;
    this.actor.createEmbeddedEntity("OwnedItem", data, { renderSheet: true });
  }
}

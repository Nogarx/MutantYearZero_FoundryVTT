export class MutantYearZeroMonsterTalentSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["mutant-year-zero", "sheet", "item"],
            template: "systems/mutant-year-zero/model/monster-talent.html",
            width: 400,
            height: 430,
            resizable: false
        });
    }

    getData() {
        const data = super.getData();
        return data;
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        buttons = [
            {
                label: "Post Item",
                class: "item-post",
                icon: "fas fa-comment",
                onclick: (ev) => this.item.sendToChat(),
            }
        ].concat(buttons);
        return buttons;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}

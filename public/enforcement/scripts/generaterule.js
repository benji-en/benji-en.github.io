// shortcuts for creating tags
const tags = [
    "div",
    "p",
    "ul",
    "ol",
    "li",
    "h1",
    "br"
];

let T = {};
tags.forEach(tagName => {
    T[tagName] = () => {
        return document.createElement(tagName);
    }
})

const container = document.querySelector(".rulescontainer");

function generateSpoilerSection(title, array, append_br) {
    const spoiler_section_container = T["div"]();
    spoiler_section_container.className = "spoiler-sec";

    const title_text = T["p"]();
    title_text.className = "spoiler-sec title"
    title_text.innerText = title;

    spoiler_section_container.append(title_text);

    const spoiler_items_list = T["ul"]();

    array.forEach((element, i) => {
        const spoiler_item_text = T["li"]();
        spoiler_item_text.innerHTML = element;
        spoiler_items_list.append(spoiler_item_text);
        if (append_br && array.length - 1 != i) spoiler_items_list.append(T["br"]());
    });
    spoiler_section_container.append(spoiler_items_list);
    return spoiler_section_container;
}

function addRule(rule, clr, insertDiv) {
    // container for whole rule
    const rule_container = T["div"]();
    rule_container.className = "rule";

    // rule "title"
    const rule_title = T["div"]();
    rule_title.classList = `rule-title color-${clr}`;
    rule_title.id = rule.acronym.toLowerCase();
    rule_title.setAttribute("onclick", "togglespoiler(this.parentNode)");

    const rule_text = T["p"]();
    rule_text.innerHTML = `${rule.acronym}. ${rule.rule}`;

    rule_title.append(rule_text);

    // definition, what it means, why it exists, etc
    const spoiler_container = T["div"]();
    spoiler_container.className = "spoiler hidden";

    if (rule.definitions) {
        spoiler_container.append(generateSpoilerSection("Definitions", rule.definitions));
    }

    if (rule.whatitmeans) {
        spoiler_container.append(generateSpoilerSection("What It Means", rule.whatitmeans));
    }

    if (rule.whyitexists) {
        spoiler_container.append(generateSpoilerSection("Why It Exists", rule.whyitexists));
    }

    if (rule.properenforcement) {
        spoiler_container.append(generateSpoilerSection("Proper Punishment/Enforcement", rule.properenforcement));
    }

    if (rule.examples) {
        spoiler_container.append(generateSpoilerSection("Examples", rule.examples, true));
    }

    rule_container.append(
        rule_title,
        spoiler_container
    );

    if (insertDiv) {
        insertDiv.append(rule_container);
        updaterules();
        return;
    }

    container.append(rule_container);
    updaterules();
    totalrulecount++;
}

const colors = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h"
];

document.addEventListener("DOMContentLoaded", (doc, ev) => {
    let totalrulecount = 0;
    rules.forEach((rulegroup, i) => {
        const rulegroupcontainer = T["div"]();
        rulegroupcontainer.className = "rulegroupcontainer";

        const title = T["h1"]();
        title.className = `color-${colors[i]}`;
        title.innerHTML = rulegroup.title;

        rulegroupcontainer.append(title);
        container.append(rulegroupcontainer);
        updaterulegroups();

        if (rulegroup.rules) {
            rulegroup.rules.forEach(rule => {
                totalrulecount++;
                addRule(rule, colors[i], rulegroupcontainer);
            })
        } else if (rulegroup.subsections) {
            rulegroup.subsections.forEach(subsection => {
                const subsectioncontainer = T["div"]();
                subsectioncontainer.className = `subsection`;

                const subsectionname = T["p"]();
                subsectionname.className = `color-${colors[i]} subsection-title`;
                subsectionname.innerHTML = subsection.name;
                subsectioncontainer.append(subsectionname);

                rulegroupcontainer.append(subsectioncontainer);
                updatesubsections();

                subsection.rules.forEach((rule) => {
                    totalrulecount++;
                    addRule(rule, colors[i], subsectioncontainer);
                })
            })
        }
    })
    console.log("total rule count: ", totalrulecount);
})

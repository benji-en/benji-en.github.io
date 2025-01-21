let rules_all = document.querySelectorAll(".rule");
let subsections_all = document.querySelectorAll(".subsection");
let rulegroups_all = document.querySelectorAll(".rulegroupcontainer");
const search = document.querySelector(".search");
const count = document.querySelector(".count");

function updaterules() {
    rules_all = document.querySelectorAll(".rule");
}

function updatesubsections() {
    subsections_all = document.querySelectorAll(".subsection");
}

function updaterulegroups() {
    rulegroups_all = document.querySelectorAll(".rulegroupcontainer");
}

function searchRules(string) {
    if (string.target) { // to check if this was called from the "input" event
        searchstring = string.target.value;
    } else {
        searchstring = string
    }
    if (searchstring === "") {
        count.textContent = "";

        rules_all.forEach(rule => {
            rule.style.display = "";
            hidespoiler(rule.querySelector(".spoiler"));
        });

        subsections_all.forEach(subsection => {
            subsection.style.display = "";
        });

        rulegroups_all.forEach(rulegroup => {
            rulegroup.style.display = "";
        });

        return;
    }
    const rules_array = Array.from(rules_all);

    const rulesThatDontMatch = rules_array.filter(rule =>
        !rule.textContent.toLowerCase().includes(searchstring.toLowerCase())
    );
    const rulesThatDoMatch = rules_array.filter(rule =>
        rule.textContent.toLowerCase().includes(searchstring.toLowerCase())
    )

    let tohide = [];
    let toshow = [];
    let ruleCount = 0;

    rulesThatDoMatch.forEach(rule => {
        if (rule.parentNode.className == "subsection") {
            toshow.push(rule.parentNode);
            toshow.push(rule.parentNode.parentNode);
        } else if (rule.parentNode.className = "rulegroupcontainer") {
            toshow.push(rule.parentNode);
        }

        ruleCount++;
        rule.style.display = "";
        showspoiler(rule.querySelector(".spoiler"));
    })

    rulesThatDontMatch.forEach(rule => {
        if (rule.parentNode.className == "subsection") {
            tohide.push(rule.parentNode);
            tohide.push(rule.parentNode.parentNode);
        } else if (rule.parentNode.className = "rulegroupcontainer") {
            tohide.push(rule.parentNode);
        }

        rule.style.display = "none";
        hidespoiler(rule.querySelector(".spoiler"));
    })

    tohide.forEach(element => {
        element.style.display = "none";
    })

    toshow.forEach(element => {
        element.style.display = "";
    })

    count.textContent = `Count: ${ruleCount}`;
}

search.addEventListener("input", (event) => {
    searchRules(event);
    if (!event.target.value == "") {
        window.history.replaceState({}, "", `?search=${event.target.value}`)
    } else {
        window.history.replaceState({}, "", "/")
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    console.log(params.toString())
    if (params.get("search")) {
        search.value = params.get("search")
        searchRules(params.get("search"));
    }
})

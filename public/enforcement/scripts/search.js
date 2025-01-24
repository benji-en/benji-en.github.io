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
        searchstring = string;
    }

    if (searchstring === "" || searchstring === "~") {
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
    let rulesThatDontMatch = [];
    let rulesThatDoMatch = [];

    if (searchstring.startsWith("~")) {
        let chars = searchstring.split("");
        let strings = [];
        let requiredStrings = [];
        let parser = {
            currentstring: "",
            currentStringIsRequired: false
        };

        function pushCurrentStringToArray() {
            if (parser.currentStringIsRequired) {
                requiredStrings.push(parser.currentstring);
                parser.currentstring = "";
                parser.currentStringIsRequired = false;
            } else {
                strings.push(parser.currentstring);
                parser.currentstring = "";
            }
        }

        let index = 0;
        for (const char of chars) {
            switch (char) {
                case ";": {
                    pushCurrentStringToArray();
                    break;
                }
                case "#": {
                    pushCurrentStringToArray();
                    parser.currentStringIsRequired = true;
                    break;
                }
                default: {
                    parser.currentstring += char;
                    break;
                }
            }

            if (index == chars.length - 1) {
                pushCurrentStringToArray();
                break;
            }

            index++;
        }


        strings = strings.map(string => string = string.replace("~", ""));
        strings = strings.map(string => string = string.trim());
        strings = strings.filter(string => string !== "");
        strings = strings.filter(string => string !== "~");
        strings = strings.filter(string => string.trim() !== "");

        console.log("REQUIRED STRINGS: ", requiredStrings);
        console.log("OPTIONAL STRINGS: ", strings);

        strings.forEach(string => {
            const temp_rulesThatDontMatch = rules_array.filter(rule =>
                !rule.textContent.toLowerCase().includes(string.toLowerCase())
            );
            const temp_rulesThatDoMatch = rules_array.filter(rule =>
                rule.textContent.toLowerCase().includes(string.toLowerCase())
            );

            rulesThatDontMatch = rulesThatDontMatch.concat(temp_rulesThatDontMatch);
            rulesThatDoMatch = rulesThatDoMatch.concat(temp_rulesThatDoMatch);
        });

        if (requiredStrings.length > 0) {
            if (rulesThatDoMatch.length == 0) {
                requiredStrings.forEach(string => {
                    rulesThatDontMatch = rules_array.filter(rule =>
                        !rule.textContent.toLowerCase().includes(string.toLowerCase())
                    );

                    rulesThatDoMatch = rules_array.filter(rule =>
                        rule.textContent.toLowerCase().includes(string.toLowerCase())
                    );
                })
            } else {
                requiredStrings.forEach(string => {
                    rulesThatDontMatch = rulesThatDontMatch.filter(rule =>
                        !rule.textContent.toLowerCase().includes(string.toLowerCase())
                    );

                    rulesThatDoMatch = rulesThatDoMatch.filter(rule =>
                        rule.textContent.toLowerCase().includes(string.toLowerCase())
                    );
                })
            }
        }

    } else {
        rulesThatDontMatch = rules_array.filter(rule =>
            !rule.textContent.toLowerCase().includes(searchstring.toLowerCase())
        );
        rulesThatDoMatch = rules_array.filter(rule =>
            rule.textContent.toLowerCase().includes(searchstring.toLowerCase())
        );
    }

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

    rulesThatDontMatch = rulesThatDontMatch.filter(rule => !rulesThatDoMatch.includes(rule));
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

    count.innerText = `Count: ${ruleCount}`;
}

search.addEventListener("input", (event) => {
    searchRules(event);
    if (!event.target.value == "") {
        window.history.replaceState({}, "", `/enforcement/?search=${event.target.value}`);
    } else {
        window.history.replaceState({}, "", "/enforcement/");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("search")) {
        search.value = params.get("search");
        searchRules(params.get("search"));
        return;
    }

    if (params.has("rule")) {
        setTimeout(() => {
            const scrollto = document.getElementById(params.get("rule").toLowerCase());
            if (scrollto) {
                togglespoiler(scrollto.parentNode);
            }
        }, 100);
    }
})

function togglespoiler(element) {
    if (!element) console.error("No element provided!");

    const spoiler_child = element.querySelector(".spoiler");

    if (spoiler_child.classList.contains("hidden")) {
        spoiler_child.classList.remove("hidden");
        element.scrollIntoView({block: "center", behavior: "smooth"});
    } else {
        spoiler_child.classList.add("hidden");
    }
}

function showspoiler(spoiler) {
    spoiler.classList.remove("hidden");
}

function hidespoiler(spoiler) {
    spoiler.classList.add("hidden");
}

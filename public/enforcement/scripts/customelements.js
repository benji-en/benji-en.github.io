class RuleLink extends HTMLAnchorElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute("href", "javascript:;")
        this.onclick = () => {
            togglespoiler(
                document.getElementById(
                    this.getAttribute("rule")
                        .toLowerCase()

                ).parentNode
            )
        }
    }
}
customElements.define("rule-link", RuleLink, {extends: "a"})

class ExternalLink extends HTMLAnchorElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute("target", "_blank")
        this.setAttribute("rel", "noopener noreferrer")
    }
}
customElements.define("ext-link", ExternalLink, {extends: "a"})

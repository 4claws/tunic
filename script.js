
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".content-section");

    // 1. ELABORAZIONE DEL TESTO MARKDOWN
    const markdownContainers = document.querySelectorAll("[data-markdown]");
    
    markdownContainers.forEach(container => {
        // Estrae il testo grezzo rimuovendo gli spazi vuoti iniziali e finali superflui
        const rawContent = container.textContent.trim();
        
        // Converte la stringa Markdown in elementi HTML validi (h1, strong, ul...)
        const cleanHtml = marked.parse(rawContent);
        
        // Inserisce il risultato convertito all'interno della sezione
        container.innerHTML = cleanHtml;
    });

    // 2. FUNZIONE DI NAVIGAZIONE TRA LE SEZIONI
    function changeTab(targetHash) {
        // Se l'indirizzo è vuoto, rimanda alla dashboard principale
        const activeId = targetHash || "#dashboard";

        // Mostra la sezione corretta e nasconde le altre
        sections.forEach(section => {
            if ("#" + section.id === activeId) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });

        // Aggiorna lo stato visivo dei pulsanti nel menu laterale
        navLinks.forEach(link => {
            if (link.getAttribute("href") === activeId) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // 3. ASCOLTO DEI CLICK SUL MENU
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Evita il salto di pagina brusco nativo di HTML
            
            const target = link.getAttribute("href");
            window.location.hash = target; // Modifica l'indirizzo URL del browser
            changeTab(target);
        });
    });

    // 4. SINCRONIZZAZIONE DELLA CRONOLOGIA DEL BROWSER
    // Controlla l'indirizzo all'avvio del sito
    changeTab(window.location.hash);

    // Gestisce l'evento in caso l'utente prema le frecce avanti/indietro nel browser
    window.addEventListener("hashchange", () => {
        changeTab(window.location.hash);
    });
});

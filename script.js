document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDiv = document.getElementById("markdown-content");

    // Funzione per caricare e convertire il file Markdown
    async function loadMarkdownPage(fileName) {
        try {
            contentDiv.style.opacity = 0; // Effetto dissolvenza in uscita
            
            // Scarica il file .md indicando esplicitamente la cartella corrente
const response = await fetch("./" + fileName, { cache: "no-store" });

            if (!response.ok) throw new Error("File non trovato");
            
            const markdownText = await response.text();
            
            // Converte il Markdown in HTML e lo inserisce nella pagina
            contentDiv.innerHTML = marked.parse(markdownText);
            contentDiv.style.opacity = 1; // Effetto dissolvenza in entrata
        } catch (error) {
            contentDiv.innerHTML = `<h1>Errore</h1><p>Impossibile caricare la pagina: ${fileName}</p>`;
            contentDiv.style.opacity = 1;
        }
    }

    // Gestione dei clic sul menu
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Impedisce al browser di scaricare il file .md
            
            // Gestione della classe active nel menu
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Prende il nome del file (es. "linguaggi.md") e lo carica
            const targetFile = link.getAttribute("href");
            window.location.hash = targetFile; // Aggiorna l'URL del browser
            loadMarkdownPage(targetFile);
        });
    });

    // Controllo all'avvio (se c'è un hash nell'URL, es: ://miosito.com)
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
        loadMarkdownPage(initialHash);
        // Aggiorna il menu active all'avvio
        navLinks.forEach(l => {
            if(l.getAttribute("href") === initialHash) {
                l.classList.add("active");
            } else {
                l.classList.remove("active");
            }
        });
    } else {
        // Altrimenti carica la pagina iniziale di default
        loadMarkdownPage("introduzione.md");
    }
});

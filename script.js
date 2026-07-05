document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDiv = document.getElementById("markdown-content");

    // Funzione principale per scaricare e convertire il file .md
    async function loadMarkdownPage(fileName) {
        // Se il nome è vuoto, corrotto o contiene .html, carica la pagina iniziale di default
        if (!fileName || fileName === "" || fileName.includes("html")) {
            fileName = "introduzione.md";
        }

        try {
            // RISOLUZIONE DEL PATH: Generiamo l'URL assoluto corretto basato sulla cartella del tuo sito
            // Questo evita i blocchi di caricamento quando si naviga tra gli hash (#)
            const siteLocation = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            const absoluteUrl = window.location.origin + siteLocation + fileName;
            
            // Scarichiamo il file di testo puro inviando la richiesta a GitHub
            const response = await fetch(absoluteUrl, { cache: "no-store" });
            
            if (!response.ok) {
                throw new Error("File non trovato");
            }
            
            const markdownText = await response.text();
            
            // Trasformiamo il testo Markdown in codice HTML leggibile dal browser
            contentDiv.innerHTML = window.marked.parse(markdownText);
            
        } catch (error) {
            contentDiv.innerHTML = `<h1>Errore di Caricamento</h1>
                                    <p>Impossibile trovare o leggere il file: <strong>${fileName}</strong></p>
                                    <p>Verifica che nel tuo repository GitHub esista un file con questo nome scritto interamente in minuscolo.</p>`;
        }
    }

    // Gestione del click sulle voci del menu della barra laterale
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Blocca l'azione nativa del browser per i file scaricabili
            
            const targetFile = link.getAttribute("href");
            window.location.hash = targetFile; // Aggiorna la barra degli indirizzi inserendo l'hash (es: #linguaggi.md)
            
            // Cambia l'evidenziazione visiva del link attivo nel menu
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            loadMarkdownPage(targetFile);
        });
    });

    // Sincronizzazione della cronologia del browser e controllo dell'URL iniziale
    function checkCurrentRoute() {
        const currentHash = window.location.hash.replace("#", "");
        
        if (currentHash) {
            loadMarkdownPage(currentHash);
            // Illumina la voce corretta nel menu laterale se l'utente ricarica la pagina
            navLinks.forEach(link => {
                if (link.getAttribute("href") === currentHash) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        } else {
            // Se l'indirizzo è pulito (es: /tunic/), carica l'introduzione di base
            loadMarkdownPage("introduzione.md");
        }
    }

    // Avvia la verifica all'apertura del sito
    checkCurrentRoute();

    // Gestisce il cambio pagina se l'utente preme i pulsanti Avanti/Indietro del browser
    window.addEventListener("hashchange", checkCurrentRoute);
});

});


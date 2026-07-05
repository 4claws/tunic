document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDiv = document.getElementById("markdown-content");

    // Funzione principale per scaricare e convertire il file .md
    async function loadMarkdownPage(fileName) {
        // Se il nome del file è vuoto o corrotto, imposta la pagina iniziale
        if (!fileName || fileName === "" || fileName.includes("html")) {
            fileName = "introduzione.md";
        }

        try {
            // Scarica il file di testo puro da GitHub
            const response = await fetch("./" + fileName);
            
            if (!response.ok) {
                throw new Error("File non trovato");
            }
            
            const markdownText = await response.text();
            
            // Converte il testo in HTML e lo stampa nella pagina
            contentDiv.innerHTML = window.marked.parse(markdownText);
            
        } catch (error) {
            contentDiv.innerHTML = `<h1>Errore di Caricamento</h1><p>Impossibile trovare il file: <strong>${fileName}</strong>. Verifica che sia scritto in minuscolo su GitHub.</p>`;
        }
    }

    // Gestione dei clic sulle voci del menu laterale
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Impedisce al browser di scaricare il file fisicamente
            
            const targetFile = link.getAttribute("href");
            window.location.hash = targetFile; // Cambia l'URL in alto (es: #linguaggi.md)
            
            // Aggiorna la classe attiva nel menu grafico
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            loadMarkdownPage(targetFile);
        });
    });

    // Controllo della pagina all'avvio del sito (Gestione ricarica o link diretti)
    function checkCurrentRoute() {
        const currentHash = window.location.hash.replace("#", "");
        
        if (currentHash) {
            loadMarkdownPage(currentHash);
            // Sincronizza il menu laterale accendendo il link corretto
            navLinks.forEach(link => {
                if (link.getAttribute("href") === currentHash) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        } else {
            // Se l'URL non ha hash, carica la pagina iniziale
            loadMarkdownPage("introduzione.md");
        }
    }

    // Esegue il controllo all'apertura del sito
    checkCurrentRoute();

    // Ascolta se l'utente usa le frecce "Avanti/Indietro" del browser
    window.addEventListener("hashchange", checkCurrentRoute);
});


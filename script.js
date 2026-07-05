document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDiv = document.getElementById("markdown-content");

    // Funzione universale per scaricare e convertire i file .md in tempo reale
    async function loadMarkdownPage(fileName) {
        // Se l'indirizzo è nullo o punta a pagine vecchie, pulisce e forza la home
        if (!fileName || fileName.trim() === "" || fileName.includes("html") || fileName === "introduzione") {
            fileName = "introduzione.md";
        }
        
        // Se per errore l'hash si porta dietro l'estensione pulita senza .md, la corregge
        if (!fileName.endsWith(".md")) {
            fileName += ".md";
        }

        try {
            contentDiv.innerHTML = "Caricamento in corso...";

            // Generazione dell'URL assoluto della cartella di GitHub Pages
            // Impedisce al browser di sbagliare cartella quando si naviga tramite hashtag
            const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            const cleanUrl = window.location.origin + basePath + fileName;
            
            // Richiesta asincrona HTTP con blocco della memoria cache vecchia
            const response = await fetch(cleanUrl, { cache: "no-store" });
            
            if (!response.ok) {
                throw new Error("File non trovato");
            }
            
            const markdownText = await response.text();
            
            // Compilazione del testo Markdown in vero HTML all'interno del contenitore
            contentDiv.innerHTML = window.marked.parse(markdownText);
            
        } catch (error) {
            contentDiv.innerHTML = `<h1>Errore di Caricamento</h1>
                                    <p>Impossibile leggere il file: <strong>${fileName}</strong></p>
                                    <p>Verifica che nel tuo repository esista un file con questo nome scritto interamente in minuscolo.</p>`;
        }
    }

    // Intercettazione e gestione dei click sui link del menu laterale
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Disattiva il download automatico del file .md da parte di HTML
            
            const targetHash = link.getAttribute("href"); // Es: "#linguaggi.md"
            window.location.hash = targetHash; // Scrive l'indirizzo nella barra URL in alto
            
            // Aggiorna l'interfaccia grafica muovendo la selezione arancione
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Estrae il nome pulito del file escludendo il cancelletto iniziale
            const pureFileName = targetHash.replace("#", "");
            loadMarkdownPage(pureFileName);
        });
    });

    // Router per calcolare la pagina corretta in fase di avvio o ricarica della scheda
    function checkCurrentRoute() {
        const currentHash = window.location.hash.replace("#", "");
        
        if (currentHash) {
            loadMarkdownPage(currentHash);
            
            // Accende il pulsante corretto nel menu laterale in base all'URL inserito
            navLinks.forEach(link => {
                if (link.getAttribute("href").replace("#", "") === currentHash) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        } else {
            // Se l'utente atterra sulla home pulita (senza hashtag), carica l'introduzione
            loadMarkdownPage("introduzione.md");
        }
    }

    // Avvio del controllo all'apertura del sito
    checkCurrentRoute();

    // Sincronizza i testi se l'utente preme i pulsanti Avanti/Indietro del browser
    window.addEventListener("hashchange", checkCurrentRoute);
});

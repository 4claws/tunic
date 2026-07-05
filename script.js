
       document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDiv = document.getElementById("markdown-content");

    // Funzione principale per scaricare e convertire il file .md
    async function loadMarkdownPage(fileName) {
        // Se non c'è un nome file valido, carica l'introduzione di default
        if (!fileName || fileName.trim() === "" || fileName.includes("html")) {
            fileName = "introduzione.md";
        }

        try {
            // Usiamo un percorso pulito che funziona nativamente su GitHub Pages
            const response = await fetch(fileName, { cache: "no-store" });
            
            if (!response.ok) {
                throw new Error("File non trovato");
            }
            
            const markdownText = await response.text();
            
            // Converte il Markdown in HTML usando la libreria Marked
            contentDiv.innerHTML = window.marked.parse(markdownText);
            
        } catch (error) {
            contentDiv.innerHTML = `<h1>Errore di Caricamento</h1>
                                    <p>Impossibile leggere il file: <strong>${fileName}</strong></p>
                                    <p>Verifica che il file sia presente sul tuo repository.</p>`;
        }
    }

    // Gestione dei clic sui link del menu laterale
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Impedisce al browser di scaricare il file .md
            
            const targetFile = link.getAttribute("href");
            window.location.hash = targetFile; // Aggiorna l'URL inserendo l'hash (es: #linguaggi.md)
            
            // Aggiorna la classe attiva nel menu grafico
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            loadMarkdownPage(targetFile);
        });
    });

    // Funzione per controllare la pagina corrente in base all'hash nell'URL
    function checkCurrentRoute() {
        // Estrae il nome del file eliminando il simbolo '#' e i parametri extra dell'URL
        let currentHash = window.location.hash.replace("#", "");
        
        // Rimuove eventuali barre o spazi bianchi rimasti nell'hash
        currentHash = currentHash.split('?')[0].trim();

        if (currentHash) {
            loadMarkdownPage(currentHash);
            
            // Accende il pulsante corretto nel menu laterale
            navLinks.forEach(link => {
                if (link.getAttribute("href") === currentHash) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        } else {
            // Se l'URL non ha hashtag (es: arrivi sulla home), carica l'introduzione
            loadMarkdownPage("introduzione.md");
        }
    }

    // Controlla la rotta all'apertura del sito
    checkCurrentRoute();

    // Gestisce il cambio pagina se l'utente usa le frecce avanti/indietro del browser
    window.addEventListener("hashchange", checkCurrentRoute);
});

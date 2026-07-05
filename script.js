document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDiv = document.getElementById("markdown-content");

    // Funzione per scaricare il file .md dal server e convertirlo
    async function fetchAndRender(pageName) {
        // Se non c'è una pagina specificata, carichiamo l'introduzione di default
        const fileToFetch = (pageName && pageName !== "") ? `${pageName}.md` : "introduzione.md";
        
        try {
            contentDiv.innerHTML = "Caricamento in corso...";
            
            // Scarica il file .md reale presente nel tuo repository
            const response = await fetch(`./${fileToFetch}`, { cache: "no-store" });
            
            if (!response.ok) {
                throw new Error("File non trovato");
            }
            
            const rawMarkdown = await response.text();
            
            // Converte il testo Markdown in vero codice HTML e lo stampa a schermo
            contentDiv.innerHTML = window.marked.parse(rawMarkdown);
            
        } catch (error) {
            contentDiv.innerHTML = `<h1>Errore di Caricamento</h1>
                                    <p>Impossibile trovare il file di testo: <strong>${fileToFetch}</strong></p>
                                    <p>Verifica che il file sia presente su GitHub e che il nome sia scritto in minuscolo.</p>`;
        }
    }

    // Gestione dei click sul menu laterale
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Blocca l'azione di download nativa del browser
            
            const targetHash = link.getAttribute("href"); // Es: "#linguaggi"
            window.location.hash = targetHash; // Aggiorna l'URL del browser
            
            // Gestione grafica del pulsante attivo
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Rimuove l'hashtag per ottenere il nome puro del file (es: "linguaggi")
            const pageName = targetHash.replace("#", "");
            fetchAndRender(pageName);
        });
    });

    // Controllo della rotta all'apertura del sito o al cambio di cronologia
    function router() {
        const currentHash = window.location.hash.replace("#", "");
        
        // Sincronizza visivamente il menu laterale all'avvio
        navLinks.forEach(link => {
            const hrefClean = link.getAttribute("href").replace("#", "");
            if (hrefClean === currentHash || (currentHash === "" && hrefClean === "introduzione")) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });

        fetchAndRender(currentHash);
    }

    // Avvia il controllo all'apertura del sito
    router();

    // Ascolta se l'utente preme i pulsanti Avanti/Indietro del browser
    window.addEventListener("hashchange", router);
});

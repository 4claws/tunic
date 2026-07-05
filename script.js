document.addEventListener("DOMContentLoaded", () => {
    // Individua la sezione con l'attributo data-markdown nella pagina attuale
    const markdownContainers = document.querySelectorAll("[data-markdown]");
    
    markdownContainers.forEach(container => {
        // Legge il testo Markdown eliminando spazi iniziali o finali vuoti
        const rawContent = container.textContent.trim();
        
        // Lo converte in vero codice HTML sfruttando la libreria Marked
        const cleanHtml = marked.parse(rawContent);
        
        // Sostituisce il testo nella pagina con il codice formattato
        container.innerHTML = cleanHtml;
    });
});

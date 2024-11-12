document.addEventListener('DOMContentLoaded', async () => {
    await fetchGlossario();
});

async function fetchGlossario() {
    try {
        const response = await fetch('/docs/glossario/glossario.txt');
        const text = await response.text();
        const lines = text.split('\n');
        let letteraCorrente = '';

        lines.forEach(line => {
            if (line.startsWith('= ')) {
                letteraCorrente = line.replace('= ', '').trim().toLowerCase();
            } else if (line.startsWith('== ')) {
                const termine = line.replace('== ', '').trim();
                const definizione = lines[lines.indexOf(line) + 1].trim(); // da capire quando si arriva alla fine della definizione
                const container = document.getElementById(letteraCorrente);
                if (container) {
                    container.innerHTML += `<dt id="${termine}">${termine}</dt><dd>${definizione}</dd>`;
                }
            }
        });
        hideEmptyLetters();
    } catch (error) {
        console.error('Errore nel caricamento del glossario:', error);
    }
}
function hideEmptyLetters(){
    // Hide empty letter containers
    document.querySelectorAll('.lettera').forEach(container => {
        const datalist = container.querySelector('dl');
        if (!datalist.querySelector('dt, dd')) {
            container.style.display = 'none';
        }
    });
}
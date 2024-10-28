
document.addEventListener('DOMContentLoaded', async () => {
    await fetchDocuments();
});

async function fetchDocuments() {
    const repoOwner = 'codehex16';
    const repoName = 'documentazione';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

    try {
        const cachedData = sessionStorage.getItem('pdfFiles');
        let pdfFiles = cachedData ? JSON.parse(cachedData) : [];
        if (!cachedData) {
            async function fetchFiles(folderUrl) {
                const folderResponse = await fetch(folderUrl);
                const folderData = await folderResponse.json();

                for (const item of folderData) {
                    if (item.type === 'file' && item.name.endsWith('.pdf')) {
                        pdfFiles.push(item);
                    } else if (item.type === 'dir') {
                        await fetchFiles(item.url);
                    }
                }
            }

            await fetchFiles(url);
            sessionStorage.setItem('pdfFiles', JSON.stringify(pdfFiles));
        }

        pdfFiles.forEach(pdf => {
            let ulElement;
            if (pdf.path.includes("verbali/interni")) {
                ulElement = document.querySelector("#interni .link-file");
            } else if (pdf.path.includes("verbali/esterni")) {
                ulElement = document.querySelector("#esterni .link-file");
            } else if (pdf.path.includes("candidatura")) {
                ulElement = document.querySelector("#candidatura .link-file");
            }

            if (ulElement) {
                let nameDate = parseName(pdf.name);
                ulElement.innerHTML += `<li><a href="${pdf.download_url}" target="_blank" class="file-link">${nameDate[0]}</a>${nameDate[1] ? `<span class="file-date">${nameDate[1]}</span>` : ''}</li>`;
            }
        });
    } catch {
        console.error('Unable to fetch documents');
    }
}

function parseName(name) {
    let fileName;
    if (name.includes("_")) {
        let docDate = name.split('_')[0];
        let docName = name.split('_')[1].replace('.pdf', '').replace("-", " ");
        fileName = [docName, docDate];
    } else {
        let docName = name.replace('.pdf', '').replaceAll("-", " ");
        fileName = [docName];
    }

    return fileName;
}

async function fetchDocuments() {

    console.log("FETCHING DOCUMENTS")
    const repoOwner = 'codehex16';
    const repoName = 'documentazione';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

    try {
        const pdfFiles = [];

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

        pdfFiles.forEach(pdf => {
            if (pdf.path.includes("verbali/interni")) {
                const ulElement = document.querySelector("#interni .link-file");
                let nameDate = parseName(pdf.name);
                ulElement.innerHTML += `<li><a href="${pdf.download_url}" target="_blank" class="file-link">${nameDate[0]}</a><span class="file-date">${nameDate[1]}</span></li>`;
            } else if (pdf.path.includes("verbali/esterni")) {
                const ulElement = document.querySelector("#esterni .link-file");
                let nameDate = parseName(pdf.name);
                ulElement.innerHTML += `<li><a href="${pdf.download_url}" target="_blank" class="file-link">${nameDate[0]}</a><span class="file-date">${nameDate[1]}</span></li>`;
            } else if (pdf.path.includes("candidatura")) {
                const ulElement = document.querySelector("#candidatura .link-file");
                let nameDate = parseName(pdf.name);
                ulElement.innerHTML += `<li><a href="${pdf.download_url}" target="_blank" class="file-link">${nameDate[0]}</a></li>`;
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
        let docName = name.replace('.pdf', '').replace("-", " ");
        fileName = [docName];
    }

    return fileName;
}
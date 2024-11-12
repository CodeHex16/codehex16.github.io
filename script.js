document.addEventListener('DOMContentLoaded', async () => {
    await fetchDocuments();
});

async function fetchDocuments() {
    const repoOwner = 'codehex16';
    const repoName = 'documentazione';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;
    const docsUrl = '/docs/'

    try {
        const cachedData = sessionStorage.getItem('pdfFiles');
        let pdfFiles = cachedData ? JSON.parse(cachedData) : [];
        if (!cachedData) {
            const promiseInterni = fetch(url + "verbali/interni");
            const promiseEsterni = fetch(url + "verbali/esterni");
            const promiseCandidatura = fetch(url + "1 - candidatura");

            const [interniResponse, esterniResponse, candidaturaResponse] = await Promise.all([promiseInterni, promiseEsterni, promiseCandidatura]);
            let data = await interniResponse.json();
            data = data.concat(await esterniResponse.json());
            data = data.concat(await candidaturaResponse.json());

            for (const item of data) {
                if (item.type === 'file' && item.name.endsWith('.pdf')) {
                    pdfFiles.push(item);
                }
            }

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
            }else if (pdf.path.includes("RTB")) {
                ulElement = document.querySelector("#rtb .link-file");
            }

            if (ulElement) {
                let nameDate = parseName(pdf.name);
                ulElement.innerHTML += `<li><a href="${docsUrl+pdf.path}" target="_blank" class="file-link">${nameDate[0]}</a>${nameDate[1] ? `<span class="file-date">${nameDate[1]}</span>` : ''}</li>`;
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
        let docName = name.split('_')[1].replace('.pdf', '').replaceAll("-", " ");
        fileName = [docName, docDate];
    } else {
        let docName = name.replace('.pdf', '').replaceAll("-", " ");
        fileName = [docName];
    }

    return fileName;
}
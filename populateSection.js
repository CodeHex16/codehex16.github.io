document.addEventListener("DOMContentLoaded", async () => {
	await addAllDocuments();

	const headers = document.querySelectorAll('.accordion-header');

	headers.forEach((header, index) => {
		if (index === 0) {
			header.classList.add("active");
			header.nextElementSibling.style.display = "block";
		} else {
			header.classList.remove("active");
			header.nextElementSibling.style.display = "none";
		}
	});

	headers.forEach(header => {
		header.addEventListener('click', () => {
			const content = header.nextElementSibling;
			const isVisible = content.style.display === 'block';
			content.style.display = isVisible ? 'none' : 'block';
			header.classList.toggle("active", !isVisible);
		});
	});
});


async function addAllDocuments() {
	const structure = await fetch("/docs/structure.json");
	const data = await structure.json();
	let pageElements = "";

	// Filtra e ordina le sezioni in ordine decrescente
	const sezioni = data.children
		.filter(sezione => sezione.type === "directory" && sezione.name !== "glossario")
		.sort((a, b) => {
			// Estrae i numeri dei nomi delle sezioni (es. "2 - RTB" -> 2)
			const numA = parseInt(a.name.split(" - ")[0]) || 0;
			const numB = parseInt(b.name.split(" - ")[0]) || 0;
			// Ordina in modo decrescente
			return numB - numA;
		});

	sezioni.forEach((sezione) => {
		let newName = sezione.name;
		if (sezione.name.includes(" - ")) {
			let elements = populateBasicPDFList(sezione);
			let verbali = populateVerbali(sezione);

			newName = newName.split(" - ")[1];
			newName = newName.charAt(0).toUpperCase() + newName.slice(1);
			pageElements += `
			<h2 class="accordion-header">${newName}</h2>
			<div class="accordion-content">
				${elements}
				${verbali}
			</div>
			<hr/>`;
		} else {
			let elements = populateBasicPDFList(sezione);

			// caso DIARIO DI BORDO
			newName = newName.charAt(0).toUpperCase() + newName.slice(1);
			newName = newName.replace(/-/g, " ");

			pageElements += `
			<h2 class="accordion-header">${newName}</h2>
			<div class="accordion-content">
				<ul class="link-file">${elements}</ul>
			</div>`;
		}
	});

	const container = document.querySelector("#documenti-container");
	container.innerHTML = pageElements;

}

// TODO: This function has been temporarily modified to divide external and internal docs for RTB, it needs to get back to the original code and made more generic when the docs repo's structure will divide internal and external docs 
function populateBasicPDFList(section) {
	const docsUrl = "/docs";
	let elementsEsterni = "", elementsInterni = "";
	let pdfFiles = section.children;
	pdfFiles.sort((a, b) => parseInt(b.name.split(" ")[0]) - parseInt(a.name.split(" ")[0]));

	pdfFiles.forEach((pdf) => {
		let path = findFilePath(section, pdf.name);
		if (pdf.type === "file" && pdf.name.endsWith(".pdf")) {
			if (!pdf.name.includes("Norme-di-Progetto"))
				elementsEsterni += `<li><a href="${docsUrl + path}" target="_blank" class="file-link">${(parseName(pdf.name))}</a></li>`;
			else
				elementsInterni += `<li><a href="${docsUrl + path}" target="_blank" class="file-link">${(parseName(pdf.name))}</a></li>`;
		}
	});

	let result = `<div class="verbali">`;
	if (elementsInterni !== ``)
		result += `<div><h4>Interni</h4><ul class="link-file">${elementsInterni}</ul></div>`;
	if (elementsEsterni !== ``)
		result += `<div><h4>Esterni</h4><ul class="link-file">${elementsEsterni}</ul></div>`;
	result += `</div>`;
	return result;
}

function populateVerbali(section) {
	const docsUrl = "/docs";
	let verbali = section.children.find((child) => child.name === "verbali" && child.type === "directory");

	let elements = "";
	if (verbali) {
		let sortVerbali = verbali.children.sort((a, b) => b.name.localeCompare(a.name));
		sortVerbali.forEach((verbaliList) => {
			let verbaliElements = "";
			let tipoVerbale = verbaliList.children.sort((a, b) => b.name.localeCompare(a.name));
			tipoVerbale.forEach((pdf) => {
				let path = findFilePath(section, pdf.name);
				if (pdf.type === "file" && pdf.name.endsWith(".pdf")) {
					let nameDate = parseName(pdf.name);
					let path = findFilePath(section, pdf.name);
					verbaliElements += `<li><a href="${docsUrl + path}" target="_blank" class="file-link">${nameDate[0]}</a>${nameDate[1] ? `<span class="file-date">${nameDate[1]}</span>` : ""}</li>`;
				}
			});

			let title = verbaliList.name.charAt(0).toUpperCase() + verbaliList.name.slice(1);
			title = title.replace(/-/g, " ");
			elements += `<div><h4>${title}</h4><ul class="link-file">${verbaliElements}</ul></div>`;
		});
	}

	return `<h3>Verbali</h3><div class="verbali">${elements}</div>`;
}

function parseName(name) {
	let fileName;
	if (name.includes("_")) {
		let docDate = name.split("_")[0];
		let docName = name
			.split("_")[1]
			.replace(".pdf", "")
			.replaceAll("-", " ");
		fileName = [docName, docDate];
	} else {
		let docName = name.replace(".pdf", "").replaceAll("-", " ");
		fileName = [docName];
	}

	return fileName;
}


function findFilePath(node, target, currentPath = '') {
	// Se il nodo corrente è un file e il nome corrisponde, restituisci il percorso assoluto
	if (node.type === 'file' && node.name === target) {
		return currentPath + '/' + node.name;
	}
	// Se il nodo è una directory, aggiorniamo il percorso e iteriamo sui children
	if (node.type === 'directory' && Array.isArray(node.children)) {
		let newPath = currentPath;
		// Non aggiungiamo la root vuota (per evitare // all'inizio)
		if (node.name !== '') {
			newPath = currentPath + '/' + node.name;
		}
		for (let child of node.children) {
			let result = findFilePath(child, target, newPath);
			if (result) {
				return result;
			}
		}
	}
	return null;
}
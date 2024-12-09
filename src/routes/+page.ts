import type { PageLoad } from './$types';
import { type DocData } from '$lib/types';
import { onMount } from 'svelte';

export const load: PageLoad = ({ params, setHeaders, fetch }) => {
	const repoOwner = 'codehex16';
	const repoName = 'documentazione';
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

	function parseName(name: string) {
		let file = { fileName: '', fileDate: '' };
		if (name.includes('_')) {
			let docDate = name.split('_')[0];
			let docName = name.split('_')[1].replace('.pdf', '').replaceAll('-', ' ');
			file = { fileName: docName, fileDate: docDate };
		} else {
			let docName = name.replace('.pdf', '').replaceAll('-', ' ');
			file = { fileName: docName, fileDate: '' };
		}

		return file;
	}

	async function getJsonFolder(folder: string) {
		let sessionData;
		onMount(() => {
			sessionData = sessionStorage.getItem(folder);
		});
		if (sessionData) {
			const data = JSON.parse(sessionData);
			console.log('Parsed: ', data, 'SessionData: ', sessionData);
			return data;
		}

		const res = await fetch(url + folder);
		if (!res.ok) {
			console.error('Failed to fetch ' + folder);
		}
		const json = await res.json();

		let files = [];
		for (const file of json) {
			if (file.type === 'file' && file.name.endsWith('.pdf')) {
				files.push(file);
			}
		}

		let data: DocData[] = [];
		files.forEach((file) => {
			let fileData: DocData = {
				nome: '',
				path: '',
				data: ''
			};
			const parsed = parseName(file.name);
			fileData['path'] = file.path;
			fileData['nome'] = parsed.fileName;
			fileData['data'] = parsed.fileDate;
			data.push(fileData);
		});
		console.log('Data: ', data, 'Stringified: ', JSON.stringify(data));
		onMount(() => {
			sessionStorage.setItem(folder, JSON.stringify(data));
		});
		return data;
	}

	return {
		verbali_interni: getJsonFolder('verbali/interni'),
		verbali_esterni: getJsonFolder('verbali/esterni'),
		candidatura: getJsonFolder('1 - candidatura'),
		rtb: getJsonFolder('2 - RTB')
	};
};

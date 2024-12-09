export interface DocData {
	nome: string;
	data: string;
	path: string;
}

export interface PersonaGruppo {
	nome: string;
	github: string;
	mail: string;
	avatar: string;
}

export type PageData = {
    verbali_interni: DocData[];
    verbali_esterni: DocData[];
    candidatura: DocData[];
    rtb: DocData[];
};
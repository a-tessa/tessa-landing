export const BLOG_LIST_PAGE_SIZE = 8;

export const BLOG_CATEGORIES = [
	{ slug: "servicos", label: "Serviços" },
	{ slug: "projetos-e-planejamento", label: "Projetos e Planejamento" },
	{ slug: "materiais-e-solucoes", label: "Materiais e Soluções" },
	{ slug: "manutencao-e-durabilidade", label: "Manutenção e Durabilidade" },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

export interface BlogPost {
	slug: string;
	title: string;
	excerpt: string;
	description: string;
	body: string[];
	publishedAt: string;
	author: { name: string; initials: string };
	imageSrc: string;
	imageAlt: string;
	category: BlogCategorySlug;
}

export const blogPosts: BlogPost[] = [
	{
		slug: "estruturas-metalicas-planejamento-obra",
		title: "Estruturas metálicas: o que planejar antes da obra",
		excerpt:
			"Antes do primeiro perfil chegar ao canteiro, já deveria estar claro quem responde por cargas, interfaces com alvenaria e onde o guindaste vai parar. Aqui vai um roteiro para não descobrir o buraco no cronograma na véspera da montagem.",
		description:
			"Da compatibilização BIM ao estoque provisório: o que fechar com engenharia, compras e obra para que estrutura metálica não vire gargalo nem surpresa de custo.",
		body: [
			"Comece pelo óbvio que muita gente pula: memorial de cargas, vincos de apoio e quem assina a responsabilidade técnica em cada interface. Sem isso, o desenho bonito no papel vira discussão na laje.",
			"Marque no terreno (ou no modelo) onde entram caminhões, onde ficam kits antes da elevação e se há altura livre para montagem em série ou só trechos. Um acesso ruim custa o mesmo que um erro de projeto — só aparece mais tarde.",
			"Alinhe prazos de liberação de base, entrega de parafusos e chegada de chapas. Estrutura metálica costuma ser crítica no caminho crítico; trate logística como parte do projeto, não como ‘problema do fornecedor’.",
			"Por fim, defina critérios de aceite na recebimento: identificação de lotes, proteção contra chuva e registro fotográfico de avarias. Quinze minutos na doca economizam dias de cadência na montagem.",
		],
		publishedAt: "2025-11-18",
		author: { name: "Leonardo Siqueira", initials: "LS" },
		imageSrc: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
		imageAlt: "Estrutura metálica em ambiente industrial",
		category: "projetos-e-planejamento",
	},
	{
		slug: "energia-solar-industrial-retorno",
		title: "Energia solar industrial: como enxergar retorno com segurança",
		excerpt:
			"Número bonito na planilha não paga boleto se a curva de consumo não conversar com a geração. Separamos o que olhar além do kWp para não apostar no escuro.",
		description:
			"Da tarifa à disponibilidade de telhado: como montar um business case de solar corporativo que aguenta pergunta de diretoria e de engenharia ao mesmo tempo.",
		body: [
			"Puxe pelo menos doze meses de faturamento de energia e, se possível, dados horários. Pico de demanda fora do sol é o vilão clássico de payback inflado.",
			"Modele cenários: compra de energia, leasing, CAPEX próprio. Cada um muda risco, fluxo de caixa e quem opera a usina — não dá para comparar só pelo custo por MWh.",
			"Inclua O&M, substituição de inversores no horizonte do projeto e perdas por sombreamento ou sujeira. O mercado já viu usina ‘ótima no papel’ que perde eficiência no mundo real.",
			"Feche com um plano de medição: metas de geração, alarmes e revisão anual. Solar industrial é ativo operacional; sem indicador, vira decoração no telhado.",
		],
		publishedAt: "2025-10-02",
		author: { name: "Marina Alves", initials: "MA" },
		imageSrc: "/choose-scenary-section/estrutura-de-solo.webp",
		imageAlt: "Instalação industrial com cobertura metálica",
		category: "servicos",
	},
	{
		slug: "galpoes-logistica-expansao",
		title: "Galpões e logística: sinais de que é hora de expandir",
		excerpt:
			"Às vezes o problema não é falta de metro quadrado, é fluxo quebrado. Outras, o piso já grita. Saiba ler quando vale remanejar layout e quando só ampliação resolve.",
		description:
			"Filas na doca, estoque no corredor e empilhadeira disputando espaço com picking: sintomas que antecedem investimento em nova nave ou em estrutura com vão livre maior.",
		body: [
			"Conte quantos minutos um caminhão fica parado na descarga em dia normal. Se o gargalo virou rotina, você está pagando frete duas vezes — na nota e no tempo ocioso.",
			"Avalie altura útil e capacidade de piso. Multiplicar racks sem recalcular carga é receita para fiscalização, seguro e dor de cabeça juntos.",
			"Crescimento de SKU, e-commerce ou nova linha de produção mudam a geometria do armazém. O layout que funcionou em 2019 pode estar sabotando o throughput de hoje.",
			"Se a expansão for inevitável, pense modular: estrutura que permita anexar sem derrubar operação inteira vale ouro em CAPEX e em continuidade de negócio.",
		],
		publishedAt: "2025-09-14",
		author: { name: "Leonardo Siqueira", initials: "LS" },
		imageSrc: "/choose-scenary-section/estruturas-de-aviario.webp",
		imageAlt: "Estrutura metálica em linha de produção",
		category: "projetos-e-planejamento",
	},
	{
		slug: "manutencao-estruturas-corrosao",
		title: "Manutenção de estruturas: prevenindo corrosão e folgas",
		excerpt:
			"Ambiente úmido, efluente ou salitre não perdoa perfil sem inspeção. A boa notícia: a maior parte do que evita parada não exige laboratório — exige calendário.",
		description:
			"Como transformar caminhada de inspeção em rotina simples, com registro e priorização, para estruturas expostas a intempérie ou vapores agressivos.",
		body: [
			"Estabeleça frequência mínima: trimestral em zonas críticas, semestral no restante — ajuste conforme NR e histórico da planta. O importante é não depender de ‘quando alguém lembrar’.",
			"Na inspeção visual, foque conexões, soldas com trinca aparente, pintura estourada e poças permanentes ao pé dos pilares. São sinais baratos de ver e caros de ignorar.",
			"Trate drenagem como extensão da estrutura: calha entupida vira cascata sobre flange. Uma tarde de limpeza evita retrofit de proteção catódica.",
			"Documente com foto, data e responsável. Quando o seguro ou a auditoria perguntar, planilha sem evidência não conta história nenhuma.",
		],
		publishedAt: "2025-08-30",
		author: { name: "Ricardo Nunes", initials: "RN" },
		imageSrc: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
		imageAlt: "Detalhe de estrutura metálica galvanizada",
		category: "manutencao-e-durabilidade",
	},
	{
		slug: "projetos-sob-medida-engenharia",
		title: "Projetos sob medida: alinhando engenharia e fabricação",
		excerpt:
			"‘Sob medida’ não é sinônimo de ‘sem padrão’. Quanto mais customizado o conjunto, mais o desenho precisa conversar com o que a máquina corta de verdade.",
		description:
			"Da tolerância ao último parafuso: como evitar que o escritório aprove A, a fábrica entregue B e a montagem descubra no ar.",
		body: [
			"Um único pacote de emissão, versionado e congelado por liberação, reduz 80% das brigas entre projeto e chão de fábrica. Duas verdades paralelas geram retrabalho caro.",
			"Negocie tolerâncias com quem opera o centro de corte e a prensa. O desenho pode sonhar em décimo de milímetro; o processo pode não aguentar o custo disso.",
			"Para geometrias novas, considere mock-up ou primeiro lote piloto. O custo de um erro em série é exponencial em relação ao custo de validar cedo.",
			"Feche a montagem com manual mínimo: sequência, torque, ferramenta e PPE. Engenharia sob medida termina na mão de quem aperta o torquímetro.",
		],
		publishedAt: "2025-07-22",
		author: { name: "Marina Alves", initials: "MA" },
		imageSrc: "/choose-scenary-section/estrutura-de-solo.webp",
		imageAlt: "Perfis metálicos em estoque industrial",
		category: "projetos-e-planejamento",
	},
	{
		slug: "coberturas-industriais-materiais",
		title: "Coberturas industriais: escolha de materiais e desempenho",
		excerpt:
			"Sanduíche, zipada, telha metálica ou misto com claraboia — cada escolha mexe em acústica, vazamento e conforto térmico. O truque é saber o que não negociar.",
		description:
			"Ventilação versus vedação, carga de vento e vida útil: um guia direto para não escolher cobertura só pelo preço do m².",
		body: [
			"Comece pelas cargas normativas e pelas sobrecargas reais de uso: manutenção, linha de vida, equipamentos no telhado. Projeto econômico demais vira reforma em cinco anos.",
			"Pense em caminhos de água e pontos de infiltração típicos — cumeeira, lanternim, fixação de painéis. Detalhe mal desenhado não se conserta com silicone infinito.",
			"Iluminação natural reduz energia e melhora ergonomia, mas pede controle de glare e calor. Claraboia sem brise vira forno no meio do turno.",
			"Deixe margem para ampliação: estrutura que não admite mais módulo de cobertura hoje pode travar expansão que a diretoria quer para o ano que vem.",
		],
		publishedAt: "2025-06-05",
		author: { name: "Leonardo Siqueira", initials: "LS" },
		imageSrc: "/choose-scenary-section/estruturas-de-aviario.webp",
		imageAlt: "Cobertura metálica em galpão industrial",
		category: "materiais-e-solucoes",
	},
	{
		slug: "seguranca-trabalho-altura-montagem",
		title: "Segurança em montagem: trabalho em altura e sequência segura",
		excerpt:
			"Montagem de estrutura é coreografia: um guindaste a menos e vira improviso perigoso. Organizar sequência e zona de exclusão não é burocracia — é produtividade com vida preservada.",
		description:
			"Como alinhar NR-35, lay-out de canteiro e ritmo de montagem metálica sem transformar o canteiro em zona de guerra entre SST e prazo.",
		body: [
			"Desenhe a sequência de levantamento antes de chegar o primeiro caminhão: o que vai ao ar primeiro define onde fica acesso, onde não pode ter gente e onde precisa plataforma.",
			"Ancoragens de linha de vida e pontos de amarração precisam estar no projeto, não ‘resolvidos no dia’. Improviso em altura não escala.",
			"Combine janelas de trabalho com operações vizinhas — empilhadeira, linha de produção, trânsito de caminhões. Conflito de movimentação é causa recorrente de quase acidente.",
			"Registre briefing diário curto: clima, equipe, mudança de plano. Cinco minutos na base evita horas paradas na delegacia ou no hospital.",
		],
		publishedAt: "2025-05-19",
		author: { name: "Ricardo Nunes", initials: "RN" },
		imageSrc: "/choose-scenary-section/estruturas-metalicas-para-telhado.webp",
		imageAlt: "Montagem de estrutura metálica com equipamentos de segurança",
		category: "manutencao-e-durabilidade",
	},
	{
		slug: "integracao-fornecedor-industrial",
		title: "Integração com fornecedor: do pedido à entrega na planta",
		excerpt:
			"Pedido fechado não é obra encerrada. Quem recebe precisa saber o que assinar, o que recusar e onde guardar três toneladas até segunda sem brigar com o pátio.",
		description:
			"Da minuta contratual ao checklist de descarga: como compradores e engenheiros falarem a mesma língua quando o kit metálico bater no portão.",
		body: [
			"Defina antes critérios de aceite mensuráveis: dimensão, quantidade, tratamento superficial, documentação. ‘Parece ok’ não gera nota de devolução defendível.",
			"Alinhe janela de descarga com guindaste ou empilhadeira disponível. Caminhão parado na rua é multa emocional e, muitas vezes, financeira.",
			"Nomeie um interlocutor único técnico-comercial. Telefone em cadeia vira versão errada do desenho e entrega no endereço certo com peça errada.",
			"Arquive lote, certificado e não conformidade no mesmo lugar. Daqui a dois anos, quando precisar auditar, caixa de e-mail não vai te salvar.",
		],
		publishedAt: "2025-04-08",
		author: { name: "Marina Alves", initials: "MA" },
		imageSrc: "/choose-scenary-section/estrutura-de-solo.webp",
		imageAlt: "Caminhão em doca de centro de distribuição",
		category: "servicos",
	},
];

export function buildBlogListHref(parts: {
	q?: string;
	ordem?: "asc" | "desc";
	limite?: number;
	categoria?: string;
}): string {
	const params = new URLSearchParams();
	if (parts.categoria?.trim()) params.set("categoria", parts.categoria.trim());
	if (parts.q?.trim()) params.set("q", parts.q.trim());
	if (parts.ordem === "asc") params.set("ordem", "asc");
	if (parts.limite !== undefined && parts.limite > BLOG_LIST_PAGE_SIZE) {
		params.set("limite", String(parts.limite));
	}
	const s = params.toString();
	return s ? `/blog?${s}` : "/blog";
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}

export function normalizeForSearch(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{M}/gu, "");
}

export function filterPostsByCategory(
	posts: BlogPost[],
	categorySlug: string,
): BlogPost[] {
	if (!categorySlug) return posts;
	return posts.filter((p) => p.category === categorySlug);
}

export function filterPostsByTitleQuery(
	posts: BlogPost[],
	query: string,
): BlogPost[] {
	const trimmed = query.trim();
	if (!trimmed) return posts;
	const nq = normalizeForSearch(trimmed);
	return posts.filter((p) => normalizeForSearch(p.title).includes(nq));
}

export function sortPostsByDate(
	posts: BlogPost[],
	ordem: "asc" | "desc",
): BlogPost[] {
	const next = [...posts];
	next.sort((a, b) => {
		const ta = new Date(a.publishedAt).getTime();
		const tb = new Date(b.publishedAt).getTime();
		return ordem === "desc" ? tb - ta : ta - tb;
	});
	return next;
}

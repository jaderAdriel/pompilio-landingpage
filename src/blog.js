// Constantes de configuração
const LOADING_ITEMS_COUNT = 9;
const FALLBACK_IMAGE = "https://somosdon.com.br/wp-content/uploads/2023/05/como-organizar-meu-negocio-respondemos-a-sua-duvida-com-3-dicas-de-gestao-contabilidade-em-guanambi-scaled.webp";
const DEFAULT_API_URL = "https://somosdon.com.br/wp-json/wp/v2/posts?per_page=5&_embed=wp:featuredmedia,wp:term";

// Função principal para carregar posts
async function loadPosts(postsContainerSelector, apiUrl = DEFAULT_API_URL) {
    try {
        const postsContainer = document.querySelector(postsContainerSelector);
        if (!postsContainer) {
            console.error(`Container não encontrado: ${postsContainerSelector}`);
            return;
        }

        // Exibe os placeholders enquanto os posts são carregados
        displayLoadingPlaceholders(postsContainer, postsContainerSelector);

        const posts = await fetchPosts(apiUrl);
        const skeletons = postsContainer.querySelectorAll(".post-preview"); // Alteração crucial aqui

        console.log(`Carregando posts para: ${postsContainerSelector}`, posts);
        processPosts(posts, skeletons, postsContainerSelector);
        removeUnusedSkeletons(posts, skeletons);

    } catch (error) {
        console.error(`Erro ao buscar posts para ${postsContainerSelector}:`, error);
        showErrorMessage(postsContainerSelector, apiUrl);
    }
}

// Função para remover skeletons não utilizados
function removeUnusedSkeletons(posts, skeletons) {
    if (posts.length < skeletons.length) {
        Array.from(skeletons).slice(posts.length).forEach(skeleton => {
            skeleton.remove();
        });
    }
}

async function fetchPosts(apiUrl) {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
    return await response.json();
}

// Função para exibir os placeholders de carregamento (atualizada)
function displayLoadingPlaceholders(container, selector) {
    container.innerHTML = Array(LOADING_ITEMS_COUNT).fill(`
        <article class="post-preview loading rounded-lg overflow-hidden animate-pulse" data-container="${selector}">
            <header class="p-4">
                <div class="post-image-wrapper skeleton bg-gray-200 h-40 w-full rounded"></div>
                <div class="post-infos-wrapper">
                    <span class="post-category skeleton bg-gray-200 h-4 w-10 rounded"></span>
                    <span class="post-date skeleton bg-gray-200 h-4 w-10 rounded"></span>
                </div>
                <h3 class="post-titulo skeleton bg-gray-200 h-6 w-full mt-2 rounded"></h3>
            </header>
            <div class="p-4 pt-0">
                <p class="post-description skeleton bg-gray-200 h-4 w-full mt-2 rounded"></p>
                <p class="post-description skeleton bg-gray-200 h-4 w-3/4 mt-2 rounded"></p>
                <a class="post-link skeleton bg-gray-200 h-6 w-24 mt-3 "></a>
            </div>
        </article>
    `).join("");
}

// Função para processar os posts (atualizada)
function processPosts(posts, skeletons, containerSelector) {
    posts.slice(0, skeletons.length).forEach((post, index) => {
        const skeleton = skeletons[index];
        if (!skeleton) return;

        // Extrai os dados do post
        const media = post._embedded?.["wp:featuredmedia"]?.[0];
        const imageUrl = media?.source_url ||
            media?.media_details?.sizes?.full?.source_url ||
            media?.media_details?.sizes?.large?.source_url ||
            FALLBACK_IMAGE;

        const categories = post._embedded?.["wp:term"]?.[0] || [];
        const primaryCategory = categories.find(t => t.taxonomy === 'category') || {};

        const postDate = post.date ? new Date(post.date).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : null;

        // Atualiza o conteúdo
        skeleton.classList.remove("loading", "animate-pulse");
        skeleton.querySelectorAll(".skeleton").forEach(el => {
            el.classList.remove("bg-gray-200", "skeleton");
        });

        skeleton.innerHTML = `
            <div class="h-full flex flex-col">
                <div class="post-image-wrapper h-40 w-full overflow-hidden">
                    <img src="${imageUrl}" 
                         alt="${post.title?.rendered || ''}" 
                         loading="lazy"
                         onerror="this.src='${FALLBACK_IMAGE}'"
                         class="w-full h-full object-cover">
                </div>
                <div class="p-4 flex-grow">
                    <div class="post-infos-wrapper flex justify-between text-sm text-gray-500 mb-2">
                        <span class="post-category font-medium text-indigo-600">${primaryCategory.name || "Sem categoria"}</span>
                        <span class="post-date">${postDate || "Data não disponível"}</span>
                    </div>
                    <h3 class="post-titulo text-lg font-bold text-gray-800 mb-2 line-clamp-2">${post.title?.rendered || "Sem título"}</h3>
                    <p class="post-description text-gray-600 text-sm mb-4 line-clamp-3">
                        ${post.excerpt?.rendered?.replace(/<[^>]*>/g, "").substring(0, 120) + "..." || "Descrição não disponível"}
                    </p>
                </div>
                <div class="px-4 pb-4">
                    <a href="${post.link || "#"}" 
                       title="${post.title?.rendered || ""}"
                       class="post-link ">
                        Leia mais
                    </a>
                </div>
            </div>
        `;

        // Adiciona classes identificadoras
        skeleton.classList.add(`post-${post.id}`);
        if (primaryCategory.slug) {
            skeleton.querySelector('.post-category').classList.add(`category-${primaryCategory.slug}`);
        }
    });
}

// ... (mantenha as outras funções como estão)

// Inicialização corrigida
function initializePosts() {

    // URLs customizadas para cada container
    const containers = {
        "#mais-relevantes .section-content": DEFAULT_API_URL.replace("per_page=5", "per_page=3") + "&orderby=date&order=desc" ,
        "#todos-posts .section-content": DEFAULT_API_URL.replace("per_page=5", "per_page=12")+ "&orderby=date&order=asc"
    };

    Object.entries(containers).forEach(([selector, url]) => {
        loadPosts(selector, url);
    });
}

// Verifica se o DOM está pronto
if (document.readyState !== 'loading') {
    initializePosts();
} else {
    document.addEventListener('DOMContentLoaded', initializePosts);
}
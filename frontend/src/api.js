/* ==================== FUNÇÃO GENÉRICA DE CHAMADA À API ==================== */
export async function chamarAPI(endpoint, options = {}, token = null) {
    const authToken = token || localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
    };

    let response, data;

    try {
        response = await fetch(`http://localhost:8080/api/v1/${endpoint}`, {
            ...options,
            headers,
        });

        const text = await response.text();
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            data = { message: text };
        }
    } catch (error) {
        throw new Error("❌ Erro de conexão com o servidor.");
    }

    if (!response.ok) {
        console.error("⚠️ Erro do backend:", data);
        const errorMessage = data.error || data.message || "Erro na API";
        throw new Error(errorMessage);
    }

    return data;
}

/* ==================== ADMIN ==================== */
export async function admin(adminData) {
    return chamarAPI("admin/create", {
        method: "POST",
        body: JSON.stringify(adminData),
    });
}

/* ==================== PRODUTOS (ADMIN) ==================== */
export async function listar(token) {
    return chamarAPI("admin/produtos", { method: "GET" }, token);
}

export async function criarProduto(produtoData, token) {
    return chamarAPI("admin/produto/:id", {
        method: "POST",
        body: JSON.stringify(produtoData),
    }, token);
}

export async function listAllProducts(produtoData, token) {
    return chamarAPI("products/sale/list", {
        method: "POST",
        body: JSON.stringify(produtoData),
    }, token);
}

export async function atualizarProduto(produtoId, produtoData, token) {
    return chamarAPI(`admin/produtos/${produtoId}`, {
        method: "PUT",
        body: JSON.stringify(produtoData),
    }, token);
}

export async function inativarProduto(produtoId, token) {
    return chamarAPI(`admin/produtos/${produtoId}`, { method: "DELETE" }, token);
}

/* ==================== VENDAS ==================== */
export async function createSale(saleData, token) {
    return chamarAPI("products/sale" , {
        method: "POST",
        body: JSON.stringify(saleData),
    }, token);
}

/* ==================== ATIVAÇÃO (SELLER) ==================== */
export async function salvarCodigoAtivacao(cadastroId, codigo, token = null) {
    return chamarAPI("activation/save", {
        method: "POST",
        body: JSON.stringify({ cadastroId, code: codigo }),
    }, token);
}

export async function verificarCodigoAtivacao(cadastroId, codigo, token = null) {
    return chamarAPI("activation/verify", {
        method: "POST",
        body: JSON.stringify({ cadastroId, code: codigo }),
    }, token);
}

/* ==================== PRODUTOS PÚBLICOS ==================== */
export async function listarProdutosPublicos() {
    return chamarAPI("products/public", { method: "GET" });
}

export async function buscarProdutoPublicoPorId(id) {
    return chamarAPI(`products/public/${id}`, { method: "GET" });
}


/* ==================== CLASSE APIFETCH ==================== */
export class apiFetch {
    static admin = {
        create: admin,
        listarProdutos: listar,
        criarProduto: criarProduto,
        atualizarProduto: atualizarProduto,
        inativarProduto: inativarProduto,
    };

    static vendas = {
        create: createSale,
        listAll: listAllProducts,
    };

    static ativacao = {
        salvarCodigo: salvarCodigoAtivacao,
        verificarCodigo: verificarCodigoAtivacao,
    };

    static produtosPublicos = {
        listar: listarProdutosPublicos,
        buscarPorId: buscarProdutoPublicoPorId,
    };
}

import { chamarAPI } from "./api"; // função genérica de chamada à API

/* ==================== ADMIN ==================== */

// Criar admin
export async function admin(adminData) {
    return chamarAPI("admin/create", {
        method: "POST",
        body: JSON.stringify(adminData),
    });
}

// Listar produtos do admin
export async function listar(token) {
    return chamarAPI("admin/produtos", { method: "GET" }, token);
}

// Criar produto
export async function createProduct(produtoData, token) {
    return chamarAPI("admin/produtos/create", {
        method: "POST",
        body: JSON.stringify(produtoData),
    }, token);
}

// Atualizar produto
export async function UpdateProduct(produtoId, produtoData, token) {
    return chamarAPI(`admin/produtos/${produtoId}`, {
        method: "PUT",
        body: JSON.stringify(produtoData),
    }, token);
}

// Inativar / deletar produto
export async function inativarProduto(produtoId, token) {
    return chamarAPI(`admin/produtos/${produtoId}`, { method: "DELETE" }, token);
}

/* ==================== PRODUTOS PÚBLICOS ==================== */

// Listar todos os produtos públicos
export async function listarProdutosPublicos() {
    return chamarAPI("products/public", { method: "GET" });
}

// Buscar produto público por ID
export async function buscarProdutoPublicoPorId(id) {
    return chamarAPI(`products/public/${id}`, { method: "GET" });
}

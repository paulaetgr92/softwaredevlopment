// services/produtos.js
import {
    listarProdutos,
    criarProduto,
    buscarProdutoPorId,
    atualizarProduto,
    inativarProduto
} from "../api";

/**
 * Funções exportadas para uso no AdminDashboard
 */
export {
    listarProdutos,
    criarProduto,
    buscarProdutoPorId,
    atualizarProduto,
    inativarProduto
};

/**
 * Criar um novo produto
 */
export async function criarProduto(dadosProduto, adminToken) {
    return createProduct(dadosProduto, adminToken);
}

/**
 * Listar todos os produtos
 */
export async function listar(adminToken) {
    return listAllProducts(adminToken);
}

/**
 * Buscar produto por ID
 */
export async function buscarProdutoPorId(idProduto, adminToken) {
    return getProductDetails(idProduto, adminToken);
}

/**
 * Atualizar produto existente
 */
export async function atualizarProduto(idProduto, dadosProduto, adminToken) {
    return updateProduct(idProduto, dadosProduto, adminToken);
}

/**
 * Inativar / deletar produto
 */
export async function inativarProduto(idProduto, adminToken) {
    return deleteProduct(idProduto, adminToken);
}

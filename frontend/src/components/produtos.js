// services/produtos.js
import {
    listarProdutos as apiListarProdutos,
    criarProduto as apiCriarProduto,
    buscarProdutoPorId as apiBuscarProdutoPorId,
    atualizarProduto as apiAtualizarProduto,
    inativarProduto as apiInativarProduto
} from "../api";

/**
 * Listar todos os produtos
 */
export async function listarProdutos(adminToken) {
    return apiListarProdutos(adminToken);
}

/**
 * Criar um novo produto
 */
export async function criarProduto(dadosProduto, adminToken) {
    return apiCriarProduto(dadosProduto, adminToken);
}

/**
 * Buscar produto por ID
 */
export async function listProductByID(idProduto, adminToken) {
    return apiBuscarProdutoPorId(idProduto, adminToken);
}

/**
 * Atualizar produto existente
 */
export async function atualizarProduto(idProduto, dadosProduto, adminToken) {
    return apiAtualizarProduto(idProduto, dadosProduto, adminToken);
}

/**
 * Inativar / deletar produto
 */
export async function inativarProduto(idProduto, adminToken) {
    return apiInativarProduto(idProduto, adminToken);
}

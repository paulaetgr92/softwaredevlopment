/**
 * Função genérica para chamadas à API
 * Suporta autenticação via Bearer token armazenado no localStorage
 */
export async function apiFetch(endpoint, options = {}, authToken = null) {
    const token = authToken || localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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

/**
 * Admin — Criar novo administrador
 */
export async function admin(adminData) {
    return apiFetch("admin/create", {
        method: "POST",
        body: JSON.stringify(adminData),
    });
}

export async function listProductByID(adminData) {
    return apiFetch("admin/create", {
        method: "POST",
        body: JSON.stringify(adminData),
    });
}
/**
 * Admin — Criar venda
 */
export async function createSale(saleData, adminToken) {
    return apiFetch(
        "/products/sale",
        {
            method: "POST",
            body: JSON.stringify(saleData),
        },
        adminToken
    );
}

/**
 * Admin — Listar produtos
 */
export async function listAllProducts(adminToken) {
    return apiFetch(
        "admin/produtos",
        {
            method: "GET",
        },
        adminToken
    );
}


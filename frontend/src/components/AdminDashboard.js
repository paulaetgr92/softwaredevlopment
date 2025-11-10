// components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import {
    listarProdutos,
   criarProduto,
    listProductByID,
    atualizarProduto,
    inativarProduto,
    listar
} from "../components/produtos";
import "./AdminDashboard.css";

const AdminDashboard = ({ adminToken, onLogout }) => {
    const [activeTab, setActiveTab] = useState("listar");
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [produtoForm, setProdutoForm] = useState({
        categoria: "",
        tamanho: "",
        cores: "",
        tempoValor: "",
        status: "disponivel",
        localizacao: "",
        imagem_url: "",
    });

    const categorias = ["Vestido", "Camisa", "Calça", "Saia", "Blazer", "Casaco", "Acessório"];
    const tamanhos = ["PP", "P", "M", "G", "GG", "XG"];
    const cores = ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Amarelo", "Rosa", "Roxo", "Cinza", "Marrom"];
    const statusOptions = ["disponivel", "alugado", "manutencao"];

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await listarProdutos(adminToken);
            setProdutos(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err.message);
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProdutoChange = (e) => {
        const { name, value } = e.target;
        setProdutoForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitProduto = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await criarProduto({ ...produtoForm, tempoValor: parseInt(produtoForm.tempoValor) }, adminToken);
            setSuccess("✅ Produto cadastrado com sucesso!");
            setProdutoForm({ categoria: "", tamanho: "", cores: "", tempoValor: "", status: "disponivel", localizacao: "", imagem_url: "" });
            fetchProdutos();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = async (idProduto) => {
        setLoading(true);
        setError("");
        try {
            const produto = await listProductByID(idProduto, adminToken);
            setEditingProduct(produto);
            setProdutoForm(produto);
            setShowEditModal(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await atualizarProduto(editingProduct.id_roupa, { ...produtoForm, tempoValor: parseInt(produtoForm.tempoValor) }, adminToken);
            setSuccess("✅ Produto atualizado com sucesso!");
            setShowEditModal(false);
            setEditingProduct(null);
            fetchProdutos();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInactivateProduct = async (idProduto) => {
        if (!window.confirm("⚠️ Tem certeza que deseja inativar este produto?")) return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await inativarProduto(idProduto, adminToken);
            setSuccess("✅ Produto inativado com sucesso!");
            fetchProdutos();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        onLogout();
    };

    return (
        <div className="admin-dashboard">
            <header>
                <h1>🎯 Painel Administrativo</h1>
                <button onClick={handleLogout}>🚪 Sair</button>
            </header>
            <main>
                <button onClick={() => setActiveTab("cadastrar")}>➕ Cadastrar Produto</button>
                <button onClick={() => setActiveTab("listar")}>📦 Produtos Cadastrados</button>

                {error && <div className="alert-error">{error}</div>}
                {success && <div className="alert-success">{success}</div>}

                {activeTab === "cadastrar" && (
                    <form onSubmit={handleSubmitProduto}>
                        <select name="categoria" value={produtoForm.categoria} onChange={handleProdutoChange}>
                            <option value="">Selecione Categoria</option>
                            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select name="tamanho" value={produtoForm.tamanho} onChange={handleProdutoChange}>
                            <option value="">Selecione Tamanho</option>
                            {tamanhos.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select name="cores" value={produtoForm.cores} onChange={handleProdutoChange}>
                            <option value="">Selecione Cor</option>
                            {cores.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="number" name="tempoValor" value={produtoForm.tempoValor} onChange={handleProdutoChange} placeholder="Valor" />
                        <input type="text" name="localizacao" value={produtoForm.localizacao} onChange={handleProdutoChange} placeholder="Localização" />
                        <input type="text" name="imagem_url" value={produtoForm.imagem_url} onChange={handleProdutoChange} placeholder="URL da imagem" />
                        <button type="submit">Cadastrar</button>
                    </form>
                )}

                {activeTab === "listar" && (
                    <div>
                        {loading ? <p>Carregando...</p> :
                            produtos.map(prod => (
                                <div key={prod.id_roupa}>
                                    <p>{prod.categoria} - {prod.tamanho} - {prod.cores}</p>
                                    <button onClick={() => handleEditProduct(prod.id_roupa)}>Editar</button>
                                    <button onClick={() => handleInactivateProduct(prod.id_roupa)}>Inativar</button>
                                </div>
                            ))
                        }
                    </div>
                )}

                {showEditModal && editingProduct && (
                    <div className="modal">
                        <form onSubmit={handleUpdateProduct}>
                            <input name="categoria" value={produtoForm.categoria} onChange={handleProdutoChange} />
                            <input name="tamanho" value={produtoForm.tamanho} onChange={handleProdutoChange} />
                            <input name="cores" value={produtoForm.cores} onChange={handleProdutoChange} />
                            <input name="tempoValor" type="number" value={produtoForm.tempoValor} onChange={handleProdutoChange} />
                            <input name="localizacao" value={produtoForm.localizacao} onChange={handleProdutoChange} />
                            <input name="imagem_url" value={produtoForm.imagem_url} onChange={handleProdutoChange} />
                            <button type="submit">Salvar</button>
                            <button type="button" onClick={() => setShowEditModal(false)}>Cancelar</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

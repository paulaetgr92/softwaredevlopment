import React, { useState, useEffect } from "react";
import {
    listarProdutos,
    criarProduto,
    buscarProdutoPorId,
    atualizarProduto,
    inativarProduto,
} from "./produtos";
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
    const cores = ["Preto","Branco","Azul","Vermelho","Verde","Amarelo","Rosa","Roxo","Cinza","Marrom"];

    useEffect(() => {
        const fetchProdutosAsync = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await listarProdutos(adminToken);
                setProdutos(Array.isArray(response) ? response : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProdutosAsync();
    }, [adminToken]);

    const handleProdutoChange = (e) => {
        const { name, value } = e.target;
        setProdutoForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitProduto = async (e) => {
        e.preventDefault();
        setLoading(true); setError(""); setSuccess("");
        try {
            await criarProduto({ ...produtoForm, tempoValor: parseInt(produtoForm.tempoValor) }, adminToken);
            setSuccess("✅ Produto cadastrado com sucesso!");
            setProdutoForm({ categoria:"",tamanho:"",cores:"",tempoValor:"",status:"disponivel",localizacao:"",imagem_url:"" });
            const resp = await listarProdutos(adminToken);
            setProdutos(resp);
            setActiveTab("listar");
        } catch(err){ setError(err.message); }
        finally { setLoading(false); }
    };

    const handleEditProduct = async (id) => {
        setLoading(true); setError("");
        try {
            const produto = await buscarProdutoPorId(id, adminToken);
            setEditingProduct(produto);
            setProdutoForm(produto);
            setShowEditModal(true);
        } catch(err){ setError(err.message); }
        finally{ setLoading(false); }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault(); setLoading(true); setError(""); setSuccess("");
        try {
            await atualizarProduto(editingProduct.id_roupa, {...produtoForm,tempoValor:parseInt(produtoForm.tempoValor)}, adminToken);
            setSuccess("✅ Produto atualizado!");
            setShowEditModal(false); setEditingProduct(null);
            const resp = await listarProdutos(adminToken);
            setProdutos(resp);
        } catch(err){ setError(err.message); }
        finally{ setLoading(false); }
    };

    const handleInactivateProduct = async (id) => {
        if(!window.confirm("⚠️ Tem certeza?")) return;
        setLoading(true); setError(""); setSuccess("");
        try { await inativarProduto(id, adminToken); setSuccess("✅ Produto inativado!"); const resp = await listarProdutos(adminToken); setProdutos(resp);}
        catch(err){ setError(err.message); } finally{ setLoading(false); }
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>🎯 Painel Administrativo</h1>
                <button className="logout-btn" onClick={onLogout}>🚪 Sair</button>
            </header>

            <div className="admin-content">
                <aside className="admin-sidebar">
                    <ul className="admin-nav">
                        <li><button className={`nav-btn ${activeTab==="listar"?"active":""}`} onClick={()=>setActiveTab("listar")}>📦 Produtos</button></li>
                        <li><button className={`nav-btn ${activeTab==="cadastrar"?"active":""}`} onClick={()=>setActiveTab("cadastrar")}>➕ Cadastrar</button></li>
                    </ul>
                </aside>

                <main className="admin-main">
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {activeTab==="cadastrar" && (
                        <form onSubmit={handleSubmitProduto}>
                            <select name="categoria" value={produtoForm.categoria} onChange={handleProdutoChange}>
                                <option value="">Selecione Categoria</option>
                                {categorias.map(c=><option key={c} value={c}>{c}</option>)}
                            </select>
                            <select name="tamanho" value={produtoForm.tamanho} onChange={handleProdutoChange}>
                                <option value="">Selecione Tamanho</option>
                                {tamanhos.map(t=><option key={t} value={t}>{t}</option>)}
                            </select>
                            <select name="cores" value={produtoForm.cores} onChange={handleProdutoChange}>
                                <option value="">Selecione Cor</option>
                                {cores.map(c=><option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="number" name="tempoValor" placeholder="Valor" value={produtoForm.tempoValor} onChange={handleProdutoChange} />
                            <input type="text" name="localizacao" placeholder="Localização" value={produtoForm.localizacao} onChange={handleProdutoChange} />
                            <input type="text" name="imagem_url" placeholder="URL da imagem" value={produtoForm.imagem_url} onChange={handleProdutoChange} />
                            <button type="submit">Cadastrar</button>
                        </form>
                    )}

                    {activeTab==="listar" && (
                        <div className="products-grid">
                            {loading ? <p>Carregando...</p> :
                                produtos.map(prod => (
                                    <div key={prod.id_roupa} className="product-card">
                                        <div className="product-card-content">
                                            <div className="product-card-header">
                                                <h3>{prod.categoria}</h3>
                                                <span className={`status-badge ${prod.status}`}>{prod.status}</span>
                                            </div>
                                            <p>{prod.tamanho} - {prod.cores}</p>
                                            <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
                                                <button className="btn-action btn-edit" onClick={()=>handleEditProduct(prod.id_roupa)}>Editar</button>
                                                <button className="btn-action btn-inactivate" onClick={()=>handleInactivateProduct(prod.id_roupa)}>Inativar</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}

                    {showEditModal && editingProduct && (
                        <div className="modal">
                            <div className="modal-content">
                                <form onSubmit={handleUpdateProduct}>
                                    <input name="categoria" value={produtoForm.categoria} onChange={handleProdutoChange} />
                                    <input name="tamanho" value={produtoForm.tamanho} onChange={handleProdutoChange} />
                                    <input name="cores" value={produtoForm.cores} onChange={handleProdutoChange} />
                                    <input name="tempoValor" type="number" value={produtoForm.tempoValor} onChange={handleProdutoChange} />
                                    <input name="localizacao" value={produtoForm.localizacao} onChange={handleProdutoChange} />
                                    <input name="imagem_url" value={produtoForm.imagem_url} onChange={handleProdutoChange} />
                                    <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>
                                        <button type="submit">Salvar</button>
                                        <button type="button" onClick={()=>setShowEditModal(false)}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

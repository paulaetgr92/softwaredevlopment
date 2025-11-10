import React, { useState } from "react";
import { salvarCodigoAtivacao, verificarCodigoAtivacao } from "../api"; // ajuste o caminho conforme sua estrutura

export default function AtivarConta({ token }) {
    const [cadastroId, setCadastroId] = useState("");
    const [codigoAtivacao, setCodigoAtivacao] = useState("");
    const [messageSalvar, setMessageSalvar] = useState("");
    const [messageVerificar, setMessageVerificar] = useState("");
    const [loading, setLoading] = useState(false);

    // Handler para salvar código de ativação
    const handleSalvarCodigo = async (e) => {
        e.preventDefault();
        setMessageSalvar("");
        setLoading(true);
        try {
            const response = await salvarCodigoAtivacao(cadastroId, codigoAtivacao, token);
            setMessageSalvar("✅ Código salvo com sucesso!");
            console.log("Resposta da API (salvar):", response);
        } catch (err) {
            setMessageSalvar("❌ Erro ao salvar código: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handler para verificar código de ativação
    const handleVerificarCodigo = async (e) => {
        e.preventDefault();
        setMessageVerificar("");
        setLoading(true);
        try {
            const response = await verificarCodigoAtivacao(cadastroId, codigoAtivacao, token);
            setMessageVerificar("✅ Código verificado com sucesso!");
            console.log("Resposta da API (verificar):", response);
        } catch (err) {
            setMessageVerificar("❌ Código inválido ou erro na verificação");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h1>Ativar Conta</h1>

            <form onSubmit={handleSalvarCodigo} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="ID do cadastro"
                    value={cadastroId}
                    onChange={(e) => setCadastroId(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <input
                    type="text"
                    placeholder="Código de ativação"
                    value={codigoAtivacao}
                    onChange={(e) => setCodigoAtivacao(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
                    {loading ? "Processando..." : "Salvar Código"}
                </button>
                {messageSalvar && <p style={{ marginTop: "10px" }}>{messageSalvar}</p>}
            </form>

            <form onSubmit={handleVerificarCodigo}>
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
                    {loading ? "Processando..." : "Verificar Código"}
                </button>
                {messageVerificar && <p style={{ marginTop: "10px" }}>{messageVerificar}</p>}
            </form>
        </div>
    );
}

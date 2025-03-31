import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "./ilter.css";

export default function Filter({ onFilter, onClose, clientMode = false }) {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(""); // Adicionado
  const [cause, setCause] = useState(""); // Adicionado

  const handleFilter = () => {
    onFilter({ status, search, user, cause }); // Enviando todos os filtros
    onClose();
  };

  return (
    <div className="filter-modal">
      <div className="filter-container">
        <button className="close-filter" onClick={onClose}>
          <FiX size={23} color="#FFF" />
          Fechar
        </button>

        <h2>Filtrar Chamados</h2>

        <div className="filter-field">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="Em aberto">Em aberto</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Resolvido">Resolvido</option>
          </select>
        </div>

        {!clientMode && (
          <>
            <div className="filter-field">
              <label>Atribuição:</label>
              <select value={user} onChange={(e) => setUser(e.target.value)}>
                <option value="">Todos</option>
                <option value="Sem atribuição">Sem atribuição</option>
                <option value="Com atribuição">Com atribuição</option>
              </select>
            </div>

            <div className="filter-field">
              <label>Categoria:</label>
              <select value={cause} onChange={(e) => setCause(e.target.value)}>
                <option value="">Todas</option>
                <option value="Suporte">Suporte</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Instalação">Instalação</option>
              </select>
            </div>
          </>
        )}

        <div className="filter-field">
          <label>Pesquisa:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por assunto..."
          />
        </div>

        <button className="apply-filter" onClick={handleFilter}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './Filter.css';

export default function FilterModal({ onClose, onFilterApply }) {
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('');
  const [cause, setCause] = useState('');

  const handleApplyFilter = () => {
    // Filtra os dados de acordo com os critérios
    onFilterApply({ status, user, cause });
    onClose();
  };

  return (
    <div className="modal">
      <div className="container">
        <button className="btn-back" onClick={onClose}>
          <FiX size={25} color='#fff' />
          Voltar
        </button>

        <main>
          <h2>Filtrar Chamados</h2>

          {/* Filtro por Status */}
          <div className="filter-option">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Em aberto">Em aberto</option>
              <option value="Em progresso">Em progresso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          {/* Filtro por Atribuição (incluindo "Sem atribuição") */}
          <div className="filter-option">
            <label>Atribuído a</label>
            <select value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Sem atribuição">Sem atribuição</option>
              <option value="Atribuído">Com atribuição</option>
            </select>
          </div>

          {/* Filtro por Causa */}
          <div className="filter-option">
            <label>Causa</label>
            <input 
              type="text" 
              value={cause} 
              onChange={(e) => setCause(e.target.value)} 
              placeholder="Causa do chamado" 
            />
          </div>

          {/* Botão de Aplicar Filtro */}
          <button onClick={handleApplyFilter} className="btn-apply">Aplicar Filtro</button>
        </main>
      </div>
    </div>
  );
}

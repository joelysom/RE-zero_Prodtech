import { FiX, FiSearch } from 'react-icons/fi';
import './modal.css';

export default function ClientModal({ conteudo, buttomBack }) {
  return (
    <div className='modal'>
      <div className='container'>
        <button className='btn-back' onClick={buttomBack}>
          <FiX size={25} color='#fff' />
          Voltar
        </button>

        <main>
          <h2>Detalhes do Chamado:</h2>
          <div className='details'>
            <span>Cliente: <i>{conteudo.cliente}</i></span>
          </div>
          <div className='details'>
            <span>Assunto: <i>{conteudo.assunto}</i></span>
            <span>Cadastrado em: <i>{conteudo.createdFormat}</i></span>
          </div>
          <div className='details'>
            <span>Status: <i className='badge' style={{ color: '#fff', backgroundColor: conteudo.status === 'Em aberto' ? '#5cb85c' : '#999' }}>
              {conteudo.status}
            </i></span>
          </div>

          {conteudo.complemento && (
            <div className='details'>
              <span>Complemento</span>
              <p>{conteudo.complemento}</p>
            </div>
          )}

          <div className='details'>
            <span>Atribuído a: <i>{conteudo.assignedUser || 'Não atribuído'}</i></span>
          </div>
        </main>
      </div>
    </div>
  );
}
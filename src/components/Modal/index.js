import { FiX, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebaseConnection';
import './modal.css';

export default function Modal({ conteudo, buttomBack, onUpdateChamado }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    }

    fetchUsers();
  }, []);

  const handleAssignUser = async () => {
    if (!selectedUser) return;
    const chamadoRef = doc(db, 'chamados', conteudo.id);
    await updateDoc(chamadoRef, { assignedUser: selectedUser });
    onUpdateChamado({ ...conteudo, assignedUser: selectedUser }); // Atualiza o estado do Dashboard
    buttomBack(); // Fecha o modal
  };

  const handleAssignCurrentUser = async () => {
    if (!currentUser) return;
    const userName = currentUser.displayName || currentUser.email;
    const chamadoRef = doc(db, 'chamados', conteudo.id);
    await updateDoc(chamadoRef, { assignedUser: userName });
    onUpdateChamado({ ...conteudo, assignedUser: userName }); // Atualiza o estado do Dashboard
    setSelectedUser(userName); 
    buttomBack();
  };

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

          <div className='details assign-user'>
            <span>Atribuído a: <i>{conteudo.assignedUser || 'Nenhum usuário'}</i></span>

            <div className='assign-controls'>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Selecione um usuário</option>
                {users.map(user => (
                  <option key={user.id} value={user.nome}>{user.nome}</option>
                ))}
              </select>
              <button className='btn-assign' onClick={handleAssignUser}>Atribuir</button>

              <button className='btn-self-assign' onClick={handleAssignCurrentUser} title="Auto-atribuir">
                <FiUser size={20} color='#fff' />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


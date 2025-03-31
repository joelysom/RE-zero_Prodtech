import { useEffect, useState, useContext } from "react";
import ClientSidebar from "../../components/ClientHeader";
import Title from "../../components/Title";
import { FiMessageSquare, FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns/esm";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Filter from "../../components/Filter/Filter";
import { AuthContext } from "../../contexts/auth";

const listRef = collection(db, "chamados");

export default function ClientDashboard() {
  const { user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({});
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Função de alteração na barra de pesquisa
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, search: value }));
  };

  // Função chamada quando pressionar "Enter" na barra de pesquisa
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      loadChamadosWithSearch(filters.search);
    }
  };

  // Carrega chamados ao iniciar o componente
  useEffect(() => {
    async function loadChamados() {
      // Verifica se o usuário está autenticado
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      // Query para buscar apenas os chamados do cliente atual
      const q = query(
        listRef,
        where("clienteId", "==", user.uid),
        orderBy("created", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);
      setLoading(false);
    }

    loadChamados();
  }, [user]);

  // Função para carregar chamados com filtro de pesquisa
  async function loadChamadosWithSearch(searchTerm) {
    setLoading(true);
    
    // Query base filtrando por clienteId
    let q = query(
      listRef,
      where("clienteId", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    // Se tiver um termo de pesquisa, poderia implementar uma lógica para filtragem adicional
    // Esta implementação básica recarrega todos os chamados do cliente
    // Em uma implementação real, você precisaria usar algum tipo de índice composto ou campo de pesquisa

    const querySnapshot = await getDocs(q);
    setChamados([]);
    await updateState(querySnapshot);
    setLoading(false);
  }

  // Atualiza os chamados no estado
  const updateState = async (querySnapshot) => {
    const isCollectionEmpty = querySnapshot.size === 0;
    if (!isCollectionEmpty) {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          assunto: doc.data().assunto,
          status: doc.data().status,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          complemento: doc.data().complemento,
          assignedUser: doc.data().assignedUser || "Não atribuído",
        });
      });
      setChamados((chamado) => [...chamado, ...list]);

      const lastItem = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastItem);
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
    setLoadMore(false);
  };

  // Handle filter changes and apply them
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    const { status, search } = newFilters;

    // Query base filtrando por clienteId
    let q = query(
      listRef,
      where("clienteId", "==", user.uid),
      orderBy("created", "desc"),
      limit(5)
    );

    // Aplica filtro de status se presente
    if (status) {
      q = query(listRef, 
        where("clienteId", "==", user.uid),
        where("status", "==", status),
        orderBy("created", "desc"),
        limit(5)
      );
    }

    const querySnapshot = await getDocs(q);
    setChamados([]);
    await updateState(querySnapshot);
  };

  // Handle loading more chamados
  const handleMore = async () => {
    setLoadMore(true);

    // Query para carregar mais chamados, iniciando após o último documento
    const q = query(
      listRef,
      where("clienteId", "==", user.uid),
      orderBy("created", "desc"),
      startAfter(lastDoc),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  };

  // Toggle modal for details
  const toggleModal = (item) => {
    setShowModal(!showModal);
    setDetails(item);
  };

  // Toggle the filter modal visibility
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Versão simplificada do Modal para o cliente (sem botões de edição/exclusão)
  const ClientModal = ({ conteudo, buttomBack }) => {
    return (
      <div className="modal">
        <div className="container">
          <button className="btn-back" onClick={buttomBack}>
            <FiSearch size={25} color="#fff" />
            Voltar
          </button>

          <main>
            <h2>Detalhes do Chamado:</h2>
            <div className="details">
              <span>
                Cliente: <i>{conteudo.cliente}</i>
              </span>
            </div>
            <div className="details">
              <span>
                Assunto: <i>{conteudo.assunto}</i>
              </span>
              <span>
                Cadastrado em: <i>{conteudo.createdFormat}</i>
              </span>
            </div>
            <div className="details">
              <span>
                Status:{" "}
                <i
                  className="badge"
                  style={{
                    color: "#fff",
                    backgroundColor: conteudo.status === "Em aberto" ? "#5cb85c" : "#999",
                  }}
                >
                  {conteudo.status}
                </i>
              </span>
            </div>

            {conteudo.complemento && (
              <div className="details">
                <span>Complemento</span>
                <p>{conteudo.complemento}</p>
              </div>
            )}

            <div className="details">
              <span>
                Atribuído a: <i>{conteudo.assignedUser || "Não atribuído"}</i>
              </span>
            </div>
          </main>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <ClientSidebar />
        <div className="content">
          <Title name="Meus Chamados">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando Chamados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <ClientSidebar />
      <div className="content">
        <Title name="Meus Chamados">
          <FiMessageSquare size={25} />
        </Title>

        <div className="top-bar">
          <div className="search-filter">
            {/* Barra de pesquisa */}
            <input
              type="text"
              placeholder="Pesquisar por assunto"
              value={filters.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="search-input"
            />

            {/* Ícone de filtro */}
            <button onClick={toggleFilterModal} className="btn-filter">
              <FiFilter size={25} />
            </button>
          </div>
        </div>

        {showFilterModal && (
          <Filter 
            onFilter={handleFilterChange} 
            onClose={toggleFilterModal}
            clientMode={true} // Passa flag para o componente Filter saber que está no modo cliente
          />
        )}

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">Atribuído a</th>
                  <th scope="col">#</th>
                </tr>
              </thead>

              <tbody>
                {chamados.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Assunto">{item.assunto}</td>
                    <td data-label="Status">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: item.status === "Em aberto" ? "#5CB85C" : "#ccc",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Cadastrado">{item.createdFormat}</td>
                    <td data-label="Atribuído a">{item.assignedUser}</td>
                    <td data-label="#">
                      <button
                        onClick={() => toggleModal(item)}
                        className="action"
                        style={{ backgroundColor: "#3583f6" }}
                      >
                        <FiSearch size={17} color="#fff" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loadMore && <h3>Buscando mais chamados...</h3>}
            {!isEmpty && !loadMore && (
              <button onClick={handleMore} className="btn-more">
                Buscar mais
              </button>
            )}
          </>
        )}
      </div>

      {showModal && (
        <ClientModal
          conteudo={details}
          buttomBack={() => setShowModal(!showModal)}
        />
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiDelete, FiEdit2, FiMessageSquare, FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns/esm";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Filter from "../../components/Filter/Filter"; // Importando o filter component

const listRef = collection(db, "chamados");

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [lastDoc, setLastDoc] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({});
  const [filters, setFilters] = useState({ status: "", user: "", cause: "", search: "" });
  const [showFilterModal, setShowFilterModal] = useState(false); // Estado para controle do filtro

  // Função de alteração na barra de pesquisa
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, search: value }));
  };

  // Função chamada quando pressionar "Enter" na barra de pesquisa
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      // Chame a função para realizar a pesquisa com o valor de `filters.search`
      console.log("Pesquisa por: ", filters.search);
    }
  };

  // Carrega chamados ao iniciar o componente
  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy("created", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);
      setLoading(false);
    }
    loadChamados();
  }, []);

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
    } else {
      setIsEmpty(true);
    }
    setLoadMore(false);
  };

  // Handle filter changes and apply them
  const handleFilterChange = async (filters) => {
    setFilters(filters);
    const { status, user, cause } = filters;

    let q = query(
      listRef,
      orderBy("created", "desc"),
      limit(5)
    );

    // Apply filters if present
    if (status) {
      q = query(q, where("status", "==", status));
    }

    if (user === "Sem atribuição") {
      q = query(q, where("assignedUser", "==", "Não atribuído"));
    } else if (user === "Com atribuição") {
      q = query(q, where("assignedUser", "not-in", ["Não atribuído", null]));
    }

    if (cause) {
      q = query(q, where("assunto", "array-contains", cause));
    }

    const querySnapshot = await getDocs(q);
    setChamados([]);
    await updateState(querySnapshot);
  };

  // Handle loading more chamados
  const handleMore = async () => {
    setLoadMore(true);

    const q = query(listRef, orderBy("created", "desc"), startAfter(lastDoc), limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  };

  // Toggle modal for details
  const toggleModal = (item) => {
    setShowModal(!showModal);
    setDetails(item);
  };

  // Handle chamado deletion
  const handleDelete = async (id) => {
    const docRef = doc(db, "chamados", id);
    await deleteDoc(docRef)
      .then(() => {
        toast.success("Item deletado com sucesso");
        setChamados(chamados.filter((chamado) => chamado.id !== id));
      })
      .catch(() => toast.error("Ops, erro ao deletar"));
  };

  // Toggle the filter modal visibility
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Chamados">
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
    <div>
      <Header />
      <div className="content">
        <Title name="Chamados">
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
              onKeyDown={handleSearchKeyDown} // Adiciona o evento de tecla pressionada
              className="search-input"
            />

            {/* Ícone de filtro */}
            <button onClick={toggleFilterModal} className="btn-filter">
              <FiFilter size={25} />
            </button>
          </div>
        </div>

        {showFilterModal && (
          <Filter onFilter={handleFilterChange} onClose={toggleFilterModal} /> // Filter modal component
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
                  <th scope="col">Cliente</th>
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
                    <td data-label="Cliente">{item.cliente}</td>
                    <td data-label="Assunto">{item.assunto}</td>
                    <td data-label="Status">
                      <span className="badge" style={{ backgroundColor: item.status === "Em aberto" ? "#5CB85C" : "#ccc" }}>
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Cadastrado">{item.createdFormat}</td>
                    <td data-label="Atribuído a">{item.assignedUser}</td>
                    <td data-label="#">
                      <button onClick={() => toggleModal(item)} className="action" style={{ backgroundColor: "#3583f6" }}>
                        <FiSearch size={17} color="#fff" />
                      </button>
                      <button className="action" style={{ backgroundColor: "#f6a935" }}>
                        <Link to={`/new/${item.id}`}>
                          <FiEdit2 size={17} color="#fff" />
                        </Link>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="action" style={{ backgroundColor: "#FD441B" }}>
                        <FiDelete size={17} color="#fff" />
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

      {showModal && <Modal conteudo={details} buttomBack={() => setShowModal(!showModal)} />}
    </div>
  );
}

import { useEffect, useState } from "react";
import Header from "../../components/HeaderTecnico";
import Title from "../../components/Title";
import { FiDelete, FiMessageSquare, FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./dashboard.module.css";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns/esm";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import Filter from "../../components/Filter/Filter";

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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null); // Estado para armazenar a função para cancelar o listener

  // Função de alteração na barra de pesquisa
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, search: value }));
  };

  // Função chamada quando pressionar "Enter" na barra de pesquisa
  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      // Aplica os filtros de pesquisa
      applyFilters();
    }
  };

  // Aplica os filtros e configura o listener em tempo real
  const applyFilters = () => {
    // Cancela o listener anterior se existir
    if (unsubscribe) {
      unsubscribe();
    }

    // Constrói a consulta base
    let q = query(
      listRef,
      orderBy("created", "desc"),
      limit(5)
    );

    // Aplica filtros se presentes
    const { status, user, cause, search } = filters;

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

    // Configura o listener em tempo real
    const unsub = onSnapshot(q, (querySnapshot) => {
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
        
        setChamados(list);
        setIsEmpty(false);

        // Armazena o último documento para paginação
        const lastItem = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastItem);
      } else {
        setChamados([]);
        setIsEmpty(true);
      }
      
      setLoading(false);
    }, (error) => {
      console.error("Erro ao ouvir alterações:", error);
      toast.error("Erro ao atualizar dados em tempo real");
      setLoading(false);
    });

    // Armazena a função para cancelar o listener
    setUnsubscribe(() => unsub);
  };

  // Carrega chamados ao iniciar o componente ou quando os filtros mudam
  useEffect(() => {
    setLoading(true);
    applyFilters();

    // Limpa o listener quando o componente for desmontado
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Carrega apenas na inicialização

  // Handle filter changes and apply them
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    
    // Aplica os novos filtros e reconfigura o listener
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  // Handle loading more chamados
  const handleMore = async () => {
    setLoadMore(true);

    // Para carregar mais, precisamos fazer uma consulta padrão (não em tempo real)
    // pois o onSnapshot não suporta bem a paginação incremental
    let q = query(listRef, orderBy("created", "desc"), startAfter(lastDoc), limit(5));
    
    // Aplica os mesmos filtros que estão ativos
    const { status, user, cause } = filters;

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
    
    const isMoreEmpty = querySnapshot.size === 0;
    
    if (!isMoreEmpty) {
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
      
      setChamados((chamados) => [...chamados, ...list]);

      // Atualiza o último documento para paginação
      const lastItem = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastItem);
    } else {
      toast.info("Não há mais chamados para carregar");
      setIsEmpty(true);
    }
    
    setLoadMore(false);
  };

  // Toggle modal for details
  const toggleModal = (item) => {
    setShowModal(!showModal);
    setDetails(item);
  };

  // Handle chamado deletion
  const handleDelete = async (id) => {
    const docRef = doc(db, "chamados", id);
    try {
      await deleteDoc(docRef);
      toast.success("Item deletado com sucesso");
      // Não precisamos atualizar manualmente o estado, pois o listener fará isso automaticamente
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Ops, erro ao deletar");
    }
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

        <div className={styles.topBar}>
          <div className={styles.searchFilter}>
            {/* Barra de pesquisa */}
            <input
              type="text"
              placeholder="Pesquisar por assunto"
              value={filters.search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className={styles.searchInput}
            />

            {/* Ícone de filtro */}
            <button onClick={toggleFilterModal} className={styles.btnFilter}>
              <FiFilter size={25} />
            </button>
          </div>
        </div>

        {showFilterModal && (
          <Filter onFilter={handleFilterChange} onClose={toggleFilterModal} />
        )}

        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className={styles.new}>
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className={styles.new}>
              <FiPlus size={25} color="#fff" />
              Novo chamado
            </Link>

            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr className={styles.tableRow}>
                  <th className={styles.tableHeader} scope="col">Cliente</th>
                  <th className={styles.tableHeader} scope="col">Assunto</th>
                  <th className={styles.tableHeader} scope="col">Status</th>
                  <th className={styles.tableHeader} scope="col">Cadastrado em</th>
                  <th className={styles.tableHeader} scope="col">Atribuído a</th>
                  <th className={styles.tableHeader} scope="col">#</th>
                </tr>
              </thead>

              <tbody>
                {chamados.map((item, index) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className={styles.tableCell} data-label="Cliente">{item.cliente}</td>
                    <td className={styles.tableCell} data-label="Assunto">{item.assunto}</td>
                    <td className={styles.tableCell} data-label="Status">
                      <span className={styles.badge} style={{ backgroundColor: item.status === "Em aberto" ? "#5CB85C" : "#ccc" }}>
                        {item.status}
                      </span>
                    </td>
                    <td className={styles.tableCell} data-label="Cadastrado">{item.createdFormat}</td>
                    <td className={styles.tableCell} data-label="Atribuído a">{item.assignedUser}</td>
                    <td className={styles.tableCell} data-label="#">
                      <button onClick={() => toggleModal(item)} className={styles.action} style={{ backgroundColor: "#3583f6" }}>
                        <FiSearch size={17} color="#fff" className={styles.actionIcon} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className={styles.action} style={{ backgroundColor: "#FD441B" }}>
                        <FiDelete size={17} color="#fff" className={styles.actionIcon} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loadMore && <h3>Buscando mais chamados...</h3>}
            {!isEmpty && !loadMore && (
              <button onClick={handleMore} className={styles.btnMore}>
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
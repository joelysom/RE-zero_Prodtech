import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FiUser, FiPlus, FiSearch, FiFilter, FiDownload, FiRefreshCw } from "react-icons/fi";
import { FaBuilding, FaRegUser, FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import Header from "../../components/HeaderTecnico";
import Title from "../../components/Title";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import styles from "./CustomersList.module.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [lastDoc, setLastDoc] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [sortOrder, setSortOrder] = useState({ field: 'nome', direction: 'asc' });
  const [loadingMore, setLoadingMore] = useState(false);
  const [csvData, setCsvData] = useState([]);
  
  const itemsPerPage = 10;
  
  // Prepare CSV data for export
  useEffect(() => {
    if (customers.length > 0) {
      const data = customers.map(customer => ({
        Tipo: customer.tipo === 'autonomous' ? 'Autônomo' : 'Empresa',
        Nome: customer.nome,
        Email: customer.email,
        Documento: customer.cpf || customer.cpfOrCnpj || '-',
        Representante: customer.representanteNome || '-',
        Empresa: customer.empresaNome || '-',
        'Data de Cadastro': customer.criadoEm ? format(customer.criadoEm.toDate(), 'dd/MM/yyyy HH:mm') : '-'
      }));
      
      setCsvData(data);
    }
  }, [customers]);

  async function fetchCustomers(searchTerm = '', filter = 'all') {
    setLoading(true);
    
    try {
      let q;
      
      // Create base query
      if (filter === 'all') {
        q = query(
          collection(db, 'clientes'), 
          orderBy(sortOrder.field, sortOrder.direction),
          limit(itemsPerPage)
        );
      } else {
        // Filter by customer type
        const fieldPath = filter === 'autonomous' ? 'cpf' : 'empresaNome';
        q = query(
          collection(db, 'clientes'),
          where(fieldPath, '!=', null),
          orderBy(fieldPath),
          orderBy(sortOrder.field, sortOrder.direction),
          limit(itemsPerPage)
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setIsEmpty(true);
        setCustomers([]);
        setLoading(false);
        return;
      }
      
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      
      const customerList = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      }).filter(customer => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          (customer.nome && customer.nome.toLowerCase().includes(searchLower)) ||
          (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
          (customer.cpf && customer.cpf.includes(searchTerm)) ||
          (customer.cpfOrCnpj && customer.cpfOrCnpj.includes(searchTerm)) ||
          (customer.empresaNome && customer.empresaNome.toLowerCase().includes(searchLower))
        );
      });
      
      setCustomers(customerList);
      setIsEmpty(customerList.length === 0);
      
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setIsEmpty(true);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleLoadMore() {
    setLoadingMore(true);
    
    try {
      let q;
      if (typeFilter === 'all') {
        q = query(
          collection(db, 'clientes'),
          orderBy(sortOrder.field, sortOrder.direction),
          startAfter(lastDoc),
          limit(itemsPerPage)
        );
      } else {
        const fieldPath = typeFilter === 'autonomous' ? 'cpf' : 'empresaNome';
        q = query(
          collection(db, 'clientes'),
          where(fieldPath, '!=', null),
          orderBy(fieldPath),
          orderBy(sortOrder.field, sortOrder.direction),
          startAfter(lastDoc),
          limit(itemsPerPage)
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setLoadingMore(false);
        return;
      }
      
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      
      const newCustomers = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      }).filter(customer => {
        if (!search) return true;
        
        const searchLower = search.toLowerCase();
        return (
          (customer.nome && customer.nome.toLowerCase().includes(searchLower)) ||
          (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
          (customer.cpf && customer.cpf.includes(search)) ||
          (customer.cpfOrCnpj && customer.cpfOrCnpj.includes(search)) ||
          (customer.empresaNome && customer.empresaNome.toLowerCase().includes(searchLower))
        );
      });
      
      setCustomers([...customers, ...newCustomers]);
      
    } catch (error) {
      console.error("Erro ao carregar mais clientes:", error);
    } finally {
      setLoadingMore(false);
    }
  }
  
  function handleSort(field) {
    const newDirection = 
      field === sortOrder.field && sortOrder.direction === 'asc' ? 'desc' : 'asc';
    
    setSortOrder({
      field,
      direction: newDirection
    });
    
    // Refetch customers with new sort order
    fetchCustomers(search, typeFilter);
  }
  
  function handleSearch() {
    fetchCustomers(search, typeFilter);
  }
  
  function handleChangeFilter(event) {
    setTypeFilter(event.target.value);
    fetchCustomers(search, event.target.value);
  }
  
  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
  
  function formatDate(timestamp) {
    if (!timestamp || !timestamp.toDate) return '-';
    
    try {
      const date = timestamp.toDate();
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return '-';
    }
  }
  
  function getCustomerType(customer) {
    if (customer.cpf) return 'autonomous';
    if (customer.empresaNome) return 'company';
    
    // Fallback detection
    return customer.cpfOrCnpj && customer.cpfOrCnpj.length === 11 ? 'autonomous' : 'company';
  }
  
  function renderCustomerTypeIcon(type) {
    if (type === 'autonomous') {
      return <FaRegUser className={styles.tableCellSvg} size={16} color="#3583f6" />;
    }
    return <FaBuilding className={styles.tableCellSvg} size={16} color="#ff9800" />;
  }
  
  function getSortIcon(field) {
    if (sortOrder.field !== field) return null;
    
    if (sortOrder.direction === 'asc') {
      return <FaSortAmountDown size={14} className={styles.sortIcon} />;
    }
    return <FaSortAmountUpAlt size={14} className={styles.sortIcon} />;
  }
  
  useEffect(() => {
    fetchCustomers();
  }, [sortOrder]);
  
  return (
    <div>
      <Header />
      <div className="content">
        <Title name='Clientes'>
          <FiUser size={25} />
        </Title>
        
        <div className="container">
          <div className={styles.topBar}>
            <Link to="/customers" className={styles.new}>
              <FiPlus size={20} /> Novo Cliente
            </Link>
            
            <div className={styles.searchFilter}>
              <div className={styles.searchBox}>
                <input 
                  type="text"
                  placeholder="Buscar por nome, email ou documento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={styles.searchInput}
                />
                <button onClick={handleSearch} className={styles.btnSearch}>
                  <FiSearch size={18} />
                </button>
              </div>
              
              <select 
                value={typeFilter} 
                onChange={handleChangeFilter}
                className={styles.filterSelect}
              >
                <option value="all">Todos os tipos</option>
                <option value="autonomous">Apenas Autônomos</option>
                <option value="company">Apenas Empresas</option>
              </select>
              
              <button onClick={() => fetchCustomers()} className={styles.btnRefresh} title="Atualizar lista">
                <FiRefreshCw size={18} />
              </button>
              
              <CSVLink 
                data={csvData}
                filename={"clientes.csv"}
                className={styles.btnExport}
                target="_blank"
              >
                <FiDownload size={18} /> Exportar CSV
              </CSVLink>
            </div>
          </div>
          
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Carregando clientes...</p>
            </div>
          ) : isEmpty ? (
            <div className={styles.emptyContainer}>
              <h3>Nenhum cliente encontrado</h3>
              <p>Não existem clientes cadastrados ou que correspondam aos filtros aplicados.</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <caption className={styles.tableCaption}>
                    Lista de Clientes ({customers.length})
                  </caption>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeader} onClick={() => handleSort('tipo')}>
                        Tipo {getSortIcon('tipo')}
                      </th>
                      <th className={styles.tableHeader} onClick={() => handleSort('nome')}>
                        Nome {getSortIcon('nome')}
                      </th>
                      <th className={styles.tableHeader} onClick={() => handleSort('email')}>
                        Email {getSortIcon('email')}
                      </th>
                      <th className={styles.tableHeader}>
                        Documento
                      </th>
                      <th className={styles.tableHeader}>
                        Representante
                      </th>
                      <th className={styles.tableHeader} onClick={() => handleSort('empresaNome')}>
                        Empresa {getSortIcon('empresaNome')}
                      </th>
                      <th className={styles.tableHeader} onClick={() => handleSort('criadoEm')}>
                        Cadastrado em {getSortIcon('criadoEm')}
                      </th>
                      <th className={styles.tableHeader}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => {
                      const customerType = getCustomerType(customer);
                      return (
                        <tr key={customer.id} className={styles.tableRow}>
                          <td className={`${styles.tableCell} ${styles.typeBadge}`} data-label="Tipo">
                            <span className={`${styles.badge} ${styles[customerType]}`}>
                              {renderCustomerTypeIcon(customerType)}
                              {customerType === 'autonomous' ? 'Autônomo' : 'Empresa'}
                            </span>
                          </td>
                          <td className={styles.tableCell} data-label="Nome">
                            {customer.nome || '-'}
                          </td>
                          <td className={styles.tableCell} data-label="Email">
                            {customer.email || '-'}
                          </td>
                          <td className={styles.tableCell} data-label="Documento">
                            {customer.cpf || customer.cpfOrCnpj || '-'}
                          </td>
                          <td className={styles.tableCell} data-label="Representante">
                            {customer.representanteNome || '-'}
                          </td>
                          <td className={styles.tableCell} data-label="Empresa">
                            {customer.empresaNome || '-'}
                          </td>
                          <td className={styles.tableCell} data-label="Cadastrado em">
                            {formatDate(customer.criadoEm)}
                          </td>
                          <td className={styles.tableCell} data-label="Ações">
                            <Link to={`/customers/${customer.id}`} className={`${styles.action} ${styles.view}`}>
                              Detalhes
                            </Link>
                            <Link to={`/customers/${customer.id}/edit`} className={`${styles.action} ${styles.edit}`}>
                              Editar
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {!isEmpty && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    onClick={handleLoadMore}
                    className={styles.btnMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Carregando...' : 'Carregar Mais'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FiUser } from "react-icons/fi";
import Header from "../../components/HeaderTecnico";
import Title from "../../components/Title";
import styles from "./CostumersList.module.css";

export default function Customers() {
  const [clientes, setClientes] = useState([]);
  
  const fetchClientes = async () => {
    const querySnapshot = await getDocs(collection(db, 'clientes'));
    const clientesList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setClientes(clientesList);
  };
  
  useEffect(() => {
    fetchClientes();
  }, []);
  
  return (
    <div>
      <Header />
      <div className="content">
        <Title name='Clientes'>
          <FiUser size={25} />
        </Title>
        <div className="container">
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr className={styles.tableRow}>
                <th className={styles.tableHeader}>Tipo</th>
                <th className={styles.tableHeader}>Nome</th>
                <th className={styles.tableHeader}>Email</th>
                <th className={styles.tableHeader}>Documento</th>
                <th className={styles.tableHeader}>Representante</th>
                <th className={styles.tableHeader}>Empresa</th>
                <th className={styles.tableHeader}>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id} className={styles.tableRow}>
                  <td className={styles.tableCell} data-label="Tipo">
                    {cliente.tipo === 'autonomous' ? 'Autônomo' : 'Empresa'}
                  </td>
                  <td className={styles.tableCell} data-label="Nome">
                    {cliente.nome}
                  </td>
                  <td className={styles.tableCell} data-label="Email">
                    {cliente.email}
                  </td>
                  <td className={styles.tableCell} data-label="Documento">
                    {cliente.cpfOrCnpj}
                  </td>
                  <td className={styles.tableCell} data-label="Representante">
                    {cliente.representante || '-'}
                  </td>
                  <td className={styles.tableCell} data-label="Empresa">
                    {cliente.nomeEmpresa || '-'}
                  </td>
                  <td className={styles.tableCell} data-label="Criado em">
                    {cliente.criadoEm?.toDate?.().toLocaleString?.() || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
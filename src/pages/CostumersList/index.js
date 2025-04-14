import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FiUser } from "react-icons/fi";
import Header from "../../components/HeaderTecnico";
import Title from "../../components/Title";
import "./CostumersList.css";

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
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Documento</th>
                <th>Representante</th>
                <th>Empresa</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.tipo === 'autonomous' ? 'Autônomo' : 'Empresa'}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.cpfOrCnpj}</td>
                  <td>{cliente.representante || '-'}</td>
                  <td>{cliente.nomeEmpresa || '-'}</td>
                  <td>{cliente.criadoEm?.toDate?.().toLocaleString?.() || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

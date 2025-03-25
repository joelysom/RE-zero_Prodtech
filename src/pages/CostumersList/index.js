import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { FiUser } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./CostumersList.css";

export default function Customers() {
  const [clientes, setClientes] = useState([]);

  // Função para buscar todos os clientes cadastrados
  const fetchClientes = async () => {
    const querySnapshot = await getDocs(collection(db, 'customers'));
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
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nomeEmpresa}</td>
                  <td>{cliente.cnpj}</td>
                  <td>{cliente.endereco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

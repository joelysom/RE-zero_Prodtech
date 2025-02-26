import { FiDelete, FiEdit2, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Tabela({ chamados, toggleModal, handleDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Assunto</th>
          <th>Status</th>
          <th>Cadastrado em</th>
          <th>Atribuído a</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        {chamados.map((item, index) => (
          <tr key={index}>
            <td data-label="Cliente">{item.cliente}</td>
            <td data-label="Assunto">{item.assunto}</td>
            <td data-label="Status">
              <span
                className="badge"
                style={{ backgroundColor: item.status === "Em aberto" ? "#5CB85C" : "#ccc" }}
              >
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
  );
}

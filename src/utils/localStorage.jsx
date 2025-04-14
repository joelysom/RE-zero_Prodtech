const usersCliente = [
  { email: "cliente@example.com", password: "cliente123", type: "cliente" },
];

const usersTecnico = [
  { email: "tecnico@example.com", password: "tecnico123", type: "tecnico" },
];

localStorage.setItem("users_cliente", JSON.stringify(usersCliente));
localStorage.setItem("users_tecnico", JSON.stringify(usersTecnico));

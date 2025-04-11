import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { db } from "../../services/firebaseConnection";
import styles from './signinClient.module.css';

// Validações
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0, remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf[10]);
};

const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0, pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  length++;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  return result === parseInt(digits.charAt(1));
};

export default function Customers() {
  const [clientType, setClientType] = useState('');
  const [cpfOrCnpj, setCpfOrCnpj] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    if (!nome || nome.trim().length < 2) return toast.error('Nome deve ter pelo menos 2 caracteres');
    if (!validateEmail(email)) return toast.error('Email inválido');
    if (senha.length < 6) return toast.error('Senha deve ter no mínimo 6 caracteres');
    if (senha !== confirmPassword) return toast.error('Senhas não correspondem');
    if (!clientType) return toast.error('Selecione o tipo de cliente');

    if (clientType === 'autonomous') {
      if (!validateCPF(cpfOrCnpj)) return toast.error('CPF inválido');
    } else if (clientType === 'company') {
      if (!validateCNPJ(cpfOrCnpj)) return toast.error('CNPJ inválido');
      if (!representativeName || representativeName.trim().length < 2) return toast.error('Nome do representante inválido');
      if (!companyName || companyName.trim().length < 2) return toast.error('Nome da empresa inválido');
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      tipo: clientType,
      nome,
      email,
      senha,
      ...(cpfOrCnpj && { cpfOrCnpj }),
      ...(clientType === 'company' && {
        representante: representativeName,
        nomeEmpresa: companyName
      }),
      criadoEm: new Date()
    };

    try {
      await addDoc(collection(db, 'clientes'), data);
      toast.success('Cliente cadastrado com sucesso!');

      // Reset form
      setClientType('');
      setCpfOrCnpj('');
      setRepresentativeName('');
      setCompanyName('');
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.content}>
        <Title name="Cadastro de Cliente">
          <FiUser size={25} />
        </Title>

        <div className={styles.container}>
          <form className={styles.formProfile} onSubmit={handleRegister}>
            <label>Tipo de Cliente</label>
            <div className={styles.radioGroup}>
              <label>
                <input type="radio" name="clientType" value="autonomous" checked={clientType === 'autonomous'} onChange={() => setClientType('autonomous')} />
                Autônomo
              </label>
              <label style={{ marginLeft: 20 }}>
                <input type="radio" name="clientType" value="company" checked={clientType === 'company'} onChange={() => setClientType('company')} />
                Empresa
              </label>
            </div>

            {clientType === 'autonomous' && (
              <input className={styles.input} type="text" placeholder="CPF" value={cpfOrCnpj} onChange={(e) => setCpfOrCnpj(e.target.value)} />
            )}

            {clientType === 'company' && (
              <>
                <input className={styles.input} type="text" placeholder="CNPJ" value={cpfOrCnpj} onChange={(e) => setCpfOrCnpj(e.target.value)} />
                <input className={styles.input} type="text" placeholder="Nome do Representante" value={representativeName} onChange={(e) => setRepresentativeName(e.target.value)} />
                <input className={styles.input} type="text" placeholder="Nome da Empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </>
            )}

            <input className={styles.input} type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input className={styles.input} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={styles.input} type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <input className={styles.input} type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <button className={styles.button} type="submit">Cadastrar Cliente</button>
          </form>
        </div>
      </div>
    </div>
  );
}

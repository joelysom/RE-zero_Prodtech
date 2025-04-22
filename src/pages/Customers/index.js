import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import styles from './signinClient.module.css';
import { toast } from 'react-toastify';
import Header from "../../components/HeaderTecnico";
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaIdCard, FaUserTie, FaRegUser, FaAddressCard } from 'react-icons/fa';
import { HiDocumentText } from 'react-icons/hi';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore';

// Utility functions for validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  
  // Check for known invalid CPFs
  if (['00000000000', '11111111111', '22222222222', '33333333333', 
       '44444444444', '55555555555', '66666666666', '77777777777', 
       '88888888888', '99999999999'].includes(cpf)) return false;
  
  // Validate CPF algorithm
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) 
    sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
  
  remainder = (sum * 10) % 11;
  
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) 
    sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
  
  remainder = (sum * 10) % 11;
  
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  
  if (cnpj.length !== 14) return false;
  
  // Check for known invalid CNPJs
  if (['00000000000000', '11111111111111', '22222222222222', 
       '33333333333333', '44444444444444', '55555555555555', 
       '66666666666666', '77777777777777', '88888888888888', 
       '99999999999999'].includes(cnpj)) return false;
  
  // Validate CNPJ algorithm
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

function ClientSignUp() {
  // Note: Estamos usando o AuthContext apenas para loadingAuth e setLoadingAuth
  const { setLoadingAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    clientType: '',
    cpfOrCnpj: '',
    representativeName: '',
    companyName: '',
    nome: '',
    email: '',
    senha: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Common validations
    if (!formData.nome || formData.nome.trim().length < 2) {
      toast.error('Nome deve ter pelo menos 2 caracteres');
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Email inválido');
      return false;
    }

    if (formData.senha.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return false;
    }

    if (formData.senha !== formData.confirmPassword) {
      toast.error('Senhas não correspondem');
      return false;
    }

    // Validate client type selection
    if (!formData.clientType) {
      toast.error('Selecione o tipo de cliente');
      return false;
    }

    // Validate CPF/CNPJ based on client type
    if (formData.clientType === 'autonomous') {
      if (!validateCPF(formData.cpfOrCnpj)) {
        toast.error('CPF inválido');
        return false;
      }
    } else if (formData.clientType === 'company') {
      if (!validateCNPJ(formData.cpfOrCnpj)) {
        toast.error('CNPJ inválido');
        return false;
      }

      if (!formData.representativeName || formData.representativeName.trim().length < 2) {
        toast.error('Nome do representante inválido');
        return false;
      }

      if (!formData.companyName || formData.companyName.trim().length < 2) {
        toast.error('Nome da empresa inválido');
        return false;
      }
    }

    return true;
  };

  // Implementação direta do cadastro sem usar a função signUp do contexto
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setLoadingAuth(true);
      
      // Prepare data for signup
      const userData = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        ...(formData.cpfOrCnpj && { cpf: formData.cpfOrCnpj }),
        ...(formData.clientType === 'company' && {
          empresaNome: formData.companyName,
          representanteNome: formData.representativeName
        })
      };

      // Criação do usuário diretamente sem usar o contexto
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.senha);
      const uid = userCredential.user.uid;
      
      // Referência do documento
      const docRef = doc(db, 'clientes', uid);
      
      // Prepare user data for storage
      const userDataToStore = {
        nome: userData.nome,
        email: userData.email,
        ...(userData.cpf && { cpf: userData.cpf }),
        ...(userData.empresaNome && { empresaNome: userData.empresaNome }),
        ...(userData.representanteNome && { representanteNome: userData.representanteNome }),
      };
      
      // Store user data in Firestore
      await setDoc(docRef, userDataToStore);
      
      // Success notification
      toast.success('Cadastro realizado com sucesso!');
      
      // Reset the form after successful signup
      setFormData({
        clientType: '',
        cpfOrCnpj: '',
        representativeName: '',
        companyName: '',
        nome: '',
        email: '',
        senha: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      // Detailed error handling for sign up
      switch(err.code) {
        case 'auth/email-already-in-use':
          toast.error('Email já está em uso');
          break;
        case 'auth/invalid-email':
          toast.error('Email inválido');
          break;
        case 'auth/operation-not-allowed':
          toast.error('Operação não permitida');
          break;
        case 'auth/weak-password':
          toast.error('Senha muito fraca');
          break;
        default:
          console.error('Signup error:', err);
          toast.error('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
      setLoadingAuth(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Cadastrar Cliente</h1>
          </div>

          <h2 className={styles.title}>
            <HiDocumentText size={24} />
            Registro de Cliente
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de Cliente</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="clientType"
                    value="autonomous"
                    checked={formData.clientType === 'autonomous'}
                    onChange={handleInputChange}
                  />
                  <FaRegUser />
                  <span>Autônomo</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="clientType"
                    value="company"
                    checked={formData.clientType === 'company'}
                    onChange={handleInputChange}
                  />
                  <FaBuilding />
                  <span>Empresa</span>
                </label>
              </div>
            </div>

            {formData.clientType === 'autonomous' && (
              <div className={styles.iconInput}>
                <FaAddressCard className={styles.icon} />
                <input
                  type="text"
                  name="cpfOrCnpj"
                  value={formData.cpfOrCnpj}
                  onChange={handleInputChange}
                  placeholder="CPF"
                  className={styles.input}
                />
              </div>
            )}

            {formData.clientType === 'company' && (
              <>
                <div className={styles.iconInput}>
                  <FaIdCard className={styles.icon} />
                  <input
                    type="text"
                    name="cpfOrCnpj"
                    value={formData.cpfOrCnpj}
                    onChange={handleInputChange}
                    placeholder="CNPJ"
                    className={styles.input}
                  />
                </div>
                <div className={styles.iconInput}>
                  <FaUserTie className={styles.icon} />
                  <input
                    type="text"
                    name="representativeName"
                    value={formData.representativeName}
                    onChange={handleInputChange}
                    placeholder="Nome do Representante"
                    className={styles.input}
                  />
                </div>
                <div className={styles.iconInput}>
                  <FaBuilding className={styles.icon} />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Nome da Empresa"
                    className={styles.input}
                  />
                </div>
              </>
            )}

            <div className={styles.iconInput}>
              <FaUser className={styles.icon} />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome Completo"
                className={styles.input}
              />
            </div>
            
            <div className={styles.iconInput}>
              <FaEnvelope className={styles.icon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="E-mail"
                className={styles.input}
              />
            </div>
            
            <div className={styles.iconInput}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Senha"
                className={styles.input}
              />
            </div>
            
            <div className={styles.iconInput}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmar Senha"
                className={styles.input}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Cadastrar'}
            </button>
            
          </form>
        </div>
      </div>
    </>
  );
}

export default ClientSignUp;
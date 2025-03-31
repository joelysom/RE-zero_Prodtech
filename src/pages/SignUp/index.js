import React, { useState, useContext } from 'react';
import { User, Wrench } from 'lucide-react';
import { AuthContext } from '../../contexts/auth';
import styles from './signin.module.css';
import { toast } from 'react-toastify';

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

function SignUp() {
  const { signUp } = useContext(AuthContext);
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Client fields
    clientType: '',
    cpfOrCnpj: '',
    representativeName: '',
    companyName: '',
    
    // Common fields
    nome: '',
    email: '',
    senha: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep(1);
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

    // Specific validations based on user type
    if (userType === 'client') {
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
    } else if (userType === 'technician') {
      // Validate technician CPF
      if (!validateCPF(formData.cpfOrCnpj)) {
        toast.error('CPF inválido');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for signup
      const signupData = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        ...(formData.cpfOrCnpj && { cpf: formData.cpfOrCnpj }),
        ...(formData.clientType === 'company' && {
          empresaNome: formData.companyName,
          representanteNome: formData.representativeName
        })
      };

      // Determine user type for signup
      const type = userType === 'client' ? 'cliente' : 'tecnico';

      // Call signUp from AuthContext
      await signUp(signupData, type);

    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Erro ao cadastrar. Tente novamente.');
    }
  };

  const renderStepZero = () => (
    <div className={styles.card}>
      <h2 className={styles.title}>Escolha seu tipo de registro</h2>
      <div className={styles.userTypeGrid}>
        <button 
          onClick={() => handleUserTypeSelection('client')}
          className={styles.userTypeButton}
        >
          <User size={48} />
          <span>Registrar Cliente</span>
        </button>
        <button 
          onClick={() => handleUserTypeSelection('technician')}
          className={styles.userTypeButton}
        >
          <Wrench size={48} />
          <span>Registrar Técnico</span>
        </button>
      </div>
    </div>
  );

  const renderClientStep = () => (
    <div className={styles.card}>
      <h2 className={styles.title}>Registro de Cliente</h2>
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
                onChange={(e) => handleInputChange(e)}
              />
              <span>Autônomo</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="clientType"
                value="company"
                checked={formData.clientType === 'company'}
                onChange={(e) => handleInputChange(e)}
              />
              <span>Empresa</span>
            </label>
          </div>
        </div>

        {formData.clientType === 'autonomous' && (
          <input
            type="text"
            name="cpfOrCnpj"
            value={formData.cpfOrCnpj}
            onChange={handleInputChange}
            placeholder="CPF"
            className={styles.input}
          />
        )}

        {formData.clientType === 'company' && (
          <>
            <input
              type="text"
              name="cpfOrCnpj"
              value={formData.cpfOrCnpj}
              onChange={handleInputChange}
              placeholder="CNPJ"
              className={styles.input}
            />
            <input
              type="text"
              name="representativeName"
              value={formData.representativeName}
              onChange={handleInputChange}
              placeholder="Nome do Representante"
              className={styles.input}
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Nome da Empresa"
              className={styles.input}
            />
          </>
        )}

        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Nome Completo"
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="E-mail"
          className={styles.input}
        />
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
          placeholder="Senha"
          className={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirmar Senha"
          className={styles.input}
        />

        <button 
          type="submit" 
          className={styles.submitButton}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );

  const renderTechnicianStep = () => (
    <div className={styles.card}>
      <h2 className={styles.title}>Registro de Técnico</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="cpfOrCnpj"
          value={formData.cpfOrCnpj}
          onChange={handleInputChange}
          placeholder="CPF"
          className={styles.input}
        />
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Nome Completo"
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="E-mail"
          className={styles.input}
        />
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
          placeholder="Senha"
          className={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirmar Senha"
          className={styles.input}
        />

        <button 
          type="submit" 
          className={styles.submitButton}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );

  return (
    <div className={styles.container}>
      {step === 0 && renderStepZero()}
      {step === 1 && userType === 'client' && renderClientStep()}
      {step === 1 && userType === 'technician' && renderTechnicianStep()}
    </div>
  );
}

export default SignUp;
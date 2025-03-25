import React, { useState } from 'react';
import { User, Wrench } from 'lucide-react';
import styles from './signin.module.css';

function SignUp() {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Client fields
    clientType: '',
    cpfOrCnpj: '',
    representativeName: '',
    companyName: '',
    
    // Common fields
    name: '',
    email: '',
    password: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your signup logic here
    console.log('Form submitted', formData);
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
              name="cnpj"
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
          name="name"
          value={formData.name}
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
          name="password"
          value={formData.password}
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
          name="cpf"
          value={formData.cpfOrCnpj}
          onChange={handleInputChange}
          placeholder="CPF"
          className={styles.input}
        />
        <input
          type="text"
          name="name"
          value={formData.name}
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
          name="password"
          value={formData.password}
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
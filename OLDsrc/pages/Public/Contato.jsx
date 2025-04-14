import React, { useState } from "react";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaClock,
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTwitter 
} from "react-icons/fa";
import "./style/Contato.css";

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const [formError, setFormError] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.telefone.trim()) {
      errors.telefone = "Telefone é obrigatório";
      isValid = false;
    }

    if (!formData.mensagem.trim()) {
      errors.mensagem = "Mensagem é obrigatória";
      isValid = false;
    }

    setFormError(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulação de envio de formulário
      setSubmitStatus("sending");
      setTimeout(() => {
        setSubmitStatus("success");
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          assunto: "",
          mensagem: ""
        });
      }, 1500);
    }
  };

  return (
    <>
      <div className="contato-container">
        <div className="overlay">
          <h1 className="title">Entre em Contato com a ProdTech</h1>
          <p className="subtitle">
            Estamos prontos para ajudar sua empresa nas soluções de tecnologia.
            Preencha o formulário e entraremos em contato.
          </p>
        </div>
        <div className="info-box">CONTATO</div>
      </div>

      <div className="contato-content">
        <div className="contato-info">
          <h2>Informações de Contato</h2>
          
          <div className="info-item">
            <div className="icon-wrapper">
              <FaMapMarkerAlt />
            </div>
            <div className="info-text">
              <h3>Localização</h3>
              <p>Senac-PE</p>
              <p>Av. Visconde de Suassuna, 500 - Santo Amaro</p>
              <p>Recife-PE, CEP 50050-540</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper">
              <FaPhoneAlt />
            </div>
            <div className="info-text">
              <h3>Telefones</h3>
              <p>Central de Atendimento: (81) 3413-6728</p>
              <p>Suporte Técnico: (81) 3413-6729</p>
              <p>WhatsApp: (81) 99876-5432</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper">
              <FaEnvelope />
            </div>
            <div className="info-text">
              <h3>Email</h3>
              <p>contato@prodtech.com.br</p>
              <p>suporte@prodtech.com.br</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="icon-wrapper">
              <FaClock />
            </div>
            <div className="info-text">
              <h3>Horário de Atendimento</h3>
              <p>Segunda a Sexta: 08:00 - 18:00</p>
              <p>Sábado: 09:00 - 13:00</p>
            </div>
          </div>
          
          <div className="social-media">
            <h3>Redes Sociais</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="contato-form" id="formulario">
          <h2>Envie sua Mensagem</h2>
          
          {submitStatus === "success" && (
            <div className="success-message">
              Mensagem enviada com sucesso! Entraremos em contato em breve.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className={formError.nome ? "error" : ""}
              />
              {formError.nome && <span className="error-text">{formError.nome}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  className={formError.email ? "error" : ""}
                />
                {formError.email && <span className="error-text">{formError.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(DDD) Número"
                  className={formError.telefone ? "error" : ""}
                />
                {formError.telefone && <span className="error-text">{formError.telefone}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="assunto">Assunto</label>
              <select 
                id="assunto"
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
              >
                <option value="">Selecione um assunto</option>
                <option value="Suporte Técnico">Suporte Técnico</option>
                <option value="Contratação de Serviços">Contratação de Serviços</option>
                <option value="Orçamento">Solicitação de Orçamento</option>
                <option value="Parceria">Proposta de Parceria</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="mensagem">Mensagem *</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                rows="5"
                placeholder="Digite sua mensagem"
                className={formError.mensagem ? "error" : ""}
              ></textarea>
              {formError.mensagem && <span className="error-text">{formError.mensagem}</span>}
            </div>
            
            <div className="form-group">
              <div className="checkbox-group">
                <input type="checkbox" id="termos" name="termos" required />
                <label htmlFor="termos">
                  Concordo com a política de privacidade e termos de uso
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitStatus === "sending"}
            >
              {submitStatus === "sending" ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>
      
      <div className="map-container">
        <h2>Nossa Localização</h2>
        <div className="map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.5181678458225!2d-34.8938134!3d-8.0591187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18a48f26253d%3A0x256c94a118a24e89!2sSenac%20Recife!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            title="Localização Senac-PE"
          ></iframe>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h3>Como funciona o suporte técnico?</h3>
            <p>Oferecemos suporte técnico 24/7 para clientes com contrato de manutenção. Para outros casos, o atendimento ocorre em horário comercial.</p>
          </div>
          
          <div className="faq-item">
            <h3>Qual o prazo para retorno após o contato?</h3>
            <p>Nosso tempo médio de resposta é de até 2 horas em dias úteis e durante o horário comercial.</p>
          </div>
          
          <div className="faq-item">
            <h3>Vocês atendem empresas de qualquer tamanho?</h3>
            <p>Sim, trabalhamos com empresas de todos os portes, desde pequenos negócios até grandes corporações.</p>
          </div>
          
          <div className="faq-item">
            <h3>Como solicitar um orçamento?</h3>
            <p>Você pode solicitar um orçamento através do nosso formulário de contato, por telefone ou email.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contato;
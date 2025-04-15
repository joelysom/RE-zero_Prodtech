import { FiSettings, FiUpload } from "react-icons/fi";
import Header from "../../components/HeaderTecnico";
import Title from "../../components/Title";
import avatar from '../../assets/avatarOLD.png';
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import './profile.css';
import { toast } from "react-toastify";
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import axios from 'axios';

export default function Profile(){
  const { user, storageUser, setUser } = useContext(AuthContext);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [loading, setLoading] = useState(false);

  // URL base do backend - ajuste conforme necessário
  const API_BASE_URL = 'http://localhost:5000'; // Altere para a URL do seu servidor
 
  const handleFile = (e) => {
    if(e.target.files[0]) {
      const image = e.target.files[0];
      if(image.type === 'image/png' || image.type === 'image/jpeg'){
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.error('Envie uma imagem do tipo PNG/JPEG');
        setImageAvatar(null);
        return;
      }
    }
  }

  // Função para verificar se o servidor está online antes de fazer upload
  const checkServerStatus = async () => {
    try {
      const statusCheck = await axios.get(`${API_BASE_URL}/api/status`);
      return statusCheck.data.status === 'online';
    } catch (e) {
      console.error('Erro ao verificar status do servidor:', e);
      return false;
    }
  }

  const handleUpload = async () => {
    setLoading(true);
    
    try {
      // Verificar se o servidor está online
      const serverOnline = await checkServerStatus();
      if (!serverOnline) {
        toast.error('Servidor indisponível. Tente novamente mais tarde.');
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('avatar', imageAvatar);
      
      console.log("Enviando upload para:", `${API_BASE_URL}/api/upload/profile/${user.uid}`);
      console.log("Arquivo sendo enviado:", imageAvatar);
      
      // Enviar imagem para o servidor
      const response = await axios.post(
        `${API_BASE_URL}/api/upload/profile/${user.uid}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Resposta da API:", response.data);
      
      if (response.data.success) {
        // URL da imagem salva no servidor
        const serverImageUrl = `${API_BASE_URL}${response.data.avatarUrl}`;
        
        // Verificar se o documento existe antes de atualizar
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          // Se o documento não existir, criar um novo
          await setDoc(docRef, {
            nome: nome,
            email: user.email,
            avatarUrl: serverImageUrl,
            createdAt: serverTimestamp()
          });
          console.log("Documento criado com sucesso!");
        } else {
          // Se existir, apenas atualizar
          await updateDoc(docRef, {
            avatarUrl: serverImageUrl,
            nome: nome,
          });
          console.log("Documento atualizado com sucesso!");
        }
        
        // Atualizar estado do usuário
        let data = {
          ...user,
          nome: nome,
          avatarUrl: serverImageUrl,
        };
        
        setUser(data);
        storageUser(data);
        toast.success('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro detalhado:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      toast.error(`Erro ao fazer upload da imagem: ${error.code || error.message || 'desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if(imageAvatar === null && nome !== '') {
        // Apenas atualizar o nome
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          // Se o documento não existir, criar um novo
          await setDoc(docRef, {
            nome: nome,
            email: user.email,
            createdAt: serverTimestamp()
          });
        } else {
          // Se existir, apenas atualizar
          await updateDoc(docRef, {
            nome: nome,
          });
        }
        
        let data = {
          ...user,
          nome: nome,
        };
        
        setUser(data);
        storageUser(data);
        toast.success('Nome atualizado com sucesso!');
      } else if (imageAvatar !== null && nome !== '') {
        // Atualizar nome e imagem
        await handleUpload();
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      toast.error(`Erro ao atualizar perfil: ${error.code || error.message || 'desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile}/> <br/>
              {!avatarUrl ? (
                <img src={avatar} alt="Foto de perfil" width={150} height={150} />
              ) : (
                <img src={avatarUrl} alt="Foto de perfil" width={150} height={150} />
              )}
            </label>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>Email</label>
            <input
              type="text"
              value={email}
              disabled={true}
            />
           
            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
//ok//
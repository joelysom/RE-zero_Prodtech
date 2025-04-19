import { useState, createContext, useEffect } from 'react'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth'; 
import { auth, db } from '../services/firebaseConnection'; 
import {   
  doc,      
  getDoc,  
  setDoc, 
} from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';  

export const AuthContext = createContext({});  

function AuthProvider({ children }){   
  const [user, setUser] = useState(null);   
  const [loadingAuth, setLoadingAuth] = useState(false);   
  const [loading, setLoading] = useState(true);   
  const [userType, setUserType] = useState(null); // 'cliente' or 'tecnico'
  const navigate = useNavigate();    

  useEffect(() => {     
    async function loadUser(){       
      const storageUser = localStorage.getItem('@userdata');        
      const storageUserType = localStorage.getItem('@usertype');
      
      if(storageUser && storageUserType){
        try {
          setUser(JSON.parse(storageUser));
          setUserType(storageUserType);
        } catch (error) {
          console.error('Error loading stored user:', error);
          localStorage.removeItem('@userdata');
          localStorage.removeItem('@usertype');
        }
      }
      
      setLoading(false);
    }
    
    loadUser();
  }, [])    

  async function signIn(email, password, type){
    setLoadingAuth(true);
    
    try {
      // First, attempt to sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // Determine which collection to check based on user type
      let docRef;
      if (type === 'tecnico') {
        docRef = doc(db, 'tecnicos', uid);
      } else {
        docRef = doc(db, 'clientes', uid);
      }
      
      // Verify user exists in the specific collection
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // If user doesn't exist in the expected collection, sign out and throw error
        await signOut(auth);
        toast.error(`Usuário não encontrado como ${type}`);
        setLoadingAuth(false);
        return;
      }
      
      // Prepare user data
      const data = {
        uid: uid,
        nome: docSnap.data().nome,
        email: userCredential.user.email,
        ...(docSnap.data().cpf && { cpf: docSnap.data().cpf }),
        ...(docSnap.data().empresaNome && { empresaNome: docSnap.data().empresaNome }),
      };
      
      // Update state and storage
      setUser(data);
      setUserType(type);
      storageUser(data, type);
      setLoadingAuth(false);
      toast.success('Bem-vindo de volta');
      navigate('/dashboard');
      
    } catch (err) {
      // Detailed error handling
      setLoadingAuth(false);
      
      switch(err.code) {
        case 'auth/invalid-login-credentials':
          toast.error('Email ou senha incorretos');
          break;
        case 'auth/user-not-found':
          toast.error('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          toast.error('Senha incorreta');
          break;
        case 'auth/user-disabled':
          toast.error('Conta desativada');
          break;
        case 'auth/invalid-email':
          toast.error('Email inválido');
          break;
        default:
          console.error('Login error:', err);
          toast.error('Erro ao fazer login. Tente novamente.');
      }
    }
  }

  // Adicionado o parâmetro shouldRedirect com valor padrão true
  async function signUp(userData, type, shouldRedirect = true) {
    setLoadingAuth(true);
    
    try {
      // Validate input
      if (!userData.email || !userData.senha) {
        toast.error('Email e senha são obrigatórios');
        setLoadingAuth(false);
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.senha);
      const uid = userCredential.user.uid;
      
      // Determine collection based on user type
      let docRef;
      if (type === 'tecnico') {
        docRef = doc(db, 'tecnicos', uid);
      } else {
        docRef = doc(db, 'clientes', uid);
      }
      
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
      
      // Prepare data for context and local storage
      const data = {
        uid,
        ...userDataToStore
      };
      
      // Update state and storage only if we should redirect
      if (shouldRedirect) {
        setUser(data);
        setUserType(type);
        storageUser(data, type);
        toast.success('Cadastrado com sucesso');
        navigate('/dashboard');
      } else {
        // Se não redirecionar, apenas mostrar o toast de sucesso
        toast.success('Cadastrado com sucesso');
      }
      
      setLoadingAuth(false);
      
    } catch (err) {
      // Detailed error handling for sign up
      setLoadingAuth(false);
      
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
    }
  }

  function storageUser(data, type){
    localStorage.setItem('@userdata', JSON.stringify(data));
    localStorage.setItem('@usertype', type);
  }

  async function logOut() {
    try {
      await signOut(auth);
      localStorage.removeItem('@userdata');
      localStorage.removeItem('@usertype');
      setUser(null);
      setUserType(null);
      toast.success('Logout realizado com sucesso!');
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
    }
  }

  return(
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        userType,
        signIn,
        signUp,
        loadingAuth,
        loading,
        logOut,
        storageUser,
        setUser,
        setUserType,
        setLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  ) 
}

export default AuthProvider;
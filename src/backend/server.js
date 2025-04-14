// backend/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

// Configuração CORS mais detalhada
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Adicione aqui as origens permitidas
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuração para receber JSON
app.use(express.json());

// Função para garantir que os diretórios existam
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Diretório criado: ${dirPath}`);
      
      // Definir permissões apropriadas (rwxrwxr--)
      fs.chmodSync(dirPath, 0o774);
    } catch (error) {
      console.error(`Erro ao criar diretório ${dirPath}:`, error);
      throw new Error(`Falha ao criar diretório: ${error.message}`);
    }
  }
};

// Configuração do Multer para salvar arquivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Validar o ID do usuário (básico)
    const userId = req.params.userId;
    if (!userId || userId.length < 5) {
      return cb(new Error('ID de usuário inválido'), null);
    }
    
    // Cria diretório baseado no ID do usuário se não existir
    const dir = path.join(__dirname, '../assets/profiles', userId);
    
    try {
      ensureDirectoryExists(dir);
      cb(null, dir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function(req, file, cb) {
    // Limpar o nome do arquivo e adicionar timestamp
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${timestamp}-${randomString}${ext}`);
  }
});

// Filtro para aceitar apenas PNG e JPEG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens PNG ou JPEG são permitidas'), false);
  }
};

// Configuração do multer com limites e tratamento de erros
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // limite de 5MB
  }
});

// Middleware para tratamento de erros do multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'Arquivo muito grande',
        details: 'O tamanho máximo permitido é 5MB'
      });
    }
    return res.status(400).json({ 
      error: 'Erro no upload do arquivo',
      details: err.message
    });
  }
  if (err) {
    return res.status(500).json({ 
      error: 'Erro no servidor',
      details: err.message
    });
  }
  next();
};

// Endpoint para upload da imagem de perfil com tratamento de erros
app.post('/api/upload/profile/:userId', (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      console.error('Erro no processamento do upload:', err);
      return res.status(400).json({ 
        error: 'Erro no upload',
        details: err.message
      });
    }
    
    // Continua para o próximo handler se não houver erros
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    // Constrói a URL para acessar a imagem
    const fileUrl = `/assets/profiles/${req.params.userId}/${req.file.filename}`;
    
    // Registro de sucesso
    console.log(`Upload bem-sucedido: ${req.file.path}`);
    console.log(`URL gerada: ${fileUrl}`);
    
    // Responde com o caminho da imagem
    return res.status(200).json({
      success: true,
      avatarUrl: fileUrl,
      message: 'Imagem enviada com sucesso!'
    });
  } catch (error) {
    console.error('Erro no processamento pós-upload:', error);
    return res.status(500).json({
      error: 'Erro ao processar upload',
      details: error.message
    });
  }
});

// Servir arquivos estáticos da pasta assets com cache
app.use('/assets', express.static(path.join(__dirname, '../assets'), {
  maxAge: '1d', // Cache de 1 dia
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 dia
    }
  }
}));

// Rota para verificar se o servidor está funcionando
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware para tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}/api/status para verificar o status`);
});
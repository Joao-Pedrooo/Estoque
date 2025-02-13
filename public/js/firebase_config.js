// firebase_config.js

// Importa o módulo compat do Firebase usando namespace import
import * as firebase from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore-compat.js";
import "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.6.11/firebase-storage-compat.js";

// Configuração do Firebase (substitua com as suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyChvk0KwHe0G72Enn5OiZ-GQwx_KD3N_TU",
  authDomain: "estoque-v1.firebaseapp.com",
  projectId: "estoque-v1",
  storageBucket: "estoque-v1.appspot.com", // Verifique se este valor está correto
  messagingSenderId: "1073871250272",
  appId: "1:1073871250272:web:cd51f47f32068f1640f405",
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Exporta as instâncias para uso nos demais módulos
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

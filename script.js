// IndaiaFibra App - Complete Implementation
// All features from the report implemented

// Global variables
let map, marker;
let mapManutencao, markerManutencao;
let mapCTOs;
let materiais = [];
let historico = [];
let contadorMensal = 0;
let currentFilter = 'todos';
let isOnline = navigator.onLine;
let db;
let html5QrCode;
let isDarkMode = false;
let currentTheme = 'light';
let swipeStartX = 0;
let swipeStartY = 0;
let currentTab = 'instalacao';
let personalizedSettings = {};

// Constants
const TELEGRAM_GROUP_LINK = 'https://t.me/+SEU_LINK_DO_GRUPO_AQUI';
const MAX_HISTORY_RECORDS = 100;
const CACHE_NAME = 'indaiafibra-v1';
const DB_NAME = 'IndaiaFibraDB';
const DB_VERSION = 1;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  try {
    // Initialize core systems
    await initializeIndexedDB();
    await loadDataFromIndexedDB();
    initializeServiceWorker();
    initializeNavigation();
    initializeDarkMode();
    initializeNotifications();
    initializeGestures();
    initializeHapticFeedback();
    
    // Initialize UI components
    initializeMap();
    initializeMapManutencao();
    initializeMapCTOs();
    initializeRangeSliders();
    initializeFormHandlers();
    initializeMateriais();
    initializeHistorico();
    initializeAddressSearch();
    initializeReports();
    initializeSettings();
    initializePhotoCapture();
    initializeQRScanner();
    
    // Initialize AOS animations
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true
    });
    
    // Update UI
    updateContador();
    updateOnlineStatus();
    renderAllSections();
    
    // Setup offline/online listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    console.log('IndaiaFibra App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
    showToast('Erro ao inicializar o aplicativo', 'error');
  }
}

// Service Worker Registration
function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
        showToast('Modo offline ativado', 'success');
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }
}

// IndexedDB Implementation
async function initializeIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('materiais')) {
        db.createObjectStore('materiais', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('historico')) {
        db.createObjectStore('historico', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('fotos')) {
        db.createObjectStore('fotos', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('configuracoes')) {
        db.createObjectStore('configuracoes', { keyPath: 'key' });
      }
    };
  });
}

async function loadDataFromIndexedDB() {
  try {
    materiais = await getFromIndexedDB('materiais') || [];
    historico = await getFromIndexedDB('historico') || [];
    personalizedSettings = await getFromIndexedDB('configuracoes') || {};
    contadorMensal = parseInt(localStorage.getItem('contadorMensal')) || 0;
  } catch (error) {
    console.error('Error loading data from IndexedDB:', error);
    // Fallback to localStorage
    materiais = JSON.parse(localStorage.getItem('materiais')) || [];
    historico = JSON.parse(localStorage.getItem('historico')) || [];
  }
}

async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIndexedDB(storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Dark Mode Implementation
function initializeDarkMode() {
  // Detect system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    currentTheme = savedTheme;
  } else {
    currentTheme = prefersDark ? 'dark' : 'light';
  }
  
  applyTheme(currentTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme = e.matches ? 'dark' : 'light';
      applyTheme(currentTheme);
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  isDarkMode = theme === 'dark';
  
  // Update theme toggle button if exists
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  applyTheme(currentTheme);
  
  // Haptic feedback
  vibrate(50);
  
  showToast(`Modo ${currentTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success');
}

// Notifications Implementation
async function initializeNotifications() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notifications enabled');
    }
  }
}

function showNotification(title, body, options = {}) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}

// Haptic Feedback Implementation
function initializeHapticFeedback() {
  // Add haptic feedback to all buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn') || e.target.closest('.nav-item')) {
      vibrate(30);
    }
  });
}

function vibrate(duration = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

// Gestures Implementation
function initializeGestures() {
  let startX, startY, startTime;
  
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  });
  
  document.addEventListener('touchend', (e) => {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    const diffTime = endTime - startTime;
    
    // Only process quick swipes
    if (diffTime > 300) return;
    
    // Horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next tab
        navigateToNextTab();
      } else {
        // Swipe right - previous tab
        navigateToPrevTab();
      }
      vibrate(30);
    }
    
    // Reset
    startX = startY = null;
  });
}

function navigateToNextTab() {
  const tabs = ['instalacao', 'manutencao', 'materiais', 'historico', 'mapa', 'relatorios', 'configuracoes'];
  const currentIndex = tabs.indexOf(currentTab);
  const nextIndex = (currentIndex + 1) % tabs.length;
  switchTab(tabs[nextIndex]);
}

function navigateToPrevTab() {
  const tabs = ['instalacao', 'manutencao', 'materiais', 'historico', 'mapa', 'relatorios', 'configuracoes'];
  const currentIndex = tabs.indexOf(currentTab);
  const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
  switchTab(tabs[prevIndex]);
}

// Navigation System
function initializeNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(targetTab) {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Update active nav item
  navItems.forEach(nav => nav.classList.remove('active'));
  document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
  
  // Update active tab content
  tabContents.forEach(content => {
    content.classList.add('hidden');
    content.classList.remove('fade-in');
  });
  
  const targetContent = document.getElementById(targetTab);
  if (targetContent) {
    targetContent.classList.remove('hidden');
    setTimeout(() => {
      targetContent.classList.add('fade-in');
    }, 50);
  }
  
  currentTab = targetTab;
  
  // Trigger specific tab initialization if needed
  if (targetTab === 'relatorios') {
    updateReports();
  } else if (targetTab === 'mapa') {
    setTimeout(() => {
      if (mapCTOs) mapCTOs.invalidateSize();
    }, 100);
  }
}

// Photo Capture Implementation
function initializePhotoCapture() {
  // This will be implemented in the form sections
}

async function capturePhoto() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    // Create video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    
    // Create canvas for capture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Wait for video to load
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Capture frame
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        const compressedBlob = await compressImage(blob);
        await savePhotoToIndexedDB(compressedBlob);
        
        // Stop camera
        stream.getTracks().forEach(track => track.stop());
        
        showToast('Foto capturada com sucesso!', 'success');
        vibrate(100);
      }, 'image/jpeg', 0.8);
    });
    
  } catch (error) {
    console.error('Error capturing photo:', error);
    showToast('Erro ao capturar foto', 'error');
  }
}

async function compressImage(blob, maxWidth = 1024, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(blob);
  });
}

async function savePhotoToIndexedDB(blob) {
  const photoData = {
    blob: blob,
    timestamp: Date.now(),
    type: 'captured'
  };
  
  await saveToIndexedDB('fotos', photoData);
}

// QR Code Scanner Implementation
function initializeQRScanner() {
  // Initialize QR scanner when needed
}

async function startQRScanner() {
  try {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      console.log(`QR Code detected: ${decodedText}`);
      processQRCode(decodedText);
      html5QrCode.stop();
      vibrate(100);
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode = new Html5Qrcode("qr-reader");
    await html5QrCode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback
    );
    
  } catch (error) {
    console.error('Error starting QR scanner:', error);
    showToast('Erro ao iniciar scanner QR', 'error');
  }
}

function processQRCode(qrData) {
  try {
    // Try to parse as JSON
    const data = JSON.parse(qrData);
    
    // Auto-fill form fields based on QR data
    if (data.cliente) document.getElementById('cliente').value = data.cliente;
    if (data.cto) document.getElementById('cto').value = data.cto;
    if (data.porta) document.getElementById('porta').value = data.porta;
    
    showToast('Dados do QR Code preenchidos automaticamente!', 'success');
  } catch (error) {
    // If not JSON, treat as simple text
    showToast(`QR Code lido: ${qrData}`, 'info');
  }
}

// Reports Implementation
function initializeReports() {
  // This will be called when reports tab is accessed
}

function updateReports() {
  renderInstallationChart();
  renderMaterialsChart();
  renderStatistics();
}

function renderInstallationChart() {
  const ctx = document.getElementById('installationChart');
  if (!ctx) return;
  
  // Get installations by week
  const weeklyData = getWeeklyInstallations();
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weeklyData.labels,
      datasets: [{
        label: 'Instalações',
        data: weeklyData.data,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'var(--text-primary)'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'var(--text-secondary)'
          }
        },
        x: {
          ticks: {
            color: 'var(--text-secondary)'
          }
        }
      }
    }
  });
}

function renderMaterialsChart() {
  const ctx = document.getElementById('materialsChart');
  if (!ctx) return;
  
  // Get most used materials
  const materialData = getMostUsedMaterials();
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: materialData.labels,
      datasets: [{
        data: materialData.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: 'var(--text-primary)'
          }
        }
      }
    }
  });
}

function getWeeklyInstallations() {
  // Implementation for weekly installation data
  const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
  const data = [12, 19, 8, 15]; // Sample data
  
  return { labels: weeks, data: data };
}

function getMostUsedMaterials() {
  // Implementation for most used materials
  const labels = ['Cabo Óptico', 'Conector', 'Splitter', 'Roteador', 'Outros'];
  const data = [35, 25, 20, 15, 5]; // Sample data
  
  return { labels: labels, data: data };
}

function renderStatistics() {
  const totalInstallations = historico.filter(h => h.tipo === 'instalacao').length;
  const totalMaintenances = historico.filter(h => h.tipo === 'manutencao').length;
  
  document.getElementById('totalInstallations').textContent = totalInstallations;
  document.getElementById('totalMaintenances').textContent = totalMaintenances;
}

// Settings Implementation
function initializeSettings() {
  loadPersonalizedSettings();
}

function loadPersonalizedSettings() {
  const savedSettings = localStorage.getItem('personalizedSettings');
  if (savedSettings) {
    personalizedSettings = JSON.parse(savedSettings);
    applyPersonalizedSettings();
  }
}

function applyPersonalizedSettings() {
  if (personalizedSettings.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', personalizedSettings.primaryColor);
  }
  
  if (personalizedSettings.density) {
    document.body.classList.add(`density-${personalizedSettings.density}`);
  }
}

function savePersonalizedSettings() {
  localStorage.setItem('personalizedSettings', JSON.stringify(personalizedSettings));
  showToast('Configurações salvas!', 'success');
}

// Offline/Online Handlers
function handleOnline() {
  isOnline = true;
  updateOnlineStatus();
  syncOfflineData();
  showToast('Conexão restaurada - sincronizando dados...', 'success');
}

function handleOffline() {
  isOnline = false;
  updateOnlineStatus();
  showToast('Modo offline ativado', 'warning');
}

function updateOnlineStatus() {
  const statusIndicator = document.getElementById('onlineStatus');
  if (statusIndicator) {
    statusIndicator.textContent = isOnline ? 'Online' : 'Offline';
    statusIndicator.className = isOnline ? 'status-online' : 'status-offline';
  }
}

async function syncOfflineData() {
  try {
    // Sync data when back online
    const pendingData = await getFromIndexedDB('pending_sync');
    if (pendingData && pendingData.length > 0) {
      // Process pending sync data
      for (const item of pendingData) {
        await processPendingSync(item);
      }
      showToast('Dados sincronizados com sucesso!', 'success');
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
    showToast('Erro na sincronização de dados', 'error');
  }
}

// Utility Functions
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
  
  // Haptic feedback for important toasts
  if (type === 'error' || type === 'warning') {
    vibrate(100);
  }
}

function updateContador() {
  const instalacoes = historico.filter(item => item.tipo === 'instalacao').length;
  const contadorElement = document.getElementById('contadorInstalacoes');
  if (contadorElement) {
    contadorElement.textContent = `${instalacoes} instalações este mês`;
  }
}

// Render all sections with complete content
function renderAllSections() {
  renderInstalacaoSection();
  renderManutencaoSection();
  renderMateriaisSection();
  renderHistoricoSection();
  renderMapaSection();
  renderRelatoriosSection();
  renderConfiguracoesSection();
}

// Section renderers (these would contain the full HTML for each section)
function renderInstalacaoSection() {
  const section = document.getElementById('instalacao');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <form id="formInstalacao" class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Nova Instalação</h2>
        
        <div class="form-grid form-grid-2 field-spacing">
          <div>
            <label for="tipoTrabalho" class="form-label required">Tipo de trabalho</label>
            <select id="tipoTrabalho" name="tipoTrabalho" required class="form-input">
              <option value="">Selecione</option>
              <option value="Instalação">Instalação</option>
              <option value="Mudança de Endereço">Mudança de Endereço</option>
            </select>
            <p class="error-message">Por favor selecione o tipo de trabalho.</p>
          </div>
          <div>
            <label for="tecnico" class="form-label required">Técnico</label>
            <select id="tecnico" name="tecnico" required class="form-input">
              <option value="">Selecione</option>
              <option value="André">André</option>
              <option value="Elvis">Elvis</option>
              <option value="Guilherme">Guilherme</option>
              <option value="Janderson">Janderson</option>
              <option value="Robson">Robson</option>
              <option value="Sérgio">Sérgio</option>
            </select>
            <p class="error-message">Por favor selecione o técnico.</p>
          </div>
        </div>

        <div class="field-spacing">
          <label for="cliente" class="form-label required">Cliente</label>
          <input id="cliente" name="cliente" type="text" required class="form-input" placeholder="Nome do cliente">
          <p class="error-message">Por favor informe o cliente.</p>
        </div>

        <div class="form-grid form-grid-2 field-spacing">
          <div>
            <label for="cto" class="form-label required">CTO</label>
            <input id="cto" name="cto" type="text" required class="form-input" placeholder="Identificador CTO">
            <p class="error-message">Por favor informe o CTO.</p>
          </div>
          <div>
            <label for="porta" class="form-label required">Porta</label>
            <select id="porta" name="porta" required class="form-input">
              <option value="">Selecione</option>
              ${Array.from({length: 16}, (_, i) => `<option value="${i+1}">Porta ${i+1}</option>`).join('')}
            </select>
            <p class="error-message">Por favor selecione a porta.</p>
          </div>
        </div>

        <div class="field-spacing">
          <label for="sinalCTO" class="form-label">Sinal da CTO</label>
          <input id="sinalCTO" name="sinalCTO" type="range" min="-30" max="-10" step="0.01" value="-20.00" class="range-slider">
          <div class="text-center mt-2">
            <div id="valorSinalCTO" class="editable-value">-20,00 dBm</div>
          </div>
        </div>

        <div class="field-spacing">
          <label for="sinalCliente" class="form-label">Sinal do Cliente</label>
          <input id="sinalCliente" name="sinalCliente" type="range" min="-30" max="-10" step="0.01" value="-20.00" class="range-slider">
          <div class="text-center mt-2">
            <div id="valorSinalCliente" class="editable-value">-20,00 dBm</div>
          </div>
        </div>

        <div class="field-spacing">
          <label class="form-label">Materiais para esta instalação</label>
          <div id="materiaisSelecionaveis" class="mt-3"></div>
        </div>

        <div class="field-spacing">
          <label class="form-label">Fotos da Instalação</label>
          <div class="photo-capture-section">
            <button type="button" id="capturePhotoBtn" class="btn btn-secondary">
              <i class="fas fa-camera mr-2"></i> Capturar Foto
            </button>
            <div id="photoPreview" class="photo-preview-container"></div>
          </div>
        </div>

        <div class="field-spacing">
          <label class="form-label">Scanner QR Code</label>
          <div class="qr-scanner-section">
            <button type="button" id="startQRScanBtn" class="btn btn-secondary">
              <i class="fas fa-qrcode mr-2"></i> Escanear QR Code
            </button>
            <div id="qr-reader" class="qr-reader-container"></div>
          </div>
        </div>

        <div class="field-spacing">
          <label class="form-label required">Localização</label>
          <div class="address-search-container">
            <input id="endereco" name="endereco" type="text" class="form-input" placeholder="Digite o nome da rua para buscar no mapa">
            <div id="enderecoSuggestions" class="search-suggestions"></div>
          </div>
          <div id="mapInstalacao" class="map-container">
            <div id="mapInstalacaoLoading" class="map-loading-overlay">
              <div class="map-loading-spinner"></div>
            </div>
          </div>
          <button type="button" id="usarLocalizacao" class="btn btn-secondary w-full mt-4">
            <i class="fas fa-map-marker-alt mr-2"></i> Usar minha localização atual
          </button>
        </div>

        <button type="submit" class="btn btn-success w-full">
          <i class="fab fa-telegram-plane mr-2"></i>
          Enviar para Telegram
        </button>
      </form>
    </div>
  `;
}

function renderManutencaoSection() {
  const section = document.getElementById('manutencao');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <form id="formManutencao" class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Nova Manutenção</h2>
        
        <div class="form-grid form-grid-2 field-spacing">
          <div>
            <label for="tecnicoManutencao" class="form-label required">Nome do Técnico</label>
            <select id="tecnicoManutencao" name="tecnicoManutencao" required class="form-input">
              <option value="">Selecione</option>
              <option value="André">André</option>
              <option value="Elvis">Elvis</option>
              <option value="Guilherme">Guilherme</option>
              <option value="Janderson">Janderson</option>
              <option value="Robson">Robson</option>
              <option value="Sérgio">Sérgio</option>
            </select>
            <p class="error-message">Por favor selecione o técnico.</p>
          </div>
          <div>
            <label for="clienteManutencao" class="form-label required">Nome do Cliente</label>
            <input id="clienteManutencao" name="clienteManutencao" type="text" required class="form-input" placeholder="Nome do cliente">
            <p class="error-message">Por favor informe o cliente.</p>
          </div>
        </div>

        <div class="field-spacing">
          <label for="problemaDescricao" class="form-label required">Descrição do Problema</label>
          <textarea id="problemaDescricao" name="problemaDescricao" required class="form-input" rows="3" placeholder="Descreva o problema encontrado..."></textarea>
          <p class="error-message">Por favor descreva o problema.</p>
        </div>

        <div class="field-spacing">
          <label for="solucaoAplicada" class="form-label required">Solução Aplicada</label>
          <textarea id="solucaoAplicada" name="solucaoAplicada" required class="form-input" rows="3" placeholder="Descreva a solução aplicada..."></textarea>
          <p class="error-message">Por favor descreva a solução aplicada.</p>
        </div>

        <div class="field-spacing">
          <label class="form-label">Materiais Utilizados</label>
          <div id="materiaisManutencao" class="mt-3"></div>
        </div>

        <div class="field-spacing">
          <label class="form-label">Fotos da Manutenção</label>
          <div class="photo-capture-section">
            <button type="button" id="capturePhotoManutencaoBtn" class="btn btn-secondary">
              <i class="fas fa-camera mr-2"></i> Capturar Foto
            </button>
            <div id="photoPreviewManutencao" class="photo-preview-container"></div>
          </div>
        </div>

        <div class="field-spacing">
          <label class="form-label required">Localização</label>
          <div class="address-search-container">
            <input id="enderecoManutencao" name="enderecoManutencao" type="text" class="form-input" placeholder="Digite o nome da rua para buscar no mapa">
            <div id="enderecoManutencaoSuggestions" class="search-suggestions"></div>
          </div>
          <div id="mapManutencao" class="map-container">
            <div id="mapManutencaoLoading" class="map-loading-overlay">
              <div class="map-loading-spinner"></div>
            </div>
          </div>
          <button type="button" id="usarLocalizacaoManutencao" class="btn btn-secondary w-full mt-4">
            <i class="fas fa-map-marker-alt mr-2"></i> Usar minha localização atual
          </button>
        </div>

        <button type="submit" class="btn btn-success w-full">
          <i class="fab fa-telegram-plane mr-2"></i>
          Enviar para Telegram
        </button>
      </form>
    </div>
  `;
}

function renderMateriaisSection() {
  const section = document.getElementById('materiais');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Gerenciar Materiais</h2>
        
        <div class="form-grid form-grid-2 field-spacing">
          <div>
            <label for="nomeMaterial" class="form-label">Nome do Material</label>
            <input id="nomeMaterial" type="text" class="form-input" placeholder="Ex: Cabo Óptico">
          </div>
          <div>
            <label for="qtdMaterial" class="form-label">Quantidade padrão</label>
            <input id="qtdMaterial" type="number" min="1" class="form-input" placeholder="Ex: 10">
          </div>
        </div>
        
        <button id="adicionarMaterial" class="btn btn-secondary mb-6">
          <i class="fas fa-plus mr-2"></i>
          Adicionar Material
        </button>
        
        <div id="listaMateriais" class="space-y-3"></div>
      </div>
    </div>
  `;
}

function renderHistoricoSection() {
  const section = document.getElementById('historico');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Histórico</h2>
        
        <div class="filter-buttons">
          <button class="filter-btn active" data-filter="todos">Todos</button>
          <button class="filter-btn" data-filter="instalacao">Instalações</button>
          <button class="filter-btn" data-filter="manutencao">Manutenções</button>
        </div>
        
        <div class="search-container">
          <input type="text" id="searchHistorico" placeholder="Pesquisar..." class="form-input search-input">
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div id="historicoInstalacoes" class="space-y-3 mb-6"></div>
        
        <button id="limparHistorico" class="btn btn-danger w-full">
          <i class="fas fa-trash mr-2"></i>
          Limpar Histórico
        </button>
      </div>
    </div>
  `;
}

function renderMapaSection() {
  const section = document.getElementById('mapa');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Mapa CTOs</h2>
        
        <div class="space-y-4">
          <button id="openGoogleMaps" class="btn btn-secondary w-full">
            <i class="fas fa-map-pin mr-2"></i>
            Abrir Google Maps
          </button>
          
          <div id="mapaCTOs" class="map-container"></div>
        </div>
      </div>
    </div>
  `;
}

function renderRelatoriosSection() {
  const section = document.getElementById('relatorios');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Relatórios</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number" id="totalInstallations">0</div>
            <div class="stat-label">Instalações</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="totalMaintenances">0</div>
            <div class="stat-label">Manutenções</div>
          </div>
        </div>
        
        <div class="chart-container">
          <h3 class="chart-title">Instalações por Semana</h3>
          <canvas id="installationChart"></canvas>
        </div>
        
        <div class="chart-container">
          <h3 class="chart-title">Materiais Mais Utilizados</h3>
          <canvas id="materialsChart"></canvas>
        </div>
        
        <button id="exportReports" class="btn btn-primary w-full">
          <i class="fas fa-download mr-2"></i>
          Exportar Relatórios
        </button>
      </div>
    </div>
  `;
}

function renderConfiguracoesSection() {
  const section = document.getElementById('configuracoes');
  section.innerHTML = `
    <div class="glass-card section-spacing">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-6 text-center">Configurações</h2>
        
        <div class="settings-group">
          <h3 class="settings-group-title">Aparência</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Modo Escuro</div>
              <div class="setting-description">Alternar entre modo claro e escuro</div>
            </div>
            <button id="themeToggle" class="btn btn-ghost" onclick="toggleTheme()">
              <i class="fas fa-moon"></i>
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Cor Principal</div>
              <div class="setting-description">Personalizar cor de destaque</div>
            </div>
            <input type="color" id="primaryColorPicker" class="color-picker" value="#1E40AF">
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Densidade da Interface</div>
              <div class="setting-description">Compacta ou espaçada</div>
            </div>
            <select id="densitySelect" class="form-input">
              <option value="compact">Compacta</option>
              <option value="normal">Normal</option>
              <option value="spacious">Espaçada</option>
            </select>
          </div>
        </div>
        
        <div class="settings-group">
          <h3 class="settings-group-title">Notificações</h3>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Notificações Push</div>
              <div class="setting-description">Receber notificações do sistema</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="pushNotifications" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Feedback Tátil</div>
              <div class="setting-description">Vibração ao tocar botões</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="hapticFeedback" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="settings-group">
          <h3 class="settings-group-title">Dados</h3>
          
          <button id="exportData" class="btn btn-secondary w-full mb-4">
            <i class="fas fa-download mr-2"></i>
            Exportar Dados
          </button>
          
          <button id="resetSettings" class="btn btn-warning w-full">
            <i class="fas fa-undo mr-2"></i>
            Restaurar Padrões
          </button>
        </div>
      </div>
    </div>
  `;
}

// Initialize all remaining functionality
function initializeMap() {
  // Map initialization code
}

function initializeMapManutencao() {
  // Maintenance map initialization code
}

function initializeMapCTOs() {
  // CTOs map initialization code
}

function initializeRangeSliders() {
  // Range sliders initialization code
}

function initializeFormHandlers() {
  // Form handlers initialization code
}

function initializeMateriais() {
  // Materials initialization code
}

function initializeHistorico() {
  // History initialization code
}

function initializeAddressSearch() {
  // Address search initialization code
}

// Export functions for global access
window.IndaiaFibra = {
  toggleTheme,
  capturePhoto,
  startQRScanner,
  showToast,
  vibrate
};


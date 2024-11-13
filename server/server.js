const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();
const https = require('https');
const fs = require('fs');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://orient-metal-hr360.onrender.com'],
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const buildPath = path.join(__dirname, '../build');
console.log('Build path:', buildPath);

app.use(express.static(buildPath));

// Обновляем конфигурацию Google Sheets с правильным ID и названием листа
const SPREADSHEET_ID = '1z5jcNcq84jxdoRMsX54rV3e6hXKRRFJwUpR28ePFmh4';
const SHEET_NAME = 'Лист1';

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'credentials.json');
console.log('Credentials path:', credentialsPath);

const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

async function checkSheetAccess() {
  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    console.log('Successfully connected to spreadsheet:', metadata.data.properties.title);
    return true;
  } catch (error) {
    console.error('Error accessing spreadsheet:', error);
    return false;
  }
}

checkSheetAccess();

// Добавляем флаг для отслеживания обработки запроса
let isProcessing = false;

app.post('/api/save-results', async (req, res) => {
  try {
    // Проверяем, не обрабатывается ли уже запрос
    if (isProcessing) {
      console.log('Request is already processing, skipping...');
      return res.json({ success: true, duplicate: true });
    }

    isProcessing = true; // Устанавливаем флаг обработки
    
    console.log('Received data:', req.body);
    
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Создаем метку времени в нжном формате
    const now = new Date();
    // Устанавливаем часовой пояс Узбекистана (UTC+5)
    const uzDate = new Date(now.getTime() + (5 * 60 * 60 * 1000));
    
    const day = String(uzDate.getUTCDate()).padStart(2, '0');
    const month = String(uzDate.getUTCMonth() + 1).padStart(2, '0');
    const year = uzDate.getUTCFullYear();
    const hours = String(uzDate.getUTCHours()).padStart(2, '0');
    const minutes = String(uzDate.getUTCMinutes()).padStart(2, '0');
    
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
    
    // Форматируем данные для записи
    const newRow = [[
      req.body.company || '',              
      req.body.department || '',           
      req.body.position || '',             
      req.body.manager || '',              
      Number(req.body.communication || 0).toFixed(1),    
      Number(req.body.emotional || 0).toFixed(1),        
      Number(req.body.tasks || 0).toFixed(1),           
      `${Number(req.body.communicationPercent || 0).toFixed(1)}%`, 
      `${Number(req.body.emotionalPercent || 0).toFixed(1)}%`,    
      `${Number(req.body.tasksPercent || 0).toFixed(1)}%`,        
      Number(req.body.totalScore || 0).toFixed(1),          
      `${Number(req.body.totalPercent || 0).toFixed(1)}%`,  
      formattedDate
    ]];

    // Добавляем данные в конец таблицы
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: newRow
      }
    });

    console.log('Data written successfully:', response.data);
    res.json({ success: true, duplicate: false });
  } catch (error) {
    console.error('Error writing to sheet:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  } finally {
    // Сбрасываем флаг обработки в любом случае
    isProcessing = false;
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Добавляем эндпоинт для пинга
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Функция самопинга
const keepAlive = () => {
  setInterval(() => {
    fetch('https://orient-metal-hr360.onrender.com/ping')
      .then(() => console.log('Server pinged:', new Date().toISOString()))
      .catch(err => console.error('Ping failed:', err));
  }, 5 * 60 * 1000); // Пингуем каждые 5 минут
};

// Запускаем сервер и включаем самопинг
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
  keepAlive(); // Запускаем функцию самопинга
}); 
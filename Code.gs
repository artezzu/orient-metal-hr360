// Функция для проверки дубликатов
function isDuplicateEntry(sheet, data) {
  if (sheet.getLastRow() <= 1) return false; // Если только заголовки, то не дубликат
  
  const lastRow = sheet.getLastRow();
  const lastEntry = sheet.getRange(lastRow, 1, 1, 7).getValues()[0];
  
  return lastEntry[0] === data.company &&
         lastEntry[1] === data.department &&
         lastEntry[2] === data.position &&
         lastEntry[3] === data.manager &&
         lastEntry[4] === data.communication &&
         lastEntry[5] === data.emotional &&
         lastEntry[6] === data.tasks;
}

function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Лист1');
    Logger.log('Starting doPost execution');
    
    const data = JSON.parse(e.postData.contents);
    Logger.log('Received data:', data);

    // Проверяем на дубликаты
    if (isDuplicateEntry(sheet, data)) {
      Logger.log('Duplicate entry detected, skipping...');
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, duplicate: true })
      ).setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
    }

    // Создаем заголовки если их нет
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Компания',
        'Отдел',
        'Должность',
        'Руководитель',
        'Коммуникация (баллы)',
        'Устойчивость (баллы)',
        'Задачи (баллы)',
        'Коммуникация (33%)',
        'Устойчивость (33%)',
        'Задачи (33%)',
        'Общий балл',
        'Общий процент',
        'Дата'
      ]);
      
      // Форматируем заголовки
      const headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setBackground('#4a4a4a')
                 .setFontColor('#ffffff')
                 .setFontWeight('bold')
                 .setHorizontalAlignment('center')
                 .setVerticalAlignment('middle')
                 .setWrap(true);
      
      // Устанавливаем ширину столбцов
      sheet.setColumnWidths(1, 4, 150); // Текстовые столбцы
      sheet.setColumnWidths(5, 7, 120); // Баллы
      sheet.setColumnWidths(8, 10, 120); // Проценты
      sheet.setColumnWidth(11, 120); // Общий балл
      sheet.setColumnWidth(12, 120); // Общий процент
      sheet.setColumnWidth(13, 120); // Дата
      
      sheet.setFrozenRows(1);
    }

    // Записываем данные
    const rowData = [
      data.company,
      data.department,
      data.position,
      data.manager,
      data.communication,
      data.emotional,
      data.tasks,
      data.communicationPercent,
      data.emotionalPercent,
      data.tasksPercent,
      data.totalScore,
      data.totalPercent,
      new Date().toLocaleString('ru-RU')
    ];

    Logger.log('Writing row data:', rowData);
    sheet.appendRow(rowData);

    const lastRow = sheet.getLastRow();
    
    // Форматируем числовые значения
    const scoresRange = sheet.getRange(lastRow, 5, 1, 3); // Баллы
    const percentsRange = sheet.getRange(lastRow, 8, 1, 3); // Проценты
    const totalScoreRange = sheet.getRange(lastRow, 11, 1, 1); // Общий балл
    const totalPercentRange = sheet.getRange(lastRow, 12, 1, 1); // Общий процент
    
    // Форматируем баллы
    scoresRange.setNumberFormat('0.0')
               .setHorizontalAlignment('center')
               .setFontWeight('bold');
    
    // Форматируем проценты
    percentsRange.setNumberFormat('0.0"%"')
                 .setHorizontalAlignment('center')
                 .setFontWeight('bold');
    
    // Форматируем общие показатели
    totalScoreRange.setNumberFormat('0.0')
                   .setHorizontalAlignment('center')
                   .setFontWeight('bold')
                   .setBackground('#e6ffe6');
                   
    totalPercentRange.setNumberFormat('0.0"%"')
                     .setHorizontalAlignment('center')
                     .setFontWeight('bold')
                     .setBackground('#e6ffe6');

    // Добавляем чередующуюся подсветку строк
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, 13).setBackground('#f8f9fa');
    }

    // Добавляем границы
    sheet.getRange(1, 1, lastRow, 13).setBorder(true, true, true, true, true, true);

    Logger.log('Successfully wrote data to row:', lastRow);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true, duplicate: false })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);

  } catch (error) {
    Logger.log('Error in doPost:', error.toString());
    Logger.log('Error stack:', error.stack);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function doGet() {
  return ContentService.createTextOutput('Script is running').setMimeType(ContentService.MimeType.TEXT);
} 
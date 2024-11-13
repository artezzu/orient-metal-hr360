// Обновляем базовый URL API
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001'
  : 'https://orient-metal-hr360.onrender.com';

export const sendToGoogleSheets = async (data) => {
  try {
    console.log('Sending data to sheets:', data);

    // Получаем русские названия категорий для правильной записи
    const ruCategories = {
      'Aloqa': 'Коммуникация',
      'Emotsional intellekt': 'Эмоциональный интеллект',
      'Qaror qabul qilish': 'Принятие решений'
    };

    // Преобразуем узбекские названия в русские если нужно
    const getCategory = (category) => ruCategories[category] || category;

    // Получаем баллы и проценты из данных
    const scores = data.surveyAnswers.scores;
    const percentages = data.surveyAnswers.percentages;

    // Рассчитываем общий балл (максимум теперь 60 - по 20 баллов на категорию)
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    // Рассчитываем общий процент (среднее значение процентов всех категорий)
    const totalPercent = Object.values(percentages).reduce((sum, percent) => sum + percent, 0) / 3;

    const formattedData = {
      company: data.userInfo.company,
      department: data.userInfo.department,
      position: data.userInfo.position,
      manager: data.userInfo.manager,
      // Баллы (максимум 20 баллов на категорию)
      communication: scores[getCategory('Коммуникация')] || scores['Aloqa'],
      emotional: scores[getCategory('Эмоциональный интеллект')] || scores['Emotsional intellekt'],
      tasks: scores[getCategory('Принятие решений')] || scores['Qaror qabul qilish'],
      // Проценты (теперь до 100%)
      communicationPercent: percentages[getCategory('Коммуникация')] || percentages['Aloqa'],
      emotionalPercent: percentages[getCategory('Эмоциональный интеллект')] || percentages['Emotsional intellekt'],
      tasksPercent: percentages[getCategory('Принятие решений')] || percentages['Qaror qabul qilish'],
      // Общие показатели
      totalScore: totalScore,
      totalPercent: totalPercent
    };

    console.log('Formatted data for sheets:', formattedData);

    const response = await fetch(`${API_BASE_URL}/api/save-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData)
    });

    const result = await response.json(); // Получаем JSON ответ
    console.log('Response received:', result);

    return result; // Возвращаем объект с success
  } catch (error) {
    console.error('Error saving to sheet:', error);
    return false;
  }
}; 
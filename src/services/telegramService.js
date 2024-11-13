import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { allQuestions, categories } from '../components/Survey';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const TELEGRAM_BOT_TOKEN = '7043132886:AAE-d05j-IPS_DnCVoTZquOwVrj8eTKa_MQ';
const TELEGRAM_CHAT_ID = '-1002306505965';

const calculateResults = (answers) => {
  const results = {
    categories: [],
    total: {
      percentage: 0,
      score: 0
    }
  };
  
  // Подсчет по категориям
  for (let category = 0; category < 3; category++) {
    let categoryScore = 0;
    
    // Теперь у нас 4 вопроса в каждой категории
    for (let question = 0; question < 4; question++) {
      const answer = parseInt(answers[`screen${category}_question${question}`]);
      categoryScore += answer;
    }
    
    // Максимальный балл теперь 20 (4 вопроса * 5 баллов)
    const categoryPercentage = (categoryScore / 20) * 100;
    
    results.categories.push({
      score: categoryScore,
      percentage: categoryPercentage
    });

    results.total.score += categoryScore;
    results.total.percentage += categoryPercentage / 3; // Делим на 3 для среднего значения
  }

  // Используем категории напрямую из импортированного массива
  results.scores = {
    [categories.ru[0]]: results.categories[0].score,
    [categories.ru[1]]: results.categories[1].score,
    [categories.ru[2]]: results.categories[2].score
  };

  results.percentages = {
    [categories.ru[0]]: results.categories[0].percentage,
    [categories.ru[1]]: results.categories[1].percentage,
    [categories.ru[2]]: results.categories[2].percentage
  };

  return results;
};

export const sendToTelegram = async (data) => {
  try {
    console.log('Starting PDF generation for Telegram...');
    const pdfDoc = await generatePDF(data);
    const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
    
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', pdfBlob, 'survey_results.pdf');
    
    console.log('Sending to Telegram...');
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    console.log('Successfully sent to Telegram');
    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
};

const generatePDF = async (data) => {
  const { userInfo, surveyAnswers } = data;
  
  // Принудительно используем русский язык для PDF
  const language = 'ru';
  
  const answers = typeof surveyAnswers === 'string' ? JSON.parse(surveyAnswers) : surveyAnswers;
  const results = calculateResults(answers.answers || answers);
  
  const docDefinition = {
    content: [
      {
        text: 'Результаты опроса',
        style: 'header'
      },
      {
        text: '\n'
      },
      {
        text: [
          { text: 'Руководитель: ', bold: true },
          userInfo.manager,
          '\n',
          { text: 'Отдел: ', bold: true },
          userInfo.department,
          '\n',
          { text: 'Должность: ', bold: true },
          userInfo.position,
          '\n',
          { text: 'Компания: ', bold: true },
          userInfo.company || '-'
        ]
      },
      {
        text: '\n\n'
      },
      ...categories[language].map((category, categoryIndex) => [
        {
          text: category,
          style: 'categoryHeader'
        },
        ...allQuestions[language][categoryIndex].map((question, questionIndex) => {
          const answerValue = parseInt(answers.answers[`screen${categoryIndex}_question${questionIndex}`]);
          const rating = ['Очень плохо', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Отлично'][answerValue - 1];
          
          return {
            text: [
              { text: `${questionIndex + 1}. ${question}\n`, style: 'question' },
              { text: `Ответ: ${rating} (${answerValue} балл(ов))\n`, style: 'answer' }
            ],
            margin: [0, 0, 0, 10]
          };
        }),
        {
          text: [
            'Итого по категории: ',
            `${results.categories[categoryIndex].score} баллов `,
            `(${results.categories[categoryIndex].percentage.toFixed(1)}%)\n\n`
          ],
          style: 'categoryTotal'
        }
      ]).flat(),
      {
        text: [
          '\nОБЩИЙ РЕЗУЛЬТАТ:\n',
          `Общие баллы: ${results.total.score}/45\n`,
          `Общий процент: ${results.total.percentage.toFixed(1)}%`
        ],
        style: 'total'
      },
      {
        text: new Date().toLocaleString('ru-RU'),
        alignment: 'right',
        fontSize: 10,
        margin: [0, 20, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      categoryHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#2196f3'
      },
      question: {
        fontSize: 12,
        margin: [0, 5, 0, 2]
      },
      answer: {
        fontSize: 12,
        margin: [20, 0, 0, 5],
        color: '#666666'
      },
      categoryTotal: {
        fontSize: 12,
        bold: true,
        margin: [0, 5, 0, 15]
      },
      total: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 0]
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  return new Promise((resolve) => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
      resolve(buffer);
    });
  });
}; 
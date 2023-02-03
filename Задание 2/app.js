const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let results = [];
fs.createReadStream('Показания.csv')
   .pipe(csv({ separator: ';' }))
   .on('data', (data) => results.push(data))
   .on('end', () => {
      // ============================= Задание 2.1 =========================================================
      let task1 = results.slice(0);
      task1.map(function (e, i) {
         e['Апрель-Май'] = +e.Апрель + +e.Май;
         e['Май-Июнь'] = +e.Май + +e.Июнь;
         e['№ строки'] = i + 1; // Иначе столбец '№ строки' в файле Начисления_абоненты.csv почему-то пустой
      });
      const csvWriter = createCsvWriter({
         path: 'Потребление.csv',
         header: [
            { id: '№ строки', title: '№ строки' },
            { id: 'Улица', title: 'Улица' },
            { id: '№ дома', title: '№ дома' },
            { id: '№ Квартиры', title: '№ Квартиры' },
            { id: 'Апрель', title: 'Апрель' },
            { id: 'Май', title: 'Май' },
            { id: 'Июнь', title: 'Июнь' },
            { id: 'Апрель-Май', title: 'Апрель-Май' },
            { id: 'Май-Июнь', title: 'Май-Июнь' },
         ],
         fieldDelimiter: ';',
      });
      csvWriter.writeRecords(task1);
      // =====================================================================================================

      // ============================ Задание 2.2 ============================================================
      let houses = [
         ...new Set(task1.slice(0).map((e) => e.Улица + ' ' + e['№ дома'])),
      ];
      let task2 = [];
      let months = ['Апрель-Май', 'Май-Июнь', 'Апрель', 'Май', 'Июнь'];
      let number = 1;
      houses.forEach(function (house) {
         let val = [];
         months.forEach(function (month) {
            let sum = 0;
            let total = 0;
            task1.forEach(function (pok) {
               if (
                  pok.Улица + ' ' + pok['№ дома'] == house &&
                  pok['№ Квартиры'] != 0
               ) {
                  sum += +pok[month];
               }
               if (
                  pok.Улица + ' ' + pok['№ дома'] == house &&
                  pok['№ Квартиры'] == 0
               ) {
                  total = +pok[month];
               }
            });
            sum == total
               ? val.push('Данные сходятся')
               : val.push('Данные не сходятся');
         });
         task2.push({
            '№ строки': number,
            Улица: house.split(' ')[0],
            '№ дома': house.split(' ')[1],
            [months[0]]: val[0],
            [months[1]]: val[1],
            [months[2]]: val[2],
            [months[3]]: val[3],
            [months[4]]: val[4],
         });
         number++;
      });
      console.log(task2);
      const csvWriter2 = createCsvWriter({
         path: 'Правильность_показаний.csv',
         header: [
            { id: '№ строки', title: '№ строки' },
            { id: 'Улица', title: 'Улица' },
            { id: '№ дома', title: '№ дома' },
            { id: 'Апрель-Май', title: 'Апрель-Май' },
            { id: 'Май-Июнь', title: 'Май-Июнь' },
            { id: 'Апрель', title: 'Апрель' },
            { id: 'Май', title: 'Май' },
            { id: 'Июнь', title: 'Июнь' },
         ],
         fieldDelimiter: ';',
      });
      csvWriter2.writeRecords(task2);
   });

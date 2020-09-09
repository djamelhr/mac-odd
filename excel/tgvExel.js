const Excel = require('exceljs');

const excelSheets = async (data) => {
    console.log(data);
    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(`Race Card`);
    const worksheet2 = workbook.addWorksheet(`tables`);
    const worksheet3 = workbook.addWorksheet(`probables`);
    const worksheet4 = workbook.addWorksheet(`quickresults`);
    const headRaceCard = ["Hourse Number", "race-current-odds", "M/L", "horse-name", "Age", "gender", "sire-dam", "owner-name", "Med", "Trainer", "Weight", "Jockey"];
    data[0].race.unshift(headRaceCard)
    worksheet.addRows(data[0].race)
    // worksheet.addTable({
    //     name: 'raceCard',
    //     ref: 'A1',
    //     headerRow: true,
    //     style: {

    //         showRowStripes: true,
    //     },
    //     columns: [
    //         { name: 'Hourse Number' },
    //         { name: 'race-current-odds' },
    //         { name: 'M/L' },
    //         { name: 'horse-name' },
    //         { name: 'Age' },
    //         { name: 'gender' },
    //         { name: 'sire-dam' },
    //         { name: 'by' },
    //         { name: 'owner-name' },
    //         { name: 'Med' },
    //         { name: 'Trainer' },
    //         { name: 'Weight' },
    //         { name: 'Jockey' },

    //     ],
    //     rows: data[0].race[0]
    // });
    worksheet.getColumn(1).width = 3;
    worksheet.getColumn(2).width = 14;
    worksheet.getColumn(3).width = 4;
    worksheet.getColumn(4).width = 7;
    worksheet.getColumn(5).width = 27;
    worksheet.getColumn(6).width = 7;
    worksheet.getColumn(7).width = 25;


    // worksheet.addRows(raceCard[0]);

    worksheet2.addRows(data[0].racePays);
    worksheet2.addRows([[" ", " ", " ", " "]]);

    worksheet2.addRows(data[0].racePools);


    // if (data[0].pools[0] == "There are no pools availiable") { worksheet2.addRow(data[0].pools) } else {
    //     worksheet2.addTable({
    //         name: 'pools',
    //         ref: 'A1',
    //         headerRow: false,

    //         style: {

    //             showRowStripes: true,
    //         },
    //         columns: [
    //             { name: 'ALL' },
    //             { name: 'Name' },
    //             { name: 'Win' },
    //             { name: 'Place' },
    //             { name: 'Show' },

    //         ],
    //         rows: data[0].pools[0]
    //     });

    // };
    // worksheet2.getColumn(3).numFmt = '"$"#,##0.00;[Red]\-"£"#,##0.00';
    // worksheet2.getColumn(3).width = 15

    // if (data[0].pays[0] == "There are no will pays available.") { worksheet2.addRow(data[0].pays) } else { worksheet2.addRows(data[0].pays[0]), worksheet2.addRows(data[0].pays[1]) }
    if (data[0].probables[0] == "There are no probables available") { worksheet3.addRow(data[0].probables) } else { worksheet3.addRows(data[0].probables[0]) };
    worksheet4.addRows(data[0].quickresults);

    return workbook
}


module.exports = {
    excelSheets

}

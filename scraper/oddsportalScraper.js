const moment = require("moment");
const oddsportal = async (page) => {

    const results = [];


    results.push(await extractedEvaluateCall(page))

    return results;
}


async function extractedEvaluateCall(page) {
    try {
        const resultOdds = await page.evaluate(() => {
            const rows = document.querySelectorAll(".table-main");
            return Array.from(rows, (row) => {
                const columns = row.querySelectorAll("tr");
                return Array.from(columns, (column) => {
                    const cols = column.querySelectorAll(
                        "td.odds-nowrp,td.center.info-value,td.name.table-participant"
                    );
                    return Array.from(cols, (col) => col.innerText.trim());
                });
            });
        });
        const arr = resultOdds[0].filter(String);
        let sheetArray = [];
        let newArray = [];
        arr.map((ar) => {
            let [match, one, X, two, Bs] = ar;
            sheetArray.push([
                match,
                Bs,
                one,
                X,
                two,
                moment().format("dddd:HH:mm"),
            ]);
            ar = {
                match: match,
                bs: Bs,
                one: one,
                x: X,
                two: two,
                scrapingDate: moment().format("dddd:HH:mm"),
            };

            newArray.push(ar);
        });
        return {
            newArray,
            sheetArray
        }
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    oddsportal

}
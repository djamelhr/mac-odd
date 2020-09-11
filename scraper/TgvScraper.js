
let probables = [];
let quickresults = [];

let sticky = [];
const tvg = async (pageH) => {

    const results = [];

    results.push(await extractedEvaluateCall(pageH));
    return results;
}

async function extractedEvaluateCall(pageH) {
    try {

        quickresults = await pageH.evaluate(() => {
            const rows2 = document.querySelectorAll(".race-results tr");
            return Array.from(rows2, (row8) => {
                const columnsH1 = row8.querySelectorAll("th,td");
                return Array.from(columnsH1, (col) => col.innerText)
            });
        });
        if (quickresults.length == 0) {
            quickresults.push(['racing runing'])
        }

        const racePools = await pageH.evaluate(() => {
            let trs

            if (document.querySelectorAll("div.message-container.text-align-center p")[1] === undefined) {
                trs = Array.from(document.querySelectorAll("div.result-runners-table.pools-table .tr"));
                return trs.map(tr => {
                    return [
                        tr.querySelector('span.label').textContent,
                        tr.querySelectorAll('span.amounts.text-centered.td')[0].textContent,
                        tr.querySelectorAll('span.amounts.text-centered.td')[1].textContent,
                        tr.querySelectorAll('span.amounts.text-centered.td')[2].textContent

                    ]
                })
            } else {
                return trs = [["no pools"]]


            }

        });

        const racePays = await pageH.evaluate(() => {
            let pys
            if (document.querySelectorAll("div.message-container.text-align-center p")[0] === undefined) {
                pys = Array.from(document.querySelectorAll("div.pcontainer div.result-runners-table")[0].querySelectorAll('.tr'));
                return pys.map(pay => {
                    return [
                        pay.querySelector("span.horse-id").innerText,
                        pay.querySelector("span.amounts.text-centered.td").innerText,

                    ]
                })
            } else {
                return pys = [["no pays"]]
            }
        });


        const race = await pageH.evaluate(() => {
            const trs = Array.from(document.querySelectorAll("tr.program-page-runner"));
            return trs.map(link => {
                if (link.querySelector('strong.race-scratched-runners')) {
                    return [
                        " ",
                        " ",
                        " ",
                        link.querySelector('strong.h5').textContent,

                        link.querySelectorAll(".horse-info-cell span")[0].textContent,

                        link.querySelectorAll(".horse-info-cell span")[1].textContent,

                        link.querySelectorAll(".horse-info-cell span")[2].textContent,

                        link.querySelector("div.text-overflow").innerText,
                        " ",
                        " ",
                        " ",
                        " ",
                    ]
                }
                return [
                    link.querySelector('td.horse-number-column').textContent,

                    link.querySelector('strong.race-current-odds').textContent,

                    link.querySelector('span.race-morning-odds').textContent,

                    link.querySelector('strong.h5').textContent,

                    link.querySelectorAll(".horse-info-cell span")[0].textContent,

                    link.querySelectorAll(".horse-info-cell span")[1].textContent,

                    link.querySelectorAll(".horse-info-cell span")[2].textContent,

                    link.querySelector("div.text-overflow").innerText,

                    link.querySelectorAll("td.handicap-value__med-weight")[0].textContent,
                    link.querySelectorAll("td.handicap-value__jockey-trainer")[0].innerText,

                    link.querySelectorAll("td.handicap-value__med-weight")[1].textContent,
                    link.querySelectorAll("td.handicap-value__jockey-trainer")[1].innerText,
                ]

            })
        })
        const keyn = await pageH.evaluate(() => {
            let bol = false
            if (document.querySelector('.race-scratched-runners')) {
                return bol = true
            }

        });


        let probablesEmpty = await pageH.$('p.probables-empty-msg');
        if (probablesEmpty) {
            let prob = await (await probablesEmpty.getProperty('textContent')).jsonValue();
            probables.push([[prob]]);
        } else {
            probables = await pageH.evaluate(() => {
                const rows1 = document.querySelectorAll("div.probables-table");
                return Array.from(rows1, (row) => {
                    const columnsH = row.querySelectorAll("div.probables-row");
                    return Array.from(columnsH, (column) => {
                        const colsH = column.querySelectorAll("span.probables-cell");
                        return Array.from(colsH, (col) => Number(col.innerText.match(/\d+$/)) || col.innerText);
                    });
                });
            });
            sticky = await pageH.evaluate(() => {
                const rows1 = document.querySelectorAll("div.sticky-col");
                return Array.from(rows1, (row) => {
                    const colsH = row.querySelectorAll("span.sticky-cell");
                    return Array.from(colsH, (col) => Number(col.innerText.match(/\d+$/)) || col.innerText);
                });

            });
            probables[0].map((r, index) => {
                r.unshift(sticky[0][index])
            })
        }

        let arrVal = [];
        if (racePays.length === 1 && racePools.length === 1) {
            race.map((r, i) => {
                arrVal.push(r)

            });
        } else if (racePays.length === 1 && racePools.length !== 1) {
            race.map((r, i) => {
                arrVal.push(r.concat([""], [""], racePools[i]))
            });
        } else if (racePays.length !== 1 && racePools.length === 1) {
            race.map((r, i) => {
                arrVal.push(r.concat(racePays[i]))
            });
        } else {
            race.map((r, i) => {
                arrVal.push(r.concat(racePays[i], racePools[i]))
            });
        }

        return {
            probables,
            quickresults,
            keyn,
            arrVal,
            race,
            racePays,
            racePools

        }
    } catch (error) {
        console.log(error);
    }

}


module.exports = {
    tvg

}
let pays = [];
let pools = [];
let probables = [];
let quickresults = [];
let raceCard = [];
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
            quickresults.push('racing runing')
        }
        // let paysAndPool = await pageH.evaluate(() => {
        //     const arraypool = document.querySelectorAll("div.message-container.text-align-center");
        //     return Array.from(arraypool, (poolpays) => poolpays.innerText)
        // });


        // if (paysAndPool.includes("There are no will pays available.")) {
        //     pays.push("There are no will pays available.");
        // } else {
        //     pays = await pageH.evaluate(() => {
        //         const rowsH = document.querySelectorAll(".column");
        //         return Array.from(rowsH, (row) => {
        //             const columnsH = row.querySelectorAll("runner-amounts.tr");
        //             return Array.from(columnsH, (column) => {
        //                 const colsH = column.querySelectorAll("span.text-centered.td.chicklet , span.amounts.text-centered.td");
        //                 return Array.from(colsH, (col) => Number(col.innerText.match(/\d+$/)) || col.innerText);
        //             });
        //         });
        //     });
        // }



        // if (paysAndPool.includes('There are no pools availiable')) {
        //     pools.push('There are no pools availiable');
        // } else {
        //     pools = await pageH.evaluate(() => {
        //         const rowsH = document.querySelectorAll("div.result-runners-table.pools-table");
        //         return Array.from(rowsH, (row) => {
        //             const columnsH = row.querySelectorAll("div.header.totals,runner-amounts.tr");
        //             return Array.from(columnsH, (column) => {
        //                 const colsH = column.querySelectorAll(".td");
        //                 return Array.from(colsH, (col) => Number(col.innerText.replace(/[^0-9]/g, "")) || col.innerText);
        //             });
        //         });
        //     });
        // }
        const racePools = await pageH.evaluate(() => {
            let trs

            if (document.querySelectorAll("div.message-container.text-align-center p")[1] === undefined) {
                trs = Array.from(document.querySelectorAll("div.result-runners-table.pools-table .tr"));
                return trs.map(tr => {
                    return [
                        tr.querySelector('span.label').textContent,
                        tr.querySelector('span.td.name').textContent,
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
                        pay.querySelector("span.td.name").innerText,
                        pay.querySelector("span.amounts.text-centered.td").innerText,

                    ]
                })
            } else {
                return pys = [["no pays"]]
            }
        });

        //  await pageH.waitForSelector("table.race-handicapping-results");
        // raceCard = await pageH.evaluate(() => {

        //     const rows1 = document.querySelectorAll("table.race-handicapping-results");
        //     return Array.from(rows1, (row) => {
        //         const columnsH = row.querySelectorAll("tr");
        //         return Array.from(columnsH, (column) => {
        //             const colsH = column.querySelectorAll("td div.horse-number-sign,strong.h5 ,strong.race-current-odds,span.race-morning-odds ,div.horse-info-cell span,td.handicap__value");
        //             return Array.from(colsH, (col) => col.textContent);
        //         });
        //     });
        // });
        // // const headRaceCard = ["Hourse Number", "race-current-odds", "M/L", "horse-name", "Age", "gender", "sire-dam", "by", "owner-name", "Med", "Trainer", "Weight", "Jockey"];
        // raceCard[0].pop();
        // raceCard[0].shift();
        //   raceCard[0].unshift(headRaceCard)
        //  raceCard[0].unshift(["#", "Odds", "Horse Details", "Med", "Trainer", "Weight", "Jockey"])

        //race-results-header
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

        })
        let probablesEmpty = await pageH.$('p.probables-empty-msg');
        if (probablesEmpty) {
            probables.push(await (await probablesEmpty.getProperty('textContent')).jsonValue());
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

        return {
            probables,
            quickresults,
            keyn,
            race,
            racePools,
            racePays

        }
    } catch (error) {
        console.log(error);
    }

}


module.exports = {
    tvg

}

const scrape = async (page, league) => {

    //   await page.goto('https://www.masseyratings.com/dls/ukraine-premier/games', { waitUntil: 'networkidle2' });
    const results = []
    console.log(league);


    results.push(await extractedEvaluateCall(page, league));




    return results;

}

const regex = /@/gi;
async function extractedEvaluateCall(page, league) {
    try {
        // , p.address
        let name = await page.evaluate(() => {
            const trs = document.querySelectorAll('table.mytable tr')
            return Array.from(trs, (tr) => {
                const tds = tr.querySelectorAll('td');
                return Array.from(tds, td => td.innerText.trim().replace(/\n/gi, ' - '))
            })
        });



        const date = await page.evaluate(() => {
            const btn = document.querySelector('.ui-datepicker-trigger').innerText
            return btn
        })
        let teams = await page.evaluate(() => {
            const trs = document.querySelectorAll('table.mytable tr')
            return Array.from(trs, (tr) => {
                const tds = tr.querySelectorAll('td.fteam a');
                return Array.from(tds, td => td.innerText)
            })
        });

        teams.shift();
        name.shift();



        name.map((v, index) => {

            v[1] = teams[index][0]
            v[0] = date + ' ' + v[0];
            v.splice(2, 0, teams[index][1].replace(regex, "").trim());
            v.unshift(league);


        });

        return {
            name,
            date
        }

    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    scrape

}
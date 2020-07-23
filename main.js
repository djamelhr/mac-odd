const path = require("path");
const url = require("url");
const { google, logging_v2 } = require("googleapis");
const moment = require("moment");
const keys = require("./keys.json");
const { app, BrowserWindow, ipcMain, ipcRenderer, shell } = require("electron");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");
const Excel = require('exceljs');



var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, 'dev.sqlite3')
  }
});


//const sheet = workbook.addWorksheet('My Sheet');
let mainWindow;
let win;
let window;
let isDev = false;
let Lastfile

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  isDev = true;
}
pie.initialize(app);

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  win = new BrowserWindow({
    width: 800,
    height: 800,
    show: false,
    parent: mainWindow,
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  let indexPath;
  let lastPath = "";
  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      hash: "baz",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      hash: "baz",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);
  // win.loadURL(indexPath);
  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", async () => {
    mainWindow.show();

    //  let djo = await knex('todos').select("*");
    //    console.log(djo);

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (mainWindow = null));

  ipcMain.on("mainWindowLoaded", function () {
    let result = knex.select("*").from("links").orderBy('created_at', 'desc');
    result.then(function (rows) {
      mainWindow.webContents.send("resultSent", rows);
    })

  });
  ipcMain.on("pup", async (e, arg) => {


    try {
      let browser = await pie.connect(app, puppeteer);
      const url = `https://www.oddsportal.com/matches/soccer/${arg}`;
      await win.loadURL(url);
      const page = await pie.getPage(browser, win);
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
      //win.hide();




      //gooogle
      const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      client.authorize((err, tokens) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("connected");
          gsrun(client);
        }
      });
      async function gsrun(cl) {
        const gsapi = google.sheets({ version: "v4", auth: cl });
        // const opt ={
        //     spreadsheetId : '1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc' ,
        //     range : 'odds!A1:E5'
        // };
        // let val = await gsapi.spreadsheets.values.get(opt);
        // console.log(val.data.values);

        const updateOpt = {
          spreadsheetId: "1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc",
          range: "odds!A2:O",
          valueInputOption: "USER_ENTERED",
          resource: { values: sheetArray },
        };
        let result = await gsapi.spreadsheets.values.append(
          updateOpt,
          (err, response) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log("send IT !");
          }
        );
      }
      mainWindow.webContents.send("allMatchs", newArray);
    } catch (error) {
      console.log(error);
    }
  });
  // ipcMain.on("stopHorses", async (e, arg) => {
  //   console.log(arg);

  //   i = -1;
  // });

  ipcMain.on("addWorkBook", async (e, arg) => {
    const workbook = new Excel.Workbook();
    let index = arg.lastIndexOf("/");
    let fileName1 = arg.substr(index)
    let fileName = fileName1.replace(/[^a-z0-9]/gi, '');

    await workbook.xlsx.writeFile(`${fileName}.xlsx`);
    await knex('links').insert({
      link: __dirname + '\\' + `${fileName}.xlsx`,
      created_at: knex.fn.now()
    })
    let allLinks = await knex("links").select('*').orderBy('created_at', 'desc');
    console.log(allLinks);

    await mainWindow.webContents.send('workBook', allLinks);

  });

  ipcMain.on('openFile', async (e, arg) => {
    shell.openPath(arg);
  })
  let i = 0;

  ipcMain.on("horses", async (e, arg) => {
    //nemmodo hneya 
    const workbook = new Excel.Workbook();
    let index = arg.link.lastIndexOf("/");
    let fileName1 = arg.link.substr(index)
    let fileName = fileName1.replace(/[^a-z0-9]/gi, '');




    try {
      let horsesbrowser = await pie.connect(app, puppeteer);
      const URL = arg.link;

      window = new BrowserWindow({ parent: mainWindow });
      await window.loadURL(URL);
      const pageH = await pie.getPage(horsesbrowser, window);
      await pageH.waitFor(500);
      let paysAndPool = await pageH.evaluate(() => {
        const arraypool = document.querySelectorAll("div.message-container.text-align-center");
        return Array.from(arraypool, (poolpays) => poolpays.innerText)
      });

      let pays = [];
      if (paysAndPool.includes("There are no will pays available.")) {
        pays.push("There are no will pays available.");
      } else {
        pays = await pageH.evaluate(() => {
          const rowsH = document.querySelectorAll(".column");
          return Array.from(rowsH, (row) => {
            const columnsH = row.querySelectorAll("runner-amounts.tr");
            return Array.from(columnsH, (column) => {
              const colsH = column.querySelectorAll("span.text-centered.td.chicklet , span.amounts.text-centered.td");
              return Array.from(colsH, (col) => Number(col.innerText.match(/\d+$/)) || col.innerText);
            });
          });
        });
      }




      console.log(paysAndPool);

      let pools = []

      if (paysAndPool.includes('There are no pools availiable')) {
        pools.push('There are no pools availiable');
      } else {
        pools = await pageH.evaluate(() => {
          const rowsH = document.querySelectorAll("div.result-runners-table.pools-table");
          return Array.from(rowsH, (row) => {
            const columnsH = row.querySelectorAll("div.header.totals,runner-amounts.tr");
            return Array.from(columnsH, (column) => {
              const colsH = column.querySelectorAll(".td");
              return Array.from(colsH, (col) => Number(col.innerText.replace(/[^0-9]/g, "")) || col.innerText);
            });
          });
        });
      }




      // let quickresultsEmpty = await pageH.$('div.race-results-header');
      // if (!quickresultsEmpty) {
      //   quickresults.push("race results unavailable ");
      // } else {
      //   console.log();

      const quickresults = await pageH.evaluate(() => {
        const rows2 = document.querySelectorAll(".race-results tr.runner");
        return Array.from(rows2, (row8) => {
          const columnsH1 = row8.querySelectorAll("td");
          return Array.from(columnsH1, (col) => Number(col.innerText.match(/\d+$/)) || col.innerText)
        });
      });

      console.log("quiq !!!!!!!", quickresults);
      await pageH.waitForSelector("table.race-handicapping-results");
      const raceCard = await pageH.evaluate(() => {
        const rows1 = document.querySelectorAll("table.race-handicapping-results");
        return Array.from(rows1, (row) => {
          const columnsH = row.querySelectorAll("tr");
          return Array.from(columnsH, (column) => {
            const colsH = column.querySelectorAll("td");
            return Array.from(colsH, (col) => Number(col.innerText.match(/\d+$/)) || col.innerText);
          });
        });
      });
      raceCard[0].pop();
      raceCard[0].shift();
      //  raceCard[0].unshift(["#", "Odds", "Horse Details", "Med", "Trainer", "Weight", "Jockey"])

      //race-results-header
      let probables = []
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
      }
      //  let data = [];
      //    data.push(quickresults, raceCard[0], probables[0], pays[0], pools[0])



      const worksheet = workbook.addWorksheet(`Race Card`);
      const worksheet2 = workbook.addWorksheet(`tables`);
      const worksheet3 = workbook.addWorksheet(`probables`);
      const worksheet4 = workbook.addWorksheet(`quickresults`);



      // worksheet.properties.defaultColWidth = 20;
      worksheet.addTable({
        name: 'raceCard',
        ref: 'A1',
        headerRow: true,
        style: {

          showRowStripes: true,
        },
        columns: [
          { name: '#' },
          { name: 'Odds' },
          { name: 'Horse Details', },
          { name: 'Med' },
          { name: 'Trainer', filterButton: true },
          { name: 'Weight' },
          { name: 'Jockey', filterButton: true },

        ],
        rows: raceCard[0]
      });
      worksheet.getColumn(1).width = 3;
      worksheet.getColumn(2).width = 14;
      worksheet.getColumn(3).width = 115;
      worksheet.getColumn(4).width = 7;
      worksheet.getColumn(5).width = 27;
      worksheet.getColumn(6).width = 7;
      worksheet.getColumn(7).width = 25;

      console.log(pays);
      console.log(quickresults);
      //  worksheet.addRows(raceCard[0]);

      if (pools[0] == "There are no pools availiable") { worksheet2.addRow(pools) } else {
        worksheet2.addTable({
          name: 'pools',
          ref: 'A1',
          headerRow: false,

          style: {

            showRowStripes: true,
          },
          columns: [
            { name: 'ALL', filterButton: true, },
            { name: 'Name', filterButton: true, },
            { name: 'Win', filterButton: true, },
            { name: 'Place', filterButton: true, },
            { name: 'Show', filterButton: true, },

          ],
          rows: pools[0]
        });

      };
      worksheet2.getColumn(3).numFmt = '"$"#,##0.00;[Red]\-"£"#,##0.00';
      worksheet2.getColumn(3).width = 15

      if (pays[0] == "There are no will pays available.") { worksheet2.addRow(pays) } else { worksheet2.addRows(pays[0]), worksheet2.addRows(pays[1]) }
      if (probables[0] == "There are no probables available") { worksheet3.addRow(probables) } else { worksheet3.addRows(probables[0]) };
      worksheet4.addRows(quickresults);

      console.log("pays", pays[0]);
      console.log("ppoom", pools);


      // worksheet.addRows(raceCard[0]);
      // worksheet.addRows(probables[0]);
      // worksheet.addRows(pays[0]);
      // worksheet.addRows(pools[0])
      //quickresults[0].map(res => worksheet.addRow(res))
      // raceCard[0].map(res => worksheet.addRow(res))
      // pays[0].map(res => worksheet.addRow(res))
      // pools[0].map(res => worksheet.addRow(res))
      // probables[0].map(res => worksheet.addRow(res))








      await knex('links').insert({
        link: __dirname + '\\' + `${fileName}.xlsx`,
        created_at: knex.fn.now()
      })

      let lfile = await knex.select('link').from('links').orderBy('created_at', 'desc').limit(1);



      let allLinks = await knex("links").select('*').orderBy('created_at', 'desc');
      await mainWindow.webContents.send('workBook', allLinks);

      // Add row using key mapping to columns






      // worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970, 1, 1)});
      // worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7)});
      await workbook.xlsx.writeFile(lfile[0].link).then(() => {

        console.log(arg.j);

      });







      mainWindow.webContents.send("horses", { resultH, resultHorses });
      // mainWindow.webContents.send("stay", {i ,URL});

      window.destroy();
      mainWindow.reload();
    } catch (error) {
      console.log(error);
    }

  });
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;

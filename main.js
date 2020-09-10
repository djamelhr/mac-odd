const path = require("path");
const fs = require('fs')
const url = require("url");
const { app, BrowserWindow, ipcMain, ipcRenderer, shell } = require("electron");
require('electron-reload')(__dirname);
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");
const Excel = require('exceljs');
const { excelSheets } = require("./excel/tgvExel")
const googleApi = require('./googleApi');
const googleApinsert = require('./googleApinsert');
const googleApiClear = require('./googleApiClear');
const { scrape } = require('./scraper/masseyScraper');
const { oddsportal } = require('./scraper/oddsportalScraper');
const { tvg } = require('./scraper/TgvScraper');
const tgvExel = require("./excel/tgvExel");





var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, 'dev.sqlite3')
  }
});


//const sheet = workbook.addWorksheet('My Sheet');
let mainWindow;
let win;
let winKo
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

  ipcMain.on("mainWindowLoaded", async (e, arg) => {
    e.preventDefault();
    let result = await knex.select("*").from("links").orderBy('created_at', 'desc');
    let leagues = await knex.select("*").from("leagues");
    let recentSearch = await knex('leagues').select("*").orderBy("last_scraping", 'desc').limit(10);
    let recentDate = await knex('oddsport').select("*").orderBy("created_at", 'desc').limit(10);
    // let recentleagues = await knex.select("*").from("recent_league").orderBy('created_at', 'desc');


    let rows = {
      result,
      leagues,
      recentSearch,
      recentDate
    }
    mainWindow.webContents.send("resultSent", rows);


  });

  ipcMain.on("addItem", async (e, arg) => {
    e.preventDefault();
    await knex("leagues").insert({ "name": arg });
  })
  // Masseya


  ipcMain.on('masseya', async (e, arg) => {

    try {
      const league = arg
      await knex("leagues").update({
        "last_scraping": knex.fn.now(),
      }).where("name", league)
      // const recentSearch = await knex('leagues').select("*").orderBy("last_scraping", 'desc');
      let masseybrowser = await pie.connect(app, puppeteer);
      winKo = new BrowserWindow({ parent: mainWindow, show: false, });
      await winKo.loadURL(`https://www.masseyratings.com/dls/${arg}/games`);
      const pageM = await pie.getPage(masseybrowser, winKo);
      const value = await scrape(pageM, arg)
      console.log(value[0].name);
      const updateOptMassey = {
        spreadsheetId: "1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc",
        range: "massey!A2:N",
        valueInputOption: "USER_ENTERED",
        resource: { values: value[0].name },
      };
      googleApi(updateOptMassey);
      await mainWindow.webContents.send("leaguesGames", {
        "leagueTable": value[0].name,

      });
      winKo.destroy();

    } catch (error) {
      console.log(error);
    }

  });
  ipcMain.on("pup", async (e, arg) => {
    console.log(arg);

    try {
      await knex('oddsport').insert({
        date: arg.matchDay,
        created_at: knex.fn.now()
      })
      let browser = await pie.connect(app, puppeteer);
      const url = `https://www.oddsportal.com/matches/soccer/${arg.link}`;
      await win.loadURL(url);
      const page = await pie.getPage(browser, win);

      await oddsportal(page).then(odds => {
        const updateOpt = {
          spreadsheetId: "1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc",
          range: "odds!A2:O",
          valueInputOption: "USER_ENTERED",
          resource: { values: odds[0].sheetArray },
        };
        googleApi(updateOpt);
        mainWindow.webContents.send("allMatchs", odds[0].newArray);
      })
      //win.hide();
    } catch (error) {
      console.log(error);
    }
  });
  // ipcMain.on("stopHorses", async (e, arg) => {
  //   console.log(arg);

  //   i = -1;
  // });

  ipcMain.on("addWorkBook", async (e, arg) => {
    console.log(arg);
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
    console.log(arg);
    let index = arg.link.lastIndexOf("/");
    let fileName1 = arg.link.substr(index)

    let fileName = fileName1.replace(/[^a-z0-9]/gi, '');
    let name = fileName
    name = name.split('');
    name.splice(name.length - 5, 0, " ")
    const newName = name.join('')

    try {
      let horsesbrowser = await pie.connect(app, puppeteer);
      const URL = arg.link;

      window = new BrowserWindow({ parent: mainWindow, show: false, });
      await window.loadURL(URL);
      const pageH = await pie.getPage(horsesbrowser, window);

      await pageH.waitFor(3000);
      //start scraping from tvgscraper and get result
      const dataTvg = await tvg(pageH);
      console.log(dataTvg);
      // console.log(dataTvg[0].raceCard[0]);
      //insert result into excel file 
      const workBookTvg = await excelSheets(dataTvg);
      await knex('links').insert({
        link: __dirname + '\\excelFiles\\' + `${fileName}.xlsx`,
        created_at: knex.fn.now(),
        name: newName,
        url: arg.link
      })

      let lfile = await knex.select('link').from('links').orderBy('created_at', 'desc').limit(1);
      console.log(lfile[0].link);
      let allLinks = await knex("links").select('*').orderBy('created_at', 'desc');
      await mainWindow.webContents.send('workBook', allLinks);
      await workBookTvg.xlsx.writeFile(lfile[0].link).then(() => {
        console.log(arg.j);
      });
      // mainWindow.webContents.send("horses", {   resultH, resultHorses });
      //  mainWindow.webContents.send("stay", { i, URL });
      window.destroy();
      mainWindow.reload();

    } catch (error) {
      console.log(error);
    }

  });

  ipcMain.on("deleteFile", async (e, arg) => {
    let id = arg.id
    let path = arg.link
    try {
      await knex("links").del().where({ id });
      fs.unlinkSync(path);

    } catch (error) {
      console.log(error.message);
    }
    console.log(id);
  })

  ipcMain.on("GoogleRealTime", async (e, arg) => {


    try {

      let horsesbrowser = await pie.connect(app, puppeteer);
      const URL = arg.link;

      window = new BrowserWindow({ parent: mainWindow, show: false });
      await window.loadURL(URL);
      const page = await pie.getPage(horsesbrowser, window);
      await page.waitFor(1000);

      let clearSheet = {
        spreadsheetId: "1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc",
        range: "horsesAPI!A2:Z",
      };

      googleApiClear(clearSheet).then(() => console.log("clear"));
      const run = async () => {
        const startTime = Date();
        let dataSheet = await tvg(page);
        console.log(dataSheet[0].probables);
        let arrayTosheet = dataSheet[0].arrVal.concat([[""]], dataSheet[0].probables[0], [[""]], dataSheet[0].quickresults);
        let updateSheet = {
          spreadsheetId: "1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc",
          range: "horsesAPI!A2:Z",
          valueInputOption: "USER_ENTERED",
          resource: { values: arrayTosheet },
        };

        await googleApinsert(updateSheet);
        const endTime = Date();
        console.log(`START TIME - ${startTime} / END TIME - ${endTime}`)
      }

      const myVar = setInterval(run, 500);
      ipcMain.on("stopSheet", async () => {
        clearInterval(myVar);
        window.destroy();
        await knex('links').insert({
          link: "https://docs.google.com/spreadsheets/d/1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc/edit#gid=703285155",
          created_at: knex.fn.now(),
          name: "GSheet",
          url: arg.link
        });
      })

    } catch (error) {
      console.log(error);
    }

  })


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

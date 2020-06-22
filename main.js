const path = require("path");
const url = require("url");
const { google } = require("googleapis");
const moment = require("moment");
const keys = require("./keys.json");
const { app, BrowserWindow, ipcMain } = require("electron");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");
let mainWindow;
let win;
let window;
let isDev = false;

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
  let lastPath;
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
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
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
  ipcMain.on("pup", async (e, arg) => {
    console.log(arg);

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

      let newArray = [];
      arr.map((ar) => {
        let [match, one, X, two, Bs] = ar;
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

      console.log(newArray);

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
          resource: { values: newArray },
        };
        let result = await gsapi.spreadsheets.values.append(
          updateOpt,
          (err, response) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log(response);
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
  let i = 0;

  ipcMain.on("horses", async (e, arg) => {
    //nemmodo hneya i
    i = arg.j;
    console.log(arg);

    for (;;) {
      if (i == -1) {
        window.destroy();
        break;
      }
      ++i;

      console.log(i);

      try {
        let horsesbrowser = await pie.connect(app, puppeteer);
        const URL = arg.link;

        window = new BrowserWindow({ show: false, parent: mainWindow });
        await window.loadURL(URL);
        // window.show();
        // window.webContents.on("did-finish-load", function () {

        // });
        const pageH = await pie.getPage(horsesbrowser, window);
        await pageH.waitFor(1000);
        //await pageH.goto(URL, { waitUntil: "networkidle2" });
        // let btn = await pageH.$x('//*[@id="closeQubitModal"]');
        // await btn[0].click();
        const resultHorses = await pageH.evaluate(() => {
          const rowsH = document.querySelectorAll(".result-runners-table");
          return Array.from(rowsH, (row) => {
            const columnsH = row.querySelectorAll(".tr");
            return Array.from(columnsH, (column) => {
              const colsH = column.querySelectorAll(".td");
              return Array.from(colsH, (col) => col.innerText);
            });
          });
        });
        const resultH = await pageH.evaluate(() => {
          const rows1 = document.querySelectorAll(".table tr");
          return Array.from(rows1, (row) => {
            const columns1 = row.querySelectorAll("td");
            return Array.from(columns1, (column) => column.innerText);
          });
        });
        console.log({
          resultHorses,
          resultH,
        });
        mainWindow.webContents.send("horses", { resultH, resultHorses });

        window.destroy();
      } catch (error) {
        console.log(error);
      }
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

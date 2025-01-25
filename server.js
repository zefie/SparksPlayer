// Developed by Michel Buffa

const { orderBy } = require('natural-orderby');
const fs = require("fs");
// We need to use the express framework: have a real web server that knows how to send mime types etc.
const express = require("express");
const path = require("path");

// Init globals variables for each module required
const app = express(),
  http = require("http"),
  server = http.createServer(app);

// Config
const PORT = process.env.PORT,
  TRACKS_PATH = process.env.MULTITRACK || "./client/multitrack",
  addrIP = process.env.IP;

if (PORT == 8009) {
  app.use(function(req, res, next) {
    const user = auth(req);

    if (user === undefined || user["name"] !== "super" || user["pass"] !== "secret") {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", 'Basic realm="Super duper secret area"');
      res.end("Unauthorized");
    } else {
      next();
    }
  });
}

app.use(express.static(path.resolve(__dirname, "client")));

// launch the http server on given port
server.listen(PORT || 3000, addrIP || "0.0.0.0", () => {
  const addr = server.address();
  console.log("SparksPlayer server listening at", addr.address + ":" + addr.port);
});

// routing
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.get("/multitrack*", (req, res) => {
  const fileName = unescape(req.originalUrl.replace("/multitrack/",""))
//  console.log(req)
  res.sendFile(TRACKS_PATH + "/" + fileName)
})

// routing
app.get("/track", async (req, res) => {
  const trackList = await getTracks();

  if (!trackList) {
    return res.send(404, "No track found");
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(trackList));
  res.end();
});

// routing
app.get("/track/:id", async (req, res) => {
  const id = req.params.id;
  const track = await getTrack(id);

  if (!track) {
    return res.send(404, 'Track not found with id "' + id + '"');
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(track));
  res.end();
});

const getTracks = async () => {
  const directories = await getFiles(TRACKS_PATH);
  return directories.filter(dir => !dir.match(/^.DS_Store$/));
};

const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1;

isASoundFile = fileName => {
  if (endsWith(fileName, ".mp3")) return true;
  if (endsWith(fileName, ".ogg")) return true;
  if (endsWith(fileName, ".wav")) return true;
  if (endsWith(fileName, ".m4a")) return true;
  if (endsWith(fileName, ".mp4")) return true;
  return false;
};

const getTrack = async id =>
  new Promise(async (resolve, reject) => {
    if (!id) reject("Need to provide an ID");

    // possible filenames for the multitrack audio
    const fileNames = [
       `${TRACKS_PATH}/${id}.mp4`, // Telegram
       `${TRACKS_PATH}/${id}.m4a`, // Sparks
       `${TRACKS_PATH}/${id}.ogg`, // Just in case
    ]

    fileNames.forEach(function (v,k) {
       if (!fs.existsSync(fileNames[k])) {
           delete fileNames[k];
       }
    });

    if (!fileNames) {
      reject(null);
    }

    fileNames.sort()

    const track = {
      id: id,
      instruments: fileNames
        .filter(fileName => isASoundFile(fileName))
        .map(fileName => ({
          name: fileName.match(/(.*)\.[^.]+$/, "")[1],
          sound: fileName
        }))
    };

    resolve(track);
  });


const getFiles = async dirName =>
  new Promise((resolve, reject) =>
    fs.readdir(dirName, function(error, directoryObject) {
      if (error) {
        reject(error);
      }
      var strippedNames = [];
      if (directoryObject !== undefined) {
          directoryObject = orderBy(directoryObject, null, ['asc'])
	  strippedNames = directoryObject.map(file => path.parse(file).name);
      }
      resolve(strippedNames);
    })
  );


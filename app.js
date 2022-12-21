const express = require("express");
const app = express();
const os = require('os');
const Excel = require('exceljs');
const DownSpeed = require("fast-speedtest-api");
const { FastAPI, SpeedUnits } = require('fast-api-speedtest');

var flag = 0;
var cpu = os.cpus()[0].model;
var cpuver = os.cpus()[0].model.split(" ")[2];
var mem = Math.round(os.totalmem()/(1024*1024*1024));
var ope = os.type() == "Windows_NT" ? os.release().split(".")[2] >= 22000 ? "Windows 11" : os.version() : os.version();

console.log("Processor : " + cpu);
console.log("RAM : " + mem + " GB");
console.log("OS : " + ope);


const workbook = new Excel.Workbook();

workbook.xlsx.readFile(`./Copy of Processor Acceptance.xlsx`).then(() => {
    for(var i=6; i<=433; i++){
        var brand = workbook.worksheets[0].getCell(i,1).value.split(" ")[0];
        // console.log(workbook.worksheets[0].getCell(i,1).value.split(" "));
        var model = workbook.worksheets[0].getCell(i,1).value.split(" ")[2];
        var gen = workbook.worksheets[0].getCell(i,1).value.split(" ")[3];
        var tot = model + "-" + gen;
        if(brand == "Intel")
        {
            if(cpuver == tot)
            {
                var flag = 1;
                break;
            }
        }
    }
    if(flag)
    {
        console.log("Yes");
        console.log(cpuver);
        console.log(tot);
    }
})
.catch(err => {
    console.error(err)
})


//Download
var download;
let DownTest = new DownSpeed({
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // required
    timeout: 20000, // default: 5000
    unit: DownSpeed.UNITS.Mbps // default: Bps
});
 
DownTest.getSpeed().then(s => {
    download = Math.round(s);
    // console.log(`Download speed: ${Math.round(s)} Mbps`);
    console.log(download);
}).catch(e => {
    console.error(e.message);
});

//Upload
var upload;
const UpTest = new FastAPI({
    measureUpload: true,
    downloadUnit: SpeedUnits.MBps,
    timeout: 40000
});

UpTest.runTest().then(result => {
    upload = result.uploadSpeed;
    // console.log(`Upload speed: ${result.uploadSpeed} ${result.uploadUnit}`);
    console.log(upload);
}).catch(e => {
    console.error(e.message);
});


app.get("/api/", (req, res) => {
    res.json({'hello':['hi', 'hey']});
});

app.get("/api1/", (req, res) => {
    res.json('hello');
});

app.get("/processor/", (req, res) => {
    res.json(cpu);
});

app.get("/ram/", (req, res) => {
    res.json(mem);
});

app.get("/os/", (req, res) => {
    res.json(ope);
});

app.get("/download/", (req, res) => {
    res.json(download);
});

app.get("/upload/", (req, res) => {
    res.json(upload);
});

const PORT = process.env.PORT || 8080;  

app.listen(PORT, console.log(`Server started on port ${PORT}`));
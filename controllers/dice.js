const myUtils = require('../utils/myUtils');
let path = require("path");
let fs = require("fs");
const Log = require('../config/log-config');
let gameidPath = path.join(__dirname, '../static/file/gameid.txt');
var consoleLog = Log.getLogger('consolelog');

async function getGameList(id, number) {
    await myUtils.getNewGameList(id,number);
}

//每秒轮训获取最新游戏数据,通过websocket发送给客户端
setInterval(async function () {
    let data = await fs.readFileSync(gameidPath, 'utf8');
    let temNextID = parseInt(data);

    //consoleLog.info("refreshNewGames:nextID:" + temNextID);
    await getGameList(temNextID, 100);
}, 2000);


// setInterval(async function (){//测试投注
//     myUtils.getBase64Seed().then(async (res)=>{
//         await myUtils.testTransact(res);
//     });
// },15000);
const EnvPeople = require("../config/config");
const Log = require('../config/log-config');
const myUtils = require('../utils/myUtils');
const diceMysql = require('../utils/diceMysql');
//日志
var errlog = Log.getLogger('err');
var runlog = Log.getLogger();
var othlog = Log.getLogger('oth');
var consoleLog = Log.getLogger('consolelog');
//获取前端种子
async function exitSeed() {
    let seed = await myUtils.getBase64Seed();
    let result = "";
    // let checkSeedActionRes = await myUtils.eosTransact('existseed',{seed:seed});
    // console.log(checkSeedActionRes.processed.action_traces[0]);
    // if (checkSeedActionRes && checkSeedActionRes.processed && checkSeedActionRes.processed.action_traces && checkSeedActionRes.processed.action_traces.length > 0 && checkSeedActionRes.processed.action_traces[0].console) {
    //     if (checkSeedActionRes.processed.action_traces[0].console == 0 ) {
    //         result = seed;
    //     }
    // }else{
    //     result = seed;
    // }
    result = seed;
    return result;
}
//获取全部投注
async function betDataAll(tokenType){
    let dataArr = await diceMysql.searchDiceGameHistory(EnvPeople.ListPageNum,tokenType);
    return dataArr;
}
//获取玩家的所有投注
async function playerBetData(account,tokenType){
    let dataArr = await diceMysql.searchDiceGamePlayer(account,EnvPeople.ListPageNum,tokenType);
    return dataArr;
}
//获取排行榜的投注数据
async function betLeaderboardData(tokenType){
    let dataArr = await diceMysql.searchDiceGameHistoryLeaderboard(EnvPeople.ListPageNum,tokenType);
    return dataArr;
}
module.exports = {
    //获取随机种子
    getDiceSeed: async (req, res) => {            
        let seed = "";
        while (true) {
            seed = await exitSeed();
            console.log("seed:", seed)
            if (seed.length > 0) {
                break;
            }
        }
         res.send(myUtils.success(seed));
    },
    //获取全部投注
    getBetDataAll: async (req, res) => {
        let tokenType = req.query.tokenType;
        if(tokenType != 1 && tokenType != 2){
                    res.send(myUtils.success({msg:'参数错误,投注类型有误'},406,'failure'));
                    return ;
        }
        let dataArr = await betDataAll(req.query.tokenType);
        res.send(myUtils.success(dataArr));
    },
    //获玩家投注
    getPlayerBetData: async (req, res) => {
        if(req.query.tokenType!=1 && req.query.tokenType!=2){
                    res.send(myUtils.success({msg:'参数错误,投注类型有误'},406,'failure'));
                    return ;
        }
        let reg_z=/^[a-z1-5.]{12}$/;
        if(!reg_z.test(req.query.acc)){
            res.send(myUtils.success({msg:'参数错误,用户格式有误'},406,'failure'));
            return ;
        }
        let dataArr = await playerBetData(req.query.acc,req.query.tokenType);
        res.send(myUtils.success(dataArr));
    },
    //获取排行榜投注
    getBetRankingData: async (req, res) => {
        if(req.query.tokenType!=1 && req.query.tokenType!=2){
                    res.send(myUtils.success({msg:'参数错误,投注类型有误'},406,'failure'));
                    return ;
        }
        let dataArr = await betLeaderboardData(req.query.tokenType);
        res.send(myUtils.success(dataArr));
    },
}
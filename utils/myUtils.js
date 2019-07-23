let exec = require("child_process").exec;
const EnvPeople = require("../config/config");
const Log = require('../config/log-config');
const diceMysql = require('./diceMysql');
const mathjs = require('mathjs');
let path = require("path");
let fs = require("fs");
let gameidPath = path.join(__dirname, '../static/file/gameid.txt');
//日志
var errlog = Log.getLogger('err');
var runlog = Log.getLogger();
var othlog = Log.getLogger('oth');
var consoleLog = Log.getLogger('consolelog');

var oldSocketData_id=0;

module.exports = {
    executeCMD: async function(cmdStr) {
        let promise = new Promise((resolve, reject) => {
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    reject(-1)
                    //console.log("执行错误:", cmdStr, "\n", err, stderr);
                } else {
                    resolve(stdout)
                    //console.log("执行完成:", stdout);
                }
            });
        })

        let result;
        await promise.then(function (data) {
            result = data
        }, function (error) {
            result = error
        })
        return result
    },
    spliteBalance: (balance) => {
        let balanceArr = balance.split(" ")
        if (balanceArr && balanceArr.length == 2) {
            balanceArr[0] = parseFloat(balanceArr[0]).toFixed(4)
            return balanceArr
        }
        return []
    },
    eosTransact : async function (actionName,datas){
        let actionRes='';
        await EnvPeople.EosApi.transact({
        actions: [{
            account: EnvPeople.DiceGameContractAccount,
            name: actionName,
            authorization: [{
                actor: EnvPeople.DiceGameContractAccount,
                permission: 'active',
            }],
            data: datas,
        }]} , {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then(res=>{
            consoleLog.info('合约方法调用操作执行完毕 : '+res.transaction_id);
            actionRes = res;
        }).catch(err=>{
            consoleLog.info("合约方法调用操作执行错误 : "+err);
        });
        return actionRes;
    },
    getHexRandNum : async function (){
        let randNum=await this.executeCMD('openssl rand -hex 32');
        return randNum;
    },
    getBase64Seed : async function (){
        let Seed=await this.executeCMD('openssl rand -base64 13');
        Seed = Seed.slice(0, 18);
        return Seed;
    },
    success : function(data,code=200,status="success"){
        let arr={};
        arr.data=data;
        arr.code=code;
        arr.status=status;

        return JSON.stringify(arr);
    },
    testTransact : async function (seed) {//测试投注
        await EnvPeople.EosApi.transact({
        actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: 'chen22211112',
          permission: 'active',
        }],
        data: {
          from: 'chen22211112',
          to: EnvPeople.DiceGameContractAccount,
          quantity: '0.2000 EOS',
          memo: seed+',49,chen22111111',//种子,小于多少,邀请人
        },
      }]} , {
        blocksBehind: 3,
        expireSeconds: 30,
      }).then(res=>{
        consoleLog.info('自动投注执行完成~ 交易哈希:'+res.transaction_id);
      }).catch(err=>{
        consoleLog.info("自动投注 transact error: "+err);
      });
    },
    getNewGameList : async function(id, number){
        await EnvPeople.JsonRpc.get_table_rows({
            "code": EnvPeople.DiceGameContractAccount,
            "index_position": 1,
            "json": true,
            "key_type": "i64",
            "limit": number,
            "lower_bound": ''+id,
            "scope": EnvPeople.DiceGameContractAccount,
            "table": "beteds",
            "table_key": "",
            "upper_bound": '-1' 
        }).then((data) => {
            //console.log(data.rows.length );
            let socketDataBetQuantity=0;
            if (data.rows.length > 0) {
                //插入数据库
                for( val in data.rows ){
                    let result_quantity = 0;
                    let game_type=1;
                    let player_bet_num = data.rows[val].quantity.split(' ');
                    if(player_bet_num[1] != 'EOS'){
                        game_type = 2;
                    }
                    if(data.rows[val].result!=0){
                        let result_oddx = mathjs.floor(mathjs.eval(EnvPeople.ANSWER_MAX_NUM + '/(' + data.rows[val].num + '-1)')*100)/100;
                        result_quantity = mathjs.floor(mathjs.eval(player_bet_num[0] + '*' + result_oddx)*10000)/10000;
                        socketDataBetQuantity = result_quantity;
                    }
                    let k_id = data.rows[val].id;
                    let player = data.rows[val].player;
                    let bet_num = data.rows[val].num;
                    let bet_quantity = player_bet_num[0];
                    let result_num = data.rows[val].result_num;
                    let times = data.rows[val].createtime;
                    
                    diceMysql.addDiceGameHistory(k_id,player,bet_num,bet_quantity,result_num,result_quantity,times,game_type);
                    /**
                     * Socket 通知部分
                     */
                    consoleLog.info("socket:length:" + data.rows.length);
                    let socket = require("../indexdice").app.io;
                    let socket_player_bet_num = data.rows[val].quantity.split(' ');
                    let socket_game_type=1;
                    if(socket_player_bet_num[1] != 'EOS'){
                        socket_game_type = 2;
                    }
                    console.log('gameData',data.rows[val]);
                    let dataObj={
                        id:k_id,
                        player:player,
                        bet_num:bet_num,
                        bet_quantity:parseFloat(socket_player_bet_num[0]),
                        result_num:result_num,
                        result_quantity:socketDataBetQuantity,
                        tokenType:socket_game_type,
                        bet_time:times
                        };
                        //console.log('=====================');
                        //console.log('oldSocketData_id:',oldSocketData_id);
                        
                    if(oldSocketData_id != k_id){
                        oldSocketData_id = k_id;
                        socket.emit('newgames', dataObj);
                    }
                }
                //处理最新的游戏数据
                let newGameList = [];
                newGameList = newGameList.concat(data.rows);
                
                if (newGameList.length > EnvPeople.NewGameListCount) {
                    newGameList = newGameList.slice(newGameList.length - EnvPeople.newGameListCount, newGameList.length);
                }
                
                let lastGame = newGameList[newGameList.length - 1];
                fs.writeFileSync(gameidPath, lastGame.id + 1);
                
                //console.log("socket:length:", data.rows.length);
            }

        })
        .catch((err) => {

        })
    },
}
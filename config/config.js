const appRoot = require('app-root-path');
const moment = require('moment');

const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;
const { Api, JsonRpc, RpcError } = require('eosjs');

// node下 eos RPC 所需模组
const fetch = require('node-fetch');
// 只有在node.js / IE11 /IE Edge 浏览器环境下，需要以下模组；
const { TextDecoder, TextEncoder } = require('text-encoding');

// 这里是私钥
const privateKey = "5KEwdAeQNPjnReVaNvs3Y6BsZAejTgT6jYKzJdgrZMdFpeh8F5N";
const testPrivateKey = "5HzvGNa3QK1yzCxn7AnFaLACFNkV6wUm4AeTJj9ZHeAQmsKrZDs";
const signatureProvider = new JsSignatureProvider([privateKey,testPrivateKey]);



// rpc 对象可以运行 eos的rpc命令
// const kylinGetInfoLink = 'http://kylin.fn.eosbixin.com';
//  const kylinGetInfoLink = 'https://api-kylin.meet.one';
// const kylinGetInfoLink = 'https://api.kylin.alohaeos.com';
// const kylinGetInfoLink = 'http://kylin.meet.one:8888';
//const kylinGetInfoLink = 'http://api.eosrio.io';
// const kylinGetInfoLink = 'https://api-kylin.eosasia.one';
 const kylinGetInfoLink = 'https://api-kylin.eoslaomao.com';
const rpc = new JsonRpc(kylinGetInfoLink, { fetch });


// api 对象可以运行eos的合约，比如转账，创建账号等等(需要费用的操作)
const eosApi = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


const gameContractAccount='chen22211111';//合约拥有者

var gameLotteryIntervalTime=1000;//游戏开奖轮询间隔时间
var newGameListCount = 20;//当前最新游戏列表数量
const ANSWER_MAX_NUM=98;//赔率计算
const listPageNum=20;
//声明
module.exports = {
    DiceGameContractAccount:gameContractAccount,
    AppPath:appRoot,
    EosApi:eosApi,
    KylinGetInfoLink:kylinGetInfoLink,
    JsonRpc:rpc,
    Moment:moment,
    DiceGameLotteryIntervalTime:gameLotteryIntervalTime,
    NewGameListCount:newGameListCount,
    ANSWER_MAX_NUM:ANSWER_MAX_NUM,
    ListPageNum:listPageNum,
};

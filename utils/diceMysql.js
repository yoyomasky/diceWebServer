var db=require('../models/mysql.js');

//向外暴露方法
module.exports = {
    //添加游戏信息
     addDiceGameHistory :  async (k_id,player,bet_num,bet_quantity,result_num,result_quantity,times,game_type) => {//历史记录表添加游戏历史
        let resultArray =  await db.query('SELECT COUNT(dh_id) as Num FROM eg_dice_history WHERE dh_k_id=?',[k_id]);
        resultArray = Object.values(JSON.parse(JSON.stringify(resultArray)))[0];//格式化返回结果变成对象
        //console.log(resultArray);
        if(resultArray.Num == 0){
            let insRes=await db.query('INSERT INTO eg_dice_history(dh_k_id,dh_player,dh_bet_num,dh_bet_quantity,dh_result_num,dh_result_quantity,dh_time,dh_game_type) VALUES(?,?,?,?,?,?,?,?)',[k_id,player,bet_num,bet_quantity,result_num,result_quantity,times,game_type]);
            let tmpVar=JSON.parse(JSON.stringify(insRes));
            //console.log(tmpVar.insertId);
        }
    },
    //获玩家的投注历史
    searchDiceGamePlayer : async (playAcc,listNum,playType=1)=>{//检索玩家游戏历史记录 全部条
            let historyResultArray =  await db.query('SELECT * FROM eg_dice_history WHERE dh_game_type=? AND dh_player=?  ORDER BY dh_id DESC LIMIT 0,?',[playType,playAcc,listNum]);
            historyResultArray = Object.values(JSON.parse(JSON.stringify(historyResultArray)));//格式化返回结果变成对象
            let resArr=[];
            for(let i=0;i<historyResultArray.length;i++){
                resArr[i]={
                    id:historyResultArray[i].dh_k_id,//id
                    player:historyResultArray[i].dh_player,//投注者
                    bet_num:historyResultArray[i].dh_bet_num,//投注数
                    bet_quantity:historyResultArray[i].dh_bet_quantity,//投注金额
                    result_num:historyResultArray[i].dh_result_num,//中奖数
                    result_quantity:historyResultArray[i].dh_result_quantity,//中奖金额
                    bet_time:historyResultArray[i].dh_time,//投注时间
                    game_type:historyResultArray[i].dh_game_type//游戏类型 1 eos 2 代币
                }
            }
            //console.log(resArr);
            return resArr;
    },
    //获取所有游戏投注
    searchDiceGameHistory : async (listNum,playType=1)=>{//检索游戏历史记录 20条
    
            let historyResultArray =  await db.query('SELECT * FROM eg_dice_history WHERE dh_game_type=? ORDER BY dh_id DESC LIMIT 0,?',[playType,listNum]);
            historyResultArray = Object.values(JSON.parse(JSON.stringify(historyResultArray)));//格式化返回结果变成对象
            let resArr=[];
            for(let i=0;i<historyResultArray.length;i++){
                resArr[i]={
                    id:historyResultArray[i].dh_k_id,//id
                    player:historyResultArray[i].dh_player,//投注者
                    bet_num:historyResultArray[i].dh_bet_num,//投注数
                    bet_quantity:historyResultArray[i].dh_bet_quantity,//投注金额
                    result_num:historyResultArray[i].dh_result_num,//中奖数
                    result_quantity:historyResultArray[i].dh_result_quantity,//中奖金额
                    bet_time:historyResultArray[i].dh_time,//投注时间
                    game_type:historyResultArray[i].dh_game_type//游戏类型 1 eos 2 代币
                }
            }
            //console.log(resArr);
            return resArr;
    },
    //获取dice投注排行榜
    searchDiceGameHistoryLeaderboard : async (listNum,playType=1)=>{//检索游戏历史记录 20条
    
            let historyResultArray =  await db.query('SELECT * FROM eg_dice_history WHERE dh_game_type=? AND dh_result_quantity!=0 ORDER BY dh_bet_num,dh_bet_quantity DESC LIMIT 0,?',[playType,listNum]);
            historyResultArray = Object.values(JSON.parse(JSON.stringify(historyResultArray)));//格式化返回结果变成对象
            let resArr=[];
            for(let i=0;i<historyResultArray.length;i++){
                resArr[i]={
                    id:historyResultArray[i].dh_k_id,//id
                    player:historyResultArray[i].dh_player,//投注者
                    bet_num:historyResultArray[i].dh_bet_num,//投注数
                    bet_quantity:historyResultArray[i].dh_bet_quantity,//投注金额
                    result_num:historyResultArray[i].dh_result_num,//中奖数
                    result_quantity:historyResultArray[i].dh_result_quantity,//中奖金额
                    bet_time:historyResultArray[i].dh_time,//投注时间
                    game_type:historyResultArray[i].dh_game_type//游戏类型 1 eos 2 代币
                }
            }
            //console.log(resArr);
            return resArr;
    },
};
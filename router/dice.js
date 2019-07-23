let router = require('express').Router();

let diceController = require("../controllers/dice");//轮询
let diceQueryController = require("../controllers/diceQuery");//查询接口

router.get("/", async (req, res) => {
    res.send("404....");
});
//获取前端种子  
router.get("/dice/seed", diceQueryController.getDiceSeed);
//获取所有投注 20条
router.get("/dice/betDataAll", diceQueryController.getBetDataAll);
 //获取我的投注 20条
router.get("/dice/playerBetData", diceQueryController.getPlayerBetData);
 //获取排行榜 20条
router.get("/dice/betRankingData", diceQueryController.getBetRankingData);

module.exports = router; 
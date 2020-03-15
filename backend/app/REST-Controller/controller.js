const userService = require("../service/UserService.js");
const transferTargetsService = require("../service/TransferTargetsService.js");

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

require('../repository/repository');

//Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.post("/user/push-token", ((req, res) => {
    return userService.saveUserPushToken(req, res);
}));

app.post("/transferTargets/user/:userId", ((req, res) => {
    return transferTargetsService.saveTransferTargetByUserId(req, res);
}));

app.get('/transferTargets/user/:userId', (req, res) => {
    return transferTargetsService.getAllTransferTargetsByUserId(req, res);
});

app.delete('/transferTargets/:transferTargetId/user/:userId', (req, res) => {
    return transferTargetsService.deleteTransferTargetByUserId(req, res);
});

app.listen(4001, () => {
    console.log("REST Server running on port 4001");
});

﻿'use strict';
var express = require('express');
var router = express.Router();
const IOTA = require('iota.lib.js');

var executed = false;


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Iota Message' });
});


router.post('/', function (req, res) {
    if (!executed){
    console.log('adding message: '+ req.body.message + ' to the tangle');
    AttachMessage(req.body.message); 
    };
});


function AttachMessage(newMessage){
    // IOTA node
    const iota = new IOTA({
    //  host: 'http://52.42.145.71', doesnt currently work with iota.api.sendTransfer
    //  host: 'http://node.iotawallet.info', // iota testnet node
    //  host: 'http://p103.iotaledger.net',
        host: 'http://p103.iotaledger.net',
    //  host: 'https://testnet140.tangle.works'
    //  host: 'https://peanut.iotasalad.org',
    //    host: 'http://wallets.iotamexico.com',
    //  port: 14265
      port:14700
    //  port:443
    // port:80
    });

    iota.api.getNodeInfo((error, nodeInfo) => {
        if (error) {
            console.error('getNodeInfo error', error)
        } else {
            console.log('getNodeInfo result', nodeInfo)
        }
    });

    // IOTA seed
    var seed = 'W99RJ9M9A9IKOHB9BFGDKLP9CORGD9HHKQ99BNEWUVI9QVQOOVH9GQN9DDFHQJMJT9O9BQOWOMY9EJX9Y' // make your own seed
    var options = {
        index: 1,
        checksum: true
    };

    // IOTA attach and send message
    iota.api.getNewAddress(seed, options, function (error, address) {

        // attach the address to the tangle with message
        var transfer = [{
            address: address,
            value: 0,
            message: iota.utils.toTrytes(newMessage),
            tag: ''
        }]

        var depth = 4;

        // on the mainnet, minWeightMagnitude is 18
        var minWeightMagnitude = 18;

        // sendTransfer API wrapper function 
        // includes prepareTransfers, 
        //          attachToTangle, 
        //          broadcast,
        //          storeTransactions 
        iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfer, function (e, attached) {
        
            if (!e) {
                console.log("successfully attached", attached);
            }
            else console.log("failed sad face");
        })
        executed = true;
    });
};







module.exports = router;

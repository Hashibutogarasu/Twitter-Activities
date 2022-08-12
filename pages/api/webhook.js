
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');
const { NextApiRequest, NextApiResponse } = require('next/dist/shared/lib/utils');
const ws = new WebSocket(`$ws://${process.env.NEXT_PUBLIC_IP_PORT_WS}`);

ws.onopen = e => {
    console.log('接続ヨシ！')
}

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @returns 
 */
export default async function webhook(req, res) {
    console.log(req.body);
    const request_json = JSON.stringify(req.body);
    console.log(request_json);

    const headers = JSON.stringify(req.rawHeaders);
    const IP = process.env.NEXT_PUBLIC_IP_PORT;

    /**@type {string} */
    let ipaddress = '';

    JSON.parse(headers).forEach(header => {
        if (header.match(/^\d{1,3}(\.\d{1,3}){3}$/) && header.match(/199.59.150.171/)) {
            ipaddress = header;
        }
    });
    
    if(ipaddress == '199.59.150.171'){
        await fetch(`http://${IP}/twitter/activity/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                json: request_json
            },
        }).then(value=>{
            console.log(`sent to ${IP}.`);
            
            res.status(200).json({
                message: `OK`
            });
        }).catch(err=>{
            console.log(`Cant send.\n${err}`);

            res.status(201).json({
                message: `Cant send.`
            });
        });

        ws.send(request_json);
        
        return;
    }

    const query = req.query;
    const { crc_token } = query;
    const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;

    if(crc_token == undefined || crc_token == '' || CONSUMER_SECRET == undefined || CONSUMER_SECRET == '' || req.method == 'GET'){
        return(
        res.status(200).json({
            response_token: `sha256=${crypto.createHmac('sha256', CONSUMER_SECRET).update('').digest('base64')}`
        }));
    }

    const json = {
        response_token: `sha256=${crypto.createHmac('sha256', CONSUMER_SECRET).update(crc_token).digest('base64')}`
    }
  
    return(
        res.status(200).json(json)
    );
}

export const config = {
    api: {
        bodyParser: false,
    },
};
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');
const { NextApiRequest, NextApiResponse } = require('next/dist/shared/lib/utils');

/**
 * 
 * @param {NextApiRequest} req 
 * @param {NextApiResponse} res 
 * @returns 
 */
export default async function webhook(req, res) {
    const request_json = JSON.stringify(req.body);
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
                "Content-Type": "application/json",
                "Twitter-Activity-Info": request_json
            }
        }).then(value=>{
            console.log(`sent to ${IP}.\nbody:${value.body}`);
            
            res.status(200).json({
                message: `OK`
            });
        }).catch(err=>{
            console.log(`Cant send.\n${err}`);

            res.status(200).json({
                message: `Cant send.`
            });
        });

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
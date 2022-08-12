// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');
const dns = require('dns');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export default async function webhook(req, res) {
    console.log(JSON.stringify(req.body));
    const headers = JSON.stringify(req.rawHeaders);

    /**@type {string[]} */
    const ipaddresses = [];

    JSON.parse(headers).forEach(header => {

        if (header.match(/^\d{1,3}(\.\d{1,3}){3}$/)) {
            ipaddresses.push(header);
        }
    });

    ipaddresses.forEach(async(ipaddress)=>{
        console.log(ipaddress);
        resolve(ipaddress);
    });

    console.log(req.method);

    const query = req.query;
    const { crc_token } = query;
    const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;

    if(crc_token == undefined || crc_token == '' || CONSUMER_SECRET == undefined || CONSUMER_SECRET == '' || req.method == 'GET'){
        return(
        res.status(201).json({
            response_token: `sha256=${crypto.createHmac('sha256', CONSUMER_SECRET).update('').digest('base64')}`
        }));
    }

    const json = {
        response_token: `sha256=${crypto.createHmac('sha256', CONSUMER_SECRET).update(crc_token).digest('base64')}`
    }
  
    return(
        res.status(201).json(json)
    );
}

const resolve = (cname) => {
    function getIp(accum){
        dns.resolve(cname,
        callback=(err, result) => {
            if (err) {
                console.error(`error: ${err}`);
            } else {
                result.push.apply(result, accum);
                console.log(result);
            }
        })
    }

    let accum = [];
    function getCnames(err, result){
        if (err) {
            getIp(accum);
        } else {
            const cname = result[0];
            accum.push(cname);
            dns.resolveCname(cname, getCnames);
        }
    }

    dns.resolveCname(cname, getCnames);
}
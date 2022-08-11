// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createHmac } from "crypto";

export default async function webhook(req, res) {
  const query = req.query;
  const { crc_token } = query;

  if(crc_token == undefined || crc_token == ''){
    return(
      res.status(200).json({
        response_token: `sha256=${createHmac('sha256', process.env.CONSUMER_SECRET).update('').digest('base64')}`
      })
    );
  }
  
  return(
    res.status(200).json({
      response_token: `sha256=${createHmac('sha256', process.env.CONSUMER_SECRET).update(crc_token).digest('base64')}`
    })
  );
}

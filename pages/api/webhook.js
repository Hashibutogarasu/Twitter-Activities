// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');

export default async function webhook(req, res) {

  console.log(res);

  const query = req.query;
  const { crc_token } = query;
  const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET;

  if(crc_token == undefined || crc_token == '' || CONSUMER_SECRET == undefined || CONSUMER_SECRET == ''){
    return(
      res.status(201).json({
        response_token: `sha256=${crypto.createHmac('sha256', CONSUMER_SECRET).update('').digest('base64')}`
      })
    );
  }

  const json = {
    response_token: `sha256=${crypto.createHmac('sha256', CONSUMER_SECRET).update(crc_token).digest('base64')}`
  }
  
  return(
    res.status(201).json(json)
  );
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require('crypto');

export default async function webhook(req, res) {
  const query = req.query;
  const { crc_token } = query;

  if(crc_token == undefined || crc_token == ''){
    return(
      res.status(201).json({})
    );
  }

  const json = {
    response_token: `sha256=${crypto.createHmac('sha256', process.env.CONSUMER_SECRET).update(crc_token).digest('base64')}`
  }
  
  return(
    res.status(201).json(json)
  );
}

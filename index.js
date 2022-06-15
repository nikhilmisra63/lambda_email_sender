const aws = require("aws-sdk");

const emailConfig = {
  accessKeyId: process.env.AWS_CSPL_ACCESS_KEY_ID,
  region: process.env.AWS_CSPL_REGION,
  secretAccessKey: process.env.AWS_CSPL_ACCESS_KEY_SECRET
};

aws.config.update(emailConfig);

exports.handler = async event => {
  const data = JSON.parse(event.body);

  const params = {
    Source: "admin@hackbuddy.in",
    Destination: {
      ToAddresses: ["info@hackbuddy.in"]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>You got a contact message from: <b>${data.email}</b><br/> name <b>${data.name}</b><br/> phone no <b>${data.phone}</b><br/> website <b>${data.website}</b><br/> message <b>${data.message}</b><br/></p>`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Contact from ${data.email}`
      }
    }
  };

  const sendPromise = new aws.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  return sendPromise
    .then(data => {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify("Success")
      };
      return response;
    })
    .catch(err => {
      const response = {
        statusCode: err.statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: err.message
      };
      return response;
    });
};

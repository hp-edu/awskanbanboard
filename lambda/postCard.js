var AWS = require("aws-sdk");
var documentClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10"
});
const tableName = "Cards";

exports.handler = async event => {
  console.log("Received: " + JSON.stringify(event, null, 2));
  let response = "";
  try {
    const id = event.requestContext.requestId;
    const body = JSON.parse(event.body);
    var params = {
      TableName: tableName,
      Item: {
        id: id,
        title: body.title,
        category: body.category
      }
    };
    await documentClient.put(params).promise();

    response = {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ id: id })
    };
  } catch (exception) {
    console.error(exception);
    response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ "Message: ": exception })
    };
  }
  return response;
};

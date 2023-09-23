/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["tinyUrlApiKey"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
const fetch = require('node-fetch');
const aws = require('aws-sdk');
const uuid = require('uuid'); // Import UUID generator

const generateOptionLink = (baseUrl, pollId, optionId) => {
    return `${baseUrl}/vote/?pollid=${pollId}&optionid=${optionId}`;
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const { Parameters } = await (new aws.SSM())
        .getParameters({
            Names: ["tinyUrlApiKey"].map(secretName => process.env[secretName]),
            WithDecryption: true,
        })
        .promise();

    console.log("Parameters", Parameters);
    console.log("EVENT: ", event);

    const options = event.options;
    const poll = event.poll;
    const baseUrl = event.baseUrl;
    console.log(options, poll, baseUrl);

    let optionsToCreate = [];
    for (let option of options) {
        let optionId = uuid.v4();
        let longUrl = generateOptionLink(baseUrl, poll.id, optionId);
        const API_TOKEN = Parameters[0].Value; 
        let tinyUrl;
        try {

            const response = await fetch("https://api.tinyurl.com/create", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                body: JSON.stringify({
                    url: longUrl
                })
            })

            if (!response.ok) {
                console.log(response)
                throw new Error(`HTTP error! Status: ${response.error}`);
            }

            const responseJson = await response.json();

            tinyUrl = responseJson.data.tiny_url; // or response.text() if you expect plain text
        } catch (error) {
            // Handle errors here
            console.error('Fetch error:', error);
            throw error; // Re-throw the error to propagate it to the caller
        }

        const optionParams = {
            id: optionId,
            text: option.text,
            numVotes: 0,
            tinyUrl: tinyUrl,
            longUrl: longUrl,
            voters: [],
            pollId: poll.id
        }

        optionsToCreate.push(optionParams);
    }
    console.log("optionsToCreate: ", optionsToCreate);
    return {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: { optionsToCreate },
    };
};

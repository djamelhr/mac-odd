
const { google, logging_v2 } = require("googleapis");

const keys = require("./keys.json");
//gooogle
const googleApisert = async (updateOpt) => {
    const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
    );
    client.authorize((err, tokens) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("connected");
            gsrun(client);
        }
    });
    async function gsrun(cl) {
        const gsapi = google.sheets({ version: "v4", auth: cl });
        // const opt ={
        //     spreadsheetId : '1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc' ,
        //     range : 'odds!A1:E5'
        // };
        // let val = await gsapi.spreadsheets.values.get(opt);
        // console.log(val.data.values);


        await gsapi.spreadsheets.values.update(
            updateOpt,
            (err, response) => {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log("send it!!");
            }
        );
    }

}


module.exports = googleApisert;
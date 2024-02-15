require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:
                {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us22.api.mailchimp.com/3.0/lists/74df6d7450';

    const options = {
        method: "POST",
        auth: 'sahil578:88b440079fb20909b7f785fa670a7287-us22'
    }

    const request = https.request(process.env.URL, options, (response) => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        });
    });
    // console.log(firstName, lastName, email);

    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port 3000");
});



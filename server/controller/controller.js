const dotenv = require('dotenv');
dotenv.config({path:'config.env'});

exports.send = (req,res)=>{
   if(!req.body){
        res.status(400).send({
            message: 'Content can not be empty!'
        });
        return;
    }

    /* Access && token du compte twilio */
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        const client = require('twilio')(accountSid, authToken);
        console.log(client);

    /* Data d'envoie du formulaire sms */
        const name_exp = "Bruce";
        const number = req.body.number;
        const messageC = req.body.messageContent;

        if(number!= "" && messageC!="" ){
            client.messages
                .create({
                    body: messageC, 
                    from: '+33757915830',       
                    to: number
                })
                .then(message => console.log(message.sid));
            console.log("Destiné à " + number);
            console.log("Votre mesage : " + messageC);
        }else{
            console.log("Veuillez remplir les champs nécessaires");
        }

    
   
}
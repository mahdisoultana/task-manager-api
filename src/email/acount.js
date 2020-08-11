const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
        
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "soultana.mahdi24@gmail.com",
        pass: "Helalaboys00"
    }
});
const WelcomEmail = (email="KristenSeeman@outlook.com", name="Mahdi Soultana") => {
  
    let mailOptions = {
        from: "soultana.mahdi24@gmail.com",
        to: email,
        subject: 'WELCOM ',
        html: `<h2> Hello  ${name}  Our Member Are Really Happy To SEE you Here </h2> <br> <p>You are the best to choose our app to manage your life : </p><h3>please Relpy Us we are Really Exciting To see you Agian !</h3>` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('success');
    });
}

const GoodByeEmail = (email="KristenSeeman@outlook.com", name="Mahdi Soultana") => {
    
    let mailOptions = {
        from: 'soultana.mahdi24@gmail.com',
        to: email,
        subject: 'GOODBYE ',
        html: `<h2>Said To see you Go ${name}</h2> <br> <p>Please Tell Us Your reason to: </p><h3>Go please Relpy Us we wait for you !</h3>` // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message);
        }
        console.log('success');
    });
}
WelcomEmail()
module.exports={GoodByeEmail,WelcomEmail}

/*
        if you want to use Outlook
        Host: smtp.live.com
        */
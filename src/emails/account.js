const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: '199399299599a@gmail.com',
        subject:'Thanks for choosing us!!',
        text:`Hope You have a great time in our app Mr ${name}.` // cannot use single or double quotes only backticks
    })
}

module.exports = {
    sendWelcomeEmail
}
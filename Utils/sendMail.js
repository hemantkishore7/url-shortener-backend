const nodeMailer = require("nodemailer");

module.exports = async(email,subject,text)=>{
   try {
    const transport = nodeMailer.createTransport({
        service:process.env.SERVICE,
        auth:{
            user:"hemantkishore98@gmail.com",
            pass:"wlyowjxsbqsughxi",
        }
    })

    transport.sendMail({
        from:"hemantkishore98@gmail.com",
        to:email,
        subject:subject,
        text:text
    },(error)=>{
      if(error)console.log("Mail has not sent",error);
      else console.log("Mail has sent successfully");
    })
   } catch (error) {
    console.log(error);
   }
}
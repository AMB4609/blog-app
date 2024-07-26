import hbs from "nodemailer-express-handlebars";
import path from "node:path";
import { transporter } from "../helpers/mail.js";

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("../api/views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("../api/views/"),
  extName: ".handlebars",
};

export const sendMail = (mailOptions) => {
  transporter.use("compile", hbs(handlebarOptions));
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("error sending email", error);
    } else {
      console.log("email sent", info.response);
    }
  });
};

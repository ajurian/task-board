import nodemailer from "nodemailer";

const Mail = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: "787e62001@smtp-brevo.com",
        pass: "M7VsPn05N3mO891Q",
    },
});

export default Mail;

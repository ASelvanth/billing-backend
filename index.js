const dotenv = require('dotenv');
const express = require('express');
const db = require('./db/connect');
const cors = require('cors');
const nodemailer = require('nodemailer');
const {fileURLToPath} = require('url');
const {dirname} = require('path');
const pdf = require('html-pdf');

const cookieParser = require('cookie-parser');
//web server
const app = express();
dotenv.config();

//import routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile');
const clientRoutes = require('./routes/clients');
const invoiceRoutes = require('./routes/invoices');

const pdfTemplate = require('./documents/index');
const emailTemplate = require('./documents/email');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

//conneting to DB
// db();

//Middleware - incoming data into json 
// app.use(express.json());
app.use(express.json({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(cors());

//Routes
// app.get('/api', authRoutes);
//http://localhost:5000/users
// app.use('/users',userRoutes);
// //http://localhost:5000/api/products

app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/clients', clientRoutes);
app.use('/invoice', invoiceRoutes);

// // NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL

// var options = { format: 'A4' };
// //SEND PDF INVOICE VIA EMAIL
// app.post('/send-pdf', async (req, res) => {
//   const { email, company } = req.body;

//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mail = {
//       from: `Invoicybilly <hello@invoicybilly.com>`, // sender address
//       to: `${email}`, // list of receivers
//       replyTo: `${company.email}`,
//       subject: `Invoice from ${
//         company.businessName ? company.businessName : company.name
//       }`, // Subject line
//       text: `Invoice from ${
//         company.businessName ? company.businessName : company.name
//       }`, // plain text body
//       html: emailTemplate(req.body), // html body
//       attachments: [
//         {
//           filename: 'invoice.pdf',
//           path: `${__dirname}/invoice.pdf`,
//         },
//       ],
//     };
//     transporter.sendMail(mail, (err, info) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log('Mail has been sent', info.response);
//         res.status(200).json({ message: 'Mail has been sent successfully' });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// //CREATE AND SEND PDF INVOICE
// app.post('/create-pdf', (req, res) => {
//     pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
//       if (err) {
//         res.send(Promise.reject());
//       } else {
//         res.send(Promise.resolve());
//       }
//     });
// });

// //SEND PDF INVOICE
// app.get('/fetch-pdf', (req, res) => {
//     res.sendFile(`${__dirname}/invoice.pdf`);
// }); 

app.get('/', (req, res) => {
    res.send('Welcome to My Inventory Billing App!!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`App is running on PORT ${PORT}`);
    db();
});



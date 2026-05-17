export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    database: {
        connectionString: process.env.MONGO_URL
    },
    mail: {
        host: process.env.MAIL_HOST || 'smtp.ethereal.mail',
        port: parseInt(process.env.MAIL_PORT, 10) || 587,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})
module.exports = {
    apps: [
        {
            name: 'socialMediaBackEnd',
            script: './dist/index.js',
            interpreter: 'node',
            env: {
                PORT: process.env.PORT,
                URL: process.env.URL,
                MONGO_URI: process.env.MONGO_URI,
                SALT: process.env.SALT,
                SECURITY_KEY: process.env.SECURITY_KEY,
                STRIPE_SECRET: process.env.SECURITY_KEY,
                AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
                AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
                AWS_REGION: process.env.AWS_REGION,
                AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
                STRIPE_ID_PLAN: process.env.STRIPE_ID_PLAN,
                STRIPE_ID_PLAN_2: process.env.STRIPE_ID_PLAN_2,
                STRIPE_ID_PLAN_3: process.env.STRIPE_ID_PLAN_3,
                MAIL_USERNAME: process.env.MAIL_USERNAME,
                MAIL_PASSWORD: process.env.MAIL_PASSWORD,
            },
        },
    ],
}

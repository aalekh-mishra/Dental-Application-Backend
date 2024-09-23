import {v2 as cloudinary} from "cloudinary";
import app from './index'
import config from './config/config'

import logger from './utils/logger';
import connectDB from './database/connection';
import { initRateLimiter } from './config/rate-limiter';


const server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    try {
        // Database Connection Connect to MongoDB
        const connection = await connectDB(config.MONGO_URI);
        logger.info(`DATABASE_CONNECTION`, {
            meta: {
                CONNECTION_NAME: connection.name
            }
        });

        cloudinary.config({
            cloud_name: config.CLOUDINARY_CLOUD_NAME,
            api_key: config.CLOUDINARY_API_KEY,
            api_secret: config.CLOUDINARY_API_SECRET,
        });
        logger.info(`CLOUDINARY_CONNECTION`, {
            meta: {
                CLOUD_CONNECTION_NAME: config.CLOUDINARY_CLOUD_NAME,  
            }
        });

        initRateLimiter(connection)
        logger.info(`RATE_LIMITER_INITIATED`)

        logger.info(`APPLICATION_STARTED`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (err) {
        logger.error(`APPLICATION_ERROR`, { meta: err })

        server.close((error:any) => {
            if (error) {
                logger.error(`APPLICATION_ERROR`, { meta: error })
            }

            process.exit(1)
        })
    }
})()
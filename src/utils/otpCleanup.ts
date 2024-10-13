import cron from 'node-cron';
import { User } from '../models/user';

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
    const now = new Date();
    await User.updateMany(
        { expiresOtpAt: { $lt: now }, otp: { $ne: '' } }, // Check for expired OTPs
        { $set: { otp: '' } } // Set the OTP field to an empty string
    );
    console.log('Expired OTPs cleared.');
});

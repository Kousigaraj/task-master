import cron from 'node-cron';
import Task from '../models/taskModel.js';

const autoDeleteOldTrash = () => {
   // Runs every day at 12:00 AM
  cron.schedule('0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      const result = await Task.deleteMany({ deletedAt: { $lt: thirtyDaysAgo } });
      console.log(`${result.deletedCount} old trashed tasks deleted`);
    } catch (error) {
      console.error('Error deleting old trashed tasks:', error.message);
    }
  });
};

export default autoDeleteOldTrash;

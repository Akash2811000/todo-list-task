import cron from "node-cron";
import Todo from "../models/todo.model";

export const createExpiredTodosCronJob = (
  // cronExpression: string = "*/30 * * * * *" // run after 30 second
  cronExpression: string = "0 0 * * *"
) => {
  return cron.schedule(cronExpression, async () => {
    try {
      const currentDate = new Date();
      const result = await Todo.updateMany(
        {
          dueDate: { $lt: currentDate },
          completed: false,
        },
        {
          $set: {
            completed: true,
            updatedAt: currentDate,
          },
        }
      );

      console.log(
        `[${new Date().toISOString()}] Expired todos cleanup: Updated ${
          result.modifiedCount
        } todos`
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error in expired todos cleanup:`,
        error
      );
    }
  });
};

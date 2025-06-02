import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  toggleTodo,
  updateTodo,
} from "../controllers/todo.controller";
import {
  authMiddleware
} from "../middlewares/auth.middleware";

const router = Router();

// router.use(
//   authMiddleware({
//     authHeaderRequired: true,
//     permissionsRequired: ["admin"],
//   })
// );
router.get(
  "/",
  authMiddleware({
    authHeaderRequired: true,
    permissionsRequired: ["user"],
  }),
  getTodos
);
router.get("/:id", getTodoById);

router.post(
  "/",
  authMiddleware({
    authHeaderRequired: true,
    permissionsRequired: ["user", "admin"],
  }),
  createTodo
);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id/toggle", toggleTodo);

export default router;

import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../schemas/auth.schemas.js";
import { catchAsync } from "../utils/catchAsync.js"; // අපේ ස්ටන්ට් රයිඩර් 🚀

// 1. සියලුම පරිශීලකයන් ලබා ගැනීම
export const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();
  return res.status(200).json(users);
});

// 2. ID එකෙන් පරිශීලකයෙක් සෙවීම
export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  return res.status(200).json(user);
});


// 4. පරිශීලක තොරතුරු යාවත්කාලීන කිරීම (බග් එක නිවැරදි කර ඇත 🛠️)
export const updateUser = catchAsync(async (req, res) => {
  // මුලින්ම ආපු දත්ත Zod හරහා පිරිසිදු කරගන්නවා
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  // පිරිසිදු කරගත් දත්ත ටික ගන්නවා
  const data = { ...result.data };

  // පින්තූරයක් එවලා තියෙනවා නම් විතරක් ඒක එකතු කරනවා
  if (req.file) {
    data.image = req.file.filename;
  }

  // කිසිම දෙයක් එවලා නැත්නම් වැරැද්දක් දෙනවා
  if (!Object.keys(data).length) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  const updatedUser = await userService.updateUser(req.user.userId, data);
  return res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

// 5. පරිශීලකයෙක් මකා දැමීම
export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return res.status(200).json({ message: "User deleted successfully" });
});

// 6. තමන්ගේම තොරතුරු ලබා ගැනීම (Profile)
export const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.status(200).json({ user });
});

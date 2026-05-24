import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";

function parseUserId(id) {
  const parsedId = Number.parseInt(String(id), 10);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid user id");
  }

  return parsedId;
}

export const userService = {
  getUsers: () => userRepository.findAll(),

  getUserById: (id) => userRepository.findById(parseUserId(id)),



  async updateUser(id, data) {
    const userId = parseUserId(id);
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return userRepository.update(userId, data);
  },

  async deleteUser(id) {
    const userId = parseUserId(id);
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    return userRepository.delete(userId);
  },
};

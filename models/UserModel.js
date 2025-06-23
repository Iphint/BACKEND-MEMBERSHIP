const { PrismaClient } = require('@prisma/client');
const { get } = require('../routes/UserRoutes');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const UserModel = {
  register: async (
    username,
    email,
    password,
    roles,
    no_telp,
    profile_picture
  ) => {
    try {
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password,
          roles,
          no_telp,
          profile_picture: profile_picture || null,
        },
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  findByUsername: async (username) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  },
  findByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
  findById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },
  updateUser: async (id, data, newFile) => {
    try {
      const parsedId = parseInt(id);
      const existingUser = await prisma.user.findUnique({
        where: { id: parsedId },
      });
      if (!existingUser) {
        throw new Error('User not found');
      }
      // Jika ada file baru, hapus file lama
      if (newFile) {
        const oldProfilePicture = existingUser.profile_picture;

        if (oldProfilePicture) {
          const oldImagePath = path.join(
            process.cwd(),
            'uploads',
            oldProfilePicture
          );

          if (fs.existsSync(oldImagePath)) {
            try {
              fs.unlinkSync(oldImagePath);
              console.log(`Deleted old profile picture: ${oldImagePath}`);
            } catch (err) {
              console.error('Error deleting old profile picture:', err);
            }
          } else {
            console.log('Old profile picture not found at:', oldImagePath);
          }
        }
        data.profile_picture = newFile.filename;
      }
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: parsedId },
        data,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },
};

module.exports = UserModel;

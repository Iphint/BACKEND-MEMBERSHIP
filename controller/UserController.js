const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

exports.register = async (req, res) => {
  const { username, email, password, roles, no_telp } = req.body;
  const profile_picture = req.file ? req.file.filename : null;

  // Validasi input
  if (!username || !email || !password || !roles || !no_telp) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validasi roles
  const allowedRoles = ['USER', 'ADMIN'];
  const parsedRoles = Array.isArray(roles) ? roles : [roles];
  const upperRoles = parsedRoles.map((r) => r.toUpperCase());

  for (const role of upperRoles) {
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role: ${role}` });
    }
  }

  try {
    // Cek username sudah ada atau belum
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Register user
    const newUser = await UserModel.register(
      username,
      email,
      hashedPassword,
      upperRoles,
      no_telp,
      profile_picture
    );
    res.status(201).json({
      message: 'Successfully registered user',
      data: newUser,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.findUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(parseInt(id));
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null,
      });
    }
    res.status(200).json({
      status: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      data: null,
    });
  }
};
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, roles, no_telp } = req.body;
  const file = req.file;

  try {
    // Validasi input
    if (!username || !email || !roles || !no_telp) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validasi roles
    const allowedRoles = ['USER', 'ADMIN'];
    const parsedRoles = Array.isArray(roles) ? roles : [roles];
    const upperRoles = parsedRoles.map((r) => r.toUpperCase());

    for (const role of upperRoles) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role: ${role}` });
      }
    }

    const existingUser = await UserModel.findByEmail(email);
    const userByUsername = await UserModel.findByUsername(username);
    if (existingUser && existingUser.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: 'Email already in use by another user' });
    } else if (userByUsername && userByUsername.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: 'Username already in use by another user' });
    }

    // Update user
    const updatedUser = await UserModel.updateUser(
      parseInt(id),
      {
        username,
        email,
        roles: upperRoles,
        no_telp,
      },
      file
    );

    res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(parseInt(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await UserModel.deleteUser(parseInt(id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json({
      status: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
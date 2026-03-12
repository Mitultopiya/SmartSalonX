import User from '../models/User.model.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, gender } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update User Profile Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses || []);
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { label, address, city, state, pincode, coordinates, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      label,
      address,
      city,
      state,
      pincode,
      coordinates,
      isDefault: isDefault || false,
    });

    await user.save();

    res.json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Add Address Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

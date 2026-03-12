import Hairstyle from '../models/Hairstyle.model.js';

export const getHairstyles = async (req, res) => {
  try {
    const { gender, isActive } = req.query;
    const query = {};

    if (gender) {
      query.gender = { $in: [gender, 'unisex'] };
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const hairstyles = await Hairstyle.find(query).sort({ createdAt: -1 });
    res.json(hairstyles);
  } catch (error) {
    console.error('Get Hairstyles Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getHairstyleById = async (req, res) => {
  try {
    const hairstyle = await Hairstyle.findById(req.params.id);

    if (!hairstyle) {
      return res.status(404).json({ message: 'Hairstyle not found' });
    }

    res.json(hairstyle);
  } catch (error) {
    console.error('Get Hairstyle Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

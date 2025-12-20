import Announcement from '../models/announcement.model.js';

// @desc    Create a new system-wide announcement (Admin only)
// @route   POST /api/announcements
// @access  Admin
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required for the announcement.' });
    }

    const newAnnouncement = await Announcement.create({
      title,
      content,
      type: type || 'system', // Defaults to system-wide
      user: req.user.id, // The ID of the admin creating the announcement
    });

    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating announcement.' });
  }
};

// @desc    Get all announcements (Publicly accessible)
// @route   GET /api/announcements
// @access  Public (But usually shown only on the user's dashboard)
export const getAnnouncements = async (req, res) => {
  try {
    // Optionally filter by type or status here if needed.
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching announcements.' });
  }
};

// @desc    Delete an announcement (Admin only)
// @route   DELETE /api/announcements/:id
// @access  Admin
export const deleteAnnouncement = async (req, res) => {
  try {
    const result = await Announcement.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    res.status(200).json({ message: 'Announcement deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting announcement.' });
  }
};
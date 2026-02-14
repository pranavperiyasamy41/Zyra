import Note from '../models/note.model.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, color, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const note = new Note({
      user: req.user._id,
      title,
      content,
      color: color || 'yellow',
      priority: priority || 'normal'
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, content, color, isPinned, priority } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (priority !== undefined) note.priority = priority;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    res.json({ message: "Note removed" });
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
import Supplier from '../models/supplier.model.js';

// 1. Create Supplier
export const createSupplier = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;

    // Validation
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be a 10-digit numeric value." });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    
    const supplier = await Supplier.create({
      user: req.user._id,
      name,
      contactPerson,
      email,
      phone,
      address
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get All Suppliers (for the logged-in user)
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Update Supplier
export const updateSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Phone number must be a 10-digit numeric value." });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Delete Supplier
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Supplier Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
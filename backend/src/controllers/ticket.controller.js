import Ticket from '../models/ticket.model.js';
import AuditLog from '../models/auditLog.model.js';

// 1. Create Ticket (User)
export const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await Ticket.create({ user: req.user._id, subject, message });
    
    // Log it
    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username, 
        action: "TICKET_CREATED", details: `Ticket ID: ${ticket._id}`
    });

    res.status(201).json(ticket);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

// 2. Get My Tickets (User)
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

// 3. Get All Tickets (Admin)
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('user', 'username pharmacyName').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

// 4. Resolve Ticket (Admin)
export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    const ticket = await Ticket.findByIdAndUpdate(id, { 
        status: 'RESOLVED', 
        adminReply: reply 
    }, { new: true });

    // Log it
    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username,
        action: "TICKET_RESOLVED", details: `Resolved Ticket ${id}`
    });

    res.json(ticket);
  } catch (error) { res.status(500).json({ message: "Server Error" }); }
};
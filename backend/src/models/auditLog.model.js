import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorName: String,
  action: String, // e.g., "USER_APPROVED", "TICKET_RESOLVED"
  details: String,
  ipAddress: String,
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
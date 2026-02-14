import mongoose from 'mongoose';

const SystemSettingsSchema = new mongoose.Schema({
  // Platform Identity
  platformName: { type: String, default: 'Zyra' },
  supportEmail: { type: String, default: 'support@zyra.com' },

  // System Limits
  maxUploadSizeMB: { type: Number, default: 5 },
  auditLogRetentionDays: { type: Number, default: 90 },

  // Security & Operations
  maintenanceMode: { type: Boolean, default: false },
  allowRegistration: { type: Boolean, default: true },
  sessionTimeoutHours: { type: Number, default: 24 }, // 24 Hours

  // Deprecated (Keeping for safety, but hidden)
  currency: { type: String, default: '₹' },
  defaultTaxRate: { type: Number, default: 18 },
  lowStockThreshold: { type: Number, default: 10 },
  expiryAlertDays: { type: Number, default: 30 },
}, { timestamps: true });

// Ensure only one settings document exists
SystemSettingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) return settings;
  
  return await this.create({
    platformName: 'Zyra',
    supportEmail: 'support@zyra.com',
    maxUploadSizeMB: 5,
    auditLogRetentionDays: 90
  });
};

export default mongoose.model('SystemSettings', SystemSettingsSchema);
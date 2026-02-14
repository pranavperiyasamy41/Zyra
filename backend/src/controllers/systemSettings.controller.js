import SystemSettings from '../models/systemSettings.model.js';
import AuditLog from '../models/auditLog.model.js';
import { getIp } from '../utils/getIp.js';

// Get Settings
export const getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Settings
export const updateSettings = async (req, res) => {
  try {
    const { 
      platformName, supportEmail,
      maxUploadSizeMB, auditLogRetentionDays,
      maintenanceMode, allowRegistration, sessionTimeoutHours
    } = req.body;

    let settings = await SystemSettings.getSettings();

    // Identity
    settings.platformName = platformName ?? settings.platformName;
    settings.supportEmail = supportEmail ?? settings.supportEmail;
    
    // Limits
    settings.maxUploadSizeMB = maxUploadSizeMB ?? settings.maxUploadSizeMB;
    settings.auditLogRetentionDays = auditLogRetentionDays ?? settings.auditLogRetentionDays;

    // Operations
    settings.maintenanceMode = maintenanceMode ?? settings.maintenanceMode;
    settings.allowRegistration = allowRegistration ?? settings.allowRegistration;
    settings.sessionTimeoutHours = sessionTimeoutHours ?? settings.sessionTimeoutHours;

    await settings.save();

    // Log Action
    await AuditLog.create({
        actorId: req.user._id, actorName: req.user.username,
        action: "SETTINGS_UPDATED", 
        details: `Updated Platform Configuration`,
        ipAddress: getIp(req)
    });

    res.json({ message: "Configuration Updated", settings });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
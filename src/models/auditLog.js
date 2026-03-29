import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    incident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incident"
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    fromStatus: String,
    toStatus: String

}, {timestamps: true});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema ({
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
        require: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: [
            "drug_stockout",
            "equipment_failure",
            "utility_failure",
            "staffing_issue"
        ],
        require: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        require: true
    },
    description: String,
    status: {
        type: String,
        enum: [
            "submitted",
            "acknowledged",
            "in_progress",
            "resolved",
            "closed"
        ],
        default: "submitted"
    },
    occurredAt: {
        type: Date,
        required: true
    }
}, {timestamps: true});

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
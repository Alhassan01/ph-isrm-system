import Incident from "../models/incident.js";
import AuditLog from "../models/auditLog.js";

export const createIncident = async (req, res) => {
    try{
        const {type, severity, description, occurredAt} = req.body;
        const incident = await Incident.create({
            type,
            severity,
            description,
            occurredAt,
            facility: req.user.facility,
            reportedBy: req.user.id
        });

        res.status(200).json({
            success: true,
            data: incident
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateIncidentStatus = async (req, res) => {
    try{
        //const { status } = req.body;
        let { status } = req.body;
            status = status.trim().toLowerCase();
        const incident = await Incident.findById(req.params.id);

        if(!incident){
            return res.status(404).json({
                success: false,
                message: "Incident not found"
            });
        }
        //prevent national admin from editing incident details
        if (
  req.user.role === "national_admin" &&
  req.method === "PUT" &&
  !req.body.status
) {
  return res.status(403).json({
    success: false,
    message: "National Admin cannot edit incident details"
  });
  const incident = await Incident.findById(req.params.id);

const oldStatus = incident.status;

// update status
incident.status = req.body.status;

await incident.save();

// ✅ CREATE AUDIT LOG
await AuditLog.create({
  incident: incident._id,
  changedBy: req.user.id,
  fromStatus: oldStatus,
  toStatus: req.body.status
});
  
}
            // if(req.user.role === "national_admin" && req.method === "PUT"){
            //     return res.status(403).json({
            //         success: false,
            //         message: "National Admin cannot edit incident details"
            //     });
            // }
        //1 Role check
        //Prevent editing after submission (except status by authorized roles)
        const allowedRoles = ["district_officer", "regional_supervisor", "national_admin"];
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "not authorized to update incident status"
            });
        }

        //2 Status flow check
        //Status flows rules
        const statusFlows = {
            submitted: ["acknowledged"],
            acknowledged: ["in_progress"],
            in_progress: ["resolved"],
            resolved: ["closed"]
        };

        const currentStatus = incident.status;

        //check if transition is allowed
        if(!statusFlows[currentStatus] || !statusFlows[currentStatus].includes(status)){
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from ${currentStatus} to ${status}`
            });
        }
        
        //3 Role-specific check
        const roleStatusMap = {
            district_officer: ["acknowledged"],
            regional_supervisor: ["in_progress"],
            national_admin: ["resolved", "closed"]
        };
        const userRole = req.user.role.trim().toLowerCase();
        if(!roleStatusMap[userRole] || !roleStatusMap[userRole].includes(status)) {
            return res.status(403).json({
                success: false,
                message: `${userRole} cannot set status to ${status}` 
            });

//             if (!roleStatusMap[userRole] || !roleStatusMap[userRole].includes(status)) {
//                 return res.status(403).json({
//                         success: false,
//             message: `${userRole} cannot set status to ${status}. User Role: ${req.user.role}`
//   });
// }
        }
        const previousStatus = incident.status;

        //4 Update 
        incident.status = status;
        await incident.save();

        res.status(200).json({
            success: true,
            data: incident
        });

        //Audit log
        await AuditLog.create({
            incident: incident._id,
            changedBy: req.user.id,
            fromStatus: previousStatus,
            toStatus: status
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
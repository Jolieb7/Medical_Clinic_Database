// appointmentController is the controller for creating/updating/deleting appointments
const db = require('..config/db');

exports.getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query("SELECT * FROM APPOINTMENTS");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch appointments."});
    }
};

exports.createAppointment = async (req, res) => {
    const { patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO APPOINTMENTS (patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status]
        );
        res.json({ id: result[0].insertId, message: "Appointment created successfully." });
    } catch (error) {
        res.status(500).json({ error: "Unable to create an appointment."});
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const [appointment] = await db.query("SELECT * FROM APPOINTMENTS WHERE appointment_id = ?", [req.params.id]);
        if (appointment.length === 0) return res.status(404).json({ message: "Appointment not found." });
        res.json(appointment[0]);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch appointment." });
    }
};

exports.updateAppointment = async (req, res) => {
    const { appointment_status } = req.body;
    try {
        await db.query("UPDATE APPOINTMENTS SET appointment_status = ? WHERE appointment_id = ?", [appointment_status, req.params.id]);
        res.json({ message: "Appointment updated successfully." });
    } catch (error) {
        res.status(500).json({ error: "Unable to update appointment." });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await db.query("DELETE FROM APPOINTMENTS WHERE appointment_id = ?", [req.params.id]);
        res.json({ message: "Appointment deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Unable to delete appointment." });
    }
};

exports.checkInPatient = async (req, res) => {
    const { appointment_id } = req.params;
    const check_in_time = new Date();
    
    try {
        const [appointment] = await db.query("SELECT * FROM APPOINTMENTS WHERE id = ?", [appointment_id]);

        if (!appointment.length) {
            return res.status(404).json({ error: "Unable to find appointment." });
        }

        await db.query("UPDATE APPOINTMENTS SET patient_check_in_time = ? WHERE id = ?", [check_in_time, appointment_id]);

        res.json({ message: "Patient checked in successfully", check_in_time });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to check in patient" });
    }
};

exports.checkOutPatient = async (req, res) => {
    const { appointment_id } = req.params;
    const check_out_time = new Date();

    try {
        const [appointment] = await db.query("SELECT * FROM APPOINTMENTS WHERE id = ?", [appointment_id]);

        if (!appointment.length) {
            return res.status(404).json({ error: "Unable to find appointment." });
        }

        await db.query("UPDATE APPOINTMENTS SET patient_check_out_time = ? WHERE id = ?", [check_out_time, appointment_id]);

        res.json({ message: "Patient checked out successfully", check_out_time });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to check out patient." });
    }
};



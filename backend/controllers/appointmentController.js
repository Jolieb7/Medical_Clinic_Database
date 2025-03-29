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
    const created_by = req.user.user_id; // Get patient ID from the token
    
    // Ensure the logged-in user is a patient
     if (req.user.role !== "Patient") {
        return res.status(403).json({ error: "Only patients can create appointments" });
        }
    
    try {
        // 1. Ensure all required fields are provided
        if (!patient_id || !doctor_id || !clinic_id || !start_time || !end_time) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // 2. Validate time range
        const startTime = new Date(start_time);
        const endTime = new Date(end_time);
        if (startTime >= endTime) {
            return res.status(400).json({ error: "Start time must be before end time." });
        }

        // 3. Ensure appointment is not in the past
        const now = new Date();
        if (startTime < now) {
            return res.status(400).json({ error: "Appointment time must be in the future." });
        }

        // 4. Check if patient, doctor, and clinic exist
        const [patient] = await db.query("SELECT id FROM PATIENTS WHERE id = ?", [patient_id]);
        const [doctor] = await db.query("SELECT id FROM DOCTORS WHERE id = ?", [doctor_id]);
        const [clinic] = await db.query("SELECT id FROM CLINIC WHERE id = ?", [clinic_id]);

        if (!patient.length || !doctor.length || !clinic.length) {
            return res.status(404).json({ error: "Invalid patient, doctor, or clinic ID." });
        }

        // 5. Check for overlapping appointments for the doctor
        const [existingAppointments] = await db.query(
            "SELECT * FROM APPOINTMENTS WHERE doctor_id = ? AND ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))",
            [doctor_id, start_time, end_time, start_time, end_time]

        );

        if (existingAppointments.length > 0) {
            return res.status(400).json({ error: "Doctor is already booked for this time." });
        }

        //Checking to see if the appointment_type is 'Specialist'. If it is, then must ensure patient has a referral (trigger).
        if (appointment_type === "Specialist") {
        const referralQuery = `
          SELECT * FROM REFERRALS
          WHERE patient_id = ? AND referral_status != 'Declined'
        `;
        const [referral] = await db.query(referralQuery, [patient_id]);
  
        if (!referral.length) {
          return res.status(403).json({ error: "A valid referral is required for a specialist appointment" });
        }
      }

        // 6. Insert appointment if all checks pass
        const result = await db.query(
            "INSERT INTO APPOINTMENTS (patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status]
        );

        res.json({ id: result[0].insertId, message: "Appointment created successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to create an appointment." });
    }
};

exports.createAppointmentByReceptionist = async (req, res) => {
    const { patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status } = req.body;
    const receptionist_id = req.user.employee_id; // Now using `employee_id` from `req.user`
    
    // Ensure the logged-in user is a receptionist
    if (req.user.role !== "Receptionist") {
        return res.status(403).json({ error: "Only receptionists can create appointments." });
    }
    

    if (!receptionist_id) {
        return res.status(403).json({ error: "Unauthorized: Receptionist ID required." });
    }
     try {
        // 1. Ensure all required fields are provided
        if (!patient_id || !doctor_id || !clinic_id || !start_time || !end_time) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // 2. Validate time range
        const startTime = new Date(start_time);
        const endTime = new Date(end_time);
        if (startTime >= endTime) {
            return res.status(400).json({ error: "Start time must be before end time." });
        }

        // 3. Ensure appointment is not in the past
        const now = new Date();
        if (startTime < now) {
            return res.status(400).json({ error: "Appointment time must be in the future." });
        }

        // 4. Check if patient, doctor, and clinic exist
        const [patient] = await db.query("SELECT id FROM PATIENTS WHERE id = ?", [patient_id]);
        const [doctor] = await db.query("SELECT id FROM DOCTORS WHERE id = ?", [doctor_id]);
        const [clinic] = await db.query("SELECT id FROM CLINIC WHERE id = ?", [clinic_id]);

        if (!patient.length || !doctor.length || !clinic.length) {
            return res.status(404).json({ error: "Invalid patient, doctor, or clinic ID." });
        }

        // 5. Check for overlapping appointments for the doctor
        const [existingAppointments] = await db.query(
            "SELECT * FROM APPOINTMENTS WHERE doctor_id = ? AND ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))",
            [doctor_id, start_time, end_time, start_time, end_time]      
        );

        if (existingAppointments.length > 0) {
            return res.status(400).json({ error: "Doctor is already booked for this time." });
        }

        // 6. Insert appointment if all checks pass
        // Insert appointment with `created_by` as receptionist_id (employee_id)
        const result = await db.query(
            "INSERT INTO APPOINTMENTS (patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [patient_id, doctor_id, clinic_id, start_time, end_time, appointment_type, appointment_status, receptionist_id]
        );

        res.json({ id: result[0].insertId, message: "Appointment created successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to create an appointment." });
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

const updateAppointment = async (req, res) => {
    try {
      const { appointment_id } = req.params;
      const { patient_id, doctor_id, clinic_id, start_time, end_time, reason, appointment_status } = req.body;
  
      // Step 1: Check if the appointment exists and retrieve `created_by`
      const [appointment] = await db.query("SELECT * FROM APPOINTMENTS WHERE appointment_id = ?", [appointment_id]);
      if (!appointment.length) {
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      const created_by = appointment[0].created_by; // Preserve the original creator
  
      // Prevent updates if the appointment is already "Canceled" or "Finished"
      if (["Canceled", "Finished"].includes(appointment[0].appointment_status)) {
        return res.status(403).json({ error: "Cannot update a canceled or finished appointment" });
      }
  
      // Validate required fields
      if (!patient_id || !doctor_id || !clinic_id || !start_time || !end_time || !appointment_status) {
        return res.status(400).json({ error: "Missing required fields. Ensure all attributes are provided." });
      }
  
      // Ensure start_time is before end_time
      const startTime = new Date(start_time);
      const endTime = new Date(end_time);
      if (startTime >= endTime) {
        return res.status(400).json({ error: "Start time must be before end time" });
      }
  
      // Step 2: Check for doctor schedule conflicts
      const checkQuery = `
        SELECT * FROM APPOINTMENTS 
        WHERE doctor_id = ? 
        AND appointment_id != ?  -- Ensure we don't compare against the same appointment
        AND ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))
      `;
  
      const [existingAppointments] = await db.query(checkQuery, [doctor_id, appointment_id, start_time, end_time, start_time, end_time]);
  
      if (existingAppointments.length > 0) {
        return res.status(409).json({ error: "Doctor is already booked for this time slot" });
      }
  
      // Step 3: Update the appointment details, keeping `created_by` unchanged
      const updateQuery = `
        UPDATE APPOINTMENTS 
        SET patient_id = ?, doctor_id = ?, clinic_id = ?, start_time = ?, end_time = ?, reason = ?, appointment_status = ?, created_by = ?
        WHERE appointment_id = ?
      `;
  
      await db.query(updateQuery, [patient_id, doctor_id, clinic_id, start_time, end_time, reason, appointment_status, created_by, appointment_id]);
  
      res.status(200).json({ message: "Appointment updated successfully" });
  
    } catch (err) {
      console.error("Error updating appointment:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  

  const cancelAppointment = async (req, res) => {
    try {
      const { appointment_id } = req.params;
  
      // Step 1: Retrieve the appointment details
      const [appointment] = await db.query("SELECT * FROM APPOINTMENTS WHERE appointment_id = ?", [appointment_id]);
      if (!appointment.length) {
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      const { patient_id, start_time, appointment_status, created_by } = appointment[0];
  
      // Ensure only the patient who booked the appointment can cancel it
      if (req.user.role === "Patient" && created_by !== req.user.patient_id) {
        return res.status(403).json({ error: "You can only cancel your own appointments" });
      }
  
      // Prevent cancellation of already canceled or finished appointments
      if (["Canceled", "Finished"].includes(appointment_status)) {
        return res.status(403).json({ error: "Cannot cancel an appointment that is already canceled or finished" });
      }
  
      // Step 2: Check if cancellation is within 24 hours
      const now = new Date();
      const appointmentStartTime = new Date(start_time);
      const hoursDifference = (appointmentStartTime - now) / (1000 * 60 * 60); // Convert milliseconds to hours
  
      let fineAmount = 0;
      if (hoursDifference < 24) {
        fineAmount = 25; // Minimum fine of $25
      }
  
      // Step 3: Update appointment_status to "Canceled"
      const updateQuery = "UPDATE APPOINTMENTS SET appointment_status = 'Canceled' WHERE appointment_id = ?";
      await db.query(updateQuery, [appointment_id]);
  
      // Step 4: If a fine applies, update the patient's billing total_amount
      if (fineAmount > 0) {
        const billingQuery = `
          UPDATE BILLING 
          SET total_amount = total_amount + ? 
          WHERE patient_id = ?
        `;
        await db.query(billingQuery, [fineAmount, patient_id]);
      }
  
      res.status(200).json({
        message: "Appointment canceled successfully",
        fine: fineAmount > 0 ? `A fine of $${fineAmount} has been added to your billing account.` : "No fine applied."
      });
  
    } catch (err) {
      console.error("Error canceling appointment:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

const deleteAppointment = async (req, res) => {
    try {
      const { appointment_id } = req.params;
  
      // Check if the appointment exists
      const [appointment] = await db.query("SELECT * FROM APPOINTMENTS WHERE appointment_id = ?", [appointment_id]);
      if (!appointment.length) {
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      // Ensure only a receptionist or admin can delete
      if (!["Receptionist", "Admin"].includes(req.user.role)) {
        return res.status(403).json({ error: "Only receptionists or admins can delete appointments" });
      }
  
      // Delete the appointment
      const deleteQuery = "DELETE FROM APPOINTMENTS WHERE appointment_id = ?";
      await db.query(deleteQuery, [appointment_id]);
  
      res.status(200).json({ message: "Appointment deleted successfully" });
  
    } catch (err) {
      console.error("Error deleting appointment:", err);
      res.status(500).json({ error: "Internal server error" });
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
        
        // Ensure only a receptionist can check in a patient
        if (req.user.role !== "Receptionist") {
            return res.status(403).json({ error: "Only receptionists can check in patients" });
        }
  
        // Update check-in time
        const updateQuery = "UPDATE APPOINTMENTS SET patient_check_in_time = ? WHERE appointment_id = ?";
        await db.query(updateQuery, [check_in_time, appointment_id]);
  
      res.status(200).json({ message: "Patient checked in successfully", check_in_time });
  
    } catch (err) {
      console.error("Error checking in patient:", err);
      res.status(500).json({ error: "Internal server error" });
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

        // Ensure only a receptionist can check out a patient
        if (req.user.role !== "Receptionist") {
            return res.status(403).json({ error: "Only receptionists can check out patients" });
        }
  
        // Update check-out time and mark appointment as Finished
        const updateQuery = "UPDATE APPOINTMENTS SET patient_check_out_time = ?, appointment_status = 'Finished' WHERE appointment_id = ?";
        await db.query(updateQuery, [check_out_time, appointment_id]);
  
        res.status(200).json({ message: "Patient checked out successfully", check_out_time });
  
    } catch (err) {
      console.error("Error checking out patient:", err);
      res.status(500).json({ error: "Internal server error" });
    }
};


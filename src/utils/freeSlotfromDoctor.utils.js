import Doctor from "../db/models/doctors.models.js";
import { ApiError } from "./apiError.js";
import { asyncHandler } from "./asyncHandler.js";

const freeSlotfromDoctor = asyncHandler(async (docId, slotDate, slotTime) => {
  const dateKey = String(slotDate).trim();
  const timeKey = String(slotTime).trim();

  // Remove the time from that day's slots
  await Doctor.updateOne(
    { _id: docId },
    { $pull: { [`slots_booked.${dateKey}`]: timeKey } }
  );

  // Remove the date key if empty
  await Doctor.updateOne(
    { _id: docId, [`slots_booked.${dateKey}`]: { $size: 0 } },
    { $unset: { [`slots_booked.${dateKey}`]: "" } }
  );

  console.log("✅ Slot removed for", docId, dateKey, timeKey);
  return true;
});


export default freeSlotfromDoctor;

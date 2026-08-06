const MaintenanceBill = require("../models/MaintenanceBill");
const Resident = require("../models/Resident");
const asyncHandler = require("../utils/asyncHandler");
const { validateMaintenanceBillPayload } = require("../validators/maintenanceValidator");

const formatMaintenanceBillResponse = (bill) => ({
  id: bill._id,
  resident: bill.resident,
  residentName: bill.residentName,
  flatNumber: bill.flatNumber,
  billMonth: bill.billMonth,
  billYear: bill.billYear,
  amount: bill.amount,
  dueDate: bill.dueDate,
  paymentDate: bill.paymentDate,
  status: bill.status,
  paymentMethod: bill.paymentMethod,
  transactionId: bill.transactionId,
  remarks: bill.remarks,
  createdBy: bill.createdBy,
  paymentHistory: bill.paymentHistory,
  createdAt: bill.createdAt,
  updatedAt: bill.updatedAt,
});

const buildSearchFilter = (search) => {
  if (!search) {
    return {};
  }

  const safeSearch = search.trim();

  return {
    $or: [
      { residentName: { $regex: safeSearch, $options: "i" } },
      { flatNumber: { $regex: safeSearch, $options: "i" } },
      { remarks: { $regex: safeSearch, $options: "i" } },
      { transactionId: { $regex: safeSearch, $options: "i" } },
      { paymentMethod: { $regex: safeSearch, $options: "i" } },
      { status: { $regex: safeSearch, $options: "i" } },
    ],
  };
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);

  return { page, limit, skip: (page - 1) * limit };
};

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const normalizeStatus = (status, dueDate) => {
  const effectiveStatus = status || "Pending";

  if (effectiveStatus === "Paid") {
    return "Paid";
  }

  const dueDateValue = new Date(dueDate);
  if (!Number.isNaN(dueDateValue.getTime())) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDateValue < today) {
      return "Overdue";
    }
  }

  return effectiveStatus;
};

const buildPaymentHistoryEntry = (bill, payload, createdBy) => ({
  status: "Paid",
  paymentDate: payload.paymentDate || new Date(),
  paymentMethod: payload.paymentMethod || bill.paymentMethod || "",
  transactionId: payload.transactionId || bill.transactionId || "",
  remarks: payload.remarks || bill.remarks || "",
  amount: bill.amount,
  createdBy,
});

const resolveResident = async (residentId) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[maintenanceController] Resident.findById input:", residentId);
  }

  const resident = await Resident.findById(residentId);

  if (!resident) {
    return null;
  }

  return resident;
};

const listMaintenanceBills = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {
    ...buildSearchFilter(req.query.search),
  };

  const status = req.query.status;
  if (status) {
    filter.status = status;
  }

  const month = parseOptionalInt(req.query.month);
  if (month !== undefined) {
    filter.billMonth = month;
  }

  const year = parseOptionalInt(req.query.year);
  if (year !== undefined) {
    filter.billYear = year;
  }

  if (req.query.flatNumber) {
    filter.flatNumber = { $regex: req.query.flatNumber.trim(), $options: "i" };
  }

  const [bills, total] = await Promise.all([
    MaintenanceBill.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MaintenanceBill.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Maintenance bills fetched successfully",
    data: {
      bills: bills.map(formatMaintenanceBillResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getMaintenanceBillById = asyncHandler(async (req, res) => {
  const bill = await MaintenanceBill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Maintenance bill not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Maintenance bill fetched successfully",
    data: {
      bill: formatMaintenanceBillResponse(bill),
    },
  });
});

const resolveBillPayload = async (body, existingBill = null) => {
  const residentId = body.resident || existingBill?.resident;
  let resident = null;

  if (process.env.NODE_ENV !== "production") {
    console.log("[maintenanceController] incoming body resident field:", body.resident);
  }

  if (body.resident !== undefined || !existingBill) {
    resident = await resolveResident(residentId);

    if (!resident) {
      return { error: { statusCode: 404, message: "Resident not found" } };
    }
  }

  const dueDate = body.dueDate !== undefined ? body.dueDate : existingBill?.dueDate;
  const nextStatusInput = body.status !== undefined ? body.status : existingBill?.status;
  const nextPaymentDate =
    body.paymentDate !== undefined
      ? body.paymentDate
      : existingBill?.paymentDate || null;

  const mergedPayload = {
    resident: resident?._id || residentId,
    residentName: body.residentName !== undefined ? body.residentName.trim() : resident?.fullName || existingBill?.residentName,
    flatNumber: body.flatNumber !== undefined ? body.flatNumber.trim() : resident?.flatNumber || existingBill?.flatNumber,
    billMonth: body.billMonth !== undefined ? Number.parseInt(body.billMonth, 10) : existingBill?.billMonth,
    billYear: body.billYear !== undefined ? Number.parseInt(body.billYear, 10) : existingBill?.billYear,
    amount: body.amount !== undefined ? Number(body.amount) : existingBill?.amount,
    dueDate,
    paymentDate: nextStatusInput === "Paid" && !nextPaymentDate ? new Date() : nextPaymentDate,
    status: normalizeStatus(nextStatusInput, dueDate),
    paymentMethod: body.paymentMethod !== undefined ? body.paymentMethod : existingBill?.paymentMethod || "",
    transactionId: body.transactionId !== undefined ? body.transactionId : existingBill?.transactionId || "",
    remarks: body.remarks !== undefined ? body.remarks : existingBill?.remarks || "",
  };

  return { data: mergedPayload };
};

const createMaintenanceBill = asyncHandler(async (req, res) => {
  const authenticatedUserId = req.user?._id || req.user?.id;

  const resolved = await resolveBillPayload(req.body);
  if (resolved.error) {
    return res.status(resolved.error.statusCode).json({
      success: false,
      message: resolved.error.message,
    });
  }

  const billData = {
    ...resolved.data,
    createdBy: authenticatedUserId,
  };

  const validationErrors = validateMaintenanceBillPayload(billData);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  if (billData.status === "Paid" && !billData.paymentDate) {
    billData.paymentDate = new Date();
  }

  const bill = await MaintenanceBill.create({
    ...billData,
    paymentHistory:
      billData.status === "Paid"
        ? [buildPaymentHistoryEntry(billData, billData, authenticatedUserId)]
        : [],
  });

  res.status(201).json({
    success: true,
    message: "Maintenance bill created successfully",
    data: {
      bill: formatMaintenanceBillResponse(bill),
    },
  });
});

const updateMaintenanceBill = asyncHandler(async (req, res) => {
  const bill = await MaintenanceBill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Maintenance bill not found",
    });
  }

  const resolved = await resolveBillPayload(req.body, bill);
  if (resolved.error) {
    return res.status(resolved.error.statusCode).json({
      success: false,
      message: resolved.error.message,
    });
  }

  const validationErrors = validateMaintenanceBillPayload({
    ...resolved.data,
    createdBy: bill.createdBy,
  }, { partial: false });

  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validationErrors,
    });
  }

  Object.assign(bill, {
    ...resolved.data,
    createdBy: bill.createdBy,
    status: resolved.data.status === "Paid" ? "Paid" : normalizeStatus(resolved.data.status, resolved.data.dueDate),
  });

  if (bill.status === "Paid" && !bill.paymentDate) {
    bill.paymentDate = new Date();
  }

  const updatedBill = await bill.save();

  res.status(200).json({
    success: true,
    message: "Maintenance bill updated successfully",
    data: {
      bill: formatMaintenanceBillResponse(updatedBill),
    },
  });
});

const deleteMaintenanceBill = asyncHandler(async (req, res) => {
  const bill = await MaintenanceBill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Maintenance bill not found",
    });
  }

  await bill.deleteOne();

  res.status(200).json({
    success: true,
    message: "Maintenance bill deleted successfully",
    data: null,
  });
});

const markBillPaid = asyncHandler(async (req, res) => {
  const bill = await MaintenanceBill.findById(req.params.id);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: "Maintenance bill not found",
    });
  }

  const authenticatedUserId = req.user?._id || req.user?.id;
  const paymentDate = req.body.paymentDate && !Number.isNaN(Date.parse(req.body.paymentDate))
    ? new Date(req.body.paymentDate)
    : new Date();

  bill.status = "Paid";
  bill.paymentDate = paymentDate;
  bill.paymentMethod = req.body.paymentMethod || bill.paymentMethod || "";
  bill.transactionId = req.body.transactionId !== undefined ? req.body.transactionId : bill.transactionId || "";
  bill.remarks = req.body.remarks !== undefined ? req.body.remarks : bill.remarks || "";
  bill.paymentHistory.push(buildPaymentHistoryEntry(bill, { ...req.body, paymentDate }, authenticatedUserId));

  const updatedBill = await bill.save();

  res.status(200).json({
    success: true,
    message: "Maintenance bill marked as paid",
    data: {
      bill: formatMaintenanceBillResponse(updatedBill),
    },
  });
});

module.exports = {
  listMaintenanceBills,
  getMaintenanceBillById,
  createMaintenanceBill,
  updateMaintenanceBill,
  deleteMaintenanceBill,
  markBillPaid,
};
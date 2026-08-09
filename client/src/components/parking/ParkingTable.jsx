import { HiPencil, HiTrash, HiEye } from "react-icons/hi2";

const formatVehicleType = (type) => {
  const typeMap = {
    "Two Wheeler": "Two Wheeler",
    "Four Wheeler": "Four Wheeler",
    Truck: "Truck",
    Motorcycle: "Motorcycle",
    Scooter: "Scooter",
  };
  return typeMap[type] || type;
};

const formatStatus = (status) => {
  const statusMap = {
    Active: { color: "bg-emerald-50 text-emerald-700", label: "Active" },
    Inactive: { color: "bg-slate-50 text-slate-700", label: "Inactive" },
    Expired: { color: "bg-red-50 text-red-700", label: "Expired" },
    Occupied: { color: "bg-violet-50 text-violet-700", label: "Occupied" },
    Vacant: { color: "bg-orange-50 text-orange-700", label: "Vacant" },
  };
  const style = statusMap[status] || statusMap.Inactive;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.color}`}>{style.label}</span>;
};

const formatSlotType = (type) => {
  const typeMap = {
    Covered: { color: "bg-blue-50 text-blue-700", label: "Covered" },
    Open: { color: "bg-green-50 text-green-700", label: "Open" },
    Reserved: { color: "bg-purple-50 text-purple-700", label: "Reserved" },
  };
  const style = typeMap[type] || typeMap.Covered;
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.color}`}>{style.label}</span>;
};

const formatExpiryStatus = (expiryDate) => {
  const date = new Date(expiryDate);
  const now = new Date();
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return <span className="text-xs text-red-700">Expired</span>;
  } else if (diffDays <= 7) {
    return <span className="text-xs text-orange-700">Expires in {diffDays} {diffDays === 1 ? "day" : "days"}</span>;
  }
  return <span className="text-xs text-slate-500">Expires in {diffDays} {diffDays === 1 ? "day" : "days"}</span>;
};

const ParkingTable = ({ parking, onView, onEdit, onDelete }) => {
  const getExpiryDate = (expiryDate) => {
    if (!expiryDate) return "N/A";
    try {
      return new Date(expiryDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (!parking || !Array.isArray(parking)) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-slate-500">No parking data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Slot</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Vehicle</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Resident</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Location</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Slot Type</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Expiry</th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {parking.map((slot) => (
              <tr key={slot.id || slot._id} className="transition-colors hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{slot.slotNumber || "N/A"}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{formatVehicleType(slot.vehicleType)}</div>
                  <div className="text-xs text-slate-500">{slot.vehicleNumber || "N/A"}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{slot.residentName || "N/A"}</div>
                  <div className="text-xs text-slate-500">{slot.flatNumber || "N/A"}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-900">{slot.flatNumber || "N/A"}</div>
                  <div className="text-xs text-slate-500">{slot.block || "N/A"}</div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">{formatStatus(slot.status)}</td>

                <td className="whitespace-nowrap px-6 py-4">{formatSlotType(slot.parkingSlotType)}</td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-slate-900">{getExpiryDate(slot.expiryDate)}</div>
                  {formatExpiryStatus(slot.expiryDate)}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(slot)}
                      className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      title="View"
                    >
                      <HiEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(slot)}
                      className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                      title="Edit"
                    >
                      <HiPencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(slot)}
                      className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {parking.length === 0 && (
        <div className="p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 p-3">
            <svg className="h-full w-full text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4 0h1m-5-4h.01M9 11h.01M12 15h.01M15 15h.01M9 7h.01M9 11h.01M9 15h.01M12 7h.01M12 11h.01M15 7h.01M15 11h.01"
              />
            </svg>
          </div>
          <p className="mt-4 text-sm text-slate-500">No parking slots found</p>
        </div>
      )}
    </div>
  );
};

export default ParkingTable;
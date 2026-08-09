import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { fetchParkingSlot } from "@/services/parkingService";
import { getApiError } from "@/utils/apiError";

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

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const ParkingDetails = () => {
  const navigate = useNavigate();
  const { parkingId } = useParams();
  const [parking, setParking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadParkingDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchParkingSlot(parkingId);
        setParking(data.data.parking);
      } catch (err) {
        const apiError = getApiError(err);
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadParkingDetails();
  }, [parkingId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !parking) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-900">Error</h1>
        <p className="mt-2 text-red-700">
          {error?.message || "Parking slot not found"}
        </p>
        <Button onClick={() => navigate(ROUTES.PARKING)} className="mt-4">
          Back to Parking
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Parking Slot Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View parking allocation details for {parking.slotNumber}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.PARKING)}>
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Slot Number</dt>
              <dd className="mt-1 text-sm text-slate-900">{parking.slotNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Vehicle Type</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatVehicleType(parking.vehicleType)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Vehicle Number</dt>
              <dd className="mt-1 text-sm font-mono text-slate-900">{parking.vehicleNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Resident Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{parking.residentName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Contact Number</dt>
              <dd className="mt-1 text-sm text-slate-900">{parking.contactNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Location</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {parking.flatNumber}, {parking.block}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Schedule & Status</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Allocated Date</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDate(parking.allocatedDate)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Expiry Date</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDate(parking.expiryDate)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Status</dt>
              <dd className="mt-1">{formatStatus(parking.status)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Slot Type</dt>
              <dd className="mt-1">{formatSlotType(parking.parkingSlotType)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Active Status</dt>
              <dd className="mt-1 text-sm text-slate-900">{parking.isActive ? "Yes" : "No"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Notes</dt>
              <dd className="mt-1 text-sm text-slate-900">{parking.notes || "No notes available"}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">System Information</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Created At</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatDate(parking.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-900">{formatDate(parking.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.PARKING_EDIT.replace(":parkingId", parkingId))}
        >
          Edit Slot
        </Button>
        <Button onClick={() => navigate(ROUTES.PARKING)}>Back to List</Button>
      </div>
    </div>
  );
};

export default ParkingDetails;
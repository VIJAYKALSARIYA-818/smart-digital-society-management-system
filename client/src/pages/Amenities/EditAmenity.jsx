import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { fetchAmenity, updateAmenity } from "@/services/amenityService";
import { getApiError } from "@/utils/apiError";
import { AmenityForm } from "./AddAmenity";

const EditAmenity = () => {
  const navigate = useNavigate();
  const { amenityId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [amenity, setAmenity] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAmenity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchAmenity(amenityId);
        setAmenity(data.data.amenity);
      } catch (err) {
        const apiError = getApiError(err);
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadAmenity();
  }, [amenityId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateAmenity(amenityId, payload);
      navigate(ROUTES.AMENITIES, {
        state: { successMessage: "Amenity updated successfully" },
      });
    } catch (submitError) {
      const apiError = getApiError(submitError);
      setError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <FormCard
      title="Edit amenity"
      subtitle="Update amenity details and configuration."
      footer={
        <Button type="button" onClick={() => navigate(ROUTES.AMENITIES)} variant="outline">
          Back to amenities
        </Button>
      }
    >
      {error ? (
        <div className="mb-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800 font-medium">{error.message}</p>
          </div>
        </div>
      ) : null}

      <AmenityForm
        initialValues={amenity || {}}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        submitLabel="Update amenity"
      />
    </FormCard>
  );
};

export default EditAmenity;
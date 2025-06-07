import { Location } from "@/utils/supabase/repositories/LocationsRepository";
import Field from "./Field";

type LocationDetailsProps = {
  location: Location;
};

export default function LocationDetails({
  location,
}: LocationDetailsProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mt-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        
        <Field label="Id" value={location.id} />
        <Field label="Building" value={location.building} />
        <Field label="Direction" value={location.direction} />
      </div>

    </div>
  );
}
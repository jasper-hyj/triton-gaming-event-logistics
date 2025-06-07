import { Location } from "@/lib/repositories/LocationsRepository";
import FormComponent from "../../components/FormComponent";

type LocationDetailsProps = {
  location: Location;
};

export default function LocationDetails({ location }: LocationDetailsProps) {
  const formComponent = new FormComponent();
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 mt-6 text-left">
      <h2 className="text-3xl font-semibold text-gray-800">{location.id}</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <formComponent.Text label="Building" value={location.building} />
        <formComponent.Text label="Direction" value={location.direction} />
      </div>
    </div>
  );
}

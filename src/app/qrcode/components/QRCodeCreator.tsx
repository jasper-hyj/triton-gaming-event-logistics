"use client";

type QRCodeCreatorProps = {
  url: string;
  setUrl: (id: string) => void;
  loading: boolean;
  handleGenerate: () => void;
};

export default function QRCodeCreator({
  url,
  setUrl,
  loading,
  handleGenerate,
}: QRCodeCreatorProps) {
  return (
    <>
      <h1 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
        Generate a QRcode
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-2">
        <input
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          placeholder="Generate by URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm sm:text-base"
          onClick={handleGenerate}
          disabled={loading}
        >
          Generate
        </button>
      </div>
    </>
  );
}

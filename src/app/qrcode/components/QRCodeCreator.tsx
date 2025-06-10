import { QRCode } from "@/app/components/QRCodeGenerator";

type QRCodeInfoBarProps = {
  qrcode: QRCode;
  setQrcode: (qrcode: QRCode) => void;
  loading: boolean;
  handleGenerate: () => void;
};

export default function QRCodeInfoBar({
  qrcode,
  setQrcode,
  loading,
  handleGenerate,
}: QRCodeInfoBarProps) {
  return (
    <>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 sm:p-8 mx-auto mb-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Generate a QR Code
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="url">
              URL
            </label>
            <input
              id="url"
              type="text"
              value={qrcode.url}
              onChange={(e) => setQrcode({ ...qrcode, url: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {/* Size Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">
              Size (px)
            </label>
            <input
              id="size"
              type="number"
              min="100"
              max="1000"
              step="50"
              value={qrcode.size}
              onChange={(e) =>
                setQrcode({
                  ...qrcode,
                  size: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                })
              }
              placeholder="500"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="url">
              Background Color
            </label>
            <select
              value={qrcode.bgColor}
              onChange={(e) =>
                setQrcode({
                  ...qrcode,
                  bgColor: e.target.value,
                })
              }
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 placeholder-gray-400"
            >
              <option value="#ffffff00">Transparent</option>
              <option value="#ffffff">White</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerate}
            disabled={loading || !qrcode.url.trim() || qrcode.size <= 0}
            className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 transition"
          >
            Generate QR Code
          </button>
        </div>
      </div>
    </>
  );
}

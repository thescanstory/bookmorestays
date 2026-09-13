"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const KARNATAKA_TEMPLATES = [
  { hotelName: "Windflower Resorts & Spa", city: "Coorg", directPrice: "15000", mmtPrice: "19000", whatsappNumber: "919876543210" },
  { hotelName: "Taj Garden Retreat", city: "Coorg", directPrice: "12000", mmtPrice: "16000", whatsappNumber: "919876543211" },
  { hotelName: "The Bison - Kabini", city: "Kabini", directPrice: "18000", mmtPrice: "23000", whatsappNumber: "919876543212" },
  { hotelName: "Orange County Coorg", city: "Coorg", directPrice: "14000", mmtPrice: "18500", whatsappNumber: "919876543213" },
  { hotelName: "Serai Retreat", city: "Chikmagalur", directPrice: "13000", mmtPrice: "17000", whatsappNumber: "919876543214" },
  { hotelName: "Hyatt Centric MG Road", city: "Bangalore", directPrice: "9000", mmtPrice: "12000", whatsappNumber: "919876543215" },
  { hotelName: "ITC Gardenia", city: "Bangalore", directPrice: "10500", mmtPrice: "14000", whatsappNumber: "919876543216" },
  { hotelName: "The Ritz-Carlton", city: "Bangalore", directPrice: "22000", mmtPrice: "28000", whatsappNumber: "919876543217" },
  { hotelName: "Goldfinch Hotel", city: "Mysore", directPrice: "8500", mmtPrice: "11000", whatsappNumber: "919876543218" },
  { hotelName: "Regaalis Mysore", city: "Mysore", directPrice: "11000", mmtPrice: "14500", whatsappNumber: "919876543219" },
];

export default function AddPropertyAdmin() {
  const [formData, setFormData] = useState({
    hotelName: "",
    city: "",
    directPrice: "",
    mmtPrice: "",
    whatsappNumber: "",
    instagramLink: "",
    trending: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [bulkText, setBulkText] = useState("");
  const [bulkStatus, setBulkStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [bulkResults, setBulkResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "video/mp4") {
        setErrorMessage("Please upload a valid .mp4 video file.");
        setVideoFile(null);
        return;
      }
      setErrorMessage("");
      setVideoFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!videoFile) {
      setErrorMessage("Please select a video file to upload.");
      return;
    }

    try {
      // 1. Upload Video to Supabase Storage
      setStatus("uploading");

      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-videos')
        .upload(filePath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Video Upload Failed: ${uploadError.message}`);
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-videos')
        .getPublicUrl(filePath);

      // 3. Save to Database
      setStatus("saving");

      const { error: dbError } = await supabase
        .from('properties')
        .insert([{
          name: formData.hotelName,
          city: formData.city,
          direct_price: Number(formData.directPrice),
          mmt_price: Number(formData.mmtPrice),
          whatsapp_number: formData.whatsappNumber,
          video_url: publicUrl,
          has_custom_video: true,
          instagram_link: formData.instagramLink,
          trending: formData.trending
        }]);

      if (dbError) {
        throw new Error(`Database Save Failed: ${dbError.message}`);
      }

      // 4. Success State
      setStatus("success");
      setFormData({ hotelName: "", city: "", directPrice: "", mmtPrice: "", whatsappNumber: "", instagramLink: "", trending: false });
      setVideoFile(null);

      setTimeout(() => setStatus("idle"), 3000);

    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(errorMsg);
    }
  };

  const handleBulkImport = async () => {
    setBulkStatus("processing");
    let successCount = 0;
    let failedCount = 0;

    try {
      const properties = JSON.parse(bulkText);
      if (!Array.isArray(properties)) throw new Error("Input must be a JSON array");

      for (const prop of properties) {
        try {
          const { error } = await supabase.from('properties').insert([{
            name: prop.hotelName,
            city: prop.city,
            direct_price: Number(prop.directPrice),
            mmt_price: Number(prop.mmtPrice),
            whatsapp_number: prop.whatsappNumber,
            instagram_link: prop.instagramLink || "",
            trending: prop.trending || false
          }]);

          if (error) throw error;
          successCount++;
        } catch (err) {
          console.error(err);
          failedCount++;
        }
      }

      setBulkResults({ success: successCount, failed: failedCount });
      setBulkStatus("success");
      setBulkText("");
      toast.success(`Added ${successCount} properties!`);
      setTimeout(() => setBulkStatus("idle"), 3000);
    } catch (err: unknown) {
      console.error(err);
      setBulkStatus("error");
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold text-[#1c2434] tracking-tight">Add New Property</h1>
          <p className="mt-2 text-[#94a3b8] font-medium text-sm">Upload a cinematic tour or bulk-add multiple properties.</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActiveTab("single")}
              className={`px-5 py-2 rounded-full font-bold text-sm transition ${
                activeTab === "single"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-[#1c2434] hover:bg-gray-200"
              }`}
            >
              Single Property
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`px-5 py-2 rounded-full font-bold text-sm transition ${
                activeTab === "bulk"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-[#1c2434] hover:bg-gray-200"
              }`}
            >
              Bulk Import
            </button>
          </div>
        </div>

        {activeTab === "single" && (
          <>
            {status === "success" && (
              <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start">
                <CheckCircle2 className="text-emerald-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-emerald-800 font-bold">Property Added Successfully!</h3>
                  <p className="text-emerald-600 text-sm mt-1">The video is live and the database has been updated.</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start">
                <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-red-800 font-bold">Upload Failed</h3>
                  <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#1c2434] mb-2">Property Name</label>
              <input
                required
                type="text"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-medium"
                placeholder="e.g. Goa Villa"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#1c2434] mb-2">City</label>
              <input
                required
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-medium"
                placeholder="e.g. Goa"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c2434] mb-2">Direct Price (₹)</label>
              <input
                required
                type="number"
                name="directPrice"
                value={formData.directPrice}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-medium"
                placeholder="15000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1c2434] mb-2">MMT Price (₹)</label>
              <input
                required
                type="number"
                name="mmtPrice"
                value={formData.mmtPrice}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-medium"
                placeholder="22000"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#1c2434] mb-2">WhatsApp Number</label>
              <input
                required
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-medium"
                placeholder="e.g. 919876543210"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#1c2434] mb-2">Instagram/TikTok Link (For Search)</label>
              <input
                type="url"
                name="instagramLink"
                value={formData.instagramLink}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-medium"
                placeholder="https://www.instagram.com/reel/..."
              />
            </div>

            <div className="sm:col-span-2 flex items-center bg-gray-50 p-4 rounded-[20px] border border-gray-100">
              <input
                type="checkbox"
                id="trending"
                name="trending"
                checked={formData.trending}
                onChange={handleInputChange}
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="trending" className="ml-3 block text-sm font-bold text-[#1c2434]">
                Show on Home Page (Trending Deal)
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#1c2434] mb-2">Cinematic Video (.mp4)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-[20px] bg-gray-50 hover:bg-blue-50/50 hover:border-primary/30 transition">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-primary opacity-50" />
                  <div className="flex text-sm text-[#64748b] justify-center font-medium mt-4">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-primary hover:text-blue-800 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" accept="video/mp4" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-[#94a3b8] mt-2 font-medium">MP4 up to 50MB</p>
                  {videoFile && (
                    <p className="text-sm font-bold text-primary mt-4 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl inline-block shadow-sm">
                      {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

              <button
                type="submit"
                disabled={status === "uploading" || status === "saving"}
                className="w-full flex justify-center items-center py-4 px-4 rounded-[20px] shadow-lg shadow-primary/30 text-lg font-bold text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-70 transition mt-2"
              >
                {status === "uploading" ? (
                  <><Loader2 className="animate-spin mr-2" /> Uploading Video...</>
                ) : status === "saving" ? (
                  <><Loader2 className="animate-spin mr-2" /> Saving to Database...</>
                ) : (
                  "Add Property"
                )}
              </button>
            </form>
          </>
        )}

        {activeTab === "bulk" && (
          <>
            {bulkStatus === "success" && (
              <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start">
                <CheckCircle2 className="text-emerald-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-emerald-800 font-bold">Bulk Import Successful!</h3>
                  <p className="text-emerald-600 text-sm mt-1">
                    {bulkResults.success} properties added, {bulkResults.failed} failed
                  </p>
                </div>
              </div>
            )}

            {bulkStatus === "error" && (
              <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start">
                <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-red-800 font-bold">Import Failed</h3>
                  <p className="text-red-600 text-sm mt-1">Invalid JSON format or database error</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="text-blue-900 font-bold text-sm">Quick Add Karnataka Hotels</h3>
                <div className="mt-3 grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {KARNATAKA_TEMPLATES.map((hotel, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBulkText(JSON.stringify([hotel], null, 2))}
                      className="text-left px-3 py-2 bg-white hover:bg-blue-50 rounded-lg text-xs border border-blue-200 hover:border-blue-400 transition font-medium text-[#1c2434]"
                    >
                      {hotel.hotelName} • {hotel.city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1c2434] mb-2">
                  Paste JSON Array of Properties
                </label>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`[
  {
    "hotelName": "Windflower Resorts",
    "city": "Coorg",
    "directPrice": "15000",
    "mmtPrice": "19000",
    "whatsappNumber": "919876543210",
    "instagramLink": "",
    "trending": false
  }
]`}
                  className="w-full h-64 bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-sm text-[#1c2434] focus:ring-2 focus:ring-primary/50 outline-none transition font-mono"
                />
              </div>

              <button
                onClick={handleBulkImport}
                disabled={bulkStatus === "processing" || !bulkText.trim()}
                className="w-full flex justify-center items-center py-4 px-4 rounded-[20px] shadow-lg shadow-primary/30 text-lg font-bold text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-70 transition"
              >
                {bulkStatus === "processing" ? (
                  <><Loader2 className="animate-spin mr-2" /> Processing...</>
                ) : (
                  "Import Properties"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

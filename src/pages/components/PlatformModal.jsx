import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";

const PlatformModal = ({ platform, onClose, onSuccess, forAdmin = false, forUser = false }) => {
    const isEditing = !!platform;
    const [formData, setFormData] = useState({
        name: platform?.name || "",
        url: platform?.url || "",
        urlTemplate: platform?.urlTemplate || "",
        type: platform?.type || "",
        scraperStatus: platform?.scraperStatus || "active",
        preferenceWeight: platform?.preferenceWeight || 0,
        parserType: platform?.parserType || "SELENIUM",
        isActive: platform?.isActive ?? true,
        notes: platform?.notes || "",
        detectionYaml: platform?.detectionYaml || "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = "Name is required.";
        if (!formData.url.trim()) errs.url = "URL is required.";
        if (isNaN(formData.preferenceWeight)) errs.preferenceWeight = "Weight must be a number.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please correct errors before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const baseApi = forAdmin ? "admin" : "user";
            const url = isEditing
                ? `${import.meta.env.VITE_API_BASE_URL}/api/${baseApi}/platforms/${platform.publicId}`
                : `${import.meta.env.VITE_API_BASE_URL}/api/${baseApi}/platforms`;
            const method = isEditing ? axios.put : axios.post;

            // Always send isActive as true/false
            const payload = { ...formData, isActive: !!formData.isActive };
            console.log("Submitting payload:", payload);

            await method(url, payload, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(isEditing ? "Platform updated successfully!" : "Platform created successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Platform save error:", error);
            toast.error(error?.response?.data?.message || "Failed to save platform.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Platform" : "Add Platform"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className={`border rounded p-2 ${errors.name ? "border-red-500" : ""}`} />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">URL *</label>
                        <input name="url" value={formData.url} onChange={handleChange} required className={`border rounded p-2 ${errors.url ? "border-red-500" : ""}`} />
                        {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">URL Template</label>
                        <input name="urlTemplate" value={formData.urlTemplate} onChange={handleChange} className="border rounded p-2" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="font-medium mb-1">Type</label>
                            <input name="type" value={formData.type} onChange={handleChange} className="border rounded p-2" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="font-medium mb-1">Scraper Status</label>
                            <select name="scraperStatus" value={formData.scraperStatus} onChange={handleChange} className="border rounded p-2">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="font-medium mb-1">Preference Weight</label>
                            <input name="preferenceWeight" type="number" value={formData.preferenceWeight} onChange={handleChange} className={`border rounded p-2 ${errors.preferenceWeight ? "border-red-500" : ""}`} />
                            {errors.preferenceWeight && <p className="text-red-500 text-sm mt-1">{errors.preferenceWeight}</p>}
                        </div>
                        <div className="flex flex-col flex-1 relative">
                            <div className="flex items-center mb-1">
                                <label className="font-medium">Parser Type *</label>
                                <div className="ml-1 relative group">
                                    <span className="text-gray-400 cursor-pointer">ℹ️</span>
                                    <div className="hidden group-hover:block absolute top-6 left-0 w-64 bg-gray-800 text-white text-xs rounded p-2 z-50 shadow-lg">
                                        Choose how the platform’s job data is scraped:
                                        <ul className="list-disc list-inside mt-1 space-y-1">
                                            <li><b>JSOUP</b>: Static HTML scraping</li>
                                            <li><b>SELENIUM</b>: Dynamic JavaScript-rendered scraping</li>
                                            <li><b>API</b>: Direct API integration</li>
                                            <li><b>CUSTOM</b>: Experimental or custom scraper</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <select
                                name="parserType"
                                value={formData.parserType}
                                onChange={handleChange}
                                className="border rounded p-2"
                                required
                            >
                                <option value="">Select parser type...</option>
                                <option value="JSOUP">JSOUP - Static HTML parsing</option>
                                <option value="SELENIUM">SELENIUM - Dynamic JS pages</option>
                                <option value="API">API - Custom integration</option>
                                <option value="CUSTOM">CUSTOM - Experimental/Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-end">
                            <label className="font-medium mb-1">Active</label>
                            <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 mt-2" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Notes</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} className="border rounded p-2" />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Detection YAML</label>

                        <CodeMirror
                            value={formData.detectionYaml}
                            height="300px"
                            extensions={[yaml()]}
                            theme="light"
                            onChange={(value) => setFormData((prev) => ({ ...prev, detectionYaml: value }))}
                            className="border rounded"
                        />

                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition">Cancel</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                            {submitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlatformModal;

"use client";

import { useState } from "react";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";

type AddWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading?: boolean;
};

export default function AddWorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: Readonly<AddWorkspaceModalProps>) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { name?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });

    // Reset form
    setFormData({ name: "", description: "" });
    setErrors({});
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: "", description: "" });
      setErrors({});
      onClose();
    }
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Workspace">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4 w-96">
            {/* Workspace Name */}
            <div>
              <label
                htmlFor="workspace-name"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Workspace Name *
              </label>
              <input
                type="text"
                id="workspace-name"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Enter workspace name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                disabled={isLoading}
                autoFocus
                maxLength={100}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Workspace Description */}
            <div>
              <label
                htmlFor="workspace-description"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Description
              </label>
              <textarea
                id="workspace-description"
                value={formData.description}
                onChange={handleChange("description")}
                placeholder="Optional description for your workspace"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors resize-none"
                disabled={isLoading}
                maxLength={500}
              />
              <p className="text-xs text-text-secondary mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Workspace"}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

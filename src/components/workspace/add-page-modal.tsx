"use client";

import { useState } from "react";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";

type AddPageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string }) => void;
  isLoading?: boolean;
};

export default function AddPageModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: Readonly<AddPageModalProps>) {
  const [formData, setFormData] = useState({
    title: "",
  });
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { title?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = "Page title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    onSubmit({
      title: formData.title.trim(),
    });

    // Reset form
    setFormData({ title: "" });
    setErrors({});
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ title: "" });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, title: e.target.value }));
    // Clear error when user starts typing
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Page">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4 w-96">
            {/* Page Title */}
            <div>
              <label
                htmlFor="page-title"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Page Title *
              </label>
              <input
                type="text"
                id="page-title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter page title"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                disabled={isLoading}
                autoFocus
                maxLength={200}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-text-secondary mt-1">
                You can edit the content after creating the page
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
            disabled={isLoading || !formData.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Page"}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal as BSModal } from 'bootstrap';
import EventEmitter from '../../../utils/cartEvents';

const UpdateProfileModal = ({ show, handleClose, currentUserData, currentProfileData, onUpdate, userId }) => {
    const modalRef = useRef(null);
    const bsModalInstance = useRef(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        phoneNumber: '',
        address: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Initialize and manage Bootstrap modal
    useEffect(() => {
        if (modalRef.current && !bsModalInstance.current) {
            bsModalInstance.current = new BSModal(modalRef.current);
            modalRef.current.addEventListener('hidden.bs.modal', handleClose);
        }

        if (bsModalInstance.current) {
            if (show) {
                bsModalInstance.current.show();
            } else {
                bsModalInstance.current.hide();
            }
        }

        return () => {
            if (modalRef.current) {
                modalRef.current.removeEventListener('hidden.bs.modal', handleClose);
            }
        };
    }, [show, handleClose]);

    // Populate form data when modal opens
    useEffect(() => {
        if (currentUserData && currentProfileData) {
            setFormData({
                name: currentUserData.name || '',
                email: currentUserData.email || '',
                bio: currentProfileData.bio || '',
                phoneNumber: currentProfileData.phoneNumber || '',
                address: currentProfileData.address || '',
            });

            // Handle existing profile image
            if (currentProfileData.profileImageUrl) {
                setImagePreviewUrl(currentProfileData.profileImageUrl);
            } else if (currentProfileData.imageBase64) {
                setImagePreviewUrl(`data:image/jpeg;base64,${currentProfileData.imageBase64}`);
            } else {
                setImagePreviewUrl('');
            }

            setSelectedImage(null);
            setValidationErrors({});
        }
    }, [currentUserData, currentProfileData, show]);

    // Form validation
    const validateForm = useCallback(() => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.phoneNumber) {
            const cleanedPhoneNumber = formData.phoneNumber.replace(/\s/g, '');
            if (!/^[\+]?[1-9]\d{9,12}$/.test(cleanedPhoneNumber)) {
                errors.phoneNumber = 'Phone number must be between 10 and 13 digits long (excluding +), starting with a non-zero digit.';
            }
        }

        if (selectedImage && selectedImage.size > 5 * 1024 * 1024) {
            errors.image = 'Image size should be less than 5MB';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, selectedImage]);

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value, files } = e.target;

        if (name === 'imageUpload') {
            if (files && files[0]) {
                const file = files[0];

                // Validate file type
                if (!file.type.startsWith('image/')) {
                    setValidationErrors(prev => ({
                        ...prev,
                        image: 'Please select a valid image file'
                    }));
                    return;
                }

                setSelectedImage(file);
                setImagePreviewUrl(URL.createObjectURL(file));
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.image;
                    return newErrors;
                });
            } else {
                setSelectedImage(null);
                setImagePreviewUrl(currentProfileData?.profileImageUrl ||
                    (currentProfileData?.imageBase64 ? `data:image/jpeg;base64,${currentProfileData.imageBase64}` : ''));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Clear validation error when user starts typing
            if (validationErrors[name]) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    }, [currentProfileData, validationErrors]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            await onUpdate(userId, formData, selectedImage);
            await onUpdate(userId, formData, selectedImage);

            // Re-fetch updated profile OR directly emit new imageBase64
            const res = await fetch(`http://localhost:8000/profile/view/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const updatedProfile = await res.json();
            if (updatedProfile.imageBase64) {
                EventEmitter.emit("profileUpdated", `data:image/jpeg;base64,${updatedProfile.imageBase64}`);
            }

        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle image removal
    const handleRemoveImage = useCallback(() => {
        setSelectedImage(null);
        setImagePreviewUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        if (!isSubmitting) {
            handleClose();
        }
    }, [handleClose, isSubmitting]);

    return (
        <div
            className="modal fade"
            id="updateProfileModal"
            tabIndex="-1"
            aria-labelledby="updateProfileModalLabel"
            aria-hidden="true"
            ref={modalRef}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content bg-dark text-white border border-secondary shadow-lg">
                    {/* Modal Header */}
                    <div className="modal-header border-bottom border-secondary bg-dark">
                        <div>
                            <h4 className="modal-title text-white fw-bold mb-1" id="updateProfileModalLabel">
                                <i className="bi bi-person-gear me-2"></i>
                                Update Profile Information
                            </h4>
                            <p className="text-muted mb-0 small">Manage your personal details and profile image</p>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Close"
                            onClick={handleModalClose}
                            disabled={isSubmitting}
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                {/* Profile Image Section */}
                                <div className="col-12">
                                    <div className="text-center p-4 bg-secondary bg-opacity-10 rounded border border-secondary">
                                        <h6 className="text-white mb-3">
                                            <i className="bi bi-camera me-2"></i>
                                            Profile Picture
                                        </h6>

                                        {imagePreviewUrl ? (
                                            <div className="position-relative d-inline-block mb-3">
                                                <img
                                                    src={imagePreviewUrl}
                                                    alt="Profile Preview"
                                                    className="rounded-circle border border-2 border-light shadow"
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        boxShadow: '0 0 20px rgba(255,255,255,0.1)'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-1"
                                                    onClick={handleRemoveImage}
                                                    style={{ width: '30px', height: '30px' }}
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mb-3">
                                                <i className="bi bi-person-circle text-muted" style={{ fontSize: '120px' }}></i>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="form-control bg-secondary text-white border-0"
                                            id="imageUploadInput"
                                            name="imageUpload"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />

                                        {validationErrors.image && (
                                            <div className="text-danger small mt-2">
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {validationErrors.image}
                                            </div>
                                        )}

                                        <small className="text-muted d-block mt-2">
                                            Supported formats: JPG, PNG, GIF (Max 5MB)
                                        </small>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="col-md-6">
                                    <label htmlFor="nameInput" className="form-label text-secondary fw-semibold">
                                        <i className="bi bi-person me-2"></i>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control bg-secondary bg-opacity-25 text-white border ${validationErrors.name ? 'border-danger' : 'border-secondary'}`}
                                        id="nameInput"
                                        placeholder="Enter your full name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.name && (
                                        <div className="text-danger small mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {validationErrors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="emailInput" className="form-label text-secondary fw-semibold">
                                        <i className="bi bi-envelope me-2"></i>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control bg-secondary bg-opacity-25 text-white border ${validationErrors.email ? 'border-danger' : 'border-secondary'}`}
                                        id="emailInput"
                                        placeholder="Enter your email address"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={true}
                                    />
                                    <div className="form-text text-muted small">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Email updates require separate verification process
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label htmlFor="bioInput" className="form-label text-secondary fw-semibold">
                                        <i className="bi bi-card-text me-2"></i>
                                        Biography
                                    </label>
                                    <textarea
                                        className="form-control bg-secondary bg-opacity-25 text-white border border-secondary"
                                        id="bioInput"
                                        rows="4"
                                        placeholder="Tell us about yourself, your interests, and professional background..."
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        style={{ resize: 'vertical' }}
                                    ></textarea>
                                    <div className="form-text text-muted small">
                                        {formData.bio.length}/500 characters
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="phoneNumberInput" className="form-label text-secondary fw-semibold">
                                        <i className="bi bi-telephone me-2"></i>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control bg-secondary bg-opacity-25 text-white border ${validationErrors.phoneNumber ? 'border-danger' : 'border-secondary'}`}
                                        id="phoneNumberInput"
                                        placeholder="+1 (555) 123-4567"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.phoneNumber && (
                                        <div className="text-danger small mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {validationErrors.phoneNumber}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="addressInput" className="form-label text-secondary fw-semibold">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bg-secondary bg-opacity-25 text-white border border-secondary"
                                        id="addressInput"
                                        placeholder="Enter your address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer border-top border-secondary bg-dark d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            <i className="bi bi-shield-check me-1"></i>
                            Your information is securely encrypted
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary px-4"
                                onClick={handleModalClose}
                                disabled={isSubmitting}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light px-4"
                                onClick={handleSubmit}
                                disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
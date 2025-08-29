/**
 * Contact Form Enhancement Script
 * Provides modern functionality for Umbraco Forms
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }

    function initContactForm() {
        // Initialize all form enhancements
        enhanceUmbracoForms();
        setupFormValidation();
        setupFormAnimations();
        setupFormSubmission();
        setupConditionalFields();
        setupFormProgress();
    }

    /**
     * Enhance Umbraco Forms with modern features
     */
    function enhanceUmbracoForms() {
        const umbracoForms = document.querySelectorAll('.umbraco-forms-form, .umbraco-form-wrapper form');
        
        umbracoForms.forEach(form => {
            // Add modern classes
            form.classList.add('modern-form');
            
            // Enhance form fields
            enhanceFormFields(form);
            
            // Setup floating labels
            setupFloatingLabels(form);
            
            // Add loading states
            setupLoadingStates(form);
        });
    }

    /**
     * Enhance individual form fields
     */
    function enhanceFormFields(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add focus/blur handlers
            input.addEventListener('focus', handleFieldFocus);
            input.addEventListener('blur', handleFieldBlur);
            input.addEventListener('input', handleFieldInput);
            
            // Add validation on change
            input.addEventListener('change', () => validateField(input));
            
            // Setup character counter for textarea
            if (input.tagName === 'TEXTAREA') {
                setupCharacterCounter(input);
            }
        });
    }

    /**
     * Setup floating labels for better UX
     */
    function setupFloatingLabels(form) {
        const formGroups = form.querySelectorAll('.form-group, .umbraco-forms-field');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Wrap in floating label container if not already
                if (!group.classList.contains('form-floating')) {
                    group.classList.add('form-floating');
                    
                    // Move label after input for CSS to work
                    if (input.nextSibling !== label) {
                        input.parentNode.insertBefore(label, input.nextSibling);
                    }
                }
                
                // Check if field has value on load
                if (input.value || input.type === 'date') {
                    group.classList.add('has-value');
                }
            }
        });
    }

    /**
     * Setup loading states for form submission
     */
    function setupLoadingStates(form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                if (form.checkValidity()) {
                    showLoadingState(submitBtn);
                }
            });
        }
    }

    /**
     * Handle field focus events
     */
    function handleFieldFocus(e) {
        const field = e.target;
        const group = field.closest('.form-group, .umbraco-forms-field, .form-floating');
        
        if (group) {
            group.classList.add('focused');
            
            // Add ripple effect
            createRippleEffect(field);
        }
    }

    /**
     * Handle field blur events
     */
    function handleFieldBlur(e) {
        const field = e.target;
        const group = field.closest('.form-group, .umbraco-forms-field, .form-floating');
        
        if (group) {
            group.classList.remove('focused');
            
            if (field.value) {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        }
    }

    /**
     * Handle field input events
     */
    function handleFieldInput(e) {
        const field = e.target;
        const group = field.closest('.form-group, .umbraco-forms-field, .form-floating');
        
        // Real-time validation
        clearTimeout(field.validationTimeout);
        field.validationTimeout = setTimeout(() => {
            validateField(field);
        }, 300);
        
        // Update character counter
        updateCharacterCounter(field);
        
        // Update form progress
        updateFormProgress(field.form);
    }

    /**
     * Create ripple effect on field focus
     */
    function createRippleEffect(field) {
        const ripple = document.createElement('span');
        ripple.classList.add('field-ripple');
        
        const rect = field.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        // Remove existing ripples
        const existingRipples = field.parentNode.querySelectorAll('.field-ripple');
        existingRipples.forEach(r => r.remove());
        
        field.parentNode.appendChild(ripple);
        
        // Remove after animation
        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Setup form validation with better UX
     */
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Prevent default HTML5 validation styling
            form.setAttribute('novalidate', '');
            
            form.addEventListener('submit', function(e) {
                if (!validateForm(form)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        });
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        let firstInvalidField = null;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = input;
                }
            }
        });
        
        // Focus first invalid field
        if (firstInvalidField) {
            firstInvalidField.focus();
            scrollToElement(firstInvalidField);
        }
        
        return isValid;
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const group = field.closest('.form-group, .umbraco-forms-field, .form-floating');
        const errorContainer = group ? group.querySelector('.field-validation-error, .validation-error') : null;
        
        let isValid = true;
        let errorMessage = '';
        
        // Check HTML5 validity
        if (!field.checkValidity()) {
            isValid = false;
            errorMessage = field.validationMessage;
        }
        
        // Custom validations
        if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        
        if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        // Update UI
        if (group) {
            group.classList.toggle('has-error', !isValid);
            field.classList.toggle('is-invalid', !isValid);
            field.classList.toggle('is-valid', isValid && field.value);
        }
        
        // Show/hide error message
        if (errorContainer) {
            errorContainer.textContent = isValid ? '' : errorMessage;
            errorContainer.style.display = isValid ? 'none' : 'block';
        }
        
        return isValid;
    }

    /**
     * Setup form animations
     */
    function setupFormAnimations() {
        // Animate form elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe form sections
        const animatableElements = document.querySelectorAll(
            '.contact-info-card, .contact-form-card, .form-group, .umbraco-forms-field'
        );
        
        animatableElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }

    /**
     * Setup enhanced form submission
     */
    function setupFormSubmission() {
        const forms = document.querySelectorAll('.umbraco-forms-form, .contact-form');
        
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });
    }

    /**
     * Handle form submission with better UX
     */
    function handleFormSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitBtn) {
            showLoadingState(submitBtn);
            
            // Disable form during submission
            disableForm(form);
            
            // Show progress indicator
            showSubmissionProgress(form);
        }
    }

    /**
     * Show loading state on submit button
     */
    function showLoadingState(button) {
        button.classList.add('btn-loading');
        button.disabled = true;
        
        // Update button text if needed
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading-text, .spinner-border');
        
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-block';
        
        if (!btnLoading && !btnText) {
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
            `;
        }
    }

    /**
     * Disable entire form during submission
     */
    function disableForm(form) {
        const inputs = form.querySelectorAll('input, select, textarea, button');
        inputs.forEach(input => input.disabled = true);
    }

    /**
     * Show submission progress
     */
    function showSubmissionProgress(form) {
        let progress = 0;
        const progressBar = createProgressBar();
        form.appendChild(progressBar);
        
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            
            updateProgressBar(progressBar, progress);
        }, 200);
        
        // Clean up after 10 seconds (adjust based on actual submission time)
        setTimeout(() => {
            clearInterval(interval);
            updateProgressBar(progressBar, 100);
            setTimeout(() => progressBar.remove(), 500);
        }, 10000);
    }

    /**
     * Setup conditional fields
     */
    function setupConditionalFields() {
        const conditionalTriggers = document.querySelectorAll('[data-conditional]');
        
        conditionalTriggers.forEach(trigger => {
            trigger.addEventListener('change', handleConditionalField);
        });
    }

    /**
     * Handle conditional field visibility
     */
    function handleConditionalField(e) {
        const trigger = e.target;
        const conditionalId = trigger.getAttribute('data-conditional');
        const conditionalField = document.getElementById(conditionalId);
        
        if (conditionalField) {
            const shouldShow = checkConditionalLogic(trigger);
            
            if (shouldShow) {
                conditionalField.classList.add('show');
                conditionalField.style.display = 'block';
            } else {
                conditionalField.classList.remove('show');
                setTimeout(() => {
                    conditionalField.style.display = 'none';
                }, 300);
            }
        }
    }

    /**
     * Check conditional logic
     */
    function checkConditionalLogic(trigger) {
        const condition = trigger.getAttribute('data-condition') || 'equals';
        const value = trigger.getAttribute('data-value');
        
        switch (condition) {
            case 'equals':
                return trigger.value === value;
            case 'not-equals':
                return trigger.value !== value;
            case 'contains':
                return trigger.value.includes(value);
            case 'greater-than':
                return parseFloat(trigger.value) > parseFloat(value);
            case 'less-than':
                return parseFloat(trigger.value) < parseFloat(value);
            default:
                return trigger.value === value;
        }
    }

    /**
     * Setup form progress tracking
     */
    function setupFormProgress() {
        const forms = document.querySelectorAll('.umbraco-forms-form, .contact-form');
        
        forms.forEach(form => {
            const progressBar = form.querySelector('.form-progress-bar');
            if (progressBar) {
                updateFormProgress(form);
                
                // Update on input changes
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.addEventListener('input', () => updateFormProgress(form));
                    input.addEventListener('change', () => updateFormProgress(form));
                });
            }
        });
    }

    /**
     * Update form completion progress
     */
    function updateFormProgress(form) {
        const progressBar = form.querySelector('.form-progress-bar');
        if (!progressBar) return;
        
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });
        
        const progress = requiredFields.length > 0 ? (filledFields.length / requiredFields.length) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        
        // Add completion class when 100%
        form.classList.toggle('form-complete', progress === 100);
    }

    /**
     * Setup character counter for textareas
     */
    function setupCharacterCounter(textarea) {
        const maxLength = textarea.getAttribute('maxlength');
        if (!maxLength) return;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.innerHTML = `<span class="current">0</span> / <span class="max">${maxLength}</span>`;
        
        textarea.parentNode.appendChild(counter);
        
        updateCharacterCounter(textarea);
    }

    /**
     * Update character counter
     */
    function updateCharacterCounter(field) {
        if (field.tagName !== 'TEXTAREA') return;
        
        const counter = field.parentNode.querySelector('.character-counter');
        if (!counter) return;
        
        const current = field.value.length;
        const max = field.getAttribute('maxlength');
        const currentSpan = counter.querySelector('.current');
        
        if (currentSpan) {
            currentSpan.textContent = current;
            
            // Add warning class when approaching limit
            counter.classList.toggle('warning', current > max * 0.8);
            counter.classList.toggle('danger', current > max * 0.95);
        }
    }

    // Utility functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\+]?[0-9\s\-\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    function scrollToElement(element, offset = 20) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - offset;
        
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }

    function createProgressBar() {
        const container = document.createElement('div');
        container.className = 'submission-progress';
        container.innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <span class="sr-only">0% Complete</span>
                </div>
            </div>
        `;
        return container;
    }

    function updateProgressBar(container, progress) {
        const progressBar = container.querySelector('.progress-bar');
        const srOnly = container.querySelector('.sr-only');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
        
        if (srOnly) {
            srOnly.textContent = `${Math.round(progress)}% Complete`;
        }
    }

    // Add CSS for animations if not already present
    function addDynamicStyles() {
        const styleId = 'contact-form-dynamic-styles';
        if (document.getElementById(styleId)) return;
        
        const styles = `
            <style id="${styleId}">
                .field-ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .animate-in {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .character-counter {
                    font-size: 0.875rem;
                    color: #6b7280;
                    text-align: right;
                    margin-top: 0.25rem;
                }
                
                .character-counter.warning .current {
                    color: #f59e0b;
                }
                
                .character-counter.danger .current {
                    color: #ef4444;
                }
                
                .submission-progress {
                    margin-top: 1rem;
                }
                
                .submission-progress .progress {
                    height: 4px;
                    background: #e5e7eb;
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .submission-progress .progress-bar {
                    height: 100%;
                    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
                    transition: width 0.3s ease;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Initialize dynamic styles
    addDynamicStyles();

})();
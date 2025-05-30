// CSRF token helper
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Upload file function
function uploadFile(documentIndex, documentData) {
    const fileInput = document.getElementById('upload_file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Uploading...';
    
    const formData = new FormData();
    formData.append('upload_file', file);
    formData.append('document_index', documentIndex);
    formData.append('document_type', documentData.document_type);
    formData.append('title', documentData.title);
    
    if (documentData.education_background_id) {
        formData.append('education_background_id', documentData.education_background_id);
    }
    
    if (documentData.document_id) {
        formData.append('document_id', documentData.document_id);
    }
    
    fetch('/institution/attachment/upload/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the UI or reload the page
            showSuccessMessage(data.message);
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Handle errors
            showErrorMessage(data.errors);
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage({'general': ['An unexpected error occurred']});
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    });
}

// Delete file function
function deleteAttachment(attachmentId) {
    if (!confirm('Are you sure you want to delete this document?')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('attachment_id', attachmentId);
    
    fetch('/institution/attachment/delete/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage(data.message);
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showErrorMessage(data.errors);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage({'general': ['An unexpected error occurred']});
    });
}

// Helper functions for displaying messages
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('#attachments-form').prepend(alertDiv);
}

function showErrorMessage(errors) {
    let errorHtml = '';
    for (const [key, value] of Object.entries(errors)) {
        value.forEach(error => {
            errorHtml += `${error}<br>`;
        });
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${errorHtml}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('#attachments-form').prepend(alertDiv);
}

// Initialize file input change handler
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('upload_file');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // You can add file validation here
                console.log('File selected:', file.name);
            }
        });
    }
});
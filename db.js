/**
 * Contact Form Database Module — Giampaolo Marchioro CV
 * Stores form submissions in localStorage with full timestamp
 * Provides retrieval and export functionality
 */

const DB_KEY = 'gm_contact_submissions';

/**
 * Save a new form submission to the database
 * @param {Object} data - Form data fields
 * @returns {Object} Saved entry with ID and timestamp
 */
function saveSubmission(data) {
    const now = new Date();
    const entry = {
        id: 'REQ-' + now.getTime(),
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        name: data.name || '',
        email: data.email || '',
        subject: data.subject || '',
        message: data.message || '',
        documents: data.documents || [],
        lang: data.lang || 'fr',
        userAgent: navigator.userAgent,
        status: 'new'
    };

    const existing = getAllSubmissions();
    existing.unshift(entry); // Add newest first
    localStorage.setItem(DB_KEY, JSON.stringify(existing));

    return entry;
}

/**
 * Get all stored submissions
 * @returns {Array} Array of submission objects
 */
function getAllSubmissions() {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    } catch {
        return [];
    }
}

/**
 * Mark a submission as read
 */
function markAsRead(id) {
    const submissions = getAllSubmissions();
    const idx = submissions.findIndex(s => s.id === id);
    if (idx !== -1) {
        submissions[idx].status = 'read';
        localStorage.setItem(DB_KEY, JSON.stringify(submissions));
    }
}

/**
 * Delete a submission by ID
 */
function deleteSubmission(id) {
    const submissions = getAllSubmissions().filter(s => s.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(submissions));
}

/**
 * Export all submissions as CSV text
 */
function exportToCSV() {
    const submissions = getAllSubmissions();
    if (!submissions.length) return '';

    const headers = ['ID', 'Date', 'Heure', 'Nom', 'Email', 'Objet', 'Message', 'Documents demandés', 'Langue', 'Statut'];
    const rows = submissions.map(s => [
        s.id,
        s.date,
        s.time,
        '"' + (s.name || '').replace(/"/g, '""') + '"',
        s.email,
        '"' + (s.subject || '').replace(/"/g, '""') + '"',
        '"' + (s.message || '').replace(/"/g, '""').replace(/\n/g, ' ') + '"',
        '"' + (s.documents || []).join('; ') + '"',
        s.lang,
        s.status
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
}

/**
 * Get count of unread submissions
 */
function getUnreadCount() {
    return getAllSubmissions().filter(s => s.status === 'new').length;
}

// Expose globally
window.GM_DB = { saveSubmission, getAllSubmissions, markAsRead, deleteSubmission, exportToCSV, getUnreadCount };

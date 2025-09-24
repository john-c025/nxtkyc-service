/**
 * KYC Helper Functions
 * Implements the official ID generation patterns from the KYC API documentation
 */

/**
 * Generate KYC Request ID: KYC123456789012 (KYC + 12 random digits)
 */
export const generateKYCRequestId = () => {
  const randomDigits = Math.random().toString().slice(2, 14).padEnd(12, '0');
  return `KYC${randomDigits}`;
};

/**
 * Generate Account Code: BWC1234567890 (company_code + 10 random digits)
 * @param {string} companyCode - The company code (e.g., "BWC")
 */
export const generateAccountCode = (companyCode) => {
  const randomDigits = Math.random().toString().slice(2, 12).padEnd(10, '0');
  return `${companyCode}${randomDigits}`;
};

/**
 * Generate Account ID: 987654321098765 (15 random digits)
 */
export const generateAccountId = () => {
  return Math.random().toString().slice(2, 17).padEnd(15, '0');
};

/**
 * Generate System User Key: A7B3K9M2P5 (10 random alphanumeric characters)
 */
export const generateSystemUserKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate User ID: 9182736450 (10 random digits)
 */
export const generateUserId = () => {
  return Math.random().toString().slice(2, 12).padEnd(10, '0');
};

/**
 * Generate secure access token (32 bytes, Base64 encoded)
 */
export const generateAccessToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Generate test account origin number with TEST prefix
 */
export const generateTestAccountOrigin = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString().slice(2, 6);
  return `TEST-${timestamp}-${random}`;
};

/**
 * Validate ID patterns according to documentation
 */
export const validateKYCRequestId = (id) => {
  return /^KYC\d{12}$/.test(id);
};

export const validateAccountCode = (code, companyCode) => {
  const pattern = new RegExp(`^${companyCode}\\d{10}$`);
  return pattern.test(code);
};

export const validateAccountId = (id) => {
  return /^\d{15}$/.test(id);
};

export const validateSystemUserKey = (key) => {
  return /^[A-Z0-9]{10}$/.test(key);
};

export const validateUserId = (id) => {
  return /^\d{10}$/.test(id);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * Get status name from status code (as per documentation)
 */
export const getStatusName = (status) => {
  const statusMap = {
    1: 'Pending',
    2: 'In Review',
    3: 'Approved', 
    4: 'Rejected',
    5: 'Archived'
  };
  return statusMap[status] || 'Unknown';
};

/**
 * Get priority name from priority level (as per documentation)
 */
export const getPriorityName = (priority) => {
  const priorityMap = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Urgent'
  };
  return priorityMap[priority] || 'Unknown';
};

/**
 * Get processing time description by priority
 */
export const getProcessingTimeDescription = (priority) => {
  const timeMap = {
    1: '5-7 business days',
    2: '3-5 business days', 
    3: '1-3 business days',
    4: 'Within 24 hours'
  };
  return timeMap[priority] || '3-5 business days';
};

/**
 * Validate status transition (as per documentation)
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    1: [2, 4, 5], // Pending -> In Review, Rejected, Archived
    2: [3, 4, 5], // In Review -> Approved, Rejected, Archived
    3: [5],       // Approved -> Archived
    4: [2, 5],    // Rejected -> In Review (reopen), Archived
    5: []         // Archived -> No transitions (final state)
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Generate KYC link as per documentation
 */
export const generateKYCLink = (baseUrl, token, accountCode) => {
  return `${baseUrl}/kyc?token=${token}&account=${accountCode}`;
};

/**
 * Parse KYC link to extract token and account
 */
export const parseKYCLink = (url) => {
  try {
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get('token');
    const account = urlObj.searchParams.get('account');
    return { token, account };
  } catch (error) {
    return { token: null, account: null };
  }
};

/**
 * Mask sensitive data for logging (show only first 4 characters)
 */
export const maskSensitiveData = (data, visibleChars = 4) => {
  if (!data || data.length <= visibleChars) return data;
  return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars);
};

/**
 * Validate file types as per documentation
 */
export const validateFileType = (filename) => {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png', '.xlsx', '.xls'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return allowedExtensions.includes(extension);
};

/**
 * Get file category based on filename and type
 */
export const getFileCategory = (filename, description = '') => {
  const lowerDesc = description.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  if (lowerDesc.includes('id') || lowerDesc.includes('identification') || 
      lowerFilename.includes('passport') || lowerFilename.includes('license')) {
    return 1; // ID Documents
  }
  
  if (lowerDesc.includes('address') || lowerDesc.includes('proof') ||
      lowerFilename.includes('utility') || lowerFilename.includes('statement')) {
    return 2; // Address Proof
  }
  
  if (lowerDesc.includes('income') || lowerDesc.includes('salary') || 
      lowerDesc.includes('bank') || lowerFilename.includes('bank')) {
    return 3; // Financial Documents
  }
  
  if (lowerDesc.includes('signature') || lowerDesc.includes('authorization')) {
    return 4; // Authorization Documents
  }
  
  return 99; // General/Other
};

/**
 * Create audit trail entry data
 */
export const createAuditEntry = (kycRequestId, actionType, actionBy, oldStatus = null, newStatus = null, actionDetails = null) => {
  return {
    kyc_request_id: kycRequestId,
    action_type: actionType,
    action_by: actionBy,
    action_timestamp: new Date().toISOString(),
    old_status: oldStatus,
    new_status: newStatus,
    action_details: actionDetails
  };
};

/**
 * Generate company code from company name (simple implementation)
 */
export const generateCompanyCode = (companyName) => {
  // Take first letters of each word, uppercase, max 5 characters
  return companyName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 5);
};

/**
 * Sanitize filename for safe storage
 */
export const sanitizeFilename = (filename) => {
  // Remove unsafe characters and limit length
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100);
};

/**
 * Generate unique filename for KYC file storage
 */
export const generateKYCFilename = (kycRequestId, originalFilename) => {
  const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
  const uuid = crypto.randomUUID();
  return `${kycRequestId}_${uuid}${extension}`;
};

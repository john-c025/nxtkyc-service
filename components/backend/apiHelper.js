// utils/apiHelper.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  CHECK_USER_STATUS: `${API_BASE_URL}/auth/check-user-status`,
  
  // User Management
  USER_DETAILS: `${API_BASE_URL}/dashboard/user/details`,
  PW_STATUS: `${API_BASE_URL}/dashboard/user/details/pw-status`,
  UPDATE_PW: `${API_BASE_URL}/dashboard/user/update-password`,
  RESET_PW: `${API_BASE_URL}/dashboard/user/reset-password`,
  UPDATE_USER_PROFILE_IMAGE: `${API_BASE_URL}/dashboard/upload-profile-picture`,
  GET_USER_PROFILE_IMAGE: `${API_BASE_URL}/dashboard/user/details/profile-picture`,
  GET_USER_POSITION_DETAILS: `${API_BASE_URL}/dashboard/user/position`,
  
  // Notifications
  USER_NOTIFICATIONS: `${API_BASE_URL}/global/load-user-notifications`,
  MARK_AS_READ: `${API_BASE_URL}/global/notifications/update-read`,
  SEND_RESET_PASS_NOTIF: `${API_BASE_URL}/global/notifications/send-reset-password`,
  SEND_UPDATE_REQ_NOTIF: `${API_BASE_URL}/global/notifications/send-update-request-notification`,
  SEND_ADMIN_UPDATE_NOTIF: `${API_BASE_URL}/global/notifications/send-admin-update-request`,
  
  // UAM - User Access Management
  LOAD_SYS_MGMT_USER_LIST: `${API_BASE_URL}/uam/management/load-system-users`,
  LOAD_SYS_MGMT_USER_DETAILS: `${API_BASE_URL}/uam/management/user/details`,
  LOAD_SYS_MODULE_ACCESS_LIST_BY_POSITION: `${API_BASE_URL}/dashboard/user/get-system-access-types`,
  REGISTER_USER: `${API_BASE_URL}/uam/management/register-user`,
  DEACTIVATE_USER: `${API_BASE_URL}/uam/management/deactivate-user`,
  ACTIVATE_USER: `${API_BASE_URL}/uam/management/activate-user`,
  LOAD_POSITIONS: `${API_BASE_URL}/uam/management/load-positions`,
  LOAD_BRANCHES: `${API_BASE_URL}/uam/management/load-branches`,
  LOAD_FIN_COMPANIES: `${API_BASE_URL}/uam/management/load-companies`,
  
  // KYC System Endpoints (Following Official Documentation)
  
  // Internal API Endpoints (/kyc/*)
  // Company Management
  KYC_GET_COMPANIES: `${API_BASE_URL}/kyc/companies`,
  KYC_GET_COMPANY_BY_ID: `${API_BASE_URL}/kyc/companies`, // /{companyId}
  KYC_CREATE_COMPANY: `${API_BASE_URL}/kyc/companies`,
  KYC_UPDATE_COMPANY: `${API_BASE_URL}/kyc/companies`, // /{companyId}
  KYC_DELETE_COMPANY: `${API_BASE_URL}/kyc/companies`, // /{companyId}

  // Client Account Management
  KYC_GET_CLIENT_ACCOUNTS: `${API_BASE_URL}/kyc/clients`,
  KYC_GET_CLIENT_BY_ACCOUNT_CODE: `${API_BASE_URL}/kyc/clients`, // /{accountCode}
  KYC_CREATE_CLIENT_ACCOUNT: `${API_BASE_URL}/kyc/clients`,
  KYC_UPSERT_CLIENT_ACCOUNT: `${API_BASE_URL}/kyc/clients/create`,
  KYC_UPDATE_CLIENT_ACCOUNT: `${API_BASE_URL}/kyc/clients`, // /{accountId}
  KYC_SEARCH_CLIENTS: `${API_BASE_URL}/kyc/clients/search`,
  KYC_MERGE_CLIENTS: `${API_BASE_URL}/kyc/clients/merge`,

  // Access Token Management
  KYC_GENERATE_ACCESS_TOKEN: `${API_BASE_URL}/kyc/tokens/generate`,
  KYC_VALIDATE_TOKEN: `${API_BASE_URL}/kyc/tokens/validate`,
  KYC_REVOKE_TOKEN: `${API_BASE_URL}/kyc/tokens/revoke`,

  // KYC Request Management (Internal)
  KYC_GET_REQUESTS: `${API_BASE_URL}/kyc/requests`,
  KYC_GET_REQUEST_DETAILS: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}
  KYC_CREATE_REQUEST: `${API_BASE_URL}/kyc/requests`,
  KYC_PROCESS_REQUEST: `${API_BASE_URL}/kyc/requests/process`,
  KYC_GET_REQUEST_NOTES: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/notes
  KYC_ADD_REQUEST_NOTE: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/notes
  KYC_CHANGE_REQUEST_STATUS: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/status
  KYC_BULK_ACTIONS: `${API_BASE_URL}/kyc/requests/bulk`,

  // File Management (Admin)
  KYC_GET_REQUEST_FILES: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/files
  KYC_UPLOAD_REQUEST_FILES: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/files
  KYC_DOWNLOAD_FILE: `${API_BASE_URL}/kyc/files`, // /{fileId}/download
  KYC_RECLASSIFY_FILE: `${API_BASE_URL}/kyc/files`, // /{fileId}/reclassify
  KYC_INVALIDATE_FILE: `${API_BASE_URL}/kyc/files`, // /{fileId}/invalidate
  KYC_REQUEST_REUPLOAD: `${API_BASE_URL}/kyc/files`, // /{fileId}/request-reupload

  // Dashboard & Analytics
  KYC_DASHBOARD_SUMMARY: `${API_BASE_URL}/kyc/dashboard/summary`,
  KYC_COMPANY_STATISTICS: `${API_BASE_URL}/kyc/dashboard/company-statistics`,
  KYC_EXPORT_REQUESTS: `${API_BASE_URL}/kyc/requests/export.csv`,

  // Reference Data
  KYC_STATUS_REFERENCE: `${API_BASE_URL}/kyc/reference/statuses`,

  // KYC Privileges Management (CRUD)
  KYC_GET_PRIVILEGES: `${API_BASE_URL}/kyc/privileges`,
  KYC_GET_PRIVILEGE_DETAILS: `${API_BASE_URL}/kyc/privileges`, // /{privilegeId}
  KYC_CREATE_PRIVILEGE: `${API_BASE_URL}/kyc/privileges`,
  KYC_UPDATE_PRIVILEGE: `${API_BASE_URL}/kyc/privileges`, // /{privilegeId}
  KYC_DELETE_PRIVILEGE: `${API_BASE_URL}/kyc/privileges`, // /{privilegeId}

  // File Categories Management (CRUD)
  KYC_GET_FILE_CATEGORIES: `${API_BASE_URL}/kyc/files/categories`,
  KYC_CREATE_FILE_CATEGORY: `${API_BASE_URL}/kyc/files/categories`,
  KYC_UPDATE_FILE_CATEGORY: `${API_BASE_URL}/kyc/files/categories`, // /{id}
  KYC_DELETE_FILE_CATEGORY: `${API_BASE_URL}/kyc/files/categories`, // /{id}

  // System User Management for KYC
  KYC_GET_SYSTEM_USERS: `${API_BASE_URL}/kyc/users`,
  KYC_GET_USER_COMPANY_ACCESS: `${API_BASE_URL}/kyc/users`, // /{userId}/companies
  KYC_UPDATE_USER_COMPANY_ACCESS: `${API_BASE_URL}/kyc/users`, // /{userId}/companies

  // Audit Trail & Security
  KYC_GET_AUDIT_TRAIL: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/audit
  KYC_GET_TOKEN_LOGS: `${API_BASE_URL}/kyc/accounts`, // /{account_code}/tokens/logs

  // Notifications
  KYC_SEND_DECISION_EMAIL: `${API_BASE_URL}/kyc/requests`, // /{kycRequestId}/send-decision-email

  // Public API Endpoints (/public/kyc/*)
  // Token Lifecycle (Public)
  KYC_PUBLIC_REVOKE_TOKEN: `${API_BASE_URL}/public/kyc/tokens/revoke`,
  KYC_PUBLIC_INTROSPECT_TOKEN: `${API_BASE_URL}/public/kyc/tokens/introspect`,
  KYC_PUBLIC_SEND_EMAIL: `${API_BASE_URL}/public/kyc/tokens/send-email`,
  KYC_PUBLIC_RESEND_EMAIL: `${API_BASE_URL}/public/kyc/tokens/resend`,

  // Request Status (Public)
  KYC_PUBLIC_REQUEST_STATUS: `${API_BASE_URL}/public/kyc/requests/status`,
  KYC_PUBLIC_REQUEST_TIMELINE: `${API_BASE_URL}/public/kyc/requests`, // /{kycRequestId}/timeline

  // File Uploads (Public)
  KYC_PUBLIC_CREATE_UPLOAD_SESSION: `${API_BASE_URL}/public/kyc/upload/create-session`,
  KYC_PUBLIC_COMPLETE_UPLOAD_SESSION: `${API_BASE_URL}/public/kyc/upload/complete-session`,
  KYC_PUBLIC_UPLOAD_SCAN_STATUS: `${API_BASE_URL}/public/kyc/upload`, // /{upload_session_id}/scan-status

  // Public Config
  KYC_PUBLIC_CONFIG: `${API_BASE_URL}/public/kyc/config`,

  // Client KYC Submission
  KYC_PUBLIC_SUBMIT: `${API_BASE_URL}/public/kyc/submit`,
  KYC_PUBLIC_CHECK_STATUS: `${API_BASE_URL}/public/kyc/status`, // /{kycRequestId}

  // Information Endpoints
  KYC_PUBLIC_PRIVILEGE_LEVELS: `${API_BASE_URL}/public/kyc/privilege-levels`, // /{companyId}
  KYC_PUBLIC_REQUIREMENTS: `${API_BASE_URL}/public/kyc/requirements`,
  KYC_PUBLIC_GET_COMPANY_BY_ACCOUNT: `${API_BASE_URL}/public/kyc/company-by-account`,
  KYC_PUBLIC_CHECK_ACCOUNT: `${API_BASE_URL}/public/kyc/check-account`,
  KYC_PUBLIC_GET_PUBLIC_FILE_CATEGORIES: `${API_BASE_URL}/public/kyc/files/categories`,
  
  // Captcha System Endpoints (Legacy - integrated into ClientKYCPage)
  GENERATE_CAPTCHA: `${API_BASE_URL}/captcha/generate`,
  VERIFY_CAPTCHA: `${API_BASE_URL}/captcha/verify`,
  REFRESH_CAPTCHA: `${API_BASE_URL}/captcha/refresh`,
  CAPTCHA_STATISTICS: `${API_BASE_URL}/captcha/statistics`,
  CAPTCHA_HISTORY: `${API_BASE_URL}/captcha/history`,
  CAPTCHA_SETTINGS: `${API_BASE_URL}/captcha/settings`,
  
  // Employee Masterfile (formerly Masterlist)
  LOAD_EMPLOYEE_MASTERFILE: `${API_BASE_URL}/reports/load-employee-masterfile`,
  LOAD_EMPLOYEE_MASTERFILE_FILTERED: `${API_BASE_URL}/reports/load-employee-masterfile-filtered`,
  UPLOAD_EMPLOYEE_MASTERFILE: `${API_BASE_URL}/reports/upload-employee-masterfile`,
  CONFIRM_EMPLOYEE_MASTERFILE_UPLOAD: `${API_BASE_URL}/reports/upload-employee-masterfile/accept`,
  PROCESS_EMPLOYEE_MASTERFILE: `${API_BASE_URL}/reports/upload-employee-masterfile/process`,
  ANALYZE_EMPLOYEE_MASTERFILE: `${API_BASE_URL}/reports/generate/employee-summary`,
  CAN_UPLOAD_EMPLOYEE_MASTERFILE: `${API_BASE_URL}/global/can-upload-employee-masterfile`,
  
  // Reports
  LOAD_KYC_REPORTS: `${API_BASE_URL}/reports/kyc/load-reports`,
  GENERATE_KYC_REPORT: `${API_BASE_URL}/reports/kyc/generate`,
  LOAD_COMPLIANCE_REPORTS: `${API_BASE_URL}/reports/compliance/load-reports`,
  GENERATE_COMPLIANCE_REPORT: `${API_BASE_URL}/reports/compliance/generate`,
  LOAD_VERIFICATION_REPORTS: `${API_BASE_URL}/reports/verification/load-reports`,
  GENERATE_VERIFICATION_REPORT: `${API_BASE_URL}/reports/verification/generate`,
  
  // System Requests
  LOAD_ALL_REQUESTS: `${API_BASE_URL}/requests/admin/get-all-requests`,
  LOAD_PENDING_REQUESTS: `${API_BASE_URL}/requests/admin/get-pending-requests`,
  REJECT_REQUEST: `${API_BASE_URL}/requests/admin/reject`,
  APPROVE_REQUEST: `${API_BASE_URL}/requests/admin/approve`,
  SUBMIT_REQUEST: `${API_BASE_URL}/global/submit-request`,
  
  // Dashboard Configuration
  LOAD_DASHBOARD_CONFIG: `${API_BASE_URL}/global/dashboard-config/load`,
  UPDATE_DASHBOARD_CONFIG: `${API_BASE_URL}/global/dashboard-config/update`,
  
  // System Status
  LOAD_SYSTEM_STATUS: `${API_BASE_URL}/global/load-system-status`,
  
  // Global Options
  GET_UNIT_STATUS_OPTIONS: `${API_BASE_URL}/global/unit-status-options`,
  GET_EMPLOYEE_STATUS_OPTIONS: `${API_BASE_URL}/global/employee-status-options`,
  GET_RECORD_REMARKS_OPTIONS: `${API_BASE_URL}/global/record-remarks-options`,
};
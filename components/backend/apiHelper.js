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
  
  // Internal API Endpoints (/KYC/*)
  // Company Management
  KYC_GET_COMPANIES: `${API_BASE_URL}/KYC/companies`,
  KYC_GET_COMPANY_BY_ID: `${API_BASE_URL}/KYC/companies`, // /{companyId}
  KYC_CREATE_COMPANY: `${API_BASE_URL}/KYC/companies`,

  // Client Account Management
  KYC_GET_CLIENT_ACCOUNTS: `${API_BASE_URL}/KYC/clients`,
  KYC_GET_CLIENT_BY_ACCOUNT_CODE: `${API_BASE_URL}/KYC/clients`, // /{accountCode}
  KYC_CREATE_CLIENT_ACCOUNT: `${API_BASE_URL}/KYC/clients`,
  KYC_UPSERT_CLIENT_ACCOUNT: `${API_BASE_URL}/KYC/clients/create`,
  KYC_UPDATE_CLIENT_ACCOUNT: `${API_BASE_URL}/KYC/clients`, // /{accountId}

  // Access Token Management
  KYC_GENERATE_ACCESS_TOKEN: `${API_BASE_URL}/KYC/tokens/generate`,

  // KYC Request Management (Internal)
  KYC_GET_REQUESTS: `${API_BASE_URL}/KYC/requests`,
  KYC_GET_REQUEST_DETAILS: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}
  KYC_CREATE_REQUEST: `${API_BASE_URL}/KYC/requests`,
  KYC_PROCESS_REQUEST: `${API_BASE_URL}/KYC/requests/process`,

  // File Management
  KYC_GET_REQUEST_FILES: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/files
  KYC_UPLOAD_REQUEST_FILES: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/files

  // Dashboard & Analytics
  KYC_DASHBOARD_SUMMARY: `${API_BASE_URL}/KYC/dashboard/summary`,
  KYC_COMPANY_STATISTICS: `${API_BASE_URL}/KYC/dashboard/company-statistics`,

  // Reference Data
  KYC_STATUS_REFERENCE: `${API_BASE_URL}/KYC/reference/statuses`,

  // KYC Privileges Management (Missing from documentation but needed)
  KYC_GET_PRIVILEGES: `${API_BASE_URL}/KYC/privileges`,
  KYC_GET_PRIVILEGE_DETAILS: `${API_BASE_URL}/KYC/privileges`, // /{privilegeId}
  KYC_CREATE_PRIVILEGE: `${API_BASE_URL}/KYC/privileges`,
  KYC_UPDATE_PRIVILEGE: `${API_BASE_URL}/KYC/privileges`, // /{privilegeId}
  KYC_DELETE_PRIVILEGE: `${API_BASE_URL}/KYC/privileges`, // /{privilegeId}
  

  // System User Management for KYC (Missing but referenced in documentation)
  KYC_GET_SYSTEM_USERS: `${API_BASE_URL}/KYC/users`,
  KYC_GET_USER_COMPANY_ACCESS: `${API_BASE_URL}/KYC/users`, // /{userId}/companies
  KYC_UPDATE_USER_COMPANY_ACCESS: `${API_BASE_URL}/KYC/users`, // /{userId}/companies

  // Token Management (Additional endpoints)
  KYC_VALIDATE_TOKEN: `${API_BASE_URL}/public/kyc/tokens/validate`,
  KYC_REVOKE_TOKEN: `${API_BASE_URL}/KYC/tokens/revoke`,

  // Audit Trail (Missing from current implementation)
  KYC_GET_AUDIT_TRAIL: `${API_BASE_URL}/KYC/audit/trail`, // /{kycRequestId}
  KYC_GET_APPROVAL_ACTIONS: `${API_BASE_URL}/KYC/audit/actions`, // /{kycRequestId}

  // Public API Endpoints (/public/kyc/*)
  // Client KYC Submission
  KYC_PUBLIC_SUBMIT: `${API_BASE_URL}/public/kyc/submit`,
  KYC_PUBLIC_CHECK_STATUS: `${API_BASE_URL}/public/kyc/status`, // /{kycRequestId}

  // Information Endpoints
  KYC_PUBLIC_PRIVILEGE_LEVELS: `${API_BASE_URL}/public/kyc/privilege-levels`, // /{companyId}
  KYC_PUBLIC_REQUIREMENTS: `${API_BASE_URL}/public/kyc/requirements`,
  
  // Captcha System Endpoints
  GENERATE_CAPTCHA: `${API_BASE_URL}/captcha/generate`,
  VERIFY_CAPTCHA: `${API_BASE_URL}/captcha/verify`,
  REFRESH_CAPTCHA: `${API_BASE_URL}/captcha/refresh`,
  CAPTCHA_STATISTICS: `${API_BASE_URL}/captcha/statistics`,
  CAPTCHA_HISTORY: `${API_BASE_URL}/captcha/history`,
  CAPTCHA_SETTINGS: `${API_BASE_URL}/captcha/settings`,

  // Additional KYC File Management (Comprehensive)
  KYC_DOWNLOAD_FILE: `${API_BASE_URL}/KYC/files/download`, // /{fileId}
  KYC_DELETE_FILE: `${API_BASE_URL}/KYC/files/delete`, // /{fileId}
  KYC_GET_FILE_INFO: `${API_BASE_URL}/KYC/files/info`, // /{fileId}
  KYC_UPDATE_FILE_DESCRIPTION: `${API_BASE_URL}/KYC/files/description`, // /{fileId}
  KYC_GET_FILE_CATEGORIES: `${API_BASE_URL}/KYC/files/categories`,
  KYC_GET_PUBLIC_FILE_CATEGORIES: `${API_BASE_URL}/public/kyc/files/categories`,


  // KYC Request Status Management
  KYC_GET_STATUS_HISTORY: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/status-history
  KYC_UPDATE_REQUEST_PRIORITY: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/priority
  KYC_ASSIGN_REVIEWER: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/assign
  KYC_ADD_REQUEST_COMMENT: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/comments
  KYC_GET_REQUEST_COMMENTS: `${API_BASE_URL}/KYC/requests`, // /{kycRequestId}/comments

  // KYC Bulk Operations
  KYC_BULK_APPROVE: `${API_BASE_URL}/KYC/requests/bulk/approve`,
  KYC_BULK_REJECT: `${API_BASE_URL}/KYC/requests/bulk/reject`,
  KYC_BULK_ARCHIVE: `${API_BASE_URL}/KYC/requests/bulk/archive`,
  KYC_BULK_ASSIGN: `${API_BASE_URL}/KYC/requests/bulk/assign`,

  // KYC Reporting & Analytics (Extended)
  KYC_EXPORT_REQUESTS: `${API_BASE_URL}/KYC/reports/export`,
  KYC_GENERATE_REPORT: `${API_BASE_URL}/KYC/reports/generate`,
  KYC_GET_PERFORMANCE_METRICS: `${API_BASE_URL}/KYC/analytics/performance`,
  KYC_GET_PROCESSING_TIMES: `${API_BASE_URL}/KYC/analytics/processing-times`,
  KYC_GET_APPROVAL_RATES: `${API_BASE_URL}/KYC/analytics/approval-rates`,

  // KYC Configuration & Settings
  KYC_GET_SYSTEM_SETTINGS: `${API_BASE_URL}/KYC/settings/system`,
  KYC_UPDATE_SYSTEM_SETTINGS: `${API_BASE_URL}/KYC/settings/system`,
  KYC_GET_EMAIL_TEMPLATES: `${API_BASE_URL}/KYC/settings/email-templates`,
  KYC_UPDATE_EMAIL_TEMPLATE: `${API_BASE_URL}/KYC/settings/email-templates`, // /{templateId}
  KYC_GET_NOTIFICATION_SETTINGS: `${API_BASE_URL}/KYC/settings/notifications`,

  // Public KYC Extended Operations
  KYC_PUBLIC_GET_COMPANY_INFO: `${API_BASE_URL}/public/kyc/company`, // /{companyId}
  KYC_PUBLIC_GET_COMPANY_BY_ACCOUNT: `${API_BASE_URL}/public/kyc/company-by-account`, // ?account_code={accountCode}
  KYC_PUBLIC_CHECK_ACCOUNT: `${API_BASE_URL}/public/kyc/check-account`, // ?account_code={accountCode}
  KYC_PUBLIC_UPLOAD_ADDITIONAL_FILES: `${API_BASE_URL}/public/kyc/upload-additional`, // /{kycRequestId}
  KYC_PUBLIC_WITHDRAW_REQUEST: `${API_BASE_URL}/public/kyc/withdraw`, // /{kycRequestId}
  KYC_PUBLIC_RESUBMIT_REQUEST: `${API_BASE_URL}/public/kyc/resubmit`, // /{kycRequestId}
  
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
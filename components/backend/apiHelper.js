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
  
  // KYC System Endpoints
  // Client Management
  LOAD_CLIENT_ACCOUNTS: `${API_BASE_URL}/kyc/clients/load-accounts`,
  LOAD_CLIENT_DETAILS: `${API_BASE_URL}/kyc/clients/details`,
  CREATE_CLIENT_ACCOUNT: `${API_BASE_URL}/kyc/clients/create-account`,
  UPDATE_CLIENT_ACCOUNT: `${API_BASE_URL}/kyc/clients/update-account`,
  DEACTIVATE_CLIENT: `${API_BASE_URL}/kyc/clients/deactivate`,
  ACTIVATE_CLIENT: `${API_BASE_URL}/kyc/clients/activate`,
  
  // KYC Requests
  LOAD_KYC_REQUESTS: `${API_BASE_URL}/kyc/requests/load-requests`,
  LOAD_KYC_REQUEST_DETAILS: `${API_BASE_URL}/kyc/requests/details`,
  CREATE_KYC_REQUEST: `${API_BASE_URL}/kyc/requests/create`,
  UPDATE_KYC_REQUEST: `${API_BASE_URL}/kyc/requests/update`,
  APPROVE_KYC_REQUEST: `${API_BASE_URL}/kyc/requests/approve`,
  REJECT_KYC_REQUEST: `${API_BASE_URL}/kyc/requests/reject`,
  ARCHIVE_KYC_REQUEST: `${API_BASE_URL}/kyc/requests/archive`,
  
  // KYC Media Files
  UPLOAD_KYC_DOCUMENT: `${API_BASE_URL}/kyc/documents/upload`,
  LOAD_KYC_DOCUMENTS: `${API_BASE_URL}/kyc/documents/load`,
  DELETE_KYC_DOCUMENT: `${API_BASE_URL}/kyc/documents/delete`,
  VERIFY_KYC_DOCUMENT: `${API_BASE_URL}/kyc/documents/verify`,
  
  // Company Management
  LOAD_COMPANIES: `${API_BASE_URL}/kyc/companies/load-companies`,
  LOAD_COMPANY_DETAILS: `${API_BASE_URL}/kyc/companies/details`,
  CREATE_COMPANY: `${API_BASE_URL}/kyc/companies/create`,
  UPDATE_COMPANY: `${API_BASE_URL}/kyc/companies/update`,
  DEACTIVATE_COMPANY: `${API_BASE_URL}/kyc/companies/deactivate`,
  ACTIVATE_COMPANY: `${API_BASE_URL}/kyc/companies/activate`,
  
  // KYC Privileges
  LOAD_KYC_PRIVILEGES: `${API_BASE_URL}/kyc/privileges/load-privileges`,
  LOAD_PRIVILEGE_DETAILS: `${API_BASE_URL}/kyc/privileges/details`,
  CREATE_PRIVILEGE: `${API_BASE_URL}/kyc/privileges/create`,
  UPDATE_PRIVILEGE: `${API_BASE_URL}/kyc/privileges/update`,
  
  // Access Tokens
  GENERATE_ACCESS_TOKEN: `${API_BASE_URL}/kyc/tokens/generate`,
  VALIDATE_ACCESS_TOKEN: `${API_BASE_URL}/kyc/tokens/validate`,
  REVOKE_ACCESS_TOKEN: `${API_BASE_URL}/kyc/tokens/revoke`,
  
  // Audit Trail
  LOAD_AUDIT_TRAIL: `${API_BASE_URL}/kyc/audit/load-trail`,
  LOAD_APPROVAL_ACTIONS: `${API_BASE_URL}/kyc/audit/load-approval-actions`,
  
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
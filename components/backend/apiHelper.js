// utils/apiHelper.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  PW_STATUS: `${API_BASE_URL}/dashboard/user/details/pw-status`,
  UPDATE_PW: `${API_BASE_URL}/dashboard/user/update-password`,
  RESET_PW: `${API_BASE_URL}/dashboard/user/reset-password`,
  LOAD_MASTERLIST: `${API_BASE_URL}/reports/load-masterlist`,
  LOAD_MASTERLIST_FILTERED: `${API_BASE_URL}/reports/load-masterlist-filtered`,
 // This will accept the masterlist upload if there is a pending upload on cache
  LOAD_COMPANIES: `${API_BASE_URL}/reports/load-collection-companies`,
  LOAD_FIN_COMPANIES: `${API_BASE_URL}/uam/management/load-companies`,
  USER_DETAILS: `${API_BASE_URL}/dashboard/user/details`,
  USER_NOTIFICATIONS: `${API_BASE_URL}/global/load-user-notifications`,
  MARK_AS_READ: `${API_BASE_URL}/global/notifications/update-read`,
  LOAD_BORROWER_LIST: `${API_BASE_URL}/bis/load-active-borrowers`,
  LOAD_BORROWER_DETAILS: `${API_BASE_URL}/bis/load-borrower-details`,
  SEND_RESET_PASS_NOTIF:`${API_BASE_URL}/global/notifications/send-reset-password`,
  SEND_UPDATE_REQ_NOTIF:`${API_BASE_URL}/global/notifications/send-update-request-notification`,
  SEND_ADMIN_UPDATE_NOTIF:`${API_BASE_URL}/global/notifications/send-admin-update-request`,
  UPDATE_USER_PROFILE_IMAGE: `${API_BASE_URL}/dashboard/upload-profile-picture`,
  GET_USER_PROFILE_IMAGE: `${API_BASE_URL}/dashboard/user/details/profile-picture`,
  //UAM
  LOAD_SYS_MGMT_USER_LIST: `${API_BASE_URL}/uam/management/load-system-users`,
  LOAD_SYS_MGMT_USER_DETAILS:`${API_BASE_URL}/uam/management/user/details`,
  LOAD_SYS_MODULE_ACCESS_LIST_BY_POSITION:`${API_BASE_URL}/dashboard/user/get-system-access-types`,
  REGISTER_USER : `${API_BASE_URL}/uam/management/register-user`,
  DEACTIVATE_USER : `${API_BASE_URL}/uam/management/deactivate-user`,
  ACTIVATE_USER : `${API_BASE_URL}/uam/management/activate-user`,
  LOAD_POSITIONS:`${API_BASE_URL}/uam/management/load-positions`,
  LOAD_BRANCHES:`${API_BASE_URL}/uam/management/load-branches`,
  CHECK_USER_STATUS:`${API_BASE_URL}/auth/check-user-status`,

  //System Config
  // Areaas
  LOAD_ALL_AREAS:`${API_BASE_URL}/global/all-areas`, 
  LOAD_ALL_AREA_COUNTS:`${API_BASE_URL}/global/area-counts`,
  LOAD_SUB_AREA_SPEC_COUNTS:`${API_BASE_URL}/global/main-sub-area-counts`,
  LOAD_SPEC_AREA_UNDER_SUB_AREA_BY_SUB_AREA_ID:`${API_BASE_URL}/global/spec-areas-by-subarea`,
  SUBMIT_REQUEST:`${API_BASE_URL}/global/submit-request`,
  
  // Loantyeps
  LOAD_ALL_LOAN_TYPES: `${API_BASE_URL}/global/all-loan-types`,
  
  
  //ADMIN Controls forrr requests here
  LOAD_ALL_REQUESTS:`${API_BASE_URL}/requests/admin/get-all-requests`,
  LOAD_PENDING_REQUESTS:`${API_BASE_URL}/requests/admin/get-pending-requests`,
  REJECT_REQUEST:`${API_BASE_URL}/requests/admin/reject`,
  APPROVE_REQUEST:`${API_BASE_URL}/requests/admin/approve`,

  // IRCM Upload related api endpoints
  UPLOAD_MASTERLIST_FILE: `${API_BASE_URL}/reports/upload-masterlist`,
  CONFIRM_MASTERLIST_UPLOAD: `${API_BASE_URL}/reports/upload-masterlist/accept`,
  PROCESS_MASTERLIST_RECORD_AREAS: `${API_BASE_URL}/reports/upload-masterlist/process-areas`,
  PROCESS_MASTERLIST_BORROWERS: `${API_BASE_URL}/reports/process-borrowers/accept`,
  ANALYZE_AND_SUMMARIZE_MASTERLIST_RECORDS: `${API_BASE_URL}/reports/generate/summary`,
  AUTOMATE_AND_TAG: `${API_BASE_URL}/reports/upload-masterlist/automate/tag`,
  CAN_UPLOAD_CHECK: `${API_BASE_URL}/global/can-upload`,
  
  //BOT
  SEND_MESSAGE_TO_AGILA: `${API_BASE_URL}/bot/chatbot`,
  SEND_IMAGE_MESSAGE_TO_AGILA: `${API_BASE_URL}/bot/chatbot-image`,

  GET_UNIT_STATUS_OPTIONS: `${API_BASE_URL}/global/unit-status-options`,
  GET_BORROWER_STATUS_OPTIONS: `${API_BASE_URL}/global/borrower-status-options`,
  GET_RECORD_REMARKS_OPTIONS: `${API_BASE_URL}/global/record-remarks-options`,

  // pos
  GET_USER_POSITION_DETAILS: `${API_BASE_URL}/dashboard/user/position`,
  //TELECOLLECTOR EDITTING
  TELECOLLECTOR_DAILY_REPORTS: `${API_BASE_URL}/reports/telecollector/daily-reports`,
  CREATE_TELECOLLECTOR_DAILY_REPORT: `${API_BASE_URL}/reports/telecollector/daily-reports/create`,
  TELE_ASSIGN_STATUS_TO_RECORD: `${API_BASE_URL}/global/telecollector/assign-status-to-record`,
  TELE_GET_RECORDS_BY_TELECOLLECTOR: `${API_BASE_URL}/reports/telecollector/load-records-by-telecollector`,
  CA_GET_AREA_COLLECTOR_ASSIGNMENTS: `${API_BASE_URL}/reports/ca/field-bindings`,
  CA_UPDATE_AREA_COLLECTOR_ASSIGNMENT: `${API_BASE_URL}/reports/ca/update-field-binding`,
  COLLECTION_ACTION_TYPES: `${API_BASE_URL}/reports/collection/action-types`,
  COLLECTION_MAKE_AN_ACTION: `${API_BASE_URL}/reports/collection/activity`,
  COLLECTION_ACTIVITY_LOG: `${API_BASE_URL}/reports/collection/activity-log`,
  ///
  COLLECTION_GET_ALL_FIELD_COLLECTORS: `${API_BASE_URL}/reports/collection/all-field`,
  COLLECTION_GET_ALL_TELECOLLECTORS: `${API_BASE_URL}/reports/collection/all-tele`,
  COLLECTION_GET_ALL_COLLECTORS: `${API_BASE_URL}/reports/collection/all-collectors`,
  //

  COLLECTION_GET_EMPLOYEE_POSITIONS: `${API_BASE_URL}/reports/system/load-employees`,
  COLLECTION_SYSTEM_BIND_COLLECTOR: `${API_BASE_URL}/reports/ca/assign-collector`,
  
  // New bulk assignment endpoints
  COLLECTION_BULK_ASSIGN_BY_MAIN_AREA: `${API_BASE_URL}/reports/ca/assign-collector`,
  COLLECTION_BULK_ASSIGN_BY_SUB_AREA: `${API_BASE_URL}/reports/ca/assign-collector`,
};
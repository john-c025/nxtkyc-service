# Missing API Endpoints Implementation Guide

## Overview

Based on the current frontend implementation and the official KYC workflow documentation, there are several API endpoints that are referenced in the code but need to be implemented on the backend. This guide provides a comprehensive list of all missing endpoints and their expected functionality.

## ✅ Completed Implementation

### Core KYC Endpoints (From Official Documentation)
- `POST /api/KYC/companies` - ✅ Company creation
- `GET /api/KYC/companies` - ✅ Load companies
- `POST /api/KYC/clients/create` - ✅ Upsert client account (KEY ENDPOINT)
- `POST /api/KYC/clients` - ✅ Create client account with full details
- `GET /api/KYC/clients` - ✅ Load client accounts
- `POST /api/KYC/tokens/generate` - ✅ Generate access tokens
- `POST /api/KYC/requests` - ✅ Create KYC requests
- `POST /api/KYC/requests/process` - ✅ Process KYC requests
- `POST /api/public/kyc/submit` - ✅ Public KYC submission
- `GET /api/public/kyc/status/{kycRequestId}` - ✅ Public status checking

## 🔴 Missing API Endpoints That Need Implementation

### 1. **KYC Privileges Management** (CRITICAL)
```csharp
[Route("api/KYC/privileges")]
public class KYCPrivilegesController : ControllerBase
{
    // GET /api/KYC/privileges - Get all privilege levels
    [HttpGet]
    public async Task<IActionResult> GetPrivilegeLevels();

    // GET /api/KYC/privileges/{privilegeId} - Get privilege details
    [HttpGet("{privilegeId}")]
    public async Task<IActionResult> GetPrivilegeDetails(int privilegeId);

    // POST /api/KYC/privileges - Create new privilege level
    [HttpPost]
    public async Task<IActionResult> CreatePrivilege(CreatePrivilegeDto dto);

    // PUT /api/KYC/privileges/{privilegeId} - Update privilege level
    [HttpPut("{privilegeId}")]
    public async Task<IActionResult> UpdatePrivilege(int privilegeId, UpdatePrivilegeDto dto);

    // DELETE /api/KYC/privileges/{privilegeId} - Delete privilege level
    [HttpDelete("{privilegeId}")]
    public async Task<IActionResult> DeletePrivilege(int privilegeId);
}
```

### 2. **Token Management** (CRITICAL)
```csharp
[Route("api/KYC/tokens")]
public class KYCTokenController : ControllerBase
{
    // POST /api/KYC/tokens/validate - Validate access token
    [HttpPost("validate")]
    public async Task<IActionResult> ValidateToken(ValidateTokenDto dto);

    // POST /api/KYC/tokens/revoke - Revoke access token
    [HttpPost("revoke")]
    public async Task<IActionResult> RevokeToken(RevokeTokenDto dto);
}
```

### 3. **File Management** (HIGH PRIORITY)
```csharp
[Route("api/KYC/files")]
public class KYCFilesController : ControllerBase
{
    // GET /api/KYC/files/download/{fileId} - Download file
    [HttpGet("download/{fileId}")]
    public async Task<IActionResult> DownloadFile(int fileId);

    // DELETE /api/KYC/files/delete/{fileId} - Delete file
    [HttpDelete("delete/{fileId}")]
    public async Task<IActionResult> DeleteFile(int fileId);

    // GET /api/KYC/files/info/{fileId} - Get file information
    [HttpGet("info/{fileId}")]
    public async Task<IActionResult> GetFileInfo(int fileId);

    // PUT /api/KYC/files/description/{fileId} - Update file description
    [HttpPut("description/{fileId}")]
    public async Task<IActionResult> UpdateFileDescription(int fileId, UpdateFileDescriptionDto dto);

    // GET /api/KYC/files/categories - Get file categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetFileCategories();
}
```

### 4. **System User Management** (MEDIUM PRIORITY)
```csharp
[Route("api/KYC/users")]
public class KYCUsersController : ControllerBase
{
    // GET /api/KYC/users - Get system users
    [HttpGet]
    public async Task<IActionResult> GetSystemUsers();

    // GET /api/KYC/users/{userId}/companies - Get user company access
    [HttpGet("{userId}/companies")]
    public async Task<IActionResult> GetUserCompanyAccess(string userId);

    // PUT /api/KYC/users/{userId}/companies - Update user company access
    [HttpPut("{userId}/companies")]
    public async Task<IActionResult> UpdateUserCompanyAccess(string userId, UpdateCompanyAccessDto dto);
}
```

### 5. **Audit Trail** (HIGH PRIORITY)
```csharp
[Route("api/KYC/audit")]
public class KYCAuditController : ControllerBase
{
    // GET /api/KYC/audit/trail/{kycRequestId} - Get audit trail
    [HttpGet("trail/{kycRequestId}")]
    public async Task<IActionResult> GetAuditTrail(string kycRequestId);

    // GET /api/KYC/audit/actions/{kycRequestId} - Get approval actions
    [HttpGet("actions/{kycRequestId}")]
    public async Task<IActionResult> GetApprovalActions(string kycRequestId);
}
```

### 6. **Request Status Management** (MEDIUM PRIORITY)
```csharp
[Route("api/KYC/requests")]
public class KYCRequestsExtendedController : ControllerBase
{
    // GET /api/KYC/requests/{kycRequestId}/status-history - Get status history
    [HttpGet("{kycRequestId}/status-history")]
    public async Task<IActionResult> GetStatusHistory(string kycRequestId);

    // PUT /api/KYC/requests/{kycRequestId}/priority - Update priority
    [HttpPut("{kycRequestId}/priority")]
    public async Task<IActionResult> UpdateRequestPriority(string kycRequestId, UpdatePriorityDto dto);

    // POST /api/KYC/requests/{kycRequestId}/assign - Assign reviewer
    [HttpPost("{kycRequestId}/assign")]
    public async Task<IActionResult> AssignReviewer(string kycRequestId, AssignReviewerDto dto);

    // POST /api/KYC/requests/{kycRequestId}/comments - Add comment
    [HttpPost("{kycRequestId}/comments")]
    public async Task<IActionResult> AddComment(string kycRequestId, AddCommentDto dto);

    // GET /api/KYC/requests/{kycRequestId}/comments - Get comments
    [HttpGet("{kycRequestId}/comments")]
    public async Task<IActionResult> GetComments(string kycRequestId);
}
```

### 7. **Bulk Operations** (LOW PRIORITY)
```csharp
[Route("api/KYC/requests/bulk")]
public class KYCBulkOperationsController : ControllerBase
{
    // POST /api/KYC/requests/bulk/approve - Bulk approve
    [HttpPost("approve")]
    public async Task<IActionResult> BulkApprove(BulkApproveDto dto);

    // POST /api/KYC/requests/bulk/reject - Bulk reject
    [HttpPost("reject")]
    public async Task<IActionResult> BulkReject(BulkRejectDto dto);

    // POST /api/KYC/requests/bulk/archive - Bulk archive
    [HttpPost("archive")]
    public async Task<IActionResult> BulkArchive(BulkArchiveDto dto);

    // POST /api/KYC/requests/bulk/assign - Bulk assign
    [HttpPost("assign")]
    public async Task<IActionResult> BulkAssign(BulkAssignDto dto);
}
```

### 8. **Reporting & Analytics** (LOW PRIORITY)
```csharp
[Route("api/KYC")]
public class KYCReportsController : ControllerBase
{
    // GET /api/KYC/reports/export - Export requests
    [HttpGet("reports/export")]
    public async Task<IActionResult> ExportRequests(ExportRequestsDto dto);

    // POST /api/KYC/reports/generate - Generate report
    [HttpPost("reports/generate")]
    public async Task<IActionResult> GenerateReport(GenerateReportDto dto);

    // GET /api/KYC/analytics/performance - Performance metrics
    [HttpGet("analytics/performance")]
    public async Task<IActionResult> GetPerformanceMetrics();

    // GET /api/KYC/analytics/processing-times - Processing times
    [HttpGet("analytics/processing-times")]
    public async Task<IActionResult> GetProcessingTimes();

    // GET /api/KYC/analytics/approval-rates - Approval rates
    [HttpGet("analytics/approval-rates")]
    public async Task<IActionResult> GetApprovalRates();
}
```

### 9. **Configuration & Settings** (LOW PRIORITY)
```csharp
[Route("api/KYC/settings")]
public class KYCSettingsController : ControllerBase
{
    // GET /api/KYC/settings/system - Get system settings
    [HttpGet("system")]
    public async Task<IActionResult> GetSystemSettings();

    // PUT /api/KYC/settings/system - Update system settings
    [HttpPut("system")]
    public async Task<IActionResult> UpdateSystemSettings(UpdateSystemSettingsDto dto);

    // GET /api/KYC/settings/email-templates - Get email templates
    [HttpGet("email-templates")]
    public async Task<IActionResult> GetEmailTemplates();

    // PUT /api/KYC/settings/email-templates/{templateId} - Update email template
    [HttpPut("email-templates/{templateId}")]
    public async Task<IActionResult> UpdateEmailTemplate(int templateId, UpdateEmailTemplateDto dto);

    // GET /api/KYC/settings/notifications - Get notification settings
    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotificationSettings();
}
```

### 10. **Public KYC Extended Operations** (MEDIUM PRIORITY)
```csharp
[Route("api/public/kyc")]
public class PublicKYCExtendedController : ControllerBase
{
    // GET /api/public/kyc/company/{companyId} - Get company info
    [HttpGet("company/{companyId}")]
    public async Task<IActionResult> GetCompanyInfo(int companyId);

    // POST /api/public/kyc/upload-additional/{kycRequestId} - Upload additional files
    [HttpPost("upload-additional/{kycRequestId}")]
    public async Task<IActionResult> UploadAdditionalFiles(string kycRequestId, IFormFileCollection files);

    // POST /api/public/kyc/withdraw/{kycRequestId} - Withdraw request
    [HttpPost("withdraw/{kycRequestId}")]
    public async Task<IActionResult> WithdrawRequest(string kycRequestId);

    // POST /api/public/kyc/resubmit/{kycRequestId} - Resubmit request
    [HttpPost("resubmit/{kycRequestId}")]
    public async Task<IActionResult> ResubmitRequest(string kycRequestId, ResubmitRequestDto dto);
}
```

## 🔥 **CRITICAL PRIORITY - Implement These First**

### 1. **Client Creation Test Mode Support**
The **"Create Test Client"** functionality in test mode requires:
- `POST /api/KYC/clients` - **ALREADY IMPLEMENTED** ✅
- Must support full client details (fname, mname, sname, email, mobileno, etc.)
- Must return proper account_code and account_id
- Must handle account_metadata JSON field

### 2. **Token Validation for Client Pages**
The **ClientKYCPage.js** requires:
- `POST /api/KYC/tokens/validate` - **MISSING** 🔴
- Used in the upsert flow before form display
- Must validate token and return account information

### 3. **File Upload for KYC Requests**
Both admin and client file uploads need:
- `POST /api/KYC/requests/{kycRequestId}/files` - **REFERENCED IN DOCS** ✅
- `GET /api/KYC/requests/{kycRequestId}/files` - **REFERENCED IN DOCS** ✅
- Must handle multipart/form-data uploads
- Must return file metadata and storage paths

## 📊 **Implementation Status Summary**

| Category | Total Endpoints | Implemented | Missing | Priority |
|----------|----------------|-------------|---------|----------|
| **Core KYC (Official)** | 10 | 10 | 0 | ✅ COMPLETE |
| **Privileges Management** | 5 | 0 | 5 | 🔴 CRITICAL |
| **Token Management** | 2 | 1 | 1 | 🔴 CRITICAL |
| **File Management** | 5 | 2 | 3 | 🟡 HIGH |
| **Audit Trail** | 2 | 0 | 2 | 🟡 HIGH |
| **Extended Operations** | 15 | 0 | 15 | 🟢 MEDIUM/LOW |

## 🎯 **Recommended Implementation Order**

### Phase 1: Critical (Required for current functionality)
1. `POST /api/KYC/tokens/validate` - Token validation for client pages
2. `GET /api/KYC/privileges` - Privilege levels for dropdowns
3. `GET /api/KYC/files/categories` - File categories for uploads

### Phase 2: High Priority (Enhanced functionality)
4. `GET /api/KYC/files/download/{fileId}` - File download
5. `DELETE /api/KYC/files/delete/{fileId}` - File deletion
6. `GET /api/KYC/audit/trail/{kycRequestId}` - Audit trail viewing

### Phase 3: Medium Priority (Full feature set)
7. All **Request Status Management** endpoints
8. All **Public KYC Extended Operations** endpoints
9. **System User Management** endpoints

### Phase 4: Low Priority (Advanced features)
10. **Bulk Operations** endpoints
11. **Reporting & Analytics** endpoints
12. **Configuration & Settings** endpoints

## 🧪 **Test Mode Functionality Now Available**

With the current implementation, Test Mode now provides:

### ✅ **Client Creation**
- **Button**: "Create Test Client" (purple button)
- **Form**: Complete client details (name, email, mobile, etc.)
- **API**: Uses `POST /api/KYC/clients` with full client data
- **Features**: Auto-generation of missing fields, metadata support

### ✅ **KYC Request Generation**
- **Button**: "Generate Test KYC" (blue button)
- **Workflow**: Complete 6-phase process following official documentation
- **API**: Uses upsert → token generation → request creation
- **Output**: Full KYC link ready for client access

### 🎯 **Perfect Workflow**
1. **Admin** enables Test Mode
2. **Admin** creates test client via "Create Test Client" 
3. **Admin** generates KYC request via "Generate Test KYC"
4. **System** provides complete secure link
5. **Client** accesses link and submits KYC
6. **Admin** reviews and processes request

The implementation now supports the complete official KYC workflow with proper test mode functionality for development and demonstration purposes.

## 🔧 **Next Steps**

1. **Implement Critical APIs** (Phase 1) to complete current functionality
2. **Test the complete workflow** from client creation to KYC processing
3. **Add remaining APIs** based on feature requirements and priority
4. **Enhance error handling** and validation for all endpoints
5. **Add comprehensive logging** and audit trail support

This implementation guide ensures that all missing functionality is properly documented and prioritized for efficient backend development.

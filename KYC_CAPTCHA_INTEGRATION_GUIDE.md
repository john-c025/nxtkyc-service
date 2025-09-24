# KYC & Captcha Integration Guide

## Overview

This document outlines the integration of KYC (Know Your Customer) and Captcha systems with their respective APIs. Both systems are designed to work with token-based access for security.

## API Endpoints Added

### KYC System Endpoints

#### Internal Admin Endpoints
- `LOAD_CLIENT_ACCOUNTS`: `/api/kyc/clients`
- `CREATE_CLIENT_ACCOUNT`: `/api/kyc/clients`
- `LOAD_KYC_REQUESTS`: `/api/kyc/requests`
- `PROCESS_KYC_REQUEST`: `/api/kyc/requests/process`
- `UPLOAD_KYC_FILES`: `/api/kyc/requests/{kycRequestId}/files`
- `GENERATE_KYC_ACCESS_TOKEN`: `/api/kyc/tokens/generate`

#### Public Client Endpoints (Token-based)
- `SUBMIT_PUBLIC_KYC_REQUEST`: `/api/public/kyc/submit`
- `CHECK_PUBLIC_KYC_STATUS`: `/api/public/kyc/status/{kycRequestId}`
- `LOAD_KYC_PRIVILEGE_LEVELS`: `/api/public/kyc/privilege-levels/{companyId}`
- `LOAD_KYC_SUBMISSION_REQUIREMENTS`: `/api/public/kyc/requirements`

### Captcha System Endpoints
- `GENERATE_CAPTCHA`: `/api/captcha/generate`
- `VERIFY_CAPTCHA`: `/api/captcha/verify`
- `CAPTCHA_STATISTICS`: `/api/captcha/statistics`
- `CAPTCHA_HISTORY`: `/api/captcha/history`

## Page Implementations

### ClientKYCPage.js

**Purpose**: Token-based KYC submission form for clients

**Access Method**: 
```
/kyc-client?token={access_token}&account={account_code}
```

**Key Features**:
- Token validation on page load
- Multi-step form with validation
- File upload with progress tracking
- Real-time submission to API
- Error handling with user feedback
- Responsive design with loading states

**API Integration**:
- Validates access token via URL parameters
- Loads submission requirements and privilege levels
- Submits form data with files via FormData
- Handles success/error responses appropriately

### CaptchaPage.js

**Purpose**: Human verification system with bot protection

**Access Method**:
```
/captcha?redirect={encoded_url}&source={source_identifier}
```

**Key Features**:
- Access validation based on redirect parameter
- Dynamic captcha generation via API
- Real-time verification with API integration
- Automatic redirect after successful verification
- Fallback to local generation if API fails
- History tracking and statistics

**API Integration**:
- Generates captcha via API with custom settings
- Verifies user input against server-side validation
- Tracks verification attempts and response times
- Supports both API and local fallback modes

## Usage Examples

### 1. KYC Workflow

#### Admin generates access token:
```javascript
const response = await axiosInstance.post(API_ENDPOINTS.GENERATE_KYC_ACCESS_TOKEN, {
  account_code: "ACC123456789",
  hours_valid: 24
});

const token = response.data.Data.token;
const clientUrl = `/kyc-client?token=${token}&account=ACC123456789`;
```

#### Client accesses KYC form:
- User receives email with secure link
- Clicks link to access KYC form
- Token is validated automatically
- Form submission includes all required data
- Files are uploaded with progress tracking

### 2. Captcha Workflow

#### Redirect to captcha before sensitive action:
```javascript
const redirectUrl = encodeURIComponent('/sensitive-page');
const captchaUrl = `/captcha?redirect=${redirectUrl}&source=login`;
window.location.href = captchaUrl;
```

#### After successful verification:
- User completes captcha
- Verification is submitted to API
- On success, automatic redirect to original destination
- Verification event is logged for analytics

## Security Features

### KYC Security
- **Token-based access**: Single-use tokens with expiration
- **Account binding**: Tokens tied to specific account codes
- **File validation**: Size and type restrictions
- **Metadata encryption**: Sensitive data stored as encrypted JSON
- **Audit trail**: All actions logged with user context

### Captcha Security
- **Server-side generation**: Captcha generated on server
- **Session binding**: Captcha tied to specific session/ID
- **Rate limiting**: Cooldown periods between generations
- **Fallback protection**: Local generation if API fails
- **Attempt tracking**: Multiple failed attempts trigger new captcha

## Error Handling

### KYC Page
- **Invalid token**: Shows access denied message
- **Expired token**: Clear error message with instructions
- **Upload errors**: File-specific error messages
- **API failures**: Graceful degradation with retry options

### Captcha Page
- **Access denied**: Clear messaging for missing parameters
- **API failures**: Automatic fallback to local generation
- **Verification errors**: New captcha generated after failures
- **Network issues**: Retry mechanisms with user feedback

## File Upload Features

### KYC File Handling
- **Multiple files**: Support for multiple document uploads
- **Progress tracking**: Real-time upload progress
- **Size validation**: Client and server-side validation
- **Type restriction**: Allowed extensions: .pdf, .jpg, .jpeg, .png, .docx, .doc
- **Preview**: Document preview before submission
- **Removal**: Ability to remove uploaded files

### API Integration
- **FormData**: Proper multipart/form-data encoding
- **Progress callbacks**: onUploadProgress for user feedback
- **Error handling**: Specific error messages for file issues
- **Metadata**: File descriptions and categorization

## Configuration Options

### KYC Settings
```javascript
const formData = {
  request_type: 'initial_verification',
  priority_level: 2, // 1=Low, 2=Medium, 3=High, 4=Urgent
  level_to_upgrade_to: 1,
  company_id: 1
};
```

### Captcha Settings
```javascript
const settings = {
  difficulty: 'medium',
  length: 5,
  caseSensitive: false,
  includeNumbers: true,
  includeSymbols: false
};
```

## Database Schema Compliance

### KYC Submission Data Structure
```javascript
const submissionData = {
  access_token: "token_from_url",
  account_code: "account_from_url",
  request_type: "Level Upgrade",
  priority_level: 2,
  level_to_upgrade_to: 1,
  request_description: "Detailed description with metadata",
  files: [File objects],
  file_description: "Document descriptions"
};
```

### Client Metadata Structure
```javascript
const accountMetadata = {
  personal_info: {
    fname, mname, sname, email, mobileno,
    dateOfBirth, nationality
  },
  address_info: {
    address, city, state, postalCode, country
  },
  identity_info: {
    identityType, identityNumber, identityExpiry
  },
  terms_info: {
    termsAccepted, privacyAccepted, marketingAccepted
  }
};
```

## Deployment Notes

### Environment Variables Required
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### API Controller Requirements
- KYCController.cs for internal admin operations
- KYCPublicController.cs for client-facing operations
- Captcha controller for verification services

### File Storage
- Upload directory: `/Uploads/KYC/Public/`
- File naming: `{kycRequestId}_{guid}.{extension}`
- URL pattern: `/uploads/kyc/public/{fileName}`

## Testing

### KYC Testing
1. Generate test access token via admin panel
2. Use token in URL: `/kyc-client?token=TOKEN&account=ACCOUNT`
3. Fill form with test data
4. Upload test documents
5. Verify API submission and database entries

### Captcha Testing
1. Access with redirect: `/captcha?redirect=/test&source=testing`
2. Verify captcha generation and display
3. Test correct/incorrect submissions
4. Verify redirect functionality
5. Check analytics and history tracking

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure API base URL is correct
2. **Token validation fails**: Check URL parameters and token expiry
3. **File upload fails**: Verify file size and type restrictions
4. **Captcha not generating**: Check API connectivity and fallback
5. **Redirect not working**: Verify URL encoding and destination

### Debug Mode
Enable console logging to see:
- Token validation results
- API request/response data
- File upload progress
- Error details and stack traces

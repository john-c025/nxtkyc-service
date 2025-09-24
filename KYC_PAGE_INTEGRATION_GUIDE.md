# KYC Page Integration Guide

## Overview

The KYCPage.js has been enhanced with full API integration and a comprehensive test KYC request generator. The page now supports both mock data (for development) and real API calls (for production) with seamless switching between modes.

## New Features Added

### 🔗 **API Integration**
- **API Mode Toggle**: Switch between mock data and real API calls
- **Real-time Data Loading**: Fetch companies, client accounts, and KYC requests from API
- **Action Processing**: Process KYC requests (approve, reject, archive) via API calls
- **Dashboard Statistics**: Load real dashboard summaries and company statistics

### 🧪 **Test KYC Generator**
- **Test Mode Toggle**: Enable/disable test generation functionality
- **Company Selection**: Choose from existing companies for test requests
- **Client Selection**: Use existing clients or auto-generate test clients
- **Request Configuration**: Configure request type, priority, levels, and descriptions
- **Mock File Generation**: Option to generate placeholder files for testing
- **Access Token Generation**: Automatic token generation for test clients

### 📊 **Enhanced UI Features**
- **Mode Indicators**: Visual indicators for API and Test modes
- **Loading States**: Real-time loading indicators during API calls
- **Error Handling**: Graceful fallback to mock data if API fails
- **Progress Feedback**: User feedback during test generation

## API Endpoints Integrated

### Internal Admin Endpoints
- `LOAD_KYC_COMPANIES` - Load company list
- `LOAD_CLIENT_ACCOUNTS` - Load client accounts by company
- `LOAD_KYC_REQUESTS` - Load KYC requests with filtering
- `PROCESS_KYC_REQUEST` - Process requests (approve/reject/archive)
- `LOAD_KYC_DASHBOARD_SUMMARY` - Dashboard statistics
- `CREATE_CLIENT_ACCOUNT` - Create new test clients
- `GENERATE_KYC_ACCESS_TOKEN` - Generate access tokens
- `CREATE_KYC_REQUEST` - Create new KYC requests

## Usage Instructions

### 1. API Mode
```javascript
// Toggle API mode in the header
1. Click "API Mode" checkbox to enable real API calls
2. All data will be fetched from the backend API
3. All actions (approve, reject, archive) will call real endpoints
4. Loading indicators will show during API operations
```

### 2. Test Mode
```javascript
// Enable test mode for generating test data
1. Click "Test Mode" checkbox to enable test functionality
2. Click "Generate Test KYC" button to open the generator
3. Configure test parameters:
   - Select company (required)
   - Choose existing client or create new one
   - Set request type and priority
   - Configure verification levels
   - Enable mock file generation
4. Click "Generate Test KYC Request" to create
```

### 3. Test Generator Configuration

#### **Company Selection**
- Required field for test generation
- Loads existing companies from API or mock data
- Triggers client account loading when selected

#### **Client Selection**
- Optional: Use existing client account
- Auto-generate: Create new test client with mock data
- Shows format: "First Last (Account Code)"

#### **Request Configuration**
```javascript
const testFormData = {
  selectedCompany: '',      // Company ID (required)
  selectedClient: '',       // Account code (optional)
  requestType: 'initial_verification', // Request type
  priorityLevel: 2,         // 1=Low, 2=Medium, 3=High, 4=Urgent
  currentLevel: 0,          // Current privilege level
  targetLevel: 1,           // Target privilege level
  requestDescription: '',   // Optional description
  generateFiles: true,      // Generate mock files
  fileCount: 3             // Number of mock files
}
```

### 4. API vs Mock Data Behavior

#### **API Mode Enabled**
- Fetches real data from backend
- API calls for all actions
- Real error handling and responses
- Production-ready functionality

#### **API Mode Disabled (Mock Mode)**
- Uses predefined mock data
- Local state management
- Simulated API responses
- Development and demo functionality

## Test Data Generation Process

### 1. Client Account Creation
```javascript
// If no existing client selected, creates new test client
const testClientData = {
  company_id: parseInt(selectedCompany),
  account_origin_number: `TEST-${timestamp}`,
  fname: 'Test',
  mname: 'Client', 
  sname: `User${randomSuffix}`,
  account_metadata: JSON.stringify({
    test_generated: true,
    generated_at: new Date().toISOString()
  })
}
```

### 2. Access Token Generation
```javascript
// Generates 24-hour access token for test client
const tokenData = {
  account_code: clientAccountCode,
  hours_valid: 24
}
```

### 3. KYC Request Creation
```javascript
// Creates KYC request with test configuration
const kycRequestData = {
  account_code: clientAccountCode,
  request_type: selectedType,
  priority_level: selectedPriority,
  request_description: generatedDescription,
  level_to_upgrade_to: targetLevel,
  has_files: generateFiles
}
```

## UI Components Enhanced

### Header Actions
```javascript
<HeaderActions>
  {/* API Mode Toggle */}
  <input type="checkbox" checked={apiMode} onChange={setApiMode} />
  
  {/* Test Mode Toggle */}
  <input type="checkbox" checked={testMode} onChange={setTestMode} />
  
  {/* Test Generator Button (visible when test mode enabled) */}
  {testMode && (
    <Button onClick={() => setShowTestGenerator(!showTestGenerator)}>
      Generate Test KYC
    </Button>
  )}
</HeaderActions>
```

### Test Generator Form
```javascript
<PrivilegeForm>
  {/* Company and Client Selection */}
  <select onChange={handleCompanyChange}>
    {companies.map(company => <option>{company.name}</option>)}
  </select>
  
  {/* Request Configuration */}
  <select value={requestType} onChange={setRequestType}>
    <option value="initial_verification">Initial Verification</option>
    <option value="level_upgrade">Level Upgrade</option>
    {/* ... more options */}
  </select>
  
  {/* File Generation Options */}
  <input type="checkbox" checked={generateFiles} />
  <select value={fileCount}>{/* 1-5 files */}</select>
  
  {/* Action Buttons */}
  <Button onClick={generateTestKYCRequest} disabled={isGenerating}>
    {isGenerating ? 'Generating...' : 'Generate Test KYC Request'}
  </Button>
</PrivilegeForm>
```

## Error Handling

### API Failures
```javascript
try {
  const response = await axiosInstance.get(API_ENDPOINTS.LOAD_KYC_REQUESTS);
  if (response.data.Success) {
    setKycRequests(response.data.Data);
  }
} catch (error) {
  console.error('Error loading KYC requests:', error);
  // Fallback to mock data
  setKycRequests(mockKycData);
}
```

### Test Generation Errors
```javascript
const result = await generateTestKYCRequest();
if (!result.success) {
  // Show error message to user
  alert(result.message);
}
```

## Visual Indicators

### Mode Status
- **API Mode**: Green indicator "• API Mode Active"
- **Loading State**: Orange indicator "• Loading..."
- **Test Mode**: Yellow background with warning icons

### Test Generator Styling
```css
{
  border: '2px solid #fbbf24',
  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  color: '#92400e'
}
```

## Data Flow

### 1. Initialization
```
Page Load → Check API Mode → Load Data (API/Mock) → Render UI
```

### 2. Filter Changes
```
Filter Change → Update State → Reload Data (if API mode) → Re-render
```

### 3. Test Generation
```
Open Generator → Select Company → Load Clients → Configure Request → Generate → Reload Data
```

### 4. Action Processing
```
Click Action → Check API Mode → Call API/Update Mock → Refresh Data → Update UI
```

## Configuration Options

### Request Types
- `initial_verification` - Initial KYC verification
- `level_upgrade` - Privilege level upgrade
- `compliance_review` - Annual compliance review
- `document_update` - Document update request

### Priority Levels
- `1` - Low Priority (5-7 business days)
- `2` - Medium Priority (3-5 business days) 
- `3` - High Priority (1-3 business days)
- `4` - Urgent Priority (Within 24 hours)

### Verification Levels
- `0` - Basic (Default)
- `1` - Bronze (Enhanced)
- `2` - Silver (Premium)
- `3` - Gold (VIP)
- `4` - Platinum (Enterprise)

## Best Practices

### 1. Development Workflow
1. Use mock mode for UI development
2. Enable test mode for generating test data
3. Switch to API mode for integration testing
4. Use test generator to create realistic scenarios

### 2. Testing Strategy
1. Test with various company configurations
2. Generate requests with different priority levels
3. Test approval/rejection workflows
4. Verify file handling functionality

### 3. Production Deployment
1. Ensure API endpoints are accessible
2. Configure proper authentication
3. Set up error monitoring
4. Disable test mode in production

## Troubleshooting

### Common Issues

1. **API Mode not working**
   - Check API_BASE_URL environment variable
   - Verify authentication tokens
   - Check network connectivity

2. **Test generation fails**
   - Ensure company is selected
   - Check API permissions for client creation
   - Verify token generation endpoint

3. **Data not loading**
   - Check browser console for errors
   - Verify API endpoint responses
   - Fallback to mock mode for debugging

### Debug Mode
Enable console logging to see:
- API request/response data
- Test generation progress
- Error details and stack traces
- State changes and data flow

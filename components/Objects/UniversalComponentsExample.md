# Universal Styled Components Guide

This guide shows how to use the universal styled components to maintain consistent theming across the entire project.

## Installation

Import the components you need from the shared file:

```javascript
import { 
  UniversalSelect,
  UniversalInput,
  UniversalSearchInput,
  UniversalButton,
  UniversalCard,
  UniversalStatusBadge,
  UniversalTable,
  UniversalPagination
} from '../Objects/SharedStyledComponents';
import { useTheme } from '../../context/ThemeContext';
```

## Usage Examples

### 1. Universal Select Dropdown

**Before (inline styles):**
```javascript
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className={`w-full px-3 py-2 rounded-lg border ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
  style={{
    backgroundColor: isDarkMode ? '#374151' : 'white',
    color: isDarkMode ? 'white' : '#111827',
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  }}
>
  <option value="all" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>All Status</option>
  <option value="assigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Assigned</option>
</select>
```

**After (universal component):**
```javascript
<UniversalSelect 
  isDarkMode={isDarkMode}
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="all">All Status</option>
  <option value="assigned">Assigned</option>
</UniversalSelect>
```

### 2. Universal Search Input

**Before:**
```javascript
<SearchInput
  type="text"
  placeholder="Search by name, PN number, or reference..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  isDarkMode={isDarkMode}
/>
```

**After:**
```javascript
<UniversalSearchInput
  isDarkMode={isDarkMode}
  type="text"
  placeholder="Search by name, PN number, or reference..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### 3. Universal Buttons

```javascript
{/* Primary Button */}
<UniversalButton variant="primary" isDarkMode={isDarkMode}>
  Save Changes
</UniversalButton>

{/* Secondary Button */}
<UniversalButton variant="secondary" isDarkMode={isDarkMode}>
  Cancel
</UniversalButton>

{/* Success Button */}
<UniversalButton variant="success" isDarkMode={isDarkMode}>
  Export Excel
</UniversalButton>

{/* Danger Button */}
<UniversalButton variant="danger" isDarkMode={isDarkMode}>
  Delete
</UniversalButton>
```

### 4. Universal Status Badges

```javascript
<UniversalStatusBadge variant="success">Assigned</UniversalStatusBadge>
<UniversalStatusBadge variant="warning">Pending</UniversalStatusBadge>
<UniversalStatusBadge variant="danger">Failed</UniversalStatusBadge>
<UniversalStatusBadge variant="unassigned">Unassigned</UniversalStatusBadge>
```

### 5. Universal Form Layout

```javascript
<UniversalFormGroup>
  <UniversalLabel isDarkMode={isDarkMode} required>
    Email Address
  </UniversalLabel>
  <UniversalInput
    isDarkMode={isDarkMode}
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</UniversalFormGroup>
```

### 6. Universal Table

```javascript
<UniversalTable isDarkMode={isDarkMode}>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td><UniversalStatusBadge variant="success">Active</UniversalStatusBadge></td>
        <td>
          <UniversalButton variant="secondary" isDarkMode={isDarkMode}>
            Edit
          </UniversalButton>
        </td>
      </tr>
    </tbody>
  </table>
</UniversalTable>
```

### 7. Universal Pagination

```javascript
<UniversalPagination isDarkMode={isDarkMode}>
  <div className="pagination-info">
    <svg>...</svg>
    Showing 1 to 10 of 100 records
  </div>
  <div className="pagination-buttons">
    <button disabled>Previous</button>
    <div className="page-info">Page 1 of 10</div>
    <button>Next</button>
  </div>
</UniversalPagination>
```

## Benefits

1. **Consistency**: All form controls look and behave the same across the entire project
2. **Maintainability**: Update styling in one place, affects all components
3. **Dark Mode**: Automatic theme switching without manual implementation
4. **Accessibility**: Built-in focus states and proper contrast ratios
5. **Performance**: No inline styles, better CSS optimization
6. **Developer Experience**: Simple, predictable API

## Available Variants

### Button Variants
- `primary` - Orange brand color
- `secondary` - Gray/neutral color
- `success` - Green color
- `danger` - Red color
- `warning` - Yellow/orange color

### Status Badge Variants
- `success` - Green (for assigned, active, etc.)
- `warning` - Yellow (for pending, in-progress, etc.)
- `danger` - Red (for failed, error, etc.)
- `info` - Blue (for information)
- `assigned` - Green (alias for success)
- `unassigned` - Gray (for unassigned, inactive, etc.)

## Migration Strategy

1. **Phase 1**: Start using universal components in new features
2. **Phase 2**: Gradually replace existing components during regular maintenance
3. **Phase 3**: Deprecate old styled components files once fully migrated

This approach ensures zero downtime and gradual improvement of the codebase. 
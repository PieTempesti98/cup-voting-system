# 🔧 Refactoring Documentation

## Overview

This document describes the refactoring performed on the CUP Voting System to follow React best practices and improve code maintainability.

## What Was Changed

### Before Refactoring
- **Single file**: All code in one 500+ line `App.jsx` file
- **No separation**: UI, logic, and data management mixed together
- **Hard to maintain**: Difficult to find and modify specific features
- **No reusability**: Logic and components couldn't be reused

### After Refactoring
- **Modular structure**: Code organized into logical folders and files
- **Separation of concerns**: Clear boundaries between UI, logic, and data
- **Easy to maintain**: Each component has a single, well-defined purpose
- **Reusable**: Custom hooks and components can be used independently

## New Structure

### 📁 Folders

#### `src/components/`
React components organized by feature:
- **Header.jsx** - Application header with gradient background
- **TabNavigation.jsx** - Tab navigation component (3 tabs)
- **CandidateForm.jsx** - Form for adding new candidates
- **CandidateList.jsx** - Display list of candidates by parish/age
- **CandidatiSection.jsx** - Complete candidate management section
- **SchedeSection.jsx** - Complete ballot registration section
- **RisultatiSection.jsx** - Complete results display section
- **index.js** - Central export file for all components

#### `src/hooks/`
Custom React hooks for reusable logic:
- **useLocalStorage.js** - Automatic localStorage sync hook
- **useVotingLogic.js** - Voting validation and counting logic
- **index.js** - Central export file for all hooks

#### `src/utils/`
Utility functions:
- **exportCSV.js** - CSV export functionality

#### `src/constants/`
Application constants and configuration:
- **voting.js** - Voting rules, parishes, age groups, storage keys

### 🎯 Main Benefits

1. **Single Responsibility Principle**
   - Each component does one thing well
   - Easy to understand and test

2. **DRY (Don't Repeat Yourself)**
   - Custom hooks extract reusable logic
   - Components can be composed and reused

3. **Easier Testing**
   - Small, focused components are easier to test
   - Logic separated from UI makes unit testing possible

4. **Better Developer Experience**
   - Clear file structure makes navigation easy
   - Import/export pattern is intuitive
   - JSDoc comments document purpose

5. **Scalability**
   - Easy to add new features
   - New developers can understand code faster
   - Changes are isolated to specific files

## Component Hierarchy

```
App
├── Header
├── TabNavigation
└── [Active Section]
    ├── CandidatiSection
    │   ├── CandidateForm
    │   └── CandidateList
    │
    ├── SchedeSection
    │   ├── BallotStatus
    │   ├── CandidateSelection
    │   └── BallotActions
    │
    └── RisultatiSection
        ├── StatsSummary
        └── ResultsList
```

## Custom Hooks

### useLocalStorage(key, defaultValue)
Manages state with automatic localStorage synchronization.

**Benefits:**
- Automatic save on every change
- Error handling built-in
- Reusable across any component

**Usage:**
```javascript
const [data, setData] = useLocalStorage('my-key', []);
```

### useVotingLogic(candidati, votiCorrente)
Provides voting validation and counting functions.

**Benefits:**
- Centralized business logic
- Consistent validation across the app
- Easy to test and modify rules

**Usage:**
```javascript
const { calcolaVotiPerCategoria, validaScheda } = useVotingLogic(candidati, voti);
```

## Migration Guide

If you need to modify the app, here's where to look:

| Task | File(s) to Edit |
|------|----------------|
| Change voting rules | `src/constants/voting.js` |
| Modify candidate form UI | `src/components/CandidateForm.jsx` |
| Update validation logic | `src/hooks/useVotingLogic.js` |
| Change CSV format | `src/utils/exportCSV.js` |
| Modify header design | `src/components/Header.jsx` |
| Add new parish | `src/constants/voting.js` |
| Change localStorage behavior | `src/hooks/useLocalStorage.js` |

## Best Practices Applied

✅ **Component Composition** - Large components broken into smaller pieces
✅ **Custom Hooks** - Logic extracted from components
✅ **Props Pattern** - Data flows down, events flow up
✅ **Constants** - Magic values extracted to configuration
✅ **JSDoc Comments** - All functions documented
✅ **Semantic Naming** - Clear, descriptive names
✅ **File Organization** - Logical folder structure
✅ **Single Source of Truth** - No duplicated code

## Performance Considerations

- **Memoization**: Could add `React.memo()` to prevent unnecessary re-renders
- **Code Splitting**: Could use `React.lazy()` for tab sections
- **Optimization**: Could use `useMemo()` for expensive calculations

These optimizations were not added to keep the code simple and readable, but can be implemented if performance becomes an issue.

## Testing Strategy

With this new structure, testing is straightforward:

1. **Unit Tests** - Test individual components and hooks
2. **Integration Tests** - Test section components with mock data
3. **E2E Tests** - Test complete workflows (add candidate → vote → see results)

## Future Improvements

- [ ] Add TypeScript for type safety
- [ ] Implement component tests with React Testing Library
- [ ] Add PropTypes or TypeScript interfaces
- [ ] Extract more granular components from sections
- [ ] Add error boundary components
- [ ] Implement loading states
- [ ] Add form validation feedback

---

**Refactored with ❤️ following React best practices**

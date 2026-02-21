# Theme System Documentation

## Overview

The Finance Dashboard Mobile app now uses a **unified theme system** with consistent colors, typography, and spacing across all screens.

## Theme Structure

### 📂 Location
`/src/constants/`

### Files
- `Colors.js` - Color palette
- `Typography.js` - Font sizes, weights, and line heights
- `Spacing.js` - Spacing and border radius values
- `index.js` - Central export file

## Usage

### Import Constants
```javascript
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';
```

### Apply in StyleSheet
```javascript
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Roboto-Black',
  },
});
```

## Color Palette

### Primary Colors
- `Colors.primary` - `#3b82f6` (Blue)
- `Colors.success` - `#10b981` (Green - Income)
- `Colors.danger` - `#ef4444` (Red - Expense)
- `Colors.warning` - `#f59e0b` (Orange)

### Neutral Colors
- `Colors.background` - `#f3f4f6` (Light gray background)
- `Colors.card` - `#ffffff` (White cards)
- `Colors.input` - `#f0f0f0` (Input background)

### Text Colors
- `Colors.textPrimary` - `#1f2937` (Dark gray)
- `Colors.textSecondary` - `#6b7280` (Medium gray)
- `Colors.textTertiary` - `#9ca3af` (Light gray)

### Border Colors
- `Colors.border` - `#e5e7eb`
- `Colors.inputBorder` - `#ddd`

## Typography

### Font Sizes
```javascript
FontSize.xs      // 12
FontSize.sm      // 14
FontSize.base    // 16
FontSize.lg      // 18
FontSize.xl      // 20
FontSize['2xl']  // 24
FontSize['3xl']  // 30
FontSize['4xl']  // 36
```

### Font Weights
```javascript
FontWeight.regular   // '400'
FontWeight.medium    // '500'
FontWeight.semibold  // '600'
FontWeight.bold      // '700'
FontWeight.black     // '900' (Roboto Black)
```

### Custom Font
**Roboto Black** is loaded throughout the app:
```javascript
fontFamily: 'Roboto-Black'
```

## Spacing

### Padding/Margin Values
```javascript
Spacing.xs      // 4
Spacing.sm      // 8
Spacing.md      // 12
Spacing.base    // 16
Spacing.lg      // 20
Spacing.xl      // 24
Spacing['2xl']  // 32
Spacing['3xl']  // 40
Spacing['4xl']  // 48
```

### Border Radius
```javascript
BorderRadius.sm    // 4
BorderRadius.md    // 6
BorderRadius.base  // 8
BorderRadius.lg    // 12
BorderRadius.xl    // 16
BorderRadius.full  // 9999 (fully rounded)
```

## Benefits

### 1. **Consistency**
- All screens use the same color values
- Typography is uniform across the app
- Spacing follows a predictable scale

### 2. **Maintainability**
- Change one value to update entire app
- No more hunting for hardcoded hex codes
- Easy to rebrand or create themes

### 3. **Scalability**
- Add new colors/sizes easily
- Support for dark mode (future)
- Theme switching capability

### 4. **Developer Experience**
- Autocomplete in IDEs
- Clear, semantic naming
- Import once, use everywhere

## Example: Before vs After

### Before (Hardcoded)
```javascript
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
```

### After (Theme System)
```javascript
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.base,
    borderRadius: BorderRadius.lg,
  },
  text: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Roboto-Black',
  },
});
```

## Screens Updated

All screens now use the theme system:
- ✅ AddTransactionScreen
- ✅ DashboardScreen
- ✅ TransactionsScreen
- ✅ BudgetScreen
- ✅ FinancialTipsScreen
- ✅ SettingsScreen
- ✅ AppNavigator

## Assignment Requirements Met

✅ **Requirement 6️⃣: UI / Design System**
- [x] Themed color system implemented
- [x] Consistent spacing and typography
- [x] Roboto Black font loaded and applied
- [x] Professional design system

## Future Enhancements

### Dark Mode Support
```javascript
// Future: Add dark mode colors
const DarkColors = {
  background: '#1f2937',
  card: '#374151',
  textPrimary: '#f9fafb',
  // ... etc
};
```

### Theme Context
```javascript
// Future: Create theme context for switching
const ThemeContext = React.createContext();
```

---

**Last Updated:** February 21, 2026

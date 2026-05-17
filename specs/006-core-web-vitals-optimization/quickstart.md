# Quickstart: Performance Audit & Validation

This guide explains how to validate Core Web Vitals optimizations for Sun Pyramids Tours.

## 1. Setup Validation Environment

Ensure you are running a production build to get accurate metrics:

```powershell
# Install dependencies
npm install

# Build the project
npm run build

# Preview the production build
npm run preview
```

## 2. Running Lab Audits (Lighthouse)

Use the CLI to run Lighthouse for reproducible results:

```powershell
# Homepage Audit (Normal)
npx lighthouse http://localhost:3000/ --output=html --output-path=./reports/home-normal.html --only-categories=performance

# Homepage Audit (Diagnostic Mode)
npx lighthouse "http://localhost:3000/?no-third-party=1" --output=html --output-path=./reports/home-diagnostic.html --only-categories=performance
```

## 3. Manual Verification Checklist

### CLS & Layout
- [ ] Open DevTools -> Performance tab -> Experience row.
- [ ] Check for "Layout Shift" entries.
- [ ] Verify image containers have reserved space (no jumping).

### Prefetching & Network
- [ ] Open DevTools -> Network tab -> Filter: `Doc`.
- [ ] Reload homepage.
- [ ] **PASS**: Only the main document is loaded.
- [ ] **FAIL**: Multiple internal route documents are loaded.

### Hydration
- [ ] Open Browser Console.
- [ ] **PASS**: No "Hydration completed but contains mismatches" warning.

## 4. Production Monitoring

Real-user data (Field Data) is available in the **Vercel Dashboard** under the **Analytics** tab once FR-009 is implemented.

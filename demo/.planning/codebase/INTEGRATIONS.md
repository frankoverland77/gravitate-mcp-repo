# External Integrations

**Analysis Date:** 2026-01-16

## APIs & External Services

**Component Library:**
- @gravitate-js/excalibrr - Private npm package
  - Registry: npmjs.org
  - Auth: `NPM_TOKEN` environment variable
  - Configuration: `.npmrc` with token interpolation

**AG Grid:**
- AG Grid Enterprise - Commercial grid library
  - License: `VITE_AG_GRID_LICENSE_KEY` environment variable
  - Initialization: `src/main.tsx` - `LicenseManager.setLicenseKey()`
  - License holder: capSpire (expires December 17, 2024)

**Map Services:**
- OpenStreetMap via Leaflet
  - No API key required
  - Used in: `src/pages/demos/delivery/components/MapView.tsx`
  - Tile layer: Standard OSM tiles

## Data Storage

**Databases:**
- None directly configured
- Mock data used throughout (`*.data.ts` files)
- API hooks pattern prepared for backend integration

**File Storage:**
- Local filesystem only (no cloud storage configured)

**Caching:**
- React Query in-memory cache
  - Default: No refetch on window focus
  - Default: No automatic retry on failure
  - Configuration: `src/main.tsx` and `src/App.tsx`

## Authentication & Identity

**Auth Provider:**
- Mock/Demo mode - No actual authentication
  - `handleLogout={() => {}}` - Empty logout handler
  - `getScopes={async () => scopes}` - Static permissions

**Session Management:**
- LocalStorage for theme preference (`TYPE_OF_THEME`)
- No actual auth tokens or sessions

**Navigation Provider:**
- `NavigationContextProvider` from `@gravitate-js/excalibrr`
  - Scopes-based menu filtering
  - Page config from `src/pageConfig.tsx`
  - Controlled via `src/_Main/AuthenticatedRoute.jsx`

## Monitoring & Observability

**Error Tracking:**
- None configured

**Analytics:**
- react-ga 3.3.1 available (Google Analytics)
  - Not visibly initialized in codebase

**Logs:**
- Console-based logging
  - ESLint warns on `console.log` (allows `console.warn`, `console.error`)

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Configuration: `vercel.json`
  - Build command: `yarn build`
  - Output: `build/` directory
  - Framework: Vite

**CI Pipeline:**
- Git hooks via Husky (pre-commit)
- No CI/CD config files detected (no `.github/workflows/`, `gitlab-ci.yml`, etc.)

**Deployment Settings:**
- SPA routing: All routes rewrite to `/index.html`
- Asset caching: 1 year immutable cache for `/assets/*`

## Environment Configuration

**Required env vars:**
- `VITE_AG_GRID_LICENSE_KEY` - AG Grid Enterprise license (required for enterprise features)
- `NPM_TOKEN` - npmjs authentication for private packages (required for installation)

**Optional env vars:**
- None documented beyond the above

**Secrets location:**
- `.env.local` - Local development (gitignored)
- Vercel Environment Variables - Production deployment

**Environment files:**
- `.env.example` - Template with documentation
- `.env.local` - Local overrides (gitignored)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## API Pattern

**Backend API Integration Pattern:**
- Uses `useApi()` hook from `@gravitate-js/excalibrr`
- TanStack Query for data fetching and caching
- Example implementation: `src/pages/demos/DogGrooming/api/useDogGrooming.ts`

**Standard API Hook Pattern:**
```typescript
// From src/pages/demos/DogGrooming/api/useDogGrooming.ts
import { useApi } from '@gravitate-js/excalibrr';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationMessage } from '@gravitate-js/excalibrr';

const endpoints = {
  read: 'api/resource/read',
  create: 'api/resource/create',
  update: 'api/resource/update',
  delete: 'api/resource/delete',
};

export function useResource() {
  const api = useApi();
  const queryClient = useQueryClient();

  const useResourceQuery = (filters) =>
    useQuery([endpoints.read, filters], () => api.post(endpoints.read, filters));

  const useCreateMutation = () =>
    useMutation((request) => api.post(endpoints.create, request), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Created successfully', false);
        queryClient.invalidateQueries([endpoints.read]);
      },
      onError: () => {
        NotificationMessage('Error.', 'Failed to create', true);
      },
    });

  return { useResourceQuery, useCreateMutation };
}
```

## Theme System

**Multi-tenant Theming:**
- 14+ theme configurations in `src/components/shared/Theming/themeconfigs.ts`
- Themes: LIGHT_MODE, DARK_MODE, SUNOCO, FHR, MURPHY, GROWMARK, OSP, BP, DKB, P66, PE_LIGHT, MOTIVA, THANKSGIVING, CHRISTMAS

**Theme Provider:**
- `ThemeContextProvider` from `@gravitate-js/excalibrr`
- Theme persisted to localStorage as `TYPE_OF_THEME`
- Default: `PE_LIGHT`

**Theme Switching:**
- Per-route theming via `ThemeRouteWrapper` component
- Example: `<ThemeRouteWrapper theme="OSP"><Component /></ThemeRouteWrapper>`

## Third-Party UI Libraries

**Ant Design (antd 4.20):**
- Form controls: Form, Input, Select, DatePicker, Switch, Checkbox
- Layout: Tabs, Drawer, Modal, Popover, Popconfirm
- Feedback: Tag, Tooltip, Spin, Alert
- Navigation: Menu, Dropdown

**Nivo Charts:**
- `@nivo/line` - Line charts
- `@nivo/scatterplot` - Scatter plots
- Used in: `src/pages/OnlineSellingPlatform/components/`

**Recharts:**
- Used in: `src/pages/ContractMeasurement/sections/benchmarks/HistoricalComparisonSection.tsx`
- Components: LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer

**Leaflet/React-Leaflet:**
- Interactive maps
- Components: MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker
- Clustering: leaflet.markercluster
- Used in: `src/pages/demos/delivery/components/MapView.tsx`

---

*Integration audit: 2026-01-16*

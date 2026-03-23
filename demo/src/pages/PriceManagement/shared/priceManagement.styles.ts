// ─── Consolidated CSS for PriceManagement pages ────────────────────────────
// Shared style block injected once per page via <style>{PRICE_MANAGEMENT_STYLES}</style>

export const PRICE_MANAGEMENT_STYLES = `
  .pm-save-highlight .ag-cell {
    background-color: var(--theme-success-dim) !important;
    transition: background-color 0.5s ease;
  }
  .pm-conflict-row {
    background-color: #fff7e6 !important;
  }
  .pm-conflict-row .ag-cell {
    background-color: #fff7e6 !important;
    border-left: none;
  }
  .pm-conflict-row .ag-cell:first-child {
    border-left: 3px solid #fa8c16 !important;
  }
  .pm-drawer .ant-drawer-body {
    padding: 0 !important;
  }
  .pm-drawer .ant-collapse-item {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
  }
  .pm-drawer .ant-collapse-content {
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
  }
  .pm-drawer .ant-collapse-content-box {
    padding: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
  }
  .price-history-grid .search-control,
  .price-history-grid .page-control-bar {
    display: none !important;
  }
  .drawer-resizing .ant-drawer-content-wrapper {
    transition: none !important;
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
  @keyframes stackedSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

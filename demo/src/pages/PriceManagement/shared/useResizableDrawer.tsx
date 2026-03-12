import { useCallback, useRef, useState } from 'react';

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useResizableDrawer(defaultWidth: string) {
  const minWidthRef = useRef<number>(0);
  const [width, setWidth] = useState<number | null>(null);

  const handleResize = useCallback(
    (newWidth: number) => {
      if (minWidthRef.current === 0) {
        if (defaultWidth.endsWith('vw')) {
          minWidthRef.current = (parseFloat(defaultWidth) / 100) * window.innerWidth;
        } else {
          minWidthRef.current = parseFloat(defaultWidth) || 500;
        }
      }
      const max = window.innerWidth * 0.92;
      setWidth(Math.max(minWidthRef.current, Math.min(newWidth, max)));
    },
    [defaultWidth]
  );

  const resetWidth = useCallback(() => setWidth(null), []);

  return { drawerWidth: width ?? defaultWidth, handleResize, resetWidth };
}

// ─── Resize Handle Component ─────────────────────────────────────────────────

interface ResizeHandleProps {
  onResize: (newWidth: number) => void;
}

export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      document.body.classList.add('drawer-resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onResize(window.innerWidth - moveEvent.clientX);
      };

      const handleMouseUp = () => {
        document.body.classList.remove('drawer-resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResize]
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 8,
        cursor: 'col-resize',
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 2,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 3,
          height: 48,
          borderRadius: 2,
          backgroundColor: isHovered ? 'var(--theme-color-1)' : 'var(--theme-border)',
          opacity: isHovered ? 1 : 0.5,
          transition: 'background-color 0.15s, opacity 0.15s',
        }}
      />
    </div>
  );
}

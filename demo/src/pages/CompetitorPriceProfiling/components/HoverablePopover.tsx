import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Popover } from 'antd';
import type { TooltipPlacement } from 'antd/es/tooltip';

const HIDE_DELAY_MS = 180;

interface HoverablePopoverProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  popoverId?: string;
  overlayStyle?: React.CSSProperties;
}

export function HoverablePopover({
  content,
  children,
  placement = 'bottom',
  popoverId,
  overlayStyle,
}: HoverablePopoverProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    if (pinned) return;
    clearHide();
    hideTimer.current = setTimeout(() => {
      setOpen(false);
      hideTimer.current = null;
    }, HIDE_DELAY_MS);
  }, [pinned, clearHide]);

  const handleTriggerEnter = useCallback(() => {
    clearHide();
    setOpen(true);
  }, [clearHide]);

  const handleTriggerLeave = useCallback(() => {
    scheduleHide();
  }, [scheduleHide]);

  const handleTriggerClick = useCallback(() => {
    if (pinned) {
      setPinned(false);
      setOpen(false);
    } else {
      setPinned(true);
      setOpen(true);
    }
  }, [pinned]);

  const handleContentEnter = useCallback(() => {
    clearHide();
  }, [clearHide]);

  const handleContentLeave = useCallback(() => {
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => clearHide, [clearHide]);

  useEffect(() => {
    if (!pinned) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const pop = document.querySelector(`[data-popover-id="${popoverId ?? ''}"]`);
      if (pop && target && pop.contains(target)) return;
      setPinned(false);
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [pinned, popoverId]);

  const wrappedContent = (
    <div
      data-popover-id={popoverId}
      onMouseEnter={handleContentEnter}
      onMouseLeave={handleContentLeave}
    >
      {content}
    </div>
  );

  return (
    <Popover
      open={open}
      content={wrappedContent}
      placement={placement}
      trigger={[]}
      overlayStyle={{ maxWidth: 360, ...overlayStyle }}
      overlayInnerStyle={{ background: '#ffffff', color: 'var(--gray-700)' }}
      destroyOnHidden
    >
      <span
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
        onClick={handleTriggerClick}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
      >
        {children}
      </span>
    </Popover>
  );
}

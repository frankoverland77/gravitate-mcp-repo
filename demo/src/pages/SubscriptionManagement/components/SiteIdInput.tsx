// SiteIdInput component - Tag-based site ID input following Gravitate pattern
// Blue tags for site IDs

import { useState, useRef } from 'react';
import { Tag, Input } from 'antd';
import { Horizontal } from '@gravitate-js/excalibrr';
import '../styles/SubscriptionManagement.css';

interface SiteIdInputProps {
  siteIds: string[];
  readOnly?: boolean;
  onChange?: (siteIds: string[]) => void;
}

export function SiteIdInput({ siteIds, readOnly = false, onChange }: SiteIdInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!readOnly && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChange = (newSiteIds: string[]) => {
    onChange?.(newSiteIds);
  };

  const handleRemoveTag = (idToRemove: string) => {
    const newSiteIds = siteIds.filter((id) => id !== idToRemove);
    handleChange(newSiteIds);
  };

  const addSiteId = (id: string) => {
    const trimmedId = id.trim().toUpperCase();
    if (trimmedId && !siteIds.includes(trimmedId)) {
      handleChange([...siteIds, trimmedId]);
      setInputValue('');
    } else {
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    // Check if the input ends with a comma, add tag if it does
    if (value.endsWith(',')) {
      const newId = value.slice(0, -1).trim();
      addSiteId(newId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter: add new tag
    if (e.key === 'Enter' && inputValue.trim()) {
      addSiteId(inputValue);
      e.preventDefault();
    }
    // Backspace: remove last tag when input empty
    if (e.key === 'Backspace' && !inputValue && siteIds.length > 0) {
      handleChange(siteIds.slice(0, -1));
    }
    // Tab: also adds tag
    if (e.key === 'Tab' && inputValue.trim()) {
      addSiteId(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (pasteData) {
      const pastedIds = pasteData
        .split(',')
        .map((id) => id.trim().toUpperCase())
        .filter((id) => id && !siteIds.includes(id));
      if (pastedIds.length > 0) {
        handleChange([...siteIds, ...pastedIds]);
      }
    }
  };

  // Read-only mode - just display tags
  if (readOnly) {
    return (
      <Horizontal className="site-id-input-readonly">
        {siteIds.map((id) => (
          <Tag key={id} className="site-id-tag">
            {id}
          </Tag>
        ))}
      </Horizontal>
    );
  }

  // Editable mode - tags with input
  return (
    <div className="site-id-input-container" onClick={handleContainerClick}>
      {siteIds.map((id) => (
        <Tag key={id} closable onClose={() => handleRemoveTag(id)} className="site-id-tag">
          {id}
        </Tag>
      ))}
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        size="small"
        className="site-id-input-field"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={siteIds.length === 0 ? 'Enter site IDs...' : ''}
      />
    </div>
  );
}

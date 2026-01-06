// EmailInput component - Tag-based email input following SiteIdInput pattern from Gravitate
// Green tags for active emails, red strikethrough for opted-out emails

import { useState, useRef } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { Horizontal } from '@gravitate-js/excalibrr';
import type { OptedOutEmail } from '../SubscriptionManagement.types';
import '../styles/SubscriptionManagement.css';

interface EmailInputProps {
  emails: string[];
  optedOutEmails?: OptedOutEmail[];
  readOnly?: boolean;
  onChange?: (emails: string[]) => void;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInput({
  emails,
  optedOutEmails = [],
  readOnly = false,
  onChange,
}: EmailInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!readOnly && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChange = (newEmails: string[]) => {
    onChange?.(newEmails);
  };

  const handleRemoveTag = (emailToRemove: string) => {
    const newEmails = emails.filter((email) => email !== emailToRemove);
    handleChange(newEmails);
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail && EMAIL_REGEX.test(trimmedEmail) && !emails.includes(trimmedEmail)) {
      handleChange([...emails, trimmedEmail]);
      setInputValue('');
    } else if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      // Could add error notification here
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
      const newEmail = value.slice(0, -1).trim();
      addEmail(newEmail);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter: add new tag
    if (e.key === 'Enter' && inputValue.trim()) {
      addEmail(inputValue);
      e.preventDefault();
    }
    // Backspace: remove last tag when input empty
    if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      handleChange(emails.slice(0, -1));
    }
    // Tab: also adds tag
    if (e.key === 'Tab' && inputValue.trim()) {
      addEmail(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (pasteData) {
      const pastedEmails = pasteData
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email && EMAIL_REGEX.test(email) && !emails.includes(email));
      if (pastedEmails.length > 0) {
        handleChange([...emails, ...pastedEmails]);
      }
    }
  };

  // Read-only mode - just display tags
  if (readOnly) {
    return (
      <Horizontal className="email-input-readonly">
        {emails.map((email) => (
          <Tag key={email} className="email-tag">
            {email}
          </Tag>
        ))}
        {optedOutEmails.map((item) => (
          <Tooltip key={item.email} title={`Opted out on ${item.optedOutDate}`}>
            <Tag className="email-tag-opted-out">{item.email}</Tag>
          </Tooltip>
        ))}
      </Horizontal>
    );
  }

  // Editable mode - tags with input
  return (
    <div className="email-input-container" onClick={handleContainerClick}>
      {emails.map((email) => (
        <Tag key={email} closable onClose={() => handleRemoveTag(email)} className="email-tag">
          {email}
        </Tag>
      ))}
      {optedOutEmails.map((item) => (
        <Tooltip key={item.email} title={`Opted out on ${item.optedOutDate}`}>
          <Tag closable onClose={() => handleRemoveTag(item.email)} className="email-tag-opted-out">
            {item.email}
          </Tag>
        </Tooltip>
      ))}
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        size="small"
        className="email-input-field"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={emails.length === 0 ? 'Enter email addresses...' : ''}
      />
    </div>
  );
}

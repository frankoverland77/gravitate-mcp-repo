import { useState } from 'react';
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import type { ActivityLogEntry } from '../ProjectHub.types';

interface ProjectHubActivityLogProps {
  entries: ActivityLogEntry[];
  onAddEntry: (message: string, author: string) => void;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProjectHubActivityLog({ entries, onAddEntry }: ProjectHubActivityLogProps) {
  const [newMessage, setNewMessage] = useState('');
  const [author, setAuthor] = useState('Manual');

  const handleAdd = () => {
    const msg = newMessage.trim();
    if (!msg) return;
    onAddEntry(msg, author);
    setNewMessage('');
  };

  return (
    <div>
      <Texto weight="600" style={{ marginBottom: 8 }}>Activity Log</Texto>

      {/* Add entry form */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 12,
      }}>
        <Input
          placeholder="Add a note..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={handleAdd}
          style={{ flex: 1 }}
          size="small"
        />
        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ width: 80 }}
          size="small"
          placeholder="Author"
        />
        <GraviButton
          size="small"
          onClick={handleAdd}
          disabled={!newMessage.trim()}
        >
          <PlusOutlined />
        </GraviButton>
      </div>

      {/* Log entries */}
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {entries.length === 0 && (
          <Texto appearance="medium" category="label" style={{ fontStyle: 'italic' }}>
            No activity yet
          </Texto>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              padding: '6px 0',
              borderBottom: '1px solid var(--gray-100)',
            }}
          >
            <Horizontal alignItems="flex-start" style={{ gap: 8 }}>
              <ClockCircleOutlined style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 3, flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <Texto category="label">{entry.message}</Texto>
                <Horizontal alignItems="center" style={{ gap: 6, marginTop: 2 }}>
                  <Texto appearance="medium" category="label" style={{ fontSize: 11 }}>
                    {formatDateTime(entry.timestamp)}
                  </Texto>
                  {entry.author && (
                    <Texto appearance="medium" category="label" style={{ fontSize: 11 }}>
                      · {entry.author}
                    </Texto>
                  )}
                </Horizontal>
              </div>
            </Horizontal>
          </div>
        ))}
      </div>
    </div>
  );
}

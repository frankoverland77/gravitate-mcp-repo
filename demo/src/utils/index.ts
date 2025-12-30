/**
 * Shared utility functions
 */

/**
 * Option format used by Gravitate components
 * Contains Value (the data value) and Text (display label)
 */
export interface SelectOption {
  Value: string | number | boolean;
  Text: string;
}

/**
 * Convert Gravitate SelectOption format to Ant Design option format
 * Used for mapping dropdown options to antd Select component
 *
 * @param option - Option in { Value, Text } format
 * @returns Option in { value, label } format for antd Select
 */
export function toAntOption(option: SelectOption): {
  value: string | number | boolean;
  label: string;
} {
  return {
    value: option.Value,
    label: option.Text,
  };
}

export const GavelIcon = ({ color = 'var(--gray-700)', ...props }: { color?: string; style?: React.CSSProperties }) => (
  <span
    className='anticon'
    style={{
      display: 'inline-block',
      lineHeight: 0,
      ...props.style,
    }}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      fill='none'
      stroke={color}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M14 13l-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 010-3L11 10' />
      <path d='M16 16l6-6' />
      <path d='M8 8l6-6' />
      <path d='M9 7l8 8' />
      <path d='M21 11l-8-8' />
    </svg>
  </span>
)

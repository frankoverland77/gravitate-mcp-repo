export const BoxTagIcon = ({ color = 'var(--gray-700)', ...props }: { color?: string; style?: React.CSSProperties }) => (
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
      <path d='M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z' />
      <circle cx='7.5' cy='7.5' r='.5' fill={color} />
    </svg>
  </span>
)

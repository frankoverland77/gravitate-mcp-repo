export const statusColor = (status?: string) => {
  switch ((status ?? '').toLowerCase()) {
    case 'accepted':
      return '#14a349'
    case 'completed':
      return '#14a349'
    case 'active':
      return '#1677ff'
    case 'pending':
      return '#f59e0c'
    case 'scheduled':
      return '#f59e0c'
    case 'remaining volume':
    case 'remaining':
      return '#e4e6ea'
    case 'declined':
      return 'red'
    default:
      return '#e4e6ea'
  }
}

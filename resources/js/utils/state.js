// State badge and color utilities
export function getStateBadgeClass(intent) {
  const classes = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-gray-100 text-gray-800',
    general: 'bg-gray-100 text-gray-800',
  }
  return classes[intent] || classes.general
}

export function getStatusColor(intent) {
  const colors = {
    success: 'green',
    danger: 'red',
    warning: 'yellow',
    info: 'blue',
    primary: 'indigo',
    secondary: 'gray',
    general: 'gray',
  }
  return colors[intent] || 'gray'
}


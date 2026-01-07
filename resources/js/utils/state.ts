import { css } from '../../../styled-system/css'

export type StateIntent =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'general'

const badgeClasses: Record<StateIntent, string> = {
  success: css({
    backgroundColor: 'rgb(220, 252, 231)',
    color: 'rgb(22, 163, 74)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
  danger: css({
    backgroundColor: 'rgb(254, 226, 226)',
    color: 'rgb(185, 28, 28)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
  warning: css({
    backgroundColor: 'rgb(254, 243, 199)',
    color: 'rgb(161, 98, 7)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
  info: css({
    backgroundColor: 'rgb(219, 234, 254)',
    color: 'rgb(37, 99, 235)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
  primary: css({
    backgroundColor: 'rgb(224, 231, 255)',
    color: 'rgb(79, 70, 229)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
  secondary: css({
    backgroundColor: 'rgb(243, 244, 246)',
    color: 'rgb(75, 85, 99)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
  general: css({
    backgroundColor: 'rgb(243, 244, 246)',
    color: 'rgb(75, 85, 99)',
    paddingInline: '0.75rem',
    paddingBlock: '0.25rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'inline-block',
  }),
}

export function getStateBadgeClass(intent: StateIntent): string {
  return badgeClasses[intent]
}

export function getStatusColor(intent: StateIntent): string {
  const colors: Record<StateIntent, string> = {
    success: 'green',
    danger: 'red',
    warning: 'yellow',
    info: 'blue',
    primary: 'indigo',
    secondary: 'gray',
    general: 'gray',
  }
  return colors[intent]
}



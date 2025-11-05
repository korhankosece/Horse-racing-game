export interface AppTableColumn {
  key: string
  label: string
  width?: string
}

export interface AppTableProps {
  columns: AppTableColumn[]
  data: Record<string, unknown>[]
  stickyHeader?: boolean
}

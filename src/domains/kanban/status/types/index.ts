export interface ITaskStatusWithoutId {
  title: string
  description?: string
}

export interface ITaskStatus extends ITaskStatusWithoutId {
  id: number
}

export interface ITaskStatusPosition {
  id: number
  statusId: number
  value: number
}

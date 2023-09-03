export interface ITask {
  id: number
  title: string
  description: string
  statusId: number
}

export interface ITaskPosition {
  id: number
  taskId: number
  value: number
}

export interface ITaskStatusTask {
  id: number
  taskId: number
  statusId: number
}

export interface ITask {
  id: number
  title: string
  description: string
  statusId: number
  position: number
  linkBoardId: number | null
}

export interface ITaskStatusTask {
  id: number
  taskId: number
  statusId: number
}

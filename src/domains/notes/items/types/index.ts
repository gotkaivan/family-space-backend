export interface INote {
  id: number
  title: string
  description?: string
  content: string
  boardId: number
  isFavorite: boolean
}

export interface INoteBoardNote {
  id: number
  noteId: number
  boardId: number
}

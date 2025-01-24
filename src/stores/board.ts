import type BoardGateway from '@/gateways/BoardGateway'
import type {
  Board,
  BoardSummary,
  Column,
  CreateBoardColumnRequest,
  MoveCardRequest,
} from '@/types/board'
import { boardGatewayKey } from '@/utils/injection-keys'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { useProjectStore } from './project'
import { useTeamStore } from './team'

export const useBoardStore = defineStore('boards', () => {
  const boardGateway = inject(boardGatewayKey) as BoardGateway
  const boards = ref<BoardSummary[]>([])
  const board = ref<Board | null>(null)
  const { project } = storeToRefs(useProjectStore())
  const { teamId } = storeToRefs(useTeamStore())

  async function listBoards() {
    boards.value = await boardGateway.listBoardsByProjectId(project.value!.id)
  }

  async function getBoard(boardId: string) {
    board.value = await boardGateway.getBoard(teamId.value!, boardId)
  }

  async function moveCard(columnId: string, cardId: string, request: MoveCardRequest) {
    await boardGateway.moveCard(teamId.value!, board.value!.id, columnId, cardId, request)
    const { columns } = board.value!
    const sourceColumn = columns.find((column) => column.id === columnId)!
    const targetColumn = columns.find((column) => column.id === request.targetColumnId)!
    const cardIndex = sourceColumn.cards.findIndex((card) => card.id === cardId)
    const [card] = sourceColumn.cards.splice(cardIndex, 1)
    card.columnId = request.targetColumnId
    card.position = request.targetPosition
    targetColumn.cards.splice(request.targetPosition, 0, card)
    reorderCards(sourceColumn)
    reorderCards(targetColumn)
  }

  function reorderCards(column: Column) {
    column.cards.forEach((card, index) => {
      card.position = index
    })
  }

  async function createColumn(request: CreateBoardColumnRequest) {
    await boardGateway.createColumn(teamId.value!, board.value!.id, request)
  }

  async function deleteColumn(columnId: string) {
    await boardGateway.deleteColumn(teamId.value!, board.value!.id, columnId)
  }

  return {
    boards,
    board,
    listBoards,
    getBoard,
    moveCard,
    createColumn,
    deleteColumn,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot))
}

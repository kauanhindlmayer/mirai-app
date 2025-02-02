import type { Board, BoardSummary } from '@/types/board'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoardStore = defineStore('boards', () => {
  const boards = ref<BoardSummary[]>([])
  const board = ref<Board | null>(null)

  return {
    boards,
    board,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBoardStore, import.meta.hot))
}

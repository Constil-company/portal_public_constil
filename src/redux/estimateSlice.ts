/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface EstimateItem {
  item: string
  qty: number
  unit: string
  unit_cost: number
  material_cost: number
  labor_cost: number
  total_cost: number
}

export interface EstimateTrade {
  trade: string
  items: EstimateItem[]
  total_cost: number
}

interface EstimateState {
  tables: EstimateTrade[]
}

const initialState: EstimateState = {
  tables: [],
}

const estimateSlice = createSlice({
  name: "estimate",
  initialState,
  reducers: {
    setEstimateTables(state, action: PayloadAction<any[]>) {
      state.tables = action.payload
    },
    clearEstimate(state) {
      state.tables = []
    },
  },
})

export const { setEstimateTables, clearEstimate } = estimateSlice.actions
export default estimateSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TemplateState {
  selectedTemplate: number | null;
}

const initialState: TemplateState = {
  selectedTemplate: null,
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<number | null>) => {
      state.selectedTemplate = action.payload;
    },
    clearSelectedTemplate: (state) => {
      state.selectedTemplate = null;
    },
  },
});

export const { setSelectedTemplate, clearSelectedTemplate } = templateSlice.actions;
export default templateSlice.reducer;

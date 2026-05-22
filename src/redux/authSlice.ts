import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string;
  user: any;
}

const initialState: AuthState = {
  token: '',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.token = '';
      state.user = null;
    },
  },
});

export const { setToken, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;

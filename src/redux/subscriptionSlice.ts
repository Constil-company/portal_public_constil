import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionState {
  isSubscriptionOpen: boolean;
}

const initialState: SubscriptionState = {
  isSubscriptionOpen: false,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionOpen: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionOpen = action.payload;
    },
  },
});

export const { setSubscriptionOpen } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

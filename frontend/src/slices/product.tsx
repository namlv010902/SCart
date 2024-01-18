import { createSlice } from '@reduxjs/toolkit';
import { IProduct } from '../common/products';
interface ProductState {
  selectedProduct: IProduct[];
}

const initialState: ProductState = {
  selectedProduct: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    selectProduct: (state, action) => {
      state.selectedProduct = [...action.payload];
    },
  },
});

export const { selectProduct } = productSlice.actions;
export default productSlice.reducer;
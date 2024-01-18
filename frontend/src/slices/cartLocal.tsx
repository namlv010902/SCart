import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ICartProduct {
  _id: string;
  quantity: number;
}

interface ICart {
  products: ICartProduct[];
}

const initialState: ICart = {
  products: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const cartSlice = createSlice({
  name: 'cartLocal',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartProduct>) => {
      const { _id, quantity } = action.payload;
      const existingProduct = state.products.find((product) => product._id === _id);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        state.products.push({ _id, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(state.products));
    },
  },
});

export const { addToCart } = cartSlice.actions;

export const selectCart = (state: RootState) => (state as { cartLocal: ICart }).cartLocal.products;

export default cartSlice.reducer;
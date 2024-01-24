import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IProduct } from '../common/products';
import { toast } from 'react-toastify';
import { baseUrl } from '../services/fetchBaseQuery.service';

interface IParams {
  quantity: number,
  id: string
}

interface ICartProduct {
  _id: string;
  quantity: any;
  name: string;
  maxQuantity: number
}

interface ICart {
  products: ICartProduct[];
}

const initialState: ICart = {
  products: JSON.parse(localStorage.getItem('cart') || '[]'),
};

export const fetchProductById = createAsyncThunk(
  'cartLocal/fetchProductById',
  async ({ id, quantity }: IParams, { dispatch }) => {
    const response = await fetch(`${baseUrl}/products/${id}`)
    const res = await response.json()
    console.log("response ==>>", response)
    const data = {
      _id: id,
      maxQuantity: res.data.quantity,
      quantity,
    }
    dispatch(updateProductQuantity(data))
    return data;
  }
);

const cartSlice = createSlice({
  name: 'cartLocal',
  initialState,
  reducers: {
    addCart: (state, action: PayloadAction<ICartProduct>) => {
      const { _id, quantity, maxQuantity } = action.payload;
      if (maxQuantity < quantity) {
        toast.error('Đã vượt quá số lượng', {
          autoClose: 3000,
        });
        return
      }
      const existingProduct = state.products.find((product) => product._id === _id);
      if (existingProduct) {
        if (existingProduct.quantity + quantity > maxQuantity) {
          toast.error('Số lượng còn lại ko đủ!', {
            autoClose: 3000,
          });
          return
        }
        existingProduct.quantity += quantity;
      } else {
        state.products.push(action.payload);
      }
      toast.success('Đã thêm vào giỏ hàng', {
        autoClose: 3000,
      });
      localStorage.setItem('cart', JSON.stringify(state.products));
    },
    removeProductInCart: (state, action: PayloadAction<string>) => {
      const _id = action.payload;
      console.log(action.payload);
      state.products = state.products.filter((product) => product._id !== _id);
      localStorage.setItem('cart', JSON.stringify(state.products));
    },
    updateProductQuantity: (state, action: PayloadAction<ICartProduct>) => {
      const { _id, quantity, maxQuantity } = action.payload;
      state.products = state.products.map((item: ICartProduct) => {
        if (item._id === _id) {
          if (maxQuantity < quantity) {
            {
              toast.error("Đã đạt tối đa số lượng mua!")
              return {
                ...item,
                quantity: maxQuantity,
              };
            }
          }
          if (quantity == "asc") {
            if (maxQuantity < item.quantity + 1) {
              {
                toast.error("Đã đạt tối đa số lượng mua!")
                return item
              }
            }
            return {
              ...item,
              quantity: parseInt(item.quantity) + 1,
            };
          }
          if (quantity == "desc") {
            if (item.quantity == 1) {
              return item
            }
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          if (quantity > 0) {
            return {
              ...item,
              quantity: quantity,
            };
          } else {
            return {
              ...item,
              quantity: 1,
            };
          }

        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(state.products));
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      console.log("state ", state.products)

    })
  },
});

export const { addCart, removeProductInCart, updateProductQuantity } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cartLocal.products;

export default cartSlice.reducer;
import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import productReducer from './services/product.service'
import authReducer from './services/auth.service'
import userReducer from './services/user.service'
import cartReducer from './services/cart.service'
import orderReducer from './services/order.service'
import categoryReducer from './services/category.service'
import uploadReducer from './services/upload.service'
import evaluationReducer from './services/evaluation.service'
import productSlice from "./slices/product"
import cartSlice from "./slices/cartLocal"

export const store = configureStore({
  reducer: {
    [productReducer.reducerPath]: productReducer.reducer,
    [authReducer.reducerPath]: authReducer.reducer,
    [userReducer.reducerPath]: userReducer.reducer,
    [cartReducer.reducerPath]: cartReducer.reducer,
    [orderReducer.reducerPath]: orderReducer.reducer,
    [categoryReducer.reducerPath]: categoryReducer.reducer,
    [uploadReducer.reducerPath]: uploadReducer.reducer,
    [evaluationReducer.reducerPath]: evaluationReducer.reducer,
    productSlice: productSlice,
    cartLocal: cartSlice,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productReducer.middleware,
      authReducer.middleware,
      userReducer.middleware,
      cartReducer.middleware,
      orderReducer.middleware,
      categoryReducer.middleware,
      uploadReducer.middleware,
      evaluationReducer.middleware,
    ]),
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
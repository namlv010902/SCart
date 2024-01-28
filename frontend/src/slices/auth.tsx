import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '../common/user';
export interface IAuth {
   accessToken: string;
   user: IUser;
}
const initState: IAuth = {
   accessToken: '',
   user: {} as IUser
};

const authReducer = createSlice({
   name: 'auth',
   initialState: initState,
   reducers: {
      saveTokenAndUser: (state, action) => {   
         state.accessToken = action.payload?.accessToken;
         state.user = action.payload?.data;
      },
      clearTokenAndUser: (state) => {   
        state.accessToken = "";
        state.user = {} as IUser
     },
   }
});

export const { saveTokenAndUser,clearTokenAndUser } = authReducer.actions;

export default authReducer.reducer;

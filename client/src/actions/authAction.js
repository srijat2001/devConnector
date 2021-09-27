import {TEST_DISPATCH} from './types';
 export const registerUser = UserData => {
     return {
         type : TEST_DISPATCH,
         payload : UserData
     }
 }
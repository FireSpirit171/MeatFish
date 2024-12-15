import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import ApiClient from '../api/APIClient';

interface UserState {
  isLoggedIn: boolean;
  userName: string | null;
  status: 'idle' | 'loading' | 'failed';
}

interface SessionResponse {
  status: string;
  username: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  userName: null,
  status: 'idle',
};

// Асинхронный экшен для логина
export const loginUser = (email: string, password: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const response = await ApiClient.login({ email, password });
    const data = await response.json() as SessionResponse;

    if (data.status === 'ok') {
      dispatch(login(data.username));
    } else {
      console.log('Неверный логин или пароль');
      dispatch(setStatus('failed'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    dispatch(setStatus('failed'));
  }
};

// Асинхронный экшен для обновления профиля
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: { email: string; password: string | undefined }, { dispatch, getState }) => {
    try {
      const response = await ApiClient.updateProfile(profileData.email, profileData.password);
      const { user } = getState() as { user: UserState };
      dispatch(login(profileData.email));
      return profileData.email;
    } catch (error) {
      throw new Error('Ошибка при обновлении профиля');
    }
  }
);

// Асинхронный экшен для логаута
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiClient.logout();

      if (response.ok) {
        return;
      } else {
        return rejectWithValue('Ошибка при логауте');
      }
    } catch (error) {
      return rejectWithValue('Ошибка при логауте');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.userName = action.payload;
      state.status = 'idle';
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = null;
      state.status = 'idle';
    },
    setStatus: (state, action: PayloadAction<'loading' | 'failed'>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userName = null;
        state.status = 'idle';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        console.error(action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userName = action.payload;
        state.status = 'idle';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        console.error(action.error.message);
      });
  },
});

export const { login, logout, setStatus } = userSlice.actions;

export default userSlice.reducer;


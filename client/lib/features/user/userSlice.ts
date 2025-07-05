import Axios from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface User {
  _id: string;
  name: string;
  email: string;
  profile?: string;
  username: string;
  role: string;
}
interface UserState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "failed";
}
const initialState: UserState = {
  user: null,
  status: "idle",
};

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    try {
      const res = await Axios.get("/auth/me", { withCredentials: true });

      return res.data;
    } catch (err) {
      console.log("user Slice error||||" + err);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;

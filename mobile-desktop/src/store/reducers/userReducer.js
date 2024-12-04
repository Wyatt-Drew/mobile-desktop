import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { subjectId: "" },
  reducers: {
    setSubjectId: (state, action) => {
      state.subjectId = action.payload;
    },
  },
});

export const { setSubjectId } = userSlice.actions;
export default userSlice.reducer;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => ({
        url: "chats/myChats",
        credentials: "include",
      }),
      providesTags:["Chat"]
    }),
  }),
});

export default api;

export const {useGetMyChatsQuery} =api

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";


const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Messages","dashboard-stats"],
  endpoints: (builder) => ({
    getMyChats: builder.query({
      query: () => ({
        url: "chats/myChats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    searchUser: builder.query({
      query: (name) => ({
        url: `users/searchUser?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "users/sendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `users/notification`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "users/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate =false }) => {
        let url = `chats/${chatId}`;
        if (populate) url += "?populate=true";
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    myMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chats/messages/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachment: builder.mutation({
      query: (data) => ({
        url: "chats/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    getMyGroups: builder.query({
      query: () => ({
        url: `chats/myGroupChats`,
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    myFriends: builder.query({
      query: (chatId) => {
        let url = "users/friends";
        if (chatId) url += `?chatId=${chatId}`;
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: ({name,members}) => ({
        url: "chats/newGroup",
        method: "POST",
        credentials: "include",
        body: {name,members},
      }),
      invalidatesTags:["Chat"]
    }),


    renameGroup: builder.mutation({
      query: ({chatId,name}) => ({
        url: `chats/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: {name},
      }),
      invalidatesTags: ["Chat"],
    }),


    addMembersToGroup: builder.mutation({
      query: ({chatId,members}) => ({
        url: "chats/addmembers",
        method: "PUT",
        credentials: "include",
        body: {chatId,members},
      }),
      invalidatesTags: ["Chat"],
    }),

    removeMembersFromGroup: builder.mutation({
      query: ({chatId,userId}) => ({
        url: "chats/removemember",
        method: "PUT",
        credentials: "include",
        body: {chatId,userId},
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: ({chatId}) => ({
        url: `chats/${chatId}`,
        method: "DELETE",
        credentials: "include",
        
      }),
      invalidatesTags: ["Chat"],
    }),


    leaveGroup: builder.mutation({
      query: ({chatId}) => ({
        url: `chats/leavegroup/${chatId}`,
        method: "DELETE",
        credentials: "include",
        
      }),
      invalidatesTags: ["Chat"],
    }),


    getStats: builder.query({
      query: () => ({
        url: "admin/stats",
        credentials: "include",
      }),
      providesTags: ["dashboard-stats"],
    }),


    getAllUsers: builder.query({
      query: () => ({
        url: "admin/users",
        credentials: "include",
      }),
      providesTags: ["all-users"],
    }),

      getAllChats: builder.query({
      query: () => ({
        url: "admin/chats",
        credentials: "include",
      }),
      providesTags: ["all-chats"],
    }),


    getAllMessages:builder.query({
      query: () => ({
        url: "admin/messages",
        credentials: "include",
      }),
      providesTags: ["all-messages"],
    })



  }),
});

export default api;

export const {
  useGetMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useMyMessagesQuery,
  useSendAttachmentMutation,
  useGetMyGroupsQuery,
  useMyFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useAddMembersToGroupMutation,
  useRemoveMembersFromGroupMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useGetStatsQuery,
  useGetAllUsersQuery,
  useGetAllChatsQuery,
  useGetAllMessagesQuery
  

} = api;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const URL = "https://dummyjson.com/users";

export const userApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({ baseUrl: URL }),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => {
        const search = params?.search || "";
        const page = params?.page || 0;
        const size = params?.size || 10;
        let paramsString = "";
        paramsString = paramsString + `${search ? "&" : "?"}limit=${size}`;
        if (page) {
          paramsString = paramsString + `&skip=${page * size}`;
        }
        return search ? `/search?q=${search}` + paramsString : paramsString;
      }
    })
  })
});

export const { useGetAllUsersQuery } = userApi;

"use server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export const fetchData = async <T>(
  apiUrl: string,
  method: HttpMethod = "GET",
  body?: any,
  requestCache?: RequestCache,
  tag?: string,
): Promise<T> => {
  "use server";
  const session: Session | null = await getServerSession(options);
  const token: string = session ? session.user.accessToken : "";
  const cache = requestCache ? requestCache : "default";
  const fetchOptions: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache,
  };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }
  if (tag) {
    fetchOptions.next = { tags: [tag] };
  }
  const res = await fetch(`${process.env.BACKEND_URL}${apiUrl}`, fetchOptions);
  if (!res.ok) {
    console.log(apiUrl);
    throw new Error(
      `데이터를 가져오지 못했습니다. 서버 응답: ${res.status} ${res.statusText}`,
    );
  }
  const data = (await res.json()) as T;

  return data;
};
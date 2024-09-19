import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        loginId: { label: "id", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.loginId || !credentials?.password) {
          return null;
        }
        console.log("credentials", credentials);
        // 여기에 POST 요청을 보낼 URL 작성
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/v1/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          },
        );
        console.log("이건 res값", res);
        // 여기서 받아올 response 받을 json 생각
        if (res.ok) {
          const user = await res.json();
          console.log("userData", user.data);
          return user.data;
        }
        return null;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("signIn 콜백 데이타의 user부분", user);
      console.log("Account 데이터", account);

      // if(profile)로 처리
      if (account?.provider === "kakao") {
        console.log("user값:", user);
        console.log("account값:", account);
        // 만약에 로그인 경로가 kakao 일때는 추가 fetch 필요
        console.log("kakao에서 로그인시도");
        // const result = await fetch(`${process.env.BACKEND_URL}/api/v1/`, {
        //   method: "POST",
        // });
        return "/";
      }

      // 여기에 data fetch 필요
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = user.accessToken; // accessToken을 string으로 캐스팅
        token.name = user.name as string; // 이름도 string으로 캐스팅
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string, // token에서 name을 string으로 캐스팅
        accessToken: token.accessToken as string, // token에서 accessToken을 string으로 캐스팅
      };
      return session;
    },
  },
  pages: {
    signIn: "/member/login",
  },
};

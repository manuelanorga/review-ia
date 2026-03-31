import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/business.manage",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const { data: otpRecord } = await supabase
          .from("otp_codes")
          .select("*")
          .eq("email", credentials.email.toLowerCase())
          .eq("code", credentials.otp)
          .eq("used", false)
          .gte("expires_at", new Date().toISOString())
          .single();

        if (!otpRecord) return null;

        await supabase
          .from("otp_codes")
          .update({ used: true })
          .eq("id", otpRecord.id);

        const { data: user } = await supabase
          .from("users")
          .select("id, email, full_name")
          .eq("email", credentials.email.toLowerCase())
          .single();

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (token.id) session.user.id = token.id;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existing) {
          await supabase.from("users").insert({
            email: user.email,
            full_name: user.name,
            plan: "starter",
            created_at: new Date().toISOString(),
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

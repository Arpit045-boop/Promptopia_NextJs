import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import {signIn, signOut, useSession, getProviders} from 'next-auth/react';


import { connectToDB } from "@utils/database";

const handler = NextAuth({
  // Option objectas
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  // secret: process.env.SECRET,
  callbacks:{
    async session({ session }) {
      try {
  
        const sessionUser = await User.findOne({
          email: session.user.email,
        });
        
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (error) {
        console.error("Error fetching session user:", error);
      }
  
      return session;
    },
    async signIn({account, profile }) {
      try {
        await connectToDB();
  
        // check if user exists
        const userExist = await User.findOne({
          email: profile.email,
        });
  
        // if not, create a new user
        if (!userExist) {
          const newUser = await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
          if (!newUser) {
            throw new Error("Failed to create a new user.");
          }
          return { user: newUser };
        }
      } catch (error) {
        console.log(error);
      }
    },
  }
 
});

export { handler as GET, handler as POST };

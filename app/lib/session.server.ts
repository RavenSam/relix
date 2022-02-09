import bcrypt from "bcrypt"
import { db } from "./db.server"
import { createCookieSessionStorage, redirect } from "remix"

// *********************************************************************************
// Login User
export const login = async ({ username, password }) => {
   const user = await db.user.findUnique({ where: { username } })

   if (!user) return null

   // Check Password
   const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

   if (!isCorrectPassword) return null

   return user
}

// *********************************************************************************
// register User
export const register = async ({ username, email, password }) => {
   const passwordHash = await bcrypt.hash(password, 10)

   return db.user.create({ data: { username, email, passwordHash } })
}

// *********************************************************************************
// Get Session secret
const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) throw new Error("No Session Secret")

// Create session storage
const storage = createCookieSessionStorage({
   cookie: {
      name: "reloox_session",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7days
      httpOnly: true,
   },
})

// *********************************************************************************
// Create Session
export const createUserSession = async (userId: string, redirectTo: string) => {
   const session = await storage.getSession()

   session.set("userId", userId)

   return redirect(redirectTo, {
      headers: {
         "Set-Cookie": await storage.commitSession(session),
      },
   })
}

// *********************************************************************************
//  Get user Session
export const getUserSesson = (request: Request) => {
   return storage.getSession(request.headers.get("Cookie"))
}

// *********************************************************************************
// Get logged in User
export const getUser = async (request: Request) => {
   const session = await getUserSesson(request)
   const userId = session.get("userId")

   if (!userId) {
      return null
   }

   try {
      const user = await db.user.findUnique({ where: { id: userId } })

      delete user.passwordHash
      return user
   } catch (error) {
      return null
   }
}

// *********************************************************************************
// log out User and destroy session
export const logout = async (request: Request) => {
   const session = await storage.getSession(request.headers.get("Cookie"))

   return redirect("/auth/logout", {
      headers: {
         "Set-Cookie": await storage.destroySession(session),
      },
   })
}

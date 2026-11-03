
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Authentification par e-mail et mot de passe
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Adresse e-mail",
          type: "email",
        },
        password: {
          label: "Mot de passe",
          type: "password",
        },
      },

      // Vérification des identifiants
      async authorize(credentials) {
        // Vérifie le format des données reçues
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // Recherche de l'utilisateur dans PostgreSQL
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        // Compare le mot de passe saisi avec son hash
        const passwordIsValid = await compare(
          password,
          user.passwordHash,
        );

        if (!passwordIsValid) {
          return null;
        }

        // Retourne les informations nécessaires à la session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // Les sessions Credentials utilisent des JWT
  session: {
    strategy: "jwt",
  },

  // Transmet l'identifiant et le rôle dans le JWT
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    // Rend ces informations disponibles dans la session
async session({ session, token }) {
  if (
    session.user &&
    typeof token.id === "string" &&
    (token.role === "USER" || token.role === "ADMIN")
  ) {
    session.user.id = token.id;
    session.user.role = token.role;
  }

  return session;
},
  },
});

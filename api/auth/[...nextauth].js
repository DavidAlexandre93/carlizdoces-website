/* global module, require, process */
const NextAuth = require('next-auth').default
const GoogleProvider = require('next-auth/providers/google').default

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
  },
}

module.exports = async function handler(req, res) {
  return NextAuth(req, res, authOptions)
}

import User from '@/models/user';
import { connectToDatabase } from '@/utils/connectToDatabase';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handlers = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	callbacks: {
		async session({ session }) {
			try {
				const sessionUser = await User.findOne({
					email: session.user.email,
				});

				session.user.id = sessionUser._id.toString();

				return session;
			} catch (ex) {}
		},
		async signIn({ profile }) {
			try {
				await connectToDatabase();

				const userExists = await User.findOne({
					email: profile.email,
				});

				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name.replace(' ', ''),
						image: profile.picture,
					});
				}
				//check if a user exists, if not then create a new user

				return true;
			} catch (ex) {
				console.log('error', ex);
				return false;
			}
		},
	},
});

export { handlers as GET, handlers as POST };

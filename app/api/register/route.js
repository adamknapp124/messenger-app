import bcrypt from 'bcrypt';

import prisma from '../../libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const body = await request.json();
		const { email, name, password } = body;

		// if there is no email, name, or password, return Missing Info error
		if (!email || !name || !password) {
			return new NextResponse('Missing info', { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await prisma.user.create({
			data: {
				email,
				name,
				hashedPassword,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.log(error, 'REGISTRATION_ERROR');
		return new NextResponse('Internal Error', { status: 500 });
	}
}

import getCurrentUser from '../../actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function POST(request) {
	try {
		const currentUser = await getCurrentUser();
		console.log('currentUser from route.js: ', currentUser);
		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (isGroup && (!members || members.length < 2 || !name)) {
			return new NextResponse('Invalid Data', { status: 400 });
		}

		if (isGroup) {
			const newConversation = await prisma.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							// iterates over the array of members passed which will have a value object, that servers as an id. The id is used to connect the users
							...members.map((member) => ({
								id: member.value,
							})),
							{
								id: currentUser.id,
							},
						],
					},
					// To include users in conversation, using prisma, add include { users: true } or whatever you want to include
					include: {
						users: true,
					},
				},
			});
			return NextResponse.json(newConversation);
		}

		const existingConversations = await prisma.conversation.findMany({
			where: {
				OR: [
					{
						userIds: {
							equals: [currentUser.id, userId],
						},
					},
					{
						userIds: {
							equals: [userId, currentUser.id],
						},
					},
				],
			},
		});

		const singleConversation = existingConversations[0];

		if (singleConversation) {
			return NextResponse.json(singleConversation);
		}

		const newConversation = await prisma.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: currentUser.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true,
			},
		});

		return NextResponse.json(newConversation);
	} catch (error) {
		return new NextResponse('Internal Error', { status: 500 });
	}
}

'use client';

import axios from 'axios';
import { useRef, useState, useEffect } from 'react';

import { pusherClient } from '../../../libs/pusher';
import useConversation from '../../../hooks/useConversation';
import MessageBox from './MessageBox';
import { find } from 'lodash';

const Body = ({ initialMessages }) => {
	const [messages, setMessages] = useState(initialMessages);
	const bottomRef = useRef(null);

	const { conversationId } = useConversation();

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`);
	}, [conversationId]);

	useEffect(() => {
		pusherClient.subscribe(conversationId);
		bottomRef?.current?.scrollIntoView();

		const messageHandler = (message) => {
			axios.post(`/api/conversations/${conversationId}/seen`);
			setMessages((current) => {
				if (find(current, { id: message.id })) {
					return current;
				}
				return [...current, message];
			});

			bottomRef?.current?.scrollIntoView();
		};

		const updateMessageHandler = (newMessage) => {
			setMessages((current) =>
				current.map((currentMessage) => {
					if (currentMessage.id === newMessage.id) {
						return newMessage;
					}
					return currentMessage;
				})
			);
		};

		pusherClient.bind('messages:new', messageHandler);
		pusherClient.bind('message:update', updateMessageHandler);

		return () => {
			pusherClient.unsubscribe(conversationId);
			pusherClient.unbind('messages:new');
			pusherClient.unbind('messages:update');
		};
	}, [conversationId]);

	return (
		<div className="flex-1 overflow-y-auto">
			{messages.map((message, i) => (
				<MessageBox
					isLast={i === messages.length - 1}
					key={message.id}
					data={message}
				/>
			))}
			<div ref={bottomRef} className="pt-24" />
		</div>
	);
};

export default Body;

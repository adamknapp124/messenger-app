'use client';

import { useForm } from 'react-hook-form';

import useConversation from '../../../hooks/useConversation';
import axios from 'axios';
import { HiPhoto } from 'react-icons/hi2';

import MessageInput from './MessageInput';
import { HiPaperAirplane } from 'react-icons/hi';
import { CldUploadButton } from 'next-cloudinary';

const Form = () => {
	const { conversationId } = useConversation();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			message: '',
		},
	});

	const onSubmit = (data) => {
		setValue('message', '', { shouldValidate: true });
		axios.post('/api/messages', {
			...data,
			conversationId,
		});
	};

	const handleUpload = (result) => {
		axios.post('/api/messages', {
			image: result?.info?.secure_url,
			conversationId,
		});
	};

	return (
		<div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
			<CldUploadButton
				options={{ maxFiles: 1 }}
				onUpload={handleUpload}
				uploadPreset="qqiwevid">
				<HiPhoto size={30} className="text-sky-500" />
			</CldUploadButton>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex items-center gap-2 lg:gap-4 w-full">
				<MessageInput
					id="message"
					register={register}
					errors={errors}
					required
					placeholder="Write a message"
				/>
				<button
					type="submit"
					className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition">
					<HiPaperAirplane size={18} className="text-white" />
				</button>
			</form>
		</div>
	);
};

export default Form;

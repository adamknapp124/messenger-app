import { Inter } from 'next/font/google';

import './globals.css';

import ToasterContext from './context/toasterContext';
import AuthContext from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Messenger Clone',
	description: 'Messenger Clone',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthContext>
					<ToasterContext />
					{children}
				</AuthContext>
			</body>
		</html>
	);
}

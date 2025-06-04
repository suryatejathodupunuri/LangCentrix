import { Inter } from 'next/font/google';
import './globals.css';
import CONFIG from '../../config.js';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: CONFIG.APP_NAME,
  description: CONFIG.APP_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
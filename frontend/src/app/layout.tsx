import Footer from '@/component/Footer';
import './globals.css';
import Header from "@/component/Header"
import { ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body>
                <Header />
                {children}
                <Footer />
                <ToastContainer position="top-right" autoClose={3000} />
            </body>
        </html>
    );
}
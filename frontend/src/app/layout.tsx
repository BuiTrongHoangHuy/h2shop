import Footer from '@/component/Footer';
import './globals.css';
import Header from "@/component/Header"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/lib/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Header />
                    {children}
                    <Footer />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
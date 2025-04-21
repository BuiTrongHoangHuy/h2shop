import Footer from '@/component/Footer';
import './globals.css';
import Header from "@/component/Header"

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
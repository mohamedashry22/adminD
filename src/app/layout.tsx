import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ClientProviders from './ClientProviders';

export const metadata = {
  title: 'Twitter Integration App',
  description: 'Twitter API Integration Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <AuthProvider>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex flex-col flex-1">
                <Header />
                <main className="p-4 overflow-auto">{children}</main>
              </div>
            </div>
          </AuthProvider>
        </ClientProviders>
      </body>
    </html>
  );
}

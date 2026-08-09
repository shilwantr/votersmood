import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'THE STATE UNION | जनमत - Political Intelligence',
  description: 'Official Gazette & Verified Constituency Feedback Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="page-wrapper">
            <Navbar />
            <main className="main-content container animate-fade-in">
              {children}
            </main>
            <footer style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--spacing-lg) 0', textAlign: 'center', marginTop: 'auto' }}>
              <div className="container">
                <p className="font-mono text-muted" style={{ fontSize: '0.875rem' }}>
                  © {new Date().getFullYear()} THE STATE UNION | जनमत. ALL RIGHTS RESERVED.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

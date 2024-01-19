// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

export const metadata = {
  title: 'XDropzone File Uploader',
  description: 'XDropzone file uploader designed and developed by Milan Thakur for xBesh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
        <Notifications />

          {children}
          
          </MantineProvider>
      </body>
    </html>
  );
}
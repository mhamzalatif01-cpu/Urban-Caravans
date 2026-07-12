const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><rect x="1.5" y="1.5" width="39" height="39" rx="7" fill="%231E2733"/><circle cx="7" cy="7" r="1.6" fill="%23F5F3EC" fill-opacity="0.5"/><circle cx="35" cy="7" r="1.6" fill="%23F5F3EC" fill-opacity="0.5"/><circle cx="7" cy="35" r="1.6" fill="%23F5F3EC" fill-opacity="0.5"/><circle cx="35" cy="35" r="1.6" fill="%23F5F3EC" fill-opacity="0.5"/><path d="M11 21h20M11 15h13M11 27h13" stroke="%23F5F3EC" stroke-width="2" stroke-linecap="round"/></svg>`;

export const metadata = {
  title: 'Spec Plate — Caravan Build Reference',
  description: 'Shared caravan build notes, searchable and answerable',
  icons: {
    icon: `data:image/svg+xml,${faviconSvg}`
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

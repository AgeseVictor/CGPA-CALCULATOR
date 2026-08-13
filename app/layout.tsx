import './globals.css'

export const metadata = {
  title: 'cgpa.store | CGPA Calculator & Class Timetable',
  description: 'Track every semester, hit your target CGPA. A comprehensive GPA/CGPA calculator, timetable builder, and academic planning tool for students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen antialiased">{children}</body>
    </html>
  )
}

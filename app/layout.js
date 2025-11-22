import Navbar from '../app/components/Navbar'
import Footer from '../app/components/Footer'
import '../app/styles/globals.css'
// import 'leaflet/dist/leaflet.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

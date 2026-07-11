import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cámara Marketplace - Conecta con Profesionales",
  description: "La plataforma líder para contratar cámaras autónomos para eventos y producciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        {/* Header Simple */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
            <div className="mr-4 flex">
              <a className="mr-6 flex items-center space-x-2 font-bold" href="/">
                📷 Cámara Marketplace
              </a>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <nav className="flex items-center space-x-2">
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Inicia Sesión
                </Link>
                <Link href="/registro" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                  Regístrate
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1">{children}</main>

        {/* Footer Simple */}
        <footer className="border-t border-border/40 py-6 md:px-8 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row max-w-screen-2xl px-4">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2024 Cámara Marketplace. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

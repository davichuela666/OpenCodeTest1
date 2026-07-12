import type { Metadata } from "next";
import Link from "next/link";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "frilanzer - Conecta con Profesionales",
  description: "La plataforma líder para encontrar profesionales autónomos para tus proyectos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${roboto.variable} ${robotoMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/40 bg-white dark:bg-[oklch(0.12_0.015_260)] shadow-xs">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-8">
              <a className="text-xl font-bold tracking-tight text-primary" href="/">
                frilanzer
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Inicia Sesión
              </Link>
              <Link href="/registro" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                Regístrate
              </Link>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-[oklch(0.12_0.02_260)] dark:bg-[oklch(0.08_0.015_260)] text-[oklch(0.85_0.01_260)]">
          <div className="container max-w-screen-2xl px-4 md:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2 md:col-span-1">
                <span className="text-lg font-bold text-white">frilanzer</span>
                <p className="mt-2 text-sm text-[oklch(0.65_0.02_260)] max-w-xs">
                  La plataforma para conectar profesionales autónomos con proyectos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-3">Para Autónomos</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/registro" className="hover:text-white transition-colors">Crear Perfil</a></li>
                  <li><a href="/dashboard/autonomo/perfil" className="hover:text-white transition-colors">Gestión de Agenda</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-3">Para Productoras</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/buscar" className="hover:text-white transition-colors">Buscar Talentos</a></li>
                  <li><a href="/publicar" className="hover:text-white transition-colors">Publicar Proyecto</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-3">Sobre frilanzer</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:text-white transition-colors">Quiénes Somos</a></li>
                  <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-[oklch(0.55_0.02_260)]">
              © 2024 frilanzer. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Clapperboard, Search, CalendarCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 flex flex-col items-center">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[1.1]">
          Conecta Productoras con <br className="hidden sm:inline" />
          <span className="text-primary">Cámaras Autónomos</span> de Confianza
        </h1>
        <p className="max-w-[42rem] mx-auto text-xl text-muted-foreground leading-normal sm:text-2xl sm:leading-8">
          La plataforma definitiva para encontrar talento técnico verificado,
          gestionar disponibilidad y simplificar la contratación para tus eventos
          y producciones.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="px-8">
            Soy Productora y Busco Talento
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Soy Cámara y Quiero Ofrecer mis Servicios
          </Button>
        </div>
      </section>

      {/* Features Section (Provisional) */}
      <section className="py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Search className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Encuentra al Profesional Ideal</CardTitle>
              <CardDescription>
                Filtra por especialidad, ubicación y equipo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accede a perfiles detallados con experiencia y listado de material verificado.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CalendarCheck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Disponibilidad en Tiempo Real</CardTitle>
              <CardDescription>
                Consulta el calendario de los autónomos al instante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Olvídate de emails interminables. Comprueba quién está libre para tus fechas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Clapperboard className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Gestión Simplificada</CardTitle>
              <CardDescription>
                Desde la búsqueda hasta la contratación en un solo lugar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Centraliza tus contactos y agiliza tus procesos de producción.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

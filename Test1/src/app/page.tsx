import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, CalendarCheck, Briefcase, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-screen-2xl px-4 md:px-8 py-20 md:py-28 text-center space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[1.1]">
            Conecta con los mejores <br className="hidden sm:inline" />
            <span className="text-primary">profesionales autónomos</span>
          </h1>
          <p className="max-w-[42rem] mx-auto text-lg text-muted-foreground leading-relaxed sm:text-xl sm:leading-8">
            La plataforma definitiva para encontrar talento verificado,
            gestionar disponibilidad y contratar para tus proyectos
            de forma rápida y segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="px-8 text-base h-11">
              Contrata Talentos
            </Button>
            <Button size="lg" variant="accent" className="px-8 text-base h-11">
              Ofrece tus Servicios <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full border-y border-border/40 bg-muted/30">
        <div className="container max-w-screen-2xl px-4 md:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5.000+", label: "Profesionales" },
              { value: "1.200+", label: "Proyectos Completados" },
              { value: "4.8", label: "Valoración Media" },
              { value: "98%", label: "Satisfacción" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full">
        <div className="container max-w-screen-2xl px-4 md:px-8 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">¿Por qué frilanzer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Encuentra al Profesional Ideal</CardTitle>
                <CardDescription>
                  Filtra por especialidad, ubicación y disponibilidad.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Accede a perfiles detallados con experiencia, valoraciones y calendario en tiempo real.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CalendarCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Disponibilidad en Tiempo Real</CardTitle>
                <CardDescription>
                  Consulta la agenda de los profesionales al instante.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Olvídate de emails interminables. Comprueba quién está disponible para tus fechas.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Star className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Valoraciones Transparentes</CardTitle>
                <CardDescription>
                  Sistema de review cruzado para total confianza.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tanto productoras como autónomos se valoran mutuamente, creando una comunidad de calidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-primary/5 border-y border-border/40">
        <div className="container max-w-screen-2xl px-4 md:px-8 py-14 text-center space-y-6">
          <h2 className="text-2xl font-bold">¿Listo para empezar?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Únete a la comunidad de profesionales y encuentra tu próximo proyecto o el talento que necesitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Crear Cuenta Gratis
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Explorar Talentos
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

# SPEC: Perfil Autónomo — Ficha, Agenda, Historial

## Visión General

El perfil de autónomo es el centro de su identidad profesional en la plataforma. Debe permitirle gestionar su información personal y profesional, controlar su disponibilidad mediante un calendario visual, y mantener un historial de trabajos realizados con valoraciones. Inspirado en plataformas como Upwork, Fiverr y freelance marketplaces modernos.

---

## 1. Ficha de Usuario Autónomo

### 1.1 Datos de Perfil (ampliación de `profiles`)

Se añaden columnas a la tabla `profiles` existente:

| Columna | Tipo | Requerido | Descripción |
|---------|------|-----------|-------------|
| `address_street` | `text` | Sí | Calle y número |
| `address_city` | `text` | Sí | Ciudad |
| `address_state` | `text` | Sí | Provincia/Región |
| `address_zip` | `text` | Sí | Código postal |
| `address_country` | `text` | Sí | País (default: 'España') |
| `bio` | `text` | No | Ya existe — texto libre de presentación |
| `skills` | `text[]` | No | Array de habilidades (ej: 'Steadicam', 'Dron FPV', 'Color grading') |
| `experience_years` | `integer` | No | Años de experiencia profesional |
| `portfolio_urls` | `text[]` | No | Enlaces a trabajos / showreel |
| `social_links` | `jsonb` | No | `{instagram, youtube, linkedin, vimeo}` |
| `observations` | `text` | No | Notas internas visibles solo para el autónomo |
| `availability_status` | `text` | Sí | Enum: `'disponible'`, `'ocupado'`, `'trabajando'`, `'vacaciones'` |
| `hourly_rate` | `numeric(10,2)` | No | Tarifa por hora (opcional, visible en perfil público) |
| `daily_rate` | `numeric(10,2)` | No | Tarifa por día (opcional) |

### 1.2 Habilidades (skills)

- Lista de texto libre con autocompletado basado en skills populares
- Mínimo 1, máximo 15
- Se muestran como badges en el perfil público

### 1.3 Estados de disponibilidad (`availability_status`)

| Estado | Significado | Color |
|--------|-------------|-------|
| `disponible` | Acepta trabajos | Verde |
| `ocupado` | Tiene trabajo pero acepta nuevos | Amarillo |
| `trabajando` | En un trabajo actualmente | Naranja |
| `vacaciones` | No disponible | Rojo |

---

## 2. Agenda de Disponibilidad (Calendario)

### 2.1 Nueva tabla: `availability_slots`

```sql
CREATE TYPE availability_type AS ENUM ('available', 'unavailable', 'tentative');

CREATE TABLE availability_slots (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date       date NOT NULL,
  type       availability_type NOT NULL DEFAULT 'available',
  note       text,                          -- opcional: "Solo mañanas", "Evento en Madrid"
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, date)                  -- un solo estado por día
);
```

### 2.2 Lógica de negocio

- El calendario muestra el **mes actual y siguientes** (hasta 12 meses vista)
- Días en verde = disponible, rojo = no disponible, amarillo = tentative
- Por defecto, todos los días futuros están en `'available'`
- El autónomo puede:
  - Marcar días individuales como no disponibles
  - Marcar rangos completos (ej: "del 1 al 15 de agosto")
  - Añadir notas a días específicos
- Las productoras ven el calendario en **solo lectura** al ver el perfil

### 2.3 Vistas útiles

- Vista mensual (grilla estilo calendario)
- Vista semanal (para planificar trabajos concretos)
- Próximos 7 días destacados al entrar al perfil

---

## 3. Historial de Trabajos

### 3.1 Nueva tabla: `work_history`

```sql
CREATE TYPE job_status AS ENUM ('completed', 'cancelled', 'in_progress');

CREATE TABLE work_history (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id     uuid REFERENCES profiles(id) NOT NULL,           -- la productora
  job_title     text NOT NULL,
  description   text,
  start_date    date NOT NULL,
  end_date      date,
  status        job_status DEFAULT 'completed',
  rating        smallint CHECK (rating >= 1 AND rating <= 5),    -- 1-5 estrellas
  review        text,                                            -- texto de la reseña
  client_name   text,                                            -- nombre visible del cliente
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### 3.2 Funcionalidad

- **Registro automático**: cuando un trabajo se marca como completado, se crea un registro en `work_history` con `status = 'completed'`
- **Valoración mutua**: tanto autónomo como productora pueden valorar (1-5 estrellas + reseña)
- **Historial público**: los últimos 10 trabajos completados se muestran en el perfil público del autónomo
- **Estadísticas**: rating promedio, número total de trabajos, trabajos por mes

---

## 4. Esquema de Rutas (Frontend)

### 4.1 Páginas

| Ruta | Archivo | Tipo | Descripción |
|------|---------|------|-------------|
| `/dashboard/autonomo/perfil` | `app/dashboard/autonomo/perfil/page.tsx` | Server + Client | Formulario de edición de ficha completa |
| `/dashboard/autonomo/agenda` | `app/dashboard/autonomo/agenda/page.tsx` | Client | Calendario de disponibilidad interactivo |
| `/dashboard/autonomo/historial` | `app/dashboard/autonomo/historial/page.tsx` | Server | Lista de trabajos realizados con valoraciones |

### 4.2 Acciones (Server Actions)

| Acción | Archivo | Descripción |
|--------|---------|-------------|
| `updateProfile` | `src/lib/actions/profile.ts` | Actualiza datos de la ficha de autónomo |
| `setAvailability` | `src/lib/actions/availability.ts` | Marca días como disponible/no disponible |
| `setAvailabilityRange` | `src/lib/actions/availability.ts` | Marca un rango de fechas |
| `getAvailability` | `src/lib/actions/availability.ts` | Obtiene disponibilidad para un mes/año |
| `getWorkHistory` | `src/lib/actions/work-history.ts` | Obtiene historial de trabajos |
| `addReview` | `src/lib/actions/work-history.ts` | Añade valoración a un trabajo |

---

## 5. Componentes a Crear

| Componente | Descripción |
|------------|-------------|
| `ProfileForm` | Formulario completo de datos personales y profesionales |
| `SkillsInput` | Input con badges para habilidades (autocompletado) |
| `AvailabilityCalendar` | Calendario mensual interactivo para marcar disponibilidad |
| `AvailabilityLegend` | Leyenda de colores del calendario |
| `WorkHistoryList` | Lista de trabajos completados con valoración |
| `RatingStars` | Componente de estrellas (visual e interactivo) |
| `StatusBadge` | Badge de estado con color (disponible, ocupado, etc.) |
| `AddressForm` | Sub-formulario de dirección postal |

---

## 6. Migraciones de Base de Datos

Orden de ejecución:

1. `add_profile_columns` — Añade columnas a `profiles`
2. `create_availability_slots` — Crea tabla de disponibilidad
3. `create_work_history` — Crea tabla de historial de trabajos

---

## 7. Resumen de Implementación (Fases)

| Fase | Descripción | Dependencias |
|------|-------------|-------------|
| **1** | Migraciones BD: columnas en profiles + availability_slots + work_history | Ninguna |
| **2** | Ficha de perfil: formulario completo con dirección, skills, tarifas, observaciones | Fase 1 |
| **3** | Calendario de disponibilidad: vista mensual + marca días | Fase 1 |
| **4** | Historial de trabajos: listado + valoraciones + estadísticas | Fase 1 |

# 💸 Mis Finanzas

Una app para llevar el control de tus ingresos y gastos personales, organizada por categorías que tú mismo defines.

---

## ¿Qué hace?

- Registras tus ingresos y egresos del día a día
- Tú creas las categorías (ej: Arriendo, Mercado, Moto, Freelance...)
- El dashboard te muestra en qué gastas más, cuánto entra, cuánto sale y tu balance actual
- Puedes filtrar por fecha o categoría para revisar períodos específicos
- Exporta tus movimientos a CSV para analizarlos en Excel o Google Sheets

---

## ¿Cómo se ve por dentro?

Está hecho con:

- **React + Vite** — la interfaz de usuario
- **TailwindCSS** — los estilos
- **Supabase** — la base de datos, el login y la seguridad

Cada usuario solo ve sus propios datos. Hay un rol de administrador para eliminar usuarios.

---

## Arrancar el proyecto localmente

**1. Clona el repositorio**
```bash
git clone https://github.com/EilerDelgado/Mis_Finanzas.git
cd Mis_Finanzas
```

**2. Instala las dependencias**
```bash
npm install
```

**3. Configura las variables de entorno**

Crea un archivo `.env` en la raíz con esto:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

**4. Corre la app**
```bash
npm run dev
```

Abre `http://localhost:8888` en el navegador.

---

## Estructura de carpetas (resumida)

```
src/
├── components/   # Todo lo visual dividido por sección
├── context/      # Estado global (sesión, transacciones)
├── services/     # Toda la comunicación con la base de datos
├── pages/        # Las páginas principales
├── hooks/        # Lógica reutilizable
└── utils/        # Funciones de cálculo, exportación, etc.
```

---

## Roles

| Rol | Qué puede hacer |
|---|---|
| `user` | Ver y gestionar sus propios datos |
| `superadmin` | Gestionar cuentas |

---

## Desplegado

En Vercel

---

## Estado del proyecto

🚧 Se va a seguir mejorando activamnte.


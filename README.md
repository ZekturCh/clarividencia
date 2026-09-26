# Culture Pulse AI

Demo local para un tótem touch vertical de Clarividencia en el evento GDP 2026.

## Instalación

```bash
npm install
npm run dev
```

Abrir la experiencia principal en `http://localhost:5173/`.

Abrir el dashboard en `http://localhost:5173/dashboard`.

## GitHub Pages

La demo publicada vive en `demo/`, como archivos estáticos commiteados en este mismo repositorio.

```bash
npm run build:pages
```

Después de commitear y subir, GitHub Pages puede servir:

- `https://zekturch.github.io/clarividencia/`
- `https://zekturch.github.io/clarividencia/demo/`
- `https://zekturch.github.io/clarividencia/demo/dashboard`

No usa backend, Firebase, OpenAI, GitHub Actions obligatorio ni servicios externos. Es una demo local/static.

## Estructura

- `src/components`: piezas reutilizables de UI.
- `src/screens`: pantallas del flujo del tótem y dashboard.
- `src/data`: preguntas, reglas de scoring y recomendaciones.
- `src/services`: motor determinístico de scoring.
- `src/providers/storage`: contrato de persistencia y `LocalStorageProvider`.
- `src/providers/ai`: contrato de IA y `MockAIProvider`.
- `src/context`: inyección simple de providers.
- `src/hooks`: comportamiento compartido, como reset por inactividad.
- `src/styles`: variables y estilos globales.
- `public/assets`: carpeta reservada para logo, iconos, fondos y recursos gráficos del cliente.

## Configuración

Los flags principales están en `src/config.ts`:

- `EVENT_NAME`
- `EVENT_YEAR`
- `IDLE_TIMEOUT`
- `ANALYSIS_DURATION`
- `ENABLE_LEAD_FORM`
- `ENABLE_DASHBOARD`
- `ENABLE_REAL_AI`
- `ENABLE_REMOTE_STORAGE`

## Cambiar textos, preguntas y scores

Editar `src/data/questions.ts`.

Cada opción define pesos por dimensión. El motor suma esos pesos sobre una base común y normaliza entre 0 y 100. Como no usa valores aleatorios, las mismas respuestas generan siempre los mismos resultados.

## Cambiar recomendaciones

Editar `src/data/recommendations.ts`.

El `MockAIProvider` elige ideas de forma determinística según fortaleza, oportunidad y prioridad calculadas.

## Reemplazar imágenes

Colocar assets definitivos en `public/assets/` y referenciarlos desde componentes o estilos. La demo usa un placeholder textual de Clarividencia y no inventa logos.

## Limpiar LocalStorage

En desarrollo, usar el botón `Clear` que aparece abajo a la derecha.

También se puede limpiar desde DevTools del navegador eliminando:

- `culture-pulse-sessions`
- `culture-pulse-leads`

## Probar el dashboard

En desarrollo, usar el botón `Mock data` para generar participaciones locales de prueba.

El dashboard se actualiza con eventos locales y `BroadcastChannel`, por lo que puede abrirse en otra pestaña mientras el tótem registra nuevas sesiones.

## Evolución posterior

La app ya deja preparados los contratos:

- `StorageProvider` para reemplazar LocalStorage por API o Firebase.
- `AIProvider` para reemplazar `MockAIProvider` por una integración remota.

No hay Firebase, OpenAI real, email, WhatsApp API, backend cloud ni autenticación en esta demo.

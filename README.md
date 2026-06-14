# LexMonitor Ecuador

Plataforma web LegalTech para gestión, control y monitoreo inteligente de procesos judiciales en Ecuador. El MVP permite buscar procesos con datos simulados, agregarlos a un portafolio, ejecutar monitoreo diario manual, analizar actuaciones con reglas de IA simulada, generar alertas, revisar plazos/audiencias y gestionar notas/documentos internos.

## Tecnologías

- Next.js con App Router
- React y TypeScript
- Tailwind CSS
- Supabase Auth y PostgreSQL preparado
- Supabase con respaldo local para desarrollo
- Servicios mock para SATJE, IA, monitoreo y notificaciones

## Instalación

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variables de entorno

Copie `.env.example` a `.env.local` y configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
SATJE_INTEGRATION_MODE=mock
```

No incluya claves reales en el repositorio. `OPENAI_API_KEY` queda reservado para una integración futura; el MVP no realiza llamadas reales a OpenAI.

## Supabase

1. Cree un proyecto en Supabase.
2. Ejecute `supabase-schema.sql` en el SQL editor.
3. Configure `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Active Supabase Auth según la política de usuarios del producto.
5. En producción, valide las políticas RLS para que cada usuario vea únicamente sus propios procesos.

El archivo SQL incluye tablas para usuarios, procesos, actuaciones, alertas, plazos, notas, documentos, configuración de notificaciones y logs de consulta, además de RLS orientativo.

## Modo mock SATJE

`src/services/satjeService.ts` usa datos simulados. La búsqueda llama a `satjeService.searchProcesses(query)` y retorna procesos realistas de Ecuador. También existen mocks para detalle, actuaciones y detección de nuevas actuaciones.

La pantalla `Buscar procesos` también permite abrir el portal oficial de la Función Judicial en `https://procesosjudiciales.funcionjudicial.gob.ec/busqueda` y registrar manualmente los datos obtenidos por el usuario. Ese registro manual crea el proceso en el portafolio, genera una actuación interna y aplica el análisis simulado para producir alertas o fechas tentativas cuando corresponda.

La integración real con SATJE debe realizarse únicamente mediante mecanismos autorizados y respetando condiciones de uso, restricciones técnicas y normativa aplicable. Este MVP no implementa scraping no autorizado, evasión de captcha, bypass de controles ni automatización prohibida.

## IA simulada

`src/services/aiAnalysisService.ts` clasifica actuaciones con reglas simples:

- Completar/subsanar demanda: urgencia alta.
- Término, plazo, cinco días o 5 días: marca plazo.
- Audiencia, citación, medida cautelar, archivo o abandono: prioridad alta.
- Sentencia y providencia: prioridad media o alta según contenido.

En producción, esta capa puede conectarse a un modelo de IA para devolver JSON estructurado con resumen, acción sugerida, urgencia, plazo y tipo de actuación.

## Flujo funcional

1. Iniciar sesión o registrarse.
2. Ir a `Buscar procesos`.
3. Buscar por número, actor, demandado, materia o provincia en modo mock, o abrir el portal oficial e importar manualmente el resultado consultado.
4. Seleccionar procesos mock o registrar un proceso oficial manualmente y agregarlo al portafolio.
5. Revisar el portafolio y activar/suspender monitoreo.
6. Ejecutar monitoreo simulado desde Dashboard.
7. Revisar alertas inteligentes.
8. Confirmar o modificar plazos.
9. Consultar calendario.
10. Agregar notas internas y documentos simulados.

## Limitaciones legales y técnicas

LexMonitor Ecuador es una herramienta de apoyo operativo. No reemplaza el criterio jurídico del abogado. Las fechas de vencimiento son tentativas y deben ser verificadas manualmente conforme a la normativa aplicable, días hábiles, feriados, notificación y reglas procesales.

La integración con SATJE debe realizarse únicamente mediante mecanismos autorizados y respetando las condiciones de uso de la Función Judicial.

## Próximos pasos para producción

- Implementar persistencia real en Supabase por usuario.
- Crear workers o cron jobs autorizados para monitoreo.
- Definir convenio, API oficial o mecanismo legal de integración SATJE.
- Incorporar auditoría de consultas y trazabilidad por actuación.
- Integrar IA real con validación de JSON estructurado.
- Implementar notificaciones por email, push y WhatsApp autorizado.
- Agregar tests unitarios, integración y e2e.
- Incorporar calendario judicial con feriados nacionales/locales y reglas procesales.

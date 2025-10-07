# piels-performance

Testing de Performance - Aseguramiento de la Calidad - S2-2025

## Lighthouse

Guía breve para ejecutar Lighthouse/LHCI usando Node y npx.

## Requisitos

- Node.js v18+
- Google Chrome o Chromium instalado en el sistema

## Instalación

Instalar dependencias del proyecto:

```powershell
npm ci
```

## Ejecución

- Ejecutar LHCI autorun (usa `lighthouserc.json`):

```powershell
npx lhci autorun
```

- Visualizar/generar reporte localmente con `light-report.js` (después de que LHCI/Lighthouse haya generado JSON):

```powershell
node light-report.js
```

Nota: `light-report.js` lee la salida JSON de Lighthouse/LHCI y genera un reporte legible.

---

## k6

Las pruebas de carga con k6 están en la carpeta `k6/`. Consulte `k6/README.md` para instrucciones detalladas.

### Solución de problemas rápida

- Si `npx lhci autorun` falla por falta de Chrome: instale Chrome/Chromium o especifique `--chrome-path`.
- Para problemas de permisos en entornos Linux: considere `--chrome-flags="--no-sandbox"`.

## Recursos Adicionales

- Lighthouse docs: [https://developer.chrome.com/docs/lighthouse/](https://developer.chrome.com/docs/lighthouse/) or [https://developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse)
- LHCI (Lighthouse CI): [https://github.com/GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)

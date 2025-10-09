# piels-performance

Testing de Performance - Aseguramiento de la Calidad - S2-2025

---

## Contenidos

- [piels-performance](#piels-performance)
  - [Contenidos](#contenidos)
  - [Lighthouse](#lighthouse)
  - [Requisitos](#requisitos)
  - [Instalación](#instalación)
  - [Ejecución](#ejecución)
  - [k6](#k6)
    - [Solución de problemas rápida](#solución-de-problemas-rápida)
  - [Entregable](#entregable)
  - [Recursos Adicionales](#recursos-adicionales)

---

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



## Entregable
Basandose en los resultados de sus pruebas, elabore sus propias conclusiones de las causas de las malas (o buenas) puntuaciones para cada una de las páginas. Detalle que componentes o aspectos de la página pueden ser las causas de una mala nota de performance. Para esto, puede acceder mediante su navegador a las direcciones incluídas en el test. 

*Por favor,* trate de usar su inteligencia **real** ingenieril, no una artifical. Los reportes generados por IA no nos son de ninguna utilidad y pueden ser fácilmente recreados por nosotros en caso de que lo fueran. Gracias. 

Para guiarse, utilice la plantilla auto generada llamada **reporte_lighthouse.md**, creada a la hora de correr el script de visualización de resultados

## Recursos Adicionales

- Lighthouse docs: [https://developer.chrome.com/docs/lighthouse/](https://developer.chrome.com/docs/lighthouse/) or [https://developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse)
- LHCI (Lighthouse CI): [https://github.com/GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)
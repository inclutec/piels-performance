# k6 - Testing de Performance

Testing de Performance - Aseguramiento de la Calidad - S2-2025

## Tabla de Contenidos

- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Ejecución de Tests](#ejecución-de-tests)
- [Escenarios Disponibles](#escenarios-disponibles)

## Instalación

### Windows

#### Opción 1: Usando Chocolatey

```powershell
choco install k6
```

#### Opción 2: Usando winget

```powershell
winget install k6 --source winget
```

#### Opción 3: Descarga manual

1. Descargar el instalador desde [k6.io/docs/get-started/installation](https://k6.io/docs/get-started/installation/)
2. Ejecutar el instalador `.msi`
3. Verificar la instalación:

```powershell
k6 version
```

### macOS

#### Opción 1: Usando Homebrew (Recomendado)

```bash
brew install k6
```

#### Opción 2: Descarga manual

```bash
# Descargar y extraer el binario
curl -L https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-macos-amd64.zip -o k6.zip
unzip k6.zip
sudo mv k6 /usr/local/bin/
```

#### Verificar instalación

```bash
k6 version
```

## Estructura del Proyecto

```
k6/
├── test.js              # Test básico de ejemplo
├── options.js           # Opciones y umbrales comunes
├── helpers/             # Funciones auxiliares reutilizables
│   ├── checks.js        # Validaciones personalizadas
│   ├── data.js          # Configuración de URLs y tokens
│   ├── http.js          # Wrappers para peticiones HTTP
│   └── metrics.js       # Métricas personalizadas
└── scenarios/           # Escenarios de prueba específicos
    ├── load.js          # Test de carga constante
    ├── soak.js          # Test de resistencia prolongada
    ├── spike.js         # Test de picos de tráfico
    └── stress.js        # Test de estrés progresivo
```

### Descripción de Archivos

#### `options.js`

Define las opciones comunes compartidas por todos los escenarios:

- **Umbrales (thresholds)**: Límites de rendimiento aceptables
  - Tasa de errores < 1%
  - P95 de latencia < 1200ms
  - P99 de latencia < 2000ms
  - TTFB (Time to First Byte) < 400ms

#### `helpers/`

#### `checks.js` - Validaciones reutilizables

- `status2xx`: Verifica respuestas exitosas (200-299)
- `ttfbUnder(ms)`: Valida que el TTFB sea menor a X ms
- `latencyUnder(ms)`: Valida que la latencia total sea menor a X ms
- `bodyNotEmpty`: Verifica que la respuesta tenga contenido
- `jsonOk`: Valida que la respuesta sea JSON válido
- `headerPresent(header)`: Verifica la presencia de un header específico

#### `data.js` - Configuración centralizada

- `BASE_URL`: URL base de la API
- `API_TOKEN`: Token de autenticación
- `ENDPOINTS`: Funciones para construir URLs de ENDPOINTS

#### `http.js` - Wrappers para peticiones HTTP

- `authHeaders(token)`: Genera headers de autenticación con tags
- `get(url, params, extraChecks)`: Ejecuta GET con validaciones automáticas

#### `metrics.js` - Métricas personalizadas

- `apiLatency`: Tendencia de latencia total
- `apiTTFB`: Tendencia de tiempo hasta el primer byte
- `apiErrors`: Tasa de errores
- `reqCount`: Contador de peticiones
- `record(res)`: Registra todas las métricas de una respuesta

#### `scenarios/`

#### `load.js` - Test de Carga

- **Propósito**: Evaluar el comportamiento bajo carga constante
- **Configuración**: 20 req/s durante 5 minutos
- **VUs**: 50-100 usuarios virtuales

#### `soak.js` - Test de Resistencia

- **Propósito**: Detectar memory leaks y degradación a largo plazo
- **Configuración**: 5 req/s durante 30 minutos (configurable con `RATE`)
- **VUs**: 20-100 usuarios virtuales

#### `spike.js` - Test de Picos

- **Propósito**: Evaluar recuperación ante aumentos súbitos de tráfico
- **Configuración**:
  - Baseline: 5 req/s (10s)
  - Spike: 100 req/s (10s)
  - Recuperación: 5 req/s (30s)

#### `stress.js` - Test de Estrés

- **Propósito**: Encontrar el límite de capacidad del sistema
- **Configuración**: Incremento progresivo de 20 a 200 req/s

## Configuración

### 1. Configurar el Token de Autenticación

#### Colocar el token

Edita `helpers/data.js` y reemplaza el valor de `API_TOKEN`:

```javascript
export const API_TOKEN = 'tu-token-aqui';
```

## Ejecución de Tests

### Test Básico

```powershell
k6 run test.js
```

### Escenarios Específicos

```powershell
k6 run scenarios/load.js
k6 run scenarios/soak.js
k6 run scenarios/spike.js
k6 run scenarios/stress.js
```

#### Test de Carga (Load Test)

```powershell
k6 run scenarios/load.js
```

#### Test de Resistencia (Soak Test)

```powershell
k6 run scenarios/soak.js

```

#### Test de Picos (Spike Test)

```powershell
k6 run scenarios/spike.js
```

#### Test de Estrés (Stress Test)

```powershell
k6 run scenarios/stress.js
```

### Opciones Adicionales

#### Generar reporte HTML

```powershell
k6 run --out json=results.json test.js
```

### Tipos de Executors

#### `constant-vus` - Número fijo de VUs

```javascript
executor: 'constant-vus',
vus: 10,
duration: '5m',
```

#### `ramping-vus` - VUs que aumentan/disminuyen gradualmente

```javascript
executor: 'ramping-vus',
startVUs: 0,
stages: [
  { duration: '1m', target: 20 },
  { duration: '3m', target: 20 },
  { duration: '1m', target: 0 },
],
```

#### `constant-arrival-rate` - Tasa constante de iteraciones

```javascript
executor: 'constant-arrival-rate',
rate: 30,              // 30 iteraciones por timeUnit
timeUnit: '1s',
duration: '5m',
preAllocatedVUs: 50,
```

#### `ramping-arrival-rate` - Tasa variable de iteraciones

```javascript
executor: 'ramping-arrival-rate',
timeUnit: '1s',
preAllocatedVUs: 50,
stages: [
  { target: 10, duration: '1m' },
  { target: 50, duration: '2m' },
  { target: 0, duration: '1m' },
],
```

## Interpretación de Resultados

Métricas clave que k6 reporta:

- **http_req_duration**: Tiempo total de la petición
- **http_req_waiting**: TTFB (Time to First Byte)
- **http_req_failed**: Porcentaje de peticiones fallidas
- **iterations**: Número de iteraciones completadas
- **vus**: Usuarios virtuales activos
- **vus_max**: Máximo de VUs utilizados

### Umbrales de Éxito

Los tests configurados pasan si se cumplen:

- Tasa de errores < 1%
- P95 latencia < 1200ms
- P99 latencia < 2000ms
- P95 TTFB < 400ms (para APIs)
- P95 latencia API < 800ms

## Escenarios Disponibles

Los siguientes escenarios están disponibles en el directorio `scenarios/`:

- **load.js**: Test de carga constante (20 req/s durante 5 minutos)
- **soak.js**: Test de resistencia prolongada (5 req/s durante 30 minutos)
- **spike.js**: Test de picos de tráfico (baseline → spike → recuperación)
- **stress.js**: Test de estrés progresivo (20 a 200 req/s)

## Recursos Adicionales

- [Documentación oficial de k6](https://k6.io/docs/)
- [Ejemplos de k6](https://k6.io/docs/examples/)
- [Guía de mejores prácticas](https://k6.io/docs/testing-guides/test-types/)
- [k6 Cloud](https://k6.io/cloud/)

# Algoritmo de Ingesta Topológica: Transmutación R^5
**Módulo:** `apex-core/src/ingest.rs`

## 1. Naturaleza del Problema
Los sistemas ERP tradicionales y las bases de datos transaccionales operan en espacios dimensionales asimétricos (tablas relacionales con cantidades variables de columnas, campos opcionales nulos, texto no estructurado). Esta asimetría computacional es ineficiente y propensa a fallas semánticas al calcular riesgos a escala.

## 2. La Solución: Reducción Dimensional Agnóstica (ETL)
El `TopologicalIngester` no "lee" bases de datos de forma tradicional. Transmuta flujos de bytes (estructurados, semi-estructurados o crudos) directamente a la Base Canónica $\mathbb{R}^5$ del sistema APEX. Opera bajo un principio de Termodinámica de Software: "Cualquier bloque de información puede ser descrito empíricamente por su entropía, fricción e inercia matemática".

Para lograr esto de forma segura y agnóstica a la fuente de datos original (ej. Postgres, CSV, JSON):
1. **SourceAdapter:** Un trait que convierte cualquier fuente en un flujo estandarizado (Stream) de lotes sin saturar la memoria (Chunking).
2. **Oráculo Heurístico y Plantillas:** Aplica expresiones regulares de carga perezosa (`LazyLock`) para adivinar el esquema subyacente. El esquema validado por el usuario se guarda como una Plantilla.
3. **Dead Letter Queue (Cuarentena):** Aisla las singularidades negativas (datos ruidosos insalvables como texto en columnas de precio) preservando el flujo continuo de ingesta.
4. **Agente Centinela (Change Data Capture):** Un demonio desacoplado que utiliza la Plantilla guardada para realizar *polling* (ej. cada 5 minutos) sobre la fuente original, capturando e inyectando solo los deltas (nuevas transacciones) de forma inmutable, sin requerir clics ni intervención del operador.

## 3. Matemática Vectorial Aplicada (Extracción Heurística de Bytes)
El algoritmo procesa la data cruda en _chunks_ (lotes de bytes) y evalúa el comportamiento iterativo a nivel de _bits_ para inferir su huella matemática pura, sin interpretar el contenido semántico.

1. **Inercia ($v_1$) - Tamaño Estructural**
   - **Cálculo:** Longitud exacta del bloque en bytes ($N$).
   - **Significado:** Masa de la información. Un bloque pesado requerirá mayor procesamiento en el proyector de liquidez y representa transacciones de alta densidad en el ERP de origen.
   
2. **Elasticidad ($v_2$) - Sumatoria de Variación**
   - **Cálculo:** $\sum_{i=1}^{N} | b_i - b_{i-1} |$ (Diferencia absoluta entre bytes consecutivos).
   - **Significado:** Mide la homogeneidad de los datos. Datos altamente estructurados y repetitivos tendrán baja elasticidad. Cadenas JSON complejas o strings de texto libre variados generarán alta elasticidad topológica.

3. **Densidad ($v_3$) - Carga Útil Bitwise**
   - **Cálculo:** $\frac{\text{Conteo de } (b_i \neq 0 \land b_i \neq 32)}{N}$
   - **Significado:** Ratio de "información real" vs. "espacios/vacíos/nulos" en el bloque. Filtra el ruido computacional inyectado por esquemas SQL sobredimensionados.

4. **Fricción ($v_4$) - Aproximación Entrópica (Suma XOR)**
   - **Cálculo:** Acumulador de anillo rotacional donde $Acc_{new} = (Acc_{old} + b_i) \oplus b_i$.
   - **Significado:** Proxy determinista y ultra-rápido de la entropía del bloque. A mayor aleatoriedad o desorden estructural en el formato origen, mayor será el vector de fricción.

5. **Gravedad ($v_5$) - Ancla Criptográfica Plegada**
   - **Cálculo:** Plegado escalar derivado del hash SHA-256 del bloque original operado mediante desplazamientos a la izquierda (Bitwise Shift).
   - **Significado:** Fuerza gravitacional determinista que otorga inmutabilidad al bloque. Si un solo byte es alterado en la base de datos origen (ej. evasión fiscal o alteración de precios), su "gravedad" colapsa, alertando inmediatamente al motor APEX de una disrupción forense.

## 4. Ingeniería Orientada a Datos (Rust DoD & Arquitectura de Hardware)
Para soportar la ingesta masiva requerida por el "Oráculo Empírico", la memoria resultante **NO** se asigna como un *Array of Structs* tradicional (`Vec<VectorR5>`), sino bajo un patrón *Struct of Arrays* (`TopologicalBatch` / SoA). 

Al aislar los componentes vectoriales $v_1, v_2, \dots, v_5$ en vectores contiguos en memoria, el algoritmo satura al 100% la **Caché L1/L2 del procesador**, alcanzando una ejecución de hiper-velocidad. Adicionalmente, el bucle crítico de extracción omite intencionalmente cualquier tipo de _branching_ (ramificaciones `if/else`), previniendo penalizaciones de CPU por "Branch Misprediction".
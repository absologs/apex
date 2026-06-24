# Fundamentos Matemáticos de APEX

Este documento compila de forma exhaustiva los modelos matemáticos, ecuaciones y algoritmos que fundamentan el motor de inferencia económica y optimización de precios (Dynamic Pricing) del sistema APEX.

---

## 1. El Tensor de Lote Discreto ($T_{i,L}$)

El estado de cada activo (lote de inventario) no se evalúa como un escalar contable estático, sino como un tensor de esfuerzo-energía financiera $T_{\mu\nu}$, sujeto a la curvatura dictada por el tensor métrico del mercado (como la inflación y la volatilidad cambiaria).

Para un producto (SKU) $i$ en un lote $L$, el estado de densidad y flujo de capital se define matricialmente como:

$$
T_{i,L} = \begin{bmatrix} 
Q_{inicial} & Q_{actual} \\ 
FX_{origen} & FX_{actual} \\ 
C_{USD} & C_{BS} \\ 
\Delta t_{estancia} & \epsilon_{entropia} 
\end{bmatrix}
$$

**Componentes del Tensor:**
- $Q_{inicial}$: Cantidad de unidades originalmente ingresadas.
- $Q_{actual}$: Cantidad remanente real al instante de evaluación.
- $FX_{origen}$: Tipo de cambio al momento de la compra/ingreso.
- $FX_{actual}$: Tipo de cambio estocástico al momento de la valuación.
- $C_{USD}$ / $C_{BS}$: Costo de adquisición indexado en moneda dura (USD) y moneda local fiduciaria (Bs).
- $\Delta t_{estancia}$: Tiempo de permanencia o antigüedad del lote (afecta el factor de descuento temporal y costo de oportunidad).
- $\epsilon_{entropia}$: Fricción del lote (robos, mermas físicas identificadas empíricamente, errores de conteo). Cualquier perturbación antrópica en un lote altera asimétricamente la presión de liquidez y coeficientes de volatilidad.

---

## 2. Problema de Optimización: El Precio de Supervivencia ($P_{floor}$)

El límite inferior de precio ("Precio de Supervivencia") no es un margen porcentual fijo ni un _mark-up_ ingenuo. Se define formalmente como la solución a un problema de optimización con restricciones estocásticas y horizonte de tiempo finito e incierto.

El límite inferior absoluto e inquebrantable $P_{floor}^{(i)}$ para el producto $i$ en el instante $t$ se formula como:

$$
P_{floor}^{(i)}(t) = \inf \left\{ p \in \mathbb{R}^+ \mid \mathbb{E}^{\mathbb{Q}} \left[ \frac{p \cdot (1 - \mu_i)}{C_{repo}^{(i)}(t + \tau)} \right] \ge 1 + \mathcal{R} \right\}
$$

**Desglose de la Inecuación de Valor Esperado:**
- $\inf \{ \cdot \}$: El ínfimo (valor mínimo) del conjunto de precios posibles $p$ que satisfacen la condición de rentabilidad estocástica.
- $\mathbb{E}^{\mathbb{Q}}[\cdot]$: El valor esperado bajo la medida de probabilidad neutral al riesgo $\mathbb{Q}$.
- $\tau$: Tiempo esperado de liquidación del inventario actual, modelado como el inverso estadístico de la velocidad de venta en tiempo real.
- $C_{repo}^{(i)}(t+\tau)$: El costo de reposición estocástico (no el costo histórico) que regirá en el momento incierto de la recompra del lote en $t+\tau$.
- $\mu_i$: Coeficiente empírico de fricción antrópica, inferido indirectamente (incluye evasiones, descuadres de caja y merma acumulada).
- $\mathcal{R}$: Prima de riesgo base u _Hurdle Rate_ mínimo exigido para justificar la operación del negocio ante el costo del capital local.

---

## 3. Topología de Activos: Salud y Divergencia de Liquidez ($H$)

Apex repudia el ROI (Retorno sobre la Inversión) estático tradicional a favor de un campo vectorial dinámico. Operativamente, mide la divergencia del campo vectorial del capital $\nabla \cdot \vec{J}_c$.

El indicador de Salud de Liquidez $H_i(t)$ para un producto $i$ dictamina empíricamente si el activo aporta o succiona oxígeno financiero al sistema:

$$
H_i(t) = \frac{\partial V_{sales}^{(i)}}{\partial t} \cdot \left( \frac{P_{actual}^{(i)} - C_{repo}^{(i)}}{C_{repo}^{(i)}} \right) \cdot \frac{1}{\pi_{inflacion}}
$$

**Variables Diferenciales:**
- $\frac{\partial V_{sales}^{(i)}}{\partial t}$: La derivada temporal del flujo o volumen de ventas (la aceleración real de extracción de liquidez del mercado).
- $\left( \frac{P_{actual}^{(i)} - C_{repo}^{(i)}}{C_{repo}^{(i)}} \right)$: El margen de protección real actual frente al costo de reposición $C_{repo}$ (no frente al costo histórico contable).
- $\frac{1}{\pi_{inflacion}}$: El vector deflactor o tensor métrico del mercado (volatilidad y devaluación) que penaliza la utilidad diferida.

**Acción Algorítmica Determinista (Smart Contract de Negocios):**
Si el vector $H_i(t) \le 0$, indica matemáticamente que la derivada del flujo de caja real se ha vuelto negativa; el activo cruza la métrica de frontera convirtiéndose en un sumidero de liquidez. Entonces se activa automáticamente la recomendación de liquidación o promoción.

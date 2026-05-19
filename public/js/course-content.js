// ─── COURSE CONTENT DATA ─────────────────────────────────────────────────────
window.COURSE_DATA = {

  'regresion-lineal': {
    title: 'Regresión Lineal',
    badge: 'ANÁLISIS PREDICTIVO',
    modules: [

      // ── MÓDULO 1: EXPLICACIÓN ──────────────────────────────────────────────
      {
        id: 'explicacion', name: '📖 Explicación', type: 'text',
        content: `
          <h2>¿Qué es la Regresión Lineal?</h2>
          <p>La regresión lineal es uno de los algoritmos más fundamentales del Machine Learning y la estadística. Nos permite <strong>modelar la relación entre variables</strong> y hacer predicciones cuantitativas sobre datos continuos.</p>
          <p>Imagina que tienes datos del tamaño de casas y su precio de venta. La regresión lineal te permite trazar la <em>"mejor línea posible"</em> que pasa por esos datos, de modo que puedas predecir el precio de cualquier casa nueva dado su tamaño.</p>

          <div class="content-formula">
            <span class="formula-label">La Ecuación Fundamental</span>
            <code>Y = mX + b</code>
          </div>

          <div class="content-grid-2">
            <div class="content-box">
              <div class="box-title">📐 Pendiente (m)</div>
              <p>Indica cuánto cambia <em>Y</em> por cada unidad que aumenta <em>X</em>. Si <strong>m = 2.5</strong>, significa que por cada metro cuadrado extra de una casa, su precio sube $2,500.</p>
              <code style="display:block; text-align:center; margin-top: 0.8rem;">m = (nΣXY − ΣX·ΣY) / (nΣX² − (ΣX)²)</code>
            </div>
            <div class="content-box">
              <div class="box-title">📍 Intersección (b)</div>
              <p>Es el valor de <em>Y</em> cuando <em>X = 0</em>. Representa el "punto de partida" de la recta al cortar el eje vertical. Aunque matemáticamente simple, su interpretación real depende del contexto.</p>
              <code style="display:block; text-align:center; margin-top: 0.8rem;">b = (ΣY − m·ΣX) / n</code>
            </div>
          </div>

          <h3>El Método de Mínimos Cuadrados (OLS)</h3>
          <p>El objetivo del algoritmo es encontrar los valores de <em>m</em> y <em>b</em> que <strong>minimicen la Suma de los Errores al Cuadrado (SSE)</strong>. El error de cada punto es la distancia vertical entre el dato real y la línea predicha:</p>
          <div class="content-formula">
            <code>SSE = Σ(Yᵢ − Ŷᵢ)² = Σ(Yᵢ − (mXᵢ + b))²</code>
          </div>
          <p>Al elevar al cuadrado, penalizamos más los errores grandes y garantizamos que haya una única solución matemática óptima. Minimizando SSE mediante cálculo diferencial obtenemos las fórmulas de <em>m</em> y <em>b</em> mostradas arriba.</p>

          <h3>Coeficiente de Determinación R²</h3>
          <p>Una vez entrenado el modelo, ¿cómo sabemos qué tan bueno es? Usamos R² (R cuadrado), que mide qué porcentaje de la variabilidad total de los datos explica nuestro modelo:</p>
          <div class="content-formula">
            <code>R² = 1 − (SSE / SST)  donde SST = Σ(Yᵢ − Ȳ)²</code>
          </div>
          <div class="content-grid-3">
            <div class="content-box-sm green">R² = 1.0 → Modelo perfecto</div>
            <div class="content-box-sm yellow">R² = 0.7 → 70% explicado</div>
            <div class="content-box-sm red">R² ≈ 0 → Modelo sin valor</div>
          </div>

          <h3>¿Cuándo usar Regresión Lineal?</h3>
          <ul>
            <li>✅ La variable objetivo (Y) es <strong>numérica continua</strong> (precios, temperaturas, pesos).</li>
            <li>✅ Existe una relación aproximadamente <strong>lineal</strong> entre X e Y.</li>
            <li>✅ Los datos son <strong>independientes</strong> entre sí.</li>
            <li>❌ No usar si la relación es claramente curvilínea o exponencial.</li>
            <li>❌ No usar si quieres clasificar categorías (usar Regresión Logística para eso).</li>
          </ul>
        `
      },

      // ── MÓDULO 2: EJEMPLOS ────────────────────────────────────────────────
      {
        id: 'ejemplos', name: '💡 Ejemplos', type: 'text',
        content: `
          <h2>Ejemplos Prácticos Resueltos</h2>

          <h3>Ejemplo 1: Cálculo Manual Paso a Paso</h3>
          <p>Tienes datos de horas de estudio vs. calificación obtenida en un examen:</p>
          <table class="content-table">
            <thead><tr><th>Estudiante</th><th>Horas (X)</th><th>Calificación (Y)</th><th>X·Y</th><th>X²</th></tr></thead>
            <tbody>
              <tr><td>Ana</td><td>1</td><td>50</td><td>50</td><td>1</td></tr>
              <tr><td>Luis</td><td>2</td><td>60</td><td>120</td><td>4</td></tr>
              <tr><td>María</td><td>3</td><td>65</td><td>195</td><td>9</td></tr>
              <tr><td>Pedro</td><td>4</td><td>80</td><td>320</td><td>16</td></tr>
              <tr><td>Sofía</td><td>5</td><td>90</td><td>450</td><td>25</td></tr>
              <tr class="total-row"><td><strong>TOTAL</strong></td><td><strong>ΣX = 15</strong></td><td><strong>ΣY = 345</strong></td><td><strong>ΣXY = 1135</strong></td><td><strong>ΣX² = 55</strong></td></tr>
            </tbody>
          </table>

          <p style="margin-top: 1.5rem;">Con n = 5 estudiantes, aplicamos las fórmulas:</p>
          <div class="content-formula">
            <code>m = (5×1135 − 15×345) / (5×55 − 15²) = (5675 − 5175) / (275 − 225) = 500/50 = <strong>10</strong></code>
          </div>
          <div class="content-formula">
            <code>b = (345 − 10×15) / 5 = (345 − 150) / 5 = 195/5 = <strong>39</strong></code>
          </div>

          <div class="content-box" style="background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.4);">
            <div class="box-title">📊 Resultado del Modelo</div>
            <p style="font-size: 1.1rem; text-align: center;"><strong>Calificación = 10 × Horas + 39</strong></p>
            <p>Si un estudiante estudia <strong>6 horas</strong>, la predicción sería: <em>Y = 10(6) + 39 = <strong>99 puntos</strong></em></p>
          </div>

          <h3 style="margin-top: 2rem;">Ejemplo 2: Casas y Precios</h3>
          <p>Un agente inmobiliario quiere predecir precios de casas basado en sus metros cuadrados. Tras recopilar datos de 100 casas vendidas, obtiene el modelo:</p>
          <div class="content-formula">
            <code>Precio ($) = 1,850 × Metros² + 45,000</code>
          </div>
          <div class="content-grid-2">
            <div class="content-box">
              <div class="box-title">🏠 Predicciones</div>
              <ul>
                <li>Casa de 80 m² → $193,000</li>
                <li>Casa de 120 m² → $267,000</li>
                <li>Casa de 200 m² → $415,000</li>
              </ul>
            </div>
            <div class="content-box">
              <div class="box-title">📈 Interpretación</div>
              <ul>
                <li><strong>m = 1,850:</strong> Cada m² adicional añade $1,850 al precio.</li>
                <li><strong>b = 45,000:</strong> El precio base (terreno, burocracia, etc.)</li>
                <li><strong>R² = 0.87:</strong> El modelo explica el 87% de las variaciones.</li>
              </ul>
            </div>
          </div>

          <h3 style="margin-top: 2rem;">Ejemplo 3: Temperatura vs. Ventas de Helado</h3>
          <p>Una heladería anota la temperatura del día y las unidades vendidas durante 30 días de verano. El análisis de regresión revela:</p>
          <div class="content-formula">
            <code>Ventas = 12.3 × Temperatura(°C) − 147</code>
          </div>
          <p>Con R² = 0.92, esto significa que la temperatura <strong>explica el 92% de las variaciones en ventas</strong>. Un día a 35°C predice: 12.3 × 35 − 147 = <strong>284 helados</strong>.</p>
        `
      },

      // ── MÓDULO 3: DEMO ────────────────────────────────────────────────────
      { id: 'demo', name: '🎬 Demo Interactiva', type: 'demo_lr' },

      // ── MÓDULO 4: CSV ─────────────────────────────────────────────────────
      { id: 'csv', name: '📊 Subir datos en CSV', type: 'csv_lr' },

      // ── MÓDULO 5: EXAMEN ──────────────────────────────────────────────────
      {
        id: 'examen', name: '📝 Examen Final', type: 'quiz',
        questions: [
          { q: "¿Cuál es el objetivo principal de la Regresión Lineal?", options: ["Clasificar datos en categorías", "Modelar la relación lineal entre variables y predecir valores continuos", "Agrupar datos similares", "Reducir la dimensionalidad"], correct: 1 },
          { q: "En la ecuación Y = mX + b, ¿qué representa 'b'?", options: ["La pendiente de la recta", "El error del modelo", "El valor de Y cuando X = 0 (intersección con el eje Y)", "El coeficiente de correlación"], correct: 2 },
          { q: "¿Qué minimiza el método de Mínimos Cuadrados (OLS)?", options: ["La suma de los errores", "La suma de los errores al cuadrado (SSE)", "El valor de R²", "La pendiente m"], correct: 1 },
          { q: "Un modelo tiene R² = 0.95. ¿Qué significa?", options: ["El modelo tiene un 95% de error", "El modelo explica el 95% de la variabilidad de los datos", "La pendiente es 0.95", "El modelo fallará el 5% del tiempo"], correct: 1 },
          { q: "Si la pendiente m es negativa, ¿cómo es la relación entre X e Y?", options: ["Directamente proporcional", "No hay relación", "Inversamente proporcional (al subir X, baja Y)", "Exponencial"], correct: 2 },
          { q: "Tienes el modelo: Ventas = 5X + 20. Si X = 10, ¿cuántas ventas predice?", options: ["50", "70", "30", "100"], correct: 1 },
          { q: "¿En qué situación NO es apropiado usar Regresión Lineal Simple?", options: ["Predecir precio de una casa por metros cuadrados", "Predecir peso por altura", "Clasificar correos como 'spam' o 'no spam'", "Predecir ventas según inversión publicitaria"], correct: 2 },
          { q: "¿Por qué en OLS se elevan los errores al cuadrado en lugar de simplemente sumarlos?", options: ["Para que el cálculo sea más rápido", "Para que los errores positivos y negativos no se cancelen entre sí y para penalizar más los errores grandes", "Es solo una convención histórica sin motivo matemático", "Para obtener siempre un resultado positivo"], correct: 1 }
        ]
      }
    ]
  },

  'algoritmo-genetico': {
    title: 'Algoritmo Genético',
    badge: 'INTELIGENCIA EVOLUTIVA',
    modules: [

      // ── MÓDULO 1: EXPLICACIÓN ──────────────────────────────────────────────
      {
        id: 'explicacion', name: '📖 Explicación', type: 'text',
        content: `
          <h2>¿Qué es un Algoritmo Genético?</h2>
          <p>Un Algoritmo Genético (AG) es una técnica de <strong>optimización heurística</strong> inspirada en la teoría de la evolución natural de Charles Darwin. Pertenece a la familia de los <em>Algoritmos Evolutivos</em> y es especialmente poderoso para encontrar soluciones buenas en problemas donde el espacio de búsqueda es demasiado grande para explorar de forma exhaustiva.</p>

          <div class="content-box" style="background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.4); margin-bottom: 2rem;">
            <div class="box-title">🧬 Analogía Biológica</div>
            <p>Así como en la naturaleza los individuos más aptos sobreviven y se reproducen (pasando sus genes a la siguiente generación), en un AG las <em>soluciones candidatas</em> más aptas son seleccionadas para generar nuevas soluciones mejores. La evolución hace el trabajo de búsqueda por nosotros.</p>
          </div>

          <h3>Vocabulario Clave</h3>
          <div class="content-grid-2">
            <div class="content-box">
              <div class="box-title">🧬 Individuo / Cromosoma</div>
              <p>Una posible solución al problema. Se representa como una cadena de valores (<em>genes</em>). Por ejemplo, en el Problema del Viajante, un individuo podría ser la ruta: <code>[A, C, D, B, E]</code>.</p>
            </div>
            <div class="content-box">
              <div class="box-title">👥 Población</div>
              <p>El conjunto de todos los individuos (soluciones candidatas) que existen en una generación. Típicamente entre 50 y 500 individuos. Una población diversa evita quedar atrapado en soluciones mediocres.</p>
            </div>
            <div class="content-box">
              <div class="box-title">💪 Fitness (Aptitud)</div>
              <p>Una función matemática que evalúa qué tan buena es una solución. Es el equivalente a la "supervivencia del más apto". El AG intentará maximizar (o minimizar) este valor.</p>
            </div>
            <div class="content-box">
              <div class="box-title">🔄 Generación</div>
              <p>Una iteración completa del ciclo evolutivo: evaluar → seleccionar → cruzar → mutar → reemplazar. Cada generación debería producir una población en promedio más apta que la anterior.</p>
            </div>
          </div>

          <h3>Las 4 Operaciones Genéticas</h3>

          <div class="steps-container">
            <div class="step">
              <div class="step-num">1</div>
              <div class="step-content">
                <strong>Selección</strong>
                <p>Elegir a los "padres" para la reproducción. Los individuos con mayor fitness tienen más probabilidad de ser seleccionados. Métodos comunes: Selección por Torneo (se escogen k individuos al azar y gana el mejor), Ruleta (probabilidad proporcional al fitness).</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div class="step-content">
                <strong>Cruce (Crossover)</strong>
                <p>Combinar los genes de dos padres para crear hijos. En el cruce de un punto, se elige un punto de corte y se intercambian los segmentos: <code>Padre1:[A,B|C,D] + Padre2:[E,F|G,H] → Hijo:[A,B,G,H]</code>.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div class="step-content">
                <strong>Mutación</strong>
                <p>Alterar aleatoriamente uno o más genes de un individuo con una probabilidad muy baja (típicamente 0.1% - 5%). Introduce diversidad genética, previniendo que la población converja prematuramente en un óptimo local.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <div class="step-content">
                <strong>Reemplazo / Elitismo</strong>
                <p>Los hijos reemplazan a los padres menos aptos. Con <em>elitismo</em>, los mejores individuos de la generación actual siempre pasan a la siguiente, garantizando que la mejor solución nunca empeore.</p>
              </div>
            </div>
          </div>

          <h3>Pseudocódigo del Algoritmo</h3>
          <pre class="code-block">INICIALIZAR población con individuos aleatorios
EVALUAR fitness de cada individuo
REPETIR hasta condición de parada:
    SELECCIONAR padres (los más aptos)
    CRUZAR pares de padres → hijos
    MUTAR hijos con probabilidad p_mutación
    EVALUAR fitness de los hijos
    REEMPLAZAR individuos menos aptos con los hijos
RETORNAR el mejor individuo encontrado</pre>
        `
      },

      // ── MÓDULO 2: EJEMPLOS ────────────────────────────────────────────────
      {
        id: 'ejemplos', name: '💡 Ejemplos Reales', type: 'text',
        content: `
          <h2>Aplicaciones Reales de los Algoritmos Genéticos</h2>

          <h3>🗺️ Ejemplo 1: El Problema del Viajante (TSP)</h3>
          <p>Un vendedor debe visitar 10 ciudades exactamente una vez y regresar al origen. El número de rutas posibles es <strong>10! / 2 = 1,814,400</strong>. Evaluar todas es viable, pero con 20 ciudades ya son 60 trillones de rutas — imposible por fuerza bruta.</p>
          <div class="content-box">
            <div class="box-title">🧬 Cómo lo resuelve el AG</div>
            <ul>
              <li><strong>Individuo:</strong> Una permutación de ciudades, ej: <code>[Madrid → París → Roma → Berlín → ...]</code></li>
              <li><strong>Fitness:</strong> La inversa de la distancia total recorrida (menor distancia = mayor aptitud).</li>
              <li><strong>Cruce:</strong> Se usa "Order Crossover" para combinar rutas manteniendo el orden relativo de ciudades.</li>
              <li><strong>Resultado:</strong> En segundos, el AG encuentra una ruta que es típicamente un 2-5% del óptimo global.</li>
            </ul>
          </div>

          <h3 style="margin-top: 2rem;">📡 Ejemplo 2: Diseño de Antenas de la NASA (2006)</h3>
          <p>La NASA necesitaba diseñar una antena compacta para el satélite ST5 con restricciones muy específicas de radiación. Ningún ingeniero humano había podido diseñar una que cumpliese todos los requisitos.</p>
          <div class="content-grid-2">
            <div class="content-box">
              <div class="box-title">🔬 El Problema</div>
              <p>El espacio de diseño era astronómicamente grande: la antena tenía múltiples segmentos con longitudes y ángulos continuos. Probar diseños físicos era imposible.</p>
            </div>
            <div class="content-box">
              <div class="box-title">✅ La Solución</div>
              <p>El AG evolucionó formas extrañas e inesperadas que ningún humano habría propuesto. La antena ganadora tenía una forma retorcida pero su rendimiento superó a todos los diseños convencionales.</p>
            </div>
          </div>

          <h3 style="margin-top: 2rem;">🤖 Ejemplo 3: Feature Selection en Machine Learning</h3>
          <p>Tienes un dataset con 500 variables (features) y quieres entrenar un modelo eficiente. ¿Cuáles 20 variables son las más relevantes? Hay 2^500 combinaciones posibles — más átomos que en el universo observable.</p>
          <div class="content-box" style="background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.4);">
            <div class="box-title">🧬 Solución con AG</div>
            <ul>
              <li><strong>Individuo:</strong> Un vector binario de 500 bits (1 = incluir feature, 0 = excluir).</li>
              <li><strong>Fitness:</strong> La precisión del modelo entrenado solo con las features seleccionadas.</li>
              <li><strong>Resultado:</strong> En horas, el AG encuentra subconjuntos de features que mejoran significativamente al modelo baseline.</li>
            </ul>
          </div>

          <h3 style="margin-top: 2rem;">🎮 Ejemplo 4: Entrenamiento de IA en Videojuegos</h3>
          <p>Los AG se usan para evolucionar los pesos de redes neuronales (neuroevolución) que controlan personajes en videojuegos. Un ejemplo famoso: <em>MarI/O</em>, donde una IA aprendió a completar niveles de Super Mario Bros desde cero usando solo un AG para evolucionar su red neuronal, sin ninguna programación de comportamiento específica.</p>
        `
      },

      // ── MÓDULO 3: DEMO ────────────────────────────────────────────────────
      { id: 'demo', name: '🎬 Demo Interactiva', type: 'demo_ga' },

      // ── MÓDULO 4: EXAMEN ──────────────────────────────────────────────────
      {
        id: 'examen', name: '📝 Examen Final', type: 'quiz',
        questions: [
          { q: "¿En qué se inspiran los Algoritmos Genéticos?", options: ["La teoría de la relatividad de Einstein", "La teoría de la evolución natural de Darwin", "El funcionamiento de las neuronas del cerebro", "Los sistemas de control PID"], correct: 1 },
          { q: "En un AG, ¿qué representa un 'individuo' o 'cromosoma'?", options: ["Un error de cálculo", "Una posible solución al problema que se está optimizando", "Un parámetro de configuración del algoritmo", "El resultado final del proceso"], correct: 1 },
          { q: "¿Cuál es el papel de la función de Fitness (Aptitud)?", options: ["Determinar el tamaño de la población", "Controlar la tasa de mutación", "Evaluar qué tan buena es una solución candidata", "Definir el número de generaciones"], correct: 2 },
          { q: "¿Qué operación genética combina segmentos de dos padres para crear nuevos hijos?", options: ["Mutación", "Selección", "Cruce (Crossover)", "Elitismo"], correct: 2 },
          { q: "¿Por qué es importante la Mutación y no se puede eliminar del algoritmo?", options: ["Hace el algoritmo más rápido", "Introduce diversidad genética y previene la convergencia prematura en óptimos locales", "Reduce el fitness promedio para evitar overfitting", "Es solo una tradición histórica del área"], correct: 1 },
          { q: "¿Qué es el 'Elitismo' en el contexto de un Algoritmo Genético?", options: ["Seleccionar siempre el mismo padre para la reproducción", "Garantizar que los mejores individuos de cada generación siempre pasen a la siguiente", "Aumentar la tasa de mutación en las últimas generaciones", "Reducir el tamaño de la población con el tiempo"], correct: 1 },
          { q: "Si la tasa de mutación es demasiado alta (cercana al 100%), ¿qué sucede?", options: ["El algoritmo converge más rápido al óptimo global", "El algoritmo se comporta como una búsqueda aleatoria pura, sin aprendizaje", "La población se vuelve perfectamente uniforme", "El crossover deja de funcionar"], correct: 1 },
          { q: "¿En cuál de estos escenarios es MÁS adecuado usar un Algoritmo Genético?", options: ["Calcular la suma de una lista de números", "Ordenar alfabéticamente una lista de nombres", "Encontrar la ruta óptima entre 50 ciudades (TSP)", "Consultar un registro en una base de datos"], correct: 2 }
        ]
      }
    ]
  }
};

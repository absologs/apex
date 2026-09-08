import os

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    write('ui/tailwind.config.js', """/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
            bg: '#F9F9F9',
            black: '#0A0A0A',
            pink: '#FF90E8',
            yellow: '#FFC900',
            cyan: '#90FFFF',
            purple: '#B985FF',
            gray: '#F3F4F6',
            text: '#374151'
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(10, 10, 10, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(10, 10, 10, 1)',
        'brutal-hover': '6px 6px 0px 0px rgba(10, 10, 10, 1)',
      }
    },
  },
  plugins: [],
}""")

    write('ui/src/app.css', """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
    .brutal-card {
        @apply bg-white border-2 border-brand-black rounded-lg shadow-brutal transition-all duration-200;
    }
    .brutal-button {
        @apply font-heading font-bold border-2 border-brand-black px-6 py-3 rounded shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-y-1 active:shadow-none transition-all cursor-pointer;
    }
    .tag {
        @apply text-[11px] font-bold px-3 py-1 rounded-full border border-brand-black uppercase tracking-wider shadow-brutal-sm inline-block;
    }
}
""")

    write('ui/src/App.svelte', """<script lang="ts">
  import { onMount } from 'svelte';
  
  // Model Data
  let datasets = [
    { id: 'ds-1', name: 'Ventas_Q3_2026.csv', rowCount: 14200, status: 'Listo', healthScore: 92 },
    { id: 'ds-2', name: 'Usuarios_Activos.json', rowCount: 530, status: 'Listo', healthScore: 100 }
  ];
  
  let isDragging = false;
  
  $: totalRows = datasets.reduce((acc, ds) => acc + ds.rowCount, 0);
  $: averageHealth = datasets.length ? Math.round(datasets.reduce((acc, ds) => acc + ds.healthScore, 0) / datasets.length) : 0;
  
  function handleDrop(e: DragEvent) {
    isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) addDataset(file.name);
  }
  
  function addDataset(name: string) {
    const newDs = { id: `ds-${Date.now()}`, name, rowCount: Math.floor(Math.random() * 5000), status: 'Ingiriendo', healthScore: 85 };
    datasets = [...datasets, newDs];
    
    setTimeout(() => {
        datasets = datasets.map(d => d.id === newDs.id ? { ...d, status: 'Listo' } : d);
    }, 2000);
  }
</script>

<nav class="bg-white border-b-2 border-brand-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
    <div class="flex items-center gap-3">
        <h1 class="text-3xl font-black font-heading tracking-tight">DatioLabs<span class="text-brand-pink">.</span></h1>
        <span class="bg-brand-yellow text-brand-black text-[10px] font-bold px-2 py-1 rounded-full border border-brand-black uppercase tracking-wider ml-2 shadow-brutal-sm">Workspace</span>
    </div>
</nav>

<main class="p-6 lg:p-10 max-w-[1600px] mx-auto w-full font-body text-brand-black min-h-screen bg-brand-bg">
    <div class="mb-10">
        <h2 class="text-4xl md:text-5xl font-black font-heading mb-3">Tus Datos, Simplificados.</h2>
        <p class="text-lg text-brand-text max-w-2xl">Sube tus archivos, conecta tus bases de datos y extrae valor inmediato. Arquitectura Svelte compilada de Alto Rendimiento.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div class="lg:col-span-2 brutal-card p-8 flex flex-col justify-center items-center text-center transition-colors {isDragging ? 'bg-brand-pink/20 border-dashed' : 'bg-brand-purple/10'}" 
             on:dragover|preventDefault={() => isDragging = true}
             on:dragleave|preventDefault={() => isDragging = false}
             on:drop|preventDefault={handleDrop}>
             <h3 class="text-2xl font-black font-heading mb-2">Arrastra tus archivos aquí</h3>
             <p class="mb-6 text-brand-text">Soportamos CSV, JSON, Excel y Parquet.</p>
             <button class="brutal-button bg-brand-cyan" on:click={() => document.getElementById('file').click()}>Explorar Archivos</button>
             <input type="file" id="file" class="hidden" on:change={(e) => addDataset(e.target.files[0].name)} />
        </div>

        <div class="brutal-card p-8 flex flex-col justify-between bg-white">
            <div>
                <h3 class="font-heading font-black text-xl mb-4">Salud del Entorno</h3>
                <div class="flex items-end gap-2 mb-6">
                    <span class="text-5xl font-black font-heading">{averageHealth}%</span>
                    <span class="text-sm font-bold text-green-600 mb-1">Óptimo</span>
                </div>
                <div class="space-y-4 border-t-2 border-brand-black pt-4">
                    <div class="flex justify-between">
                        <span class="font-semibold">Total Filas:</span>
                        <span class="bg-brand-gray px-2 py-1 rounded border border-brand-black font-bold">{totalRows}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
""")

if __name__ == '__main__':
    main()

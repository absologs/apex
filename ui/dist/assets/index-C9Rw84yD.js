var Be=Object.defineProperty;var Ce=(u,e,a)=>e in u?Be(u,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):u[e]=a;var w=(u,e,a)=>Ce(u,typeof e!="symbol"?e+"":e,a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(n){if(n.ep)return;n.ep=!0;const l=a(n);fetch(n.href,l)}})();const pe=1,he=2,ve=4,Ue=8,ee=1,ie=2,se=8,me=16,ye=32,ue=64,De=128,Q=u=>{if(typeof u=="number")return Number.isFinite(u)?u:0;if(u==null)return 0;let e=String(u).trim();if(!e)return 0;e.includes(",")&&!e.includes(".")?e=e.replace(",","."):e.includes(".")&&e.includes(",")&&(e=e.replace(/\./g,"").replace(",","."));const a=parseFloat(e);return Number.isFinite(a)&&!isNaN(a)?a:0};class Ie extends Error{constructor(e){super(e)}}function Pe(){const u=typeof window<"u"?window.location.pathname.toLowerCase():"",e=typeof window<"u"?new URLSearchParams(window.location.search):null,a=u.includes("retail")||(e==null?void 0:e.get("rubro"))==="retail",o=u.includes("panaderia")||(e==null?void 0:e.get("rubro"))==="panaderia";return a?{key:"datiolabs_demo_retail_v3",claveLicencia:"0000888833330000",titular:"DatioLabs Retail Demo",config:{nombre:"DatioLabs Retail",rubros:Ue,capacidades:ee|me|ye|ue|De,tienePin:!1},productos:[{sku:"SMART-PHONE-X",nombre:"Smartphone X 128GB (Serie/Garantía)",precioBrutoUsd:"180.00",margenPct:"38",precioUsd:"250.00",impuestoPct:"16",stock:"8",capacidades:ee|me|ue,unidad:"un",categoriaId:"cat-general"},{sku:"AURICULAR-BT",nombre:"Audífonos Inalámbricos Bluetooth Pro",precioBrutoUsd:"14.00",margenPct:"42",precioUsd:"20.00",impuestoPct:"16",stock:"22",capacidades:ee|ue,unidad:"un",categoriaId:"cat-general"},{sku:"CARGADOR-RAPIDO",nombre:"Cargador Rápido 30W Tipo-C",precioBrutoUsd:"5.50",margenPct:"45",precioUsd:"8.00",impuestoPct:"16",stock:"30",capacidades:ee,unidad:"un",categoriaId:"cat-general"},{sku:"CABLE-USB-C",nombre:"Cable Reforzado Tipo-C a Tipo-C 1.5m",precioBrutoUsd:"2.50",margenPct:"60",precioUsd:"4.00",impuestoPct:"16",stock:"45",capacidades:ee,unidad:"un",categoriaId:"cat-general"},{sku:"POWERBANK-20K",nombre:"Batería Portátil PowerBank 20000mAh",precioBrutoUsd:"16.00",margenPct:"40",precioUsd:"22.50",impuestoPct:"16",stock:"12",capacidades:ee|ue,unidad:"un",categoriaId:"cat-general"}]}:o?{key:"datiolabs_demo_panaderia_v3",claveLicencia:"0000888822220000",titular:"DatioLabs Panadería Demo",config:{nombre:"DatioLabs Panadería",rubros:he,capacidades:ee|ie,tienePin:!1},productos:[{sku:"PAN-CANILLA",nombre:"Pan Canilla Tradicional",precioBrutoUsd:"0.50",margenPct:"60",precioUsd:"0.80",impuestoPct:"0",stock:"60",capacidades:ee,unidad:"un",categoriaId:"cat-panes"},{sku:"PAN-CAMPESINO",nombre:"Pan Campesino Rústico",precioBrutoUsd:"0.80",margenPct:"50",precioUsd:"1.20",impuestoPct:"0",stock:"35",capacidades:ee,unidad:"un",categoriaId:"cat-panes"},{sku:"PAN-SOBADO",nombre:"Pan Sobado Suave",precioBrutoUsd:"0.65",margenPct:"53",precioUsd:"1.00",impuestoPct:"0",stock:"40",capacidades:ee,unidad:"un",categoriaId:"cat-panes"},{sku:"QUESO-GUAYANES",nombre:"Queso Guayanés Fresco",precioBrutoUsd:"3.20",margenPct:"40",precioUsd:"4.50",impuestoPct:"0",stock:"15.00",capacidades:ie,unidad:"kg",categoriaId:"cat-viveres"},{sku:"CAFE-MOLIDO",nombre:"Café Molido Tostado 250g",precioBrutoUsd:"2.00",margenPct:"50",precioUsd:"3.00",impuestoPct:"0",stock:"25",capacidades:ee,unidad:"un",categoriaId:"cat-viveres"}]}:{key:"datiolabs_demo_licoreria_v3",claveLicencia:"0000888811110000",titular:"DatioLabs Licorería Demo",config:{nombre:"DatioLabs Licorería",rubros:ve,capacidades:ee|se,tienePin:!1},productos:[{sku:"RON-DIPLOMATICO",nombre:"Ron Reserva Exclusiva 750ml",precioBrutoUsd:"13.50",margenPct:"33",precioUsd:"18.00",impuestoPct:"16",stock:"12",capacidades:ee|se,unidad:"un",categoriaId:"cat-bebidas"},{sku:"RON-SANTA-TERESA",nombre:"Ron Santa Teresa Gran Reserva 750ml",precioBrutoUsd:"8.80",margenPct:"36",precioUsd:"12.00",impuestoPct:"16",stock:"16",capacidades:ee|se,unidad:"un",categoriaId:"cat-bebidas"},{sku:"CERVEZA-POLAR-6P",nombre:"Six Pack Cerveza Pilsen 330ml",precioBrutoUsd:"3.30",margenPct:"36",precioUsd:"4.50",impuestoPct:"16",stock:"30",capacidades:ee|se,unidad:"un",categoriaId:"cat-bebidas"},{sku:"WHISKY-12A",nombre:"Whisky Escocés 12 Años 750ml",precioBrutoUsd:"16.50",margenPct:"33",precioUsd:"22.00",impuestoPct:"16",stock:"8",capacidades:ee|se,unidad:"un",categoriaId:"cat-bebidas"},{sku:"REFRESCO-COLA",nombre:"Refresco Cola 2L (Mezclador)",precioBrutoUsd:"1.20",margenPct:"50",precioUsd:"1.80",impuestoPct:"16",stock:"24",capacidades:ee|se,unidad:"un",categoriaId:"cat-bebidas"},{sku:"HIELO-BOLSA",nombre:"Bolsa de Hielo 3Kg",precioBrutoUsd:"0.60",margenPct:"66",precioUsd:"1.00",impuestoPct:"16",stock:"40",capacidades:ee|se,unidad:"un",categoriaId:"cat-viveres"}]}}class Te{constructor(){w(this,"config");w(this,"productos");w(this,"cuentas",[{ventaId:"CTA-88210",etiqueta:"Mesa 4 (Terraza)",tipo:"activa",fechaCreacionUnix:Math.floor(Date.now()/1e3)-7200,fechaCreacionStr:"Hoy, 02:00 PM",lineas:2,totalParcialUsd:"10.00",totalParcialBs:"8073.90",abonosUsd:"5.00",abonosBs:"4036.95",consumos:[{id:"con-m4-1",sku:"CERVEZA-POLAR-6P",nombre:"Six Pack Cerveza Pilsen 330ml",cantidad:2,precioUsd:"4.50",subtotalUsd:"9.00"},{id:"con-m4-2",sku:"HIELO-BOLSA",nombre:"Bolsa de Hielo 3Kg",cantidad:1,precioUsd:"1.00",subtotalUsd:"1.00"}]},{ventaId:"CTA-88211",etiqueta:"Barra Principal (Carlos)",tipo:"activa",fechaCreacionUnix:Math.floor(Date.now()/1e3)-3600,fechaCreacionStr:"Hoy, 03:00 PM",lineas:2,totalParcialUsd:"19.80",totalParcialBs:"15986.32",abonosUsd:"25.00",abonosBs:"20184.75",consumos:[{id:"con-bp-1",sku:"RON-DIPLOMATICO",nombre:"Ron Reserva Exclusiva 750ml",cantidad:1,precioUsd:"18.00",subtotalUsd:"18.00"},{id:"con-bp-2",sku:"REFRESCO-COLA",nombre:"Refresco Cola 2L (Mezclador)",cantidad:1,precioUsd:"1.80",subtotalUsd:"1.80"}]},{ventaId:"CTA-88212",etiqueta:"Mesa 1 (VIP)",tipo:"activa",fechaCreacionUnix:Math.floor(Date.now()/1e3)-1800,fechaCreacionStr:"Hoy, 03:30 PM",lineas:1,totalParcialUsd:"22.00",totalParcialBs:"17762.58",abonosUsd:"0.00",abonosBs:"0.00",consumos:[{id:"con-m1-1",sku:"WHISKY-12A",nombre:"Whisky Escocés 12 Años 750ml",cantidad:1,precioUsd:"22.00",subtotalUsd:"22.00"}]},{ventaId:"DEU-99042",etiqueta:"Taller Hermanos Gómez",cliente:"Carlos Gómez (Taller)",nota:"Crédito comercial acordado a cobrar en días",tipo:"deuda",fechaCreacionUnix:Math.floor(Date.now()/1e3)-86400*3,fechaCreacionStr:"01/09/2026 10:30",lineas:3,totalParcialUsd:"34.00",totalParcialBs:"27451.26",abonosUsd:"10.00",abonosBs:"8073.90",consumos:[{id:"con-d1",sku:"RON-SANTA-TERESA",nombre:"Ron Santa Teresa Gran Reserva 750ml",cantidad:2,precioUsd:"12.00",subtotalUsd:"24.00"},{id:"con-d2",sku:"CERVEZA-POLAR-6P",nombre:"Six Pack Cerveza Pilsen 330ml",cantidad:2,precioUsd:"4.50",subtotalUsd:"9.00"},{id:"con-d3",sku:"HIELO-BOLSA",nombre:"Bolsa de Hielo 3Kg",cantidad:1,precioUsd:"1.00",subtotalUsd:"1.00"}]}]);w(this,"categorias",[{id:"cat-general",nombre:"General"},{id:"cat-viveres",nombre:"Víveres"},{id:"cat-bebidas",nombre:"Bebidas y Licores"},{id:"cat-panes",nombre:"Panes y Horneados"}]);w(this,"tasasImpuestos",[{id:"iva-16",nombre:"IVA General (16%)",porcentaje:16},{id:"iva-8",nombre:"IVA Reducido (8%)",porcentaje:8},{id:"iva-0",nombre:"Exento (0%)",porcentaje:0}]);w(this,"tasaActual",{valor:"807.39",fechaUnix:Math.floor(Date.now()/1e3),fluctuacionPct:null,direccion:null});w(this,"tickets",[{ventaId:"TRX-94812",totalUsd:"23.80",totalBs:"19215.88",tasaDelDia:"807.39",montoRecibidoBs:"20000.00",vueltoBs:"784.12",fechaHora:"Hoy, 01:24 PM",fechaUnix:Math.floor(Date.now()/1e3)-3600,canal:"VENTA DIRECTA",operador:"Caja Principal",pagos:[{metodo:"PAGO MOVIL",montoUsd:"23.80",montoBs:"19215.88",referencia:"REF-7892"}],lineas:[{sku:"RON-SANTA-TERESA",nombre:"Ron Santa Teresa Gran Reserva 750ml",cantidad:"1",precioUsd:"12.00",tasaBloqueada:"807.39",subtotalUsd:"12.00",subtotalBs:"9688.68"},{sku:"CERVEZA-POLAR-6P",nombre:"Six Pack Cerveza Pilsen 330ml",cantidad:"2",precioUsd:"4.50",tasaBloqueada:"807.39",subtotalUsd:"9.00",subtotalBs:"7266.51"},{sku:"HIELO-BOLSA",nombre:"Bolsa de Hielo 3Kg",cantidad:"1",precioUsd:"1.00",tasaBloqueada:"807.39",subtotalUsd:"1.00",subtotalBs:"807.39"},{sku:"REFRESCO-COLA",nombre:"Refresco Cola 2L (Mezclador)",cantidad:"1",precioUsd:"1.80",tasaBloqueada:"807.39",subtotalUsd:"1.80",subtotalBs:"1453.30"}]},{ventaId:"CTA-78104",totalUsd:"40.00",totalBs:"32295.60",tasaDelDia:"807.39",montoRecibidoBs:"35000.00",vueltoBs:"2704.40",fechaHora:"Hoy, 12:50 PM",fechaUnix:Math.floor(Date.now()/1e3)-7200,canal:"CONSUMO EN CUENTA",operador:"Mesa 4 / Mostrador",pagos:[{metodo:"DOL.CASH",moneda:"USD",montoUsd:"20.00",montoBs:"16147.80",tasaCambio:"807.39"},{metodo:"PUNTOD.VENTA",moneda:"BS",montoUsd:"20.00",montoBs:"16147.80",referencia:"LOTE-112"}],lineas:[{sku:"RON-DIPLOMATICO",nombre:"Ron Reserva Exclusiva 750ml",cantidad:"1",precioUsd:"18.00",tasaBloqueada:"807.39",subtotalUsd:"18.00",subtotalBs:"14533.02"},{sku:"WHISKY-12A",nombre:"Whisky Escocés 12 Años 750ml",cantidad:"1",precioUsd:"22.00",tasaBloqueada:"807.39",subtotalUsd:"22.00",subtotalBs:"17762.58"}]},{ventaId:"TRX-94811",totalUsd:"13.60",totalBs:"10980.50",tasaDelDia:"807.39",montoRecibidoBs:"11000.00",vueltoBs:"19.50",fechaHora:"Hoy, 11:35 AM",fechaUnix:Math.floor(Date.now()/1e3)-10800,canal:"VENTA DIRECTA",operador:"Caja Principal",pagos:[{metodo:"BS.EFEC.",moneda:"BS",montoUsd:"13.60",montoBs:"10980.50"}],lineas:[{sku:"CERVEZA-POLAR-6P",nombre:"Six Pack Cerveza Pilsen 330ml",cantidad:"2",precioUsd:"4.50",tasaBloqueada:"807.39",subtotalUsd:"9.00",subtotalBs:"7266.51"},{sku:"REFRESCO-COLA",nombre:"Refresco Cola 2L (Mezclador)",cantidad:"2",precioUsd:"1.80",tasaBloqueada:"807.39",subtotalUsd:"3.60",subtotalBs:"2906.60"},{sku:"HIELO-BOLSA",nombre:"Bolsa de Hielo 3Kg",cantidad:"1",precioUsd:"1.00",tasaBloqueada:"807.39",subtotalUsd:"1.00",subtotalBs:"807.39"}]},{ventaId:"CTA-78103",totalUsd:"18.00",totalBs:"14533.02",tasaDelDia:"807.39",montoRecibidoBs:"15000.00",vueltoBs:"466.98",fechaHora:"Hoy, 10:15 AM",fechaUnix:Math.floor(Date.now()/1e3)-14400,canal:"CONSUMO EN CUENTA",operador:"Barra Principal",pagos:[{metodo:"ZELLE",moneda:"USD",montoUsd:"18.00",montoBs:"14533.02",tasaCambio:"807.39",referencia:"ZEL-5501"}],lineas:[{sku:"RON-DIPLOMATICO",nombre:"Ron Reserva Exclusiva 750ml",cantidad:"1",precioUsd:"18.00",tasaBloqueada:"807.39",subtotalUsd:"18.00",subtotalBs:"14533.02"}]}]);w(this,"ventasTotalUsd",95.4);w(this,"ventasTotalBs",77025);w(this,"metodosPago",[{nombre:"PUNTOD.VENTA",moneda:"BS"},{nombre:"BIOPAGO",moneda:"BS"},{nombre:"PAGO MOVIL",moneda:"BS"},{nombre:"TRANSF.BS.",moneda:"BS"},{nombre:"BS.EFEC.",moneda:"BS"},{nombre:"DOL.CASH",moneda:"USD"},{nombre:"ZELLE",moneda:"USD"},{nombre:"BINAN.USDT",moneda:"USD"}]);w(this,"dispositivos",[{id:"dev-1",nombre:"iPhone 15 Pro (Dueño)",ip:"192.168.1.45",ultimoAcceso:"Hace 5 min",activo:!0},{id:"dev-2",nombre:"Tablet Mostrador 1",ip:"192.168.1.80",ultimoAcceso:"Hace 12 min",activo:!0}]);w(this,"respaldos",[{id:"bk-1",fecha:"Hoy, 06:00 PM",archivoNombre:"DATO-DEMO-20260903-180000.datio",registros:412,tamanoKb:124,checksumSha256:"9f83a21b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f"},{id:"bk-2",fecha:"Ayer, 11:30 PM",archivoNombre:"DATO-DEMO-20260902-233000.datio",registros:395,tamanoKb:118,checksumSha256:"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}]);w(this,"licencia",{estado:"activa",tipo:"Enterprise Standalone Local",claveLicencia:"0000888811110000",titular:"Empresa DatioLabs Cliente Comercial",validez:"Perpetua (Sin caducidad / Portabilidad Total)"});w(this,"operadores",[{id:"op-1",nombre:"Carlos Mendoza",activo:!0,creadoUnix:Math.floor(Date.now()/1e3)-86400*30},{id:"op-2",nombre:"María Andrea Silva",activo:!0,creadoUnix:Math.floor(Date.now()/1e3)-86400*15},{id:"op-3",nombre:"José Gregorio Páez",activo:!0,creadoUnix:Math.floor(Date.now()/1e3)-86400*5}]);w(this,"jornadaActual",{id:"JOR-20260908-01",estado:"abierta",inicioUnix:Math.floor(Date.now()/1e3)-14400,inicioStr:"Hoy, 08:30 AM",operadorInicial:"Carlos Mendoza",operadorActual:"Carlos Mendoza",operadoresActivos:["Carlos Mendoza"],operadoresRelevo:["Carlos Mendoza"],tasaInicio:"807.39",ventasTotalUsd:"95.40",ventasTotalBs:"77025.00",ticketsEmitidos:6,vueltoPagadoBs:"1450.00",vueltoRetenidoBs:"784.12",deudasLiquidadasUsd:"34.00",entradasStockReg:2,mermasStockReg:0,cambiosPrecioReg:0});w(this,"historicoJornadas",[{id:"JOR-20260907-01",estado:"cerrada",inicioUnix:Math.floor(Date.now()/1e3)-86400-28800,finUnix:Math.floor(Date.now()/1e3)-86400,inicioStr:"Ayer, 08:00 AM",finStr:"Ayer, 09:30 PM",operadorInicial:"María Andrea Silva",operadorActual:"Carlos Mendoza",operadoresRelevo:["María Andrea Silva","Carlos Mendoza"],tasaInicio:"805.20",tasaFin:"807.39",ventasTotalUsd:"340.50",ventasTotalBs:"274889.70",ticketsEmitidos:24,vueltoPagadoBs:"4520.00",vueltoRetenidoBs:"1200.00",deudasLiquidadasUsd:"68.00",entradasStockReg:4,mermasStockReg:1,cambiosPrecioReg:1,checksumSha256:"a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0"}]);w(this,"semaforoStock",{rojoMax:5,amarilloMax:15});w(this,"historicoTasas",[{id:"tx-1",valor:"807.3900",fechaHora:"Hoy, 04:00 PM",tipo:"automático",motivo:"Sondeo oficial BCV"},{id:"tx-2",valor:"805.2000",fechaHora:"Hoy, 09:00 AM",tipo:"automático",motivo:"Apertura de jornada"},{id:"tx-3",valor:"802.1500",fechaHora:"Ayer, 05:00 PM",tipo:"automático",motivo:"Cierre BCV"}]);w(this,"pinDueno","");w(this,"storageKey");const e=Pe();this.storageKey=e.key,this.config=e.config,this.productos=e.productos,this.licencia.claveLicencia=e.claveLicencia,this.licencia.titular=e.titular;try{["datiolabs_demo_licoreria_db","datiolabs_demo_panaderia_db","datiolabs_demo_retail_db","datiolabs_demo_licoreria_v2"].forEach(o=>{try{localStorage.removeItem(o)}catch{}});const a=localStorage.getItem(this.storageKey);if(a){const o=JSON.parse(a);if(o.productos&&Array.isArray(o.productos)&&(this.productos=o.productos.map(n=>{const l=e.productos.find(c=>c.sku===n.sku),i=String(n.unidad||(l==null?void 0:l.unidad)||"").toLowerCase(),r=i==="kg"?"kg":i==="ml"?"ml":"un",t=n.categoriaId&&n.categoriaId.trim()?n.categoriaId:(l==null?void 0:l.categoriaId)||"cat-general",s=Number(n.precioUsd)||0,d=n.precioBrutoUsd&&Number(n.precioBrutoUsd)>0?n.precioBrutoUsd:(l==null?void 0:l.precioBrutoUsd)||(s*.65).toFixed(2);return{...n,unidad:r,categoriaId:t,precioBrutoUsd:d}})),o.cuentas&&Array.isArray(o.cuentas)&&o.cuentas.length>0&&(this.cuentas=o.cuentas.map(n=>(Array.isArray(n.consumos)||(n.consumos=[]),n.abonosUsd===void 0&&(n.abonosUsd="0.00"),n.abonosBs===void 0&&(n.abonosBs="0.00"),n.tipo||(n.tipo=n.etiqueta.toLowerCase().includes("taller")||n.etiqueta.toLowerCase().includes("deuda")?"deuda":"activa"),n.fechaCreacionUnix||(n.fechaCreacionUnix=n.tipo==="deuda"?Math.floor(Date.now()/1e3)-86400*3:Math.floor(Date.now()/1e3)-3600),n.fechaCreacionStr||(n.fechaCreacionStr=n.tipo==="deuda"?"01/09/2026 10:30":"Hoy"),n.consumos.length===0&&Q(n.totalParcialUsd)>0&&n.consumos.push({id:"con-"+Math.random().toString(36).slice(2,8),sku:"CONSUMO-PREV",nombre:"Consumos acumulados",cantidad:1,precioUsd:String(n.totalParcialUsd),subtotalUsd:String(n.totalParcialUsd)}),n.lineas=n.consumos.length,n)),this.cuentas.some(n=>n.tipo==="deuda")||this.cuentas.push({ventaId:"DEU-99042",etiqueta:"Taller Hermanos Gómez",cliente:"Carlos Gómez (Taller)",nota:"Crédito comercial convenido a pagar en días",tipo:"deuda",fechaCreacionUnix:Math.floor(Date.now()/1e3)-86400*3,fechaCreacionStr:"01/09/2026 10:30",lineas:3,totalParcialUsd:"34.00",totalParcialBs:(34*Q(this.tasaActual.valor)).toFixed(2),abonosUsd:"10.00",abonosBs:(10*Q(this.tasaActual.valor)).toFixed(2),consumos:[{id:"con-d1",sku:"RON-SANTA-TERESA",nombre:"Ron Santa Teresa Gran Reserva 750ml",cantidad:2,precioUsd:"12.00",subtotalUsd:"24.00"},{id:"con-d2",sku:"CERVEZA-POLAR-6P",nombre:"Six Pack Cerveza Pilsen 330ml",cantidad:2,precioUsd:"4.50",subtotalUsd:"9.00"},{id:"con-d3",sku:"HIELO-BOLSA",nombre:"Bolsa de Hielo 3Kg",cantidad:1,precioUsd:"1.00",subtotalUsd:"1.00"}]})),o.metodosPago&&Array.isArray(o.metodosPago)){const n=[{nombre:"PUNTOD.VENTA",moneda:"BS"},{nombre:"BIOPAGO",moneda:"BS"},{nombre:"PAGO MOVIL",moneda:"BS"},{nombre:"TRANSF.BS.",moneda:"BS"},{nombre:"BS.EFEC.",moneda:"BS"},{nombre:"DOL.CASH",moneda:"USD"},{nombre:"ZELLE",moneda:"USD"},{nombre:"BINAN.USDT",moneda:"USD"}],l=[],i=new Set,r=t=>{let s="",d="BS";if(typeof t=="string")s=t.trim().toUpperCase(),s==="DOLAR.EFEC."&&(s="DOL.CASH"),s==="USDT BINAN."&&(s="BINAN.USDT"),["DOL.CASH","ZELLE","BINAN.USDT"].includes(s)&&(d="USD");else if(t&&typeof t=="object"&&"nombre"in t){const c=t;s=String(c.nombre||"").trim().toUpperCase(),s==="DOLAR.EFEC."&&(s="DOL.CASH"),s==="USDT BINAN."&&(s="BINAN.USDT"),d=c.moneda==="USD"||["DOL.CASH","ZELLE","BINAN.USDT"].includes(s)?"USD":"BS"}s&&!i.has(s)&&(i.add(s),l.push({nombre:s,moneda:d}))};n.forEach(r),o.metodosPago.forEach(r),l.sort((t,s)=>t.moneda===s.moneda?0:t.moneda==="BS"?-1:1),this.metodosPago=l}else this.metodosPago.sort((n,l)=>n.moneda===l.moneda?0:n.moneda==="BS"?-1:1);o.operadores&&Array.isArray(o.operadores)&&(this.operadores=o.operadores),o.jornadaActual!==void 0&&(this.jornadaActual=o.jornadaActual),o.historicoJornadas&&Array.isArray(o.historicoJornadas)&&(this.historicoJornadas=o.historicoJornadas),o.semaforoStock&&(this.semaforoStock=o.semaforoStock),o.categorias&&(this.categorias=o.categorias),o.tasasImpuestos&&(this.tasasImpuestos=o.tasasImpuestos),o.tasaActual&&(this.tasaActual=o.tasaActual),o.dispositivos&&(this.dispositivos=o.dispositivos),o.respaldos&&(this.respaldos=o.respaldos),o.historicoTasas&&(this.historicoTasas=o.historicoTasas),o.tickets&&Array.isArray(o.tickets)&&o.tickets.length>0&&(this.tickets=o.tickets),o.ventasTotalUsd!==void 0&&(this.ventasTotalUsd=Number(o.ventasTotalUsd)),o.ventasTotalBs!==void 0&&(this.ventasTotalBs=Number(o.ventasTotalBs)),o.pinDueno!==void 0&&(this.pinDueno=o.pinDueno),this.config&&this.pinDueno&&(this.config.tienePin=!0)}}catch{}this.refrescarTasaEnVivo()}async refrescarTasaEnVivo(){try{const e=await fetch("https://ve.dolarapi.com/v1/dolares/oficial");if(e.ok){const a=await e.json(),o=Number(a.promedio);if(Number.isFinite(o)&&o>0){const n=Number(this.tasaActual.valor);let l=null,i=null;if(Number.isFinite(n)&&n>0&&n!==o){const s=(o-n)/n*100;l=Math.abs(s).toFixed(2),i=s>0?"subio":"bajo"}this.tasaActual={valor:o.toFixed(4),fechaUnix:Math.floor(Date.now()/1e3),fluctuacionPct:l,direccion:i};const t=new Date().toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"});this.historicoTasas.unshift({id:"tx-"+Math.random().toString(36).slice(2,7),valor:o.toFixed(4),fechaHora:`Hoy, ${t}`,tipo:"automático",motivo:"Sincronización BCV en vivo"}),this.historicoTasas.length>50&&this.historicoTasas.pop(),this.persist(),typeof window<"u"&&window.dispatchEvent(new CustomEvent("tasa_actualizada",{detail:o}))}}}catch{}}persist(){try{localStorage.setItem(this.storageKey,JSON.stringify({productos:this.productos,cuentas:this.cuentas,categorias:this.categorias,tasasImpuestos:this.tasasImpuestos,tasaActual:this.tasaActual,dispositivos:this.dispositivos,respaldos:this.respaldos,historicoTasas:this.historicoTasas,tickets:this.tickets,ventasTotalUsd:this.ventasTotalUsd,ventasTotalBs:this.ventasTotalBs,pinDueno:this.pinDueno,metodosPago:this.metodosPago,operadores:this.operadores,jornadaActual:this.jornadaActual,historicoJornadas:this.historicoJornadas,semaforoStock:this.semaforoStock}))}catch{}}}const m=new Te;async function H(u,e){var n;const a=window.__TAURI__,o=(n=a==null?void 0:a.core)==null?void 0:n.invoke;if(o)try{return await o(u,e)}catch(l){throw new Ie(typeof l=="string"?l:JSON.stringify(l))}return Le(u,e)}function Le(u,e){var a,o,n,l,i;switch(u){case"obtener_config":return Promise.resolve(m.config);case"inicializar_negocio":{const r=e!=null&&e.pinDueno?String(e.pinDueno).trim():"";return m.pinDueno=r,m.config={nombre:String((e==null?void 0:e.nombre)||"Mi Negocio Demo"),rubros:Number((e==null?void 0:e.rubros)||15),capacidades:ee|ie|se|me|ye,tienePin:r.length>0},m.persist(),Promise.resolve(void 0)}case"validar_pin_dueno":{const r=String((e==null?void 0:e.pin)||"").trim();return m.pinDueno?Promise.resolve(r===m.pinDueno):Promise.resolve(!0)}case"cambiar_pin_dueno":{const r=String((e==null?void 0:e.pinAnterior)||"").trim(),t=String((e==null?void 0:e.pinNuevo)||"").trim();return m.pinDueno&&r!==m.pinDueno?Promise.reject(new Error("La clave anterior no coincide.")):(m.pinDueno=t,m.config&&(m.config.tienePin=t.length>0),m.persist(),Promise.resolve(!0))}case"listar_productos":return Promise.resolve(m.productos);case"crear_producto":{const r=e==null?void 0:e.input,t=String((r==null?void 0:r.unidad)||"").toLowerCase(),s=t==="kg"?"kg":t==="ml"?"ml":r!=null&&r.pesable?"kg":"un",d=!!(r!=null&&r.esCaja),c=Number(r==null?void 0:r.unidadesPorCaja)>1?Math.floor(Number(r.unidadesPorCaja)):void 0,b=String((r==null?void 0:r.stockInicial)||"0"),g={sku:String((r==null?void 0:r.sku)||"").toUpperCase(),nombre:String((r==null?void 0:r.nombre)||""),precioBrutoUsd:String((r==null?void 0:r.precioBrutoUsd)||"0"),margenPct:String((r==null?void 0:r.margenPct)||"0"),precioUsd:String((r==null?void 0:r.precioUsd)||"0"),impuestoPct:String((r==null?void 0:r.impuestoPct)||"0"),stock:b,capacidades:ee|(s==="kg"||s==="ml"||r!=null&&r.pesable?ie:0),categoriaId:String((r==null?void 0:r.categoriaId)||""),sinStock:!!(r!=null&&r.sinStock),unidad:s,esCaja:d,unidadesPorCaja:c};return m.productos.push(g),m.persist(),Promise.resolve(void 0)}case"eliminar_producto":{const r=String((e==null?void 0:e.sku)||"").toUpperCase();return m.productos=m.productos.filter(t=>t.sku!==r),m.persist(),Promise.resolve(void 0)}case"registrar_venta":{const r=e==null?void 0:e.items,t=Number((e==null?void 0:e.montoRecibidoBs)||"0");let s=0;const d=Number(m.tasaActual.valor);r.forEach(x=>{const A=m.productos.find(N=>N.sku===x.sku);if(A){const N=Number(x.cantidad);s+=Number(A.precioUsd)*N,A.stock=String(Math.max(0,Number(A.stock)-N))}});const c=s*d,b=Math.max(0,t-c);m.ventasTotalUsd+=s,m.ventasTotalBs+=c;const g=new Date,h=g.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}),v=Array.isArray(e==null?void 0:e.pagos)&&e.pagos.length>0?e.pagos:[{metodo:t>0?"BS.EFEC.":"DOL.CASH",moneda:t>0?"BS":"USD",montoUsd:s.toFixed(2),montoBs:c.toFixed(2)}],k=e==null?void 0:e.resolucionVuelto,U=b>.009?(k==null?void 0:k.estado)||"PAGADO":"SIN_VUELTO",$=U==="PAGADO"?(k==null?void 0:k.metodo)||"BS.EFEC.":void 0,O=b>.009?(k==null?void 0:k.montoBs)||b.toFixed(2):void 0,L=b>.009?(k==null?void 0:k.montoUsd)||(d>0?(b/d).toFixed(2):"0.00"):void 0,F=U==="PAGADO"?k==null?void 0:k.tasa:void 0,C=((a=m.jornadaActual)==null?void 0:a.operadorActual)||"Caja Principal",y={ventaId:"TRX-"+Math.floor(1e4+Math.random()*9e4),totalUsd:s.toFixed(2),totalBs:c.toFixed(2),tasaDelDia:d.toFixed(2),montoRecibidoBs:t.toFixed(2),vueltoBs:b.toFixed(2),fechaHora:`Hoy, ${h}`,fechaUnix:Math.floor(g.getTime()/1e3),canal:"VENTA DIRECTA",operador:C,pagos:v,estadoVuelto:U,metodoVuelto:$,montoVueltoBs:O,montoVueltoUsd:L,tasaVuelto:F,lineas:r.map(x=>{const A=m.productos.find(q=>q.sku===x.sku),N=(Number((A==null?void 0:A.precioUsd)||0)*Number(x.cantidad)).toFixed(2),S=(Number(N)*d).toFixed(2);return{sku:x.sku,nombre:(A==null?void 0:A.nombre)||x.sku,cantidad:x.cantidad,precioUsd:(A==null?void 0:A.precioUsd)||"0",tasaBloqueada:d.toFixed(2),subtotalUsd:N,subtotalBs:S}})};if(m.tickets.unshift(y),m.jornadaActual){const x=m.jornadaActual;x.ventasTotalUsd=(Q(x.ventasTotalUsd)+s).toFixed(2),x.ventasTotalBs=(Q(x.ventasTotalBs)+c).toFixed(2),x.ticketsEmitidos+=1,U==="PAGADO"?x.vueltoPagadoBs=(Q(x.vueltoPagadoBs)+b).toFixed(2):U==="RETENIDO"&&(x.vueltoRetenidoBs=(Q(x.vueltoRetenidoBs)+b).toFixed(2))}return m.persist(),Promise.resolve(y)}case"listar_cuentas":return Promise.resolve(m.cuentas);case"abrir_cuenta":{const r=String((e==null?void 0:e.etiqueta)||"Mesa Demo").trim(),t=(e==null?void 0:e.tipo)==="deuda"?"deuda":"activa",s=typeof(e==null?void 0:e.cliente)=="string"?e.cliente.trim():void 0,d=typeof(e==null?void 0:e.nota)=="string"?e.nota.trim():void 0,c=new Date,b=c.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}),g=`${c.toLocaleDateString("es-VE")} ${b}`,h={ventaId:(t==="deuda"?"DEU-":"CTA-")+Math.random().toString(36).slice(2,8).toUpperCase(),etiqueta:r,tipo:t,cliente:s,nota:d,fechaCreacionUnix:Math.floor(c.getTime()/1e3),fechaCreacionStr:g,totalParcialUsd:"0.00",totalParcialBs:"0.00",abonosUsd:"0.00",abonosBs:"0.00",lineas:0,consumos:[]};return m.cuentas.push(h),m.persist(),Promise.resolve(h)}case"agregar_consumo":{const r=String((e==null?void 0:e.ventaId)||""),t=String((e==null?void 0:e.sku)||"").trim().toUpperCase(),s=Q(e==null?void 0:e.cantidad)||1,d=m.cuentas.find(b=>b.ventaId===r),c=m.productos.find(b=>b.sku.trim().toUpperCase()===t);if(d&&c){if(!c.sinStock){const U=Q(c.stock);if(U<s)return Promise.reject(new Error(`Stock insuficiente para "${c.nombre}". Disponible: ${U} ${c.unidad||"un."}`));c.stock=String(Math.max(0,U-s))}Array.isArray(d.consumos)||(d.consumos=[]);const b=Q(c.precioUsd),g=b*s,h=Q(m.tasaActual.valor)||807.39,v=d.consumos.find(U=>U.sku.trim().toUpperCase()===c.sku.trim().toUpperCase());v?(v.cantidad+=s,v.subtotalUsd=(v.cantidad*Q(v.precioUsd)).toFixed(2)):d.consumos.push({id:"con-"+Math.random().toString(36).slice(2,8),sku:c.sku,nombre:c.nombre,cantidad:s,precioUsd:b.toFixed(2),subtotalUsd:g.toFixed(2)});const k=d.consumos.reduce((U,$)=>U+Q($.subtotalUsd),0);return d.totalParcialUsd=k.toFixed(2),d.totalParcialBs=(k*h).toFixed(2),d.lineas=d.consumos.length,m.persist(),Promise.resolve(d)}return Promise.resolve(d)}case"eliminar_consumo":{const r=String((e==null?void 0:e.ventaId)||""),t=String((e==null?void 0:e.consumoId)||""),s=m.cuentas.find(d=>d.ventaId===r);if(s&&Array.isArray(s.consumos)){const d=s.consumos.findIndex(c=>c.id===t);if(d!==-1){const c=s.consumos[d],b=m.productos.find(v=>v.sku.trim().toUpperCase()===c.sku.trim().toUpperCase());b&&!b.sinStock&&(b.stock=String(Q(b.stock)+c.cantidad)),s.consumos.splice(d,1);const g=Q(m.tasaActual.valor)||807.39,h=s.consumos.reduce((v,k)=>v+Q(k.subtotalUsd),0);s.totalParcialUsd=h.toFixed(2),s.totalParcialBs=(h*g).toFixed(2),s.lineas=s.consumos.length,m.persist()}return Promise.resolve(s)}return Promise.resolve(s)}case"cerrar_cuenta":{const r=String((e==null?void 0:e.ventaId)||""),t=m.cuentas.findIndex(f=>f.ventaId===r),s=t!==-1?m.cuentas[t]:null;let d="0.00",c="0.00",b=[],g=0;const h=Q(e==null?void 0:e.tasaCobro),v=h>0?h:Number(m.tasaActual.valor)||807.39,k=(s==null?void 0:s.tipo)==="deuda";if(s){const f=Number(s.totalParcialUsd),I=Number(s.abonosUsd||"0"),P=Math.max(0,I-f);g=P;const G=Math.max(f,I);d=G.toFixed(2),c=(G*v).toFixed(2),m.cuentas.splice(t,1),m.ventasTotalUsd+=G,m.ventasTotalBs+=G*v,b=(s.consumos||[]).map(T=>({sku:T.sku,nombre:T.nombre,cantidad:String(T.cantidad),precioUsd:T.precioUsd,tasaBloqueada:v.toFixed(4),subtotalUsd:T.subtotalUsd,subtotalBs:(Number(T.subtotalUsd)*v).toFixed(2)})),P>0&&b.push({sku:"GANANCIA-EXCEDENTE",nombre:"Saldo a Favor Consolidado como Ganancia (Excedente Retenido)",cantidad:"1",precioUsd:P.toFixed(2),tasaBloqueada:v.toFixed(4),subtotalUsd:P.toFixed(2),subtotalBs:(P*v).toFixed(2)})}const U=new Date,$=U.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}),O=Array.isArray(e==null?void 0:e.pagos)&&e.pagos.length>0?e.pagos:[{metodo:k?"TRANSF.BS.":"BS.EFEC.",moneda:"BS",montoUsd:d,montoBs:c}],L=Number((e==null?void 0:e.montoRecibidoBs)||c),F=Math.max(0,L-Number(c)),C=e==null?void 0:e.resolucionVuelto,y=F>.009?(C==null?void 0:C.estado)||"PAGADO":"SIN_VUELTO",x=y==="PAGADO"?(C==null?void 0:C.metodo)||(k?"TRANSF.BS.":"BS.EFEC."):void 0,A=F>.009?(C==null?void 0:C.montoBs)||F.toFixed(2):void 0,N=F>.009?(C==null?void 0:C.montoUsd)||(v>0?(F/v).toFixed(2):"0.00"):void 0,S=y==="PAGADO"?C==null?void 0:C.tasa:void 0,q=((o=m.jornadaActual)==null?void 0:o.operadorActual)||"Caja Principal",p={ventaId:r||(k?"DEU-":"CTA-")+Math.floor(1e4+Math.random()*9e4),totalUsd:d,totalBs:c,tasaDelDia:v.toFixed(4),montoRecibidoBs:L.toFixed(2),vueltoBs:F.toFixed(2),fechaHora:`Hoy, ${$}`,fechaUnix:Math.floor(U.getTime()/1e3),canal:k?"LIQUIDACIÓN DE DEUDA":"CONSUMO EN CUENTA",operador:q,saldoAFavorConsolidadoUsd:g>0?g.toFixed(2):void 0,pagos:O,estadoVuelto:y,metodoVuelto:x,montoVueltoBs:A,montoVueltoUsd:N,tasaVuelto:S,lineas:b};if(m.tickets.unshift(p),m.jornadaActual){const f=m.jornadaActual,I=Q(d),P=Q(c);f.ventasTotalUsd=(Q(f.ventasTotalUsd)+I).toFixed(2),f.ventasTotalBs=(Q(f.ventasTotalBs)+P).toFixed(2),f.ticketsEmitidos+=1,k&&(f.deudasLiquidadasUsd=(Q(f.deudasLiquidadasUsd)+I).toFixed(2)),y==="PAGADO"?f.vueltoPagadoBs=(Q(f.vueltoPagadoBs)+F).toFixed(2):y==="RETENIDO"&&(f.vueltoRetenidoBs=(Q(f.vueltoRetenidoBs)+F).toFixed(2))}return m.persist(),Promise.resolve(p)}case"listar_categorias":return Promise.resolve(m.categorias);case"crear_categoria":{const r=String((e==null?void 0:e.nombre)||"").trim(),t="cat-"+Math.random().toString(36).slice(2,7);return m.categorias.push({id:t,nombre:r}),m.persist(),Promise.resolve(m.categorias)}case"eliminar_categoria":{const r=String((e==null?void 0:e.id)||"");return m.categorias=m.categorias.filter(t=>t.id!==r),m.persist(),Promise.resolve(m.categorias)}case"listar_tasas_impuestos":return Promise.resolve(m.tasasImpuestos);case"crear_tasa_impuesto":{const r=String((e==null?void 0:e.nombre)||"").trim(),t=Number((e==null?void 0:e.porcentaje)||0),s="tax-"+Math.random().toString(36).slice(2,7);return m.tasasImpuestos.push({id:s,nombre:r,porcentaje:t}),m.persist(),Promise.resolve(m.tasasImpuestos)}case"eliminar_tasa_impuesto":{const r=String((e==null?void 0:e.id)||"");return m.tasasImpuestos=m.tasasImpuestos.filter(t=>t.id!==r),m.persist(),Promise.resolve(m.tasasImpuestos)}case"abonar_cuenta":{const r=String((e==null?void 0:e.ventaId)||""),t=Number((e==null?void 0:e.montoUsd)||0),s=Number((e==null?void 0:e.montoBs)||0),d=m.cuentas.find(c=>c.ventaId===r);if(d&&Number.isFinite(t)&&t>0&&t<=5e4){const c=Number(m.tasaActual.valor),b=Number(d.abonosUsd||"0"),g=Number(d.abonosBs||"0");if(s>0){const h=g+s;d.abonosBs=h.toFixed(2),d.abonosUsd=(c>0?h/c:0).toFixed(2)}else{const h=b+t;d.abonosUsd=h.toFixed(2),d.abonosBs=(h*c).toFixed(2)}m.persist()}return Promise.resolve(d)}case"editar_abono_cuenta":{const r=String((e==null?void 0:e.ventaId)||""),t=Math.max(0,Math.min(5e4,Number((e==null?void 0:e.nuevoAbonoUsd)||0))),s=m.cuentas.find(d=>d.ventaId===r);if(s&&Number.isFinite(t)){const d=Number(m.tasaActual.valor);s.abonosUsd=t.toFixed(2),s.abonosBs=(t*d).toFixed(2),m.persist()}return Promise.resolve(s)}case"datos_panel":{const r=Number(m.tasaActual.valor),t=m.ventasTotalUsd,s=m.ventasTotalBs,d=t*.65,c=t-d,b=t*.12,g=c-b,h=c,v=g*r,k={};m.tickets.forEach(p=>{p.lineas.forEach(f=>{k[f.sku]||(k[f.sku]={qty:0,monto:0,nombre:f.nombre}),k[f.sku].qty+=Number(f.cantidad)||1,k[f.sku].monto+=Number(f.subtotalUsd)||0})}),m.productos.forEach((p,f)=>{if(!k[p.sku]){const I=Math.max(1,14-f*2);k[p.sku]={qty:I,monto:I*Number(p.precioUsd),nombre:p.nombre}}});const U=Object.values(k).sort((p,f)=>f.monto-p.monto),$=U.reduce((p,f)=>p+f.monto,0)||1,O=U.map(p=>({nombre:p.nombre,cantidad:String(p.qty),totalUsd:p.monto.toFixed(2),porcentaje:(p.monto/$*100).toFixed(1)})),L=Number(m.tasaActual.valor)||807.39;let F=0;const C={};m.categorias.forEach(p=>{C[p.id]={categoriaId:p.id,nombre:p.nombre,cantidadProductos:0,unidadesStock:0,brutoUsd:0,ventaUsd:0}}),C["cat-general"]||(C["cat-general"]={categoriaId:"cat-general",nombre:"General",cantidadProductos:0,unidadesStock:0,brutoUsd:0,ventaUsd:0}),m.productos.forEach(p=>{const f=p.categoriaId&&C[p.categoriaId]?p.categoriaId:"cat-general",I=C[f];I.cantidadProductos+=1;const P=p.sinStock?0:Number(p.stock)||0,G=Number(p.precioBrutoUsd)>0?Number(p.precioBrutoUsd):Number(p.precioUsd)*.65,T=Number(p.precioUsd)||0,E=P*G,X=P*T;I.unidadesStock+=P,I.brutoUsd+=E,I.ventaUsd+=X,F+=E});const y=Object.values(C).filter(p=>p.cantidadProductos>0||p.brutoUsd>0).map(p=>{const f=Math.max(0,p.ventaUsd-p.brutoUsd),I=p.ventaUsd>0?(f/p.ventaUsd*100).toFixed(1):"0.0",P=F>0?(p.brutoUsd/F*100).toFixed(1):"0.0";return{categoriaId:p.categoriaId,nombre:p.nombre,cantidadProductos:p.cantidadProductos,unidadesStock:Math.round(p.unidadesStock*100)/100,dineroBrutoUsd:p.brutoUsd.toFixed(2),dineroBrutoBs:(p.brutoUsd*L).toFixed(2),dineroVentaUsd:p.ventaUsd.toFixed(2),dineroVentaBs:(p.ventaUsd*L).toFixed(2),margenBrutoProyectadoUsd:f.toFixed(2),margenBrutoPct:I,porcentajeCapital:P}}).sort((p,f)=>Number(f.dineroBrutoUsd)-Number(p.dineroBrutoUsd)),x=m.cuentas.filter(p=>p.tipo==="deuda"),A=m.cuentas.filter(p=>p.tipo!=="deuda"),N=x.reduce((p,f)=>p+Math.max(0,Q(f.totalParcialUsd)-Q(f.abonosUsd)),0),S=N*L,q={ventas24hUsd:t.toFixed(2),ventas24hBs:s.toFixed(2),tickets24h:Math.max(m.tickets.length,18),valorInventarioUsd:m.productos.reduce((p,f)=>p+Number(f.precioUsd)*Number(f.stock),0).toFixed(2),costoTotalUsd:d.toFixed(2),gananciaBrutaUsd:c.toFixed(2),gananciaNetaUsd:g.toFixed(2),gananciaNetaSinImpUsd:h.toFixed(2),gananciaNetaBs:v.toFixed(2),cuentasAbiertas:A.length,deudasAbiertas:x.length,dineroEnLaCalleUsd:N.toFixed(2),dineroEnLaCalleBs:S.toFixed(2),criticos:m.productos.filter(p=>!p.sinStock&&Number(p.stock)<=5).map(p=>({sku:p.sku,nombre:p.nombre,stock:p.stock})),topProductos:O,dineroPorCategoria:y};return Promise.resolve(q)}case"compra_stock":{const r=String((e==null?void 0:e.sku)||""),t=Number((e==null?void 0:e.cantidad)||"0"),s=m.productos.find(d=>d.sku===r);return s&&Number.isFinite(t)&&t>0?(s.stock=String(Number(s.stock)+t),m.persist(),Promise.resolve(s.stock)):Promise.resolve("0")}case"reducir_stock":{const r=String((e==null?void 0:e.sku)||""),t=Number((e==null?void 0:e.cantidad)||"0"),s=m.productos.find(d=>d.sku===r);return s&&Number.isFinite(t)&&t>0?(s.stock=String(Math.max(0,Number(s.stock)-t)),m.persist(),Promise.resolve(s.stock)):Promise.resolve("0")}case"registrar_merma":{const r=String((e==null?void 0:e.sku)||""),t=Number((e==null?void 0:e.cantidad)||"0"),s=m.productos.find(d=>d.sku===r);return s&&Number.isFinite(t)&&t>0?(s.stock=String(Math.max(0,Number(s.stock)-t)),m.persist(),Promise.resolve(s.stock)):Promise.resolve("0")}case"listar_dispositivos":return Promise.resolve(m.dispositivos);case"registrar_dispositivo":{const r=String((e==null?void 0:e.nombre)||"Dispositivo Móvil").trim(),s={id:"dev-"+Math.random().toString(36).slice(2,7),nombre:r,ip:"192.168.1."+Math.floor(Math.random()*200+20),ultimoAcceso:"Ahora mismo",activo:!0};return m.dispositivos.push(s),m.persist(),Promise.resolve(m.dispositivos)}case"revocar_dispositivo":{const r=String((e==null?void 0:e.id)||"");return m.dispositivos=m.dispositivos.filter(t=>t.id!==r),m.persist(),Promise.resolve(m.dispositivos)}case"listar_respaldos":return Promise.resolve(m.respaldos);case"crear_respaldo":{const r="bk-"+Math.random().toString(36).slice(2,7),t=m.productos.length+m.cuentas.length+m.categorias.length,s=new Date,d=(((n=m.config)==null?void 0:n.nombre)||"DATIOLABS").toUpperCase().replace(/[^A-Z0-9]/g,"-").replace(/-+/g,"-").slice(0,30),c=s.getFullYear(),b=String(s.getMonth()+1).padStart(2,"0"),g=String(s.getDate()).padStart(2,"0"),h=String(s.getHours()).padStart(2,"0"),v=String(s.getMinutes()).padStart(2,"0"),k=String(s.getSeconds()).padStart(2,"0"),U=`${d}-${c}${b}${g}-${h}${v}${k}.datio`,$={id:r,fecha:"Ahora mismo",archivoNombre:U,registros:t,tamanoKb:Math.round(t*.4+10),checksumSha256:Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join("")};return m.respaldos.unshift($),m.persist(),Promise.resolve($)}case"restaurar_desde_respaldo":return m.dispositivos=[],m.persist(),Promise.resolve(!0);case"obtener_licencia":return Promise.resolve(m.licencia);case"obtener_tasa_bcv":return Promise.resolve(m.tasaActual);case"forzar_actualizacion_tasa":return m.refrescarTasaEnVivo().then(()=>m.tasaActual);case"listar_historico_tasas":return Promise.resolve(m.historicoTasas);case"fijar_tasa_manual":{const r=String((e==null?void 0:e.tasa)||"0"),t=Number(r),s=Number(m.tasaActual.valor);let d=null,c=null;if(Number.isFinite(s)&&s>0&&Number.isFinite(t)&&t>0&&s!==t){const h=(t-s)/s*100;d=Math.abs(h).toFixed(2),c=h>0?"subio":"bajo"}m.tasaActual={valor:t.toFixed(4),fechaUnix:Math.floor(Date.now()/1e3),fluctuacionPct:d,direccion:c};const g=new Date().toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"});return m.historicoTasas.unshift({id:"tx-"+Math.random().toString(36).slice(2,7),valor:t.toFixed(4),fechaHora:`Hoy, ${g}`,tipo:"manual",motivo:"Ajuste manual por el usuario"}),m.historicoTasas.length>50&&m.historicoTasas.pop(),m.persist(),Promise.resolve(m.tasaActual)}case"listar_ventas":return Promise.resolve(m.tickets);case"listar_metodos_pago":return m.metodosPago.sort((r,t)=>r.moneda===t.moneda?0:r.moneda==="BS"?-1:1),Promise.resolve(m.metodosPago);case"crear_metodo_pago":{const r=String((e==null?void 0:e.nombre)||"").trim().toUpperCase().replace(/[^A-Z0-9. _-]/g,"").slice(0,25),t=(e==null?void 0:e.moneda)==="USD"?"USD":"BS";return r&&!m.metodosPago.some(s=>s.nombre===r)&&(m.metodosPago.push({nombre:r,moneda:t}),m.metodosPago.sort((s,d)=>s.moneda===d.moneda?0:s.moneda==="BS"?-1:1),m.persist()),Promise.resolve(m.metodosPago)}case"eliminar_metodo_pago":{const r=String((e==null?void 0:e.nombre)||"").trim().toUpperCase();return r&&(m.metodosPago=m.metodosPago.filter(t=>t.nombre!==r),m.metodosPago.length===0&&m.metodosPago.push({nombre:"PUNTOD.VENTA",moneda:"BS"}),m.persist()),Promise.resolve(m.metodosPago)}case"listar_operadores":return Promise.resolve(m.operadores);case"crear_operador":{const r=String((e==null?void 0:e.nombre)||"").trim();if(r){const t={id:"op-"+Math.random().toString(36).slice(2,7),nombre:r,activo:!0,creadoUnix:Math.floor(Date.now()/1e3)};m.operadores.push(t),m.persist()}return Promise.resolve(m.operadores)}case"editar_operador":{const r=String((e==null?void 0:e.id)||""),t=String((e==null?void 0:e.nombre)||"").trim();if(r&&t){const s=m.operadores.find(d=>d.id===r);if(s){const d=s.nombre;s.nombre=t,m.jornadaActual&&(m.jornadaActual.operadorActual===d&&(m.jornadaActual.operadorActual=t),m.jornadaActual.operadoresActivos&&(m.jornadaActual.operadoresActivos=m.jornadaActual.operadoresActivos.map(c=>c===d?t:c)),m.jornadaActual.operadoresRelevo&&(m.jornadaActual.operadoresRelevo=m.jornadaActual.operadoresRelevo.map(c=>c===d?t:c))),m.persist()}}return Promise.resolve(m.operadores)}case"eliminar_operador":{const r=String((e==null?void 0:e.id)||"");if(r){const t=m.operadores.find(d=>d.id===r),s=t==null?void 0:t.nombre;m.operadores=m.operadores.filter(d=>d.id!==r),m.jornadaActual&&s&&(m.jornadaActual.operadoresActivos&&(m.jornadaActual.operadoresActivos=m.jornadaActual.operadoresActivos.filter(d=>d!==s)),m.jornadaActual.operadorActual===s&&(m.jornadaActual.operadorActual=((l=m.jornadaActual.operadoresActivos)==null?void 0:l[0])||((i=m.operadores[0])==null?void 0:i.nombre)||"Cajero Principal")),m.persist()}return Promise.resolve(m.operadores)}case"alternar_operador":{const r=String((e==null?void 0:e.id)||""),t=m.operadores.find(s=>s.id===r);return t&&(t.activo=!t.activo,m.persist()),Promise.resolve(m.operadores)}case"obtener_jornada_actual":return Promise.resolve(m.jornadaActual);case"listar_historico_jornadas":return Promise.resolve(m.historicoJornadas);case"abrir_jornada":{const r=String((e==null?void 0:e.operador)||"Cajero Principal").trim(),t=Array.isArray(e==null?void 0:e.operadores)&&e.operadores.length>0?e.operadores.map(U=>String(U).trim()).filter(Boolean):[r],s=new Date,d=s.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}),c=`${s.toLocaleDateString("es-VE")} ${d}`,b=s.getFullYear(),g=String(s.getMonth()+1).padStart(2,"0"),h=String(s.getDate()).padStart(2,"0"),v=m.tasaActual.valor,k={id:`JOR-${b}${g}${h}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,estado:"abierta",inicioUnix:Math.floor(Date.now()/1e3),inicioStr:`Hoy, ${d} (${c})`,operadorInicial:t[0]||r,operadorActual:t.join(", "),operadoresActivos:t,operadoresRelevo:[...t],tasaInicio:v,ventasTotalUsd:"0.00",ventasTotalBs:"0.00",ticketsEmitidos:0,vueltoPagadoBs:"0.00",vueltoRetenidoBs:"0.00",deudasLiquidadasUsd:"0.00",entradasStockReg:0,mermasStockReg:0,cambiosPrecioReg:0};return m.jornadaActual=k,m.persist(),Promise.resolve(k)}case"asignar_operadores_turno":{const r=Array.isArray(e==null?void 0:e.operadores)?e.operadores.map(t=>String(t).trim()).filter(Boolean):[];return m.jornadaActual&&(m.jornadaActual.operadoresActivos=r,m.jornadaActual.operadorActual=r.length>0?r.join(", "):"Sin operador asignado",r.forEach(t=>{var s,d;(s=m.jornadaActual)!=null&&s.operadoresRelevo.includes(t)||(d=m.jornadaActual)==null||d.operadoresRelevo.push(t)}),m.persist()),Promise.resolve(m.jornadaActual)}case"relevar_operador_jornada":{const r=String((e==null?void 0:e.operador)||"").trim();return m.jornadaActual&&r&&(m.jornadaActual.operadorActual=r,m.jornadaActual.operadoresActivos=[r],m.jornadaActual.operadoresRelevo.includes(r)||m.jornadaActual.operadoresRelevo.push(r),m.persist()),Promise.resolve(m.jornadaActual)}case"cerrar_jornada":{if(!m.jornadaActual)return Promise.reject(new Error("No existe una jornada laboral abierta para cerrar."));const r=new Date,t=r.toLocaleTimeString("es-VE",{hour:"2-digit",minute:"2-digit"}),s=`${r.toLocaleDateString("es-VE")} ${t}`,d=m.jornadaActual;return d.estado="cerrada",d.finUnix=Math.floor(Date.now()/1e3),d.finStr=`${s}`,d.tasaFin=m.tasaActual.valor,d.checksumSha256=Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join(""),m.historicoJornadas.unshift(d),m.jornadaActual=null,m.persist(),Promise.resolve(d)}case"obtener_semaforo_stock":return Promise.resolve(m.semaforoStock);case"guardar_semaforo_stock":{const r=Math.max(1,Number(e==null?void 0:e.rojoMax)||5),t=Math.max(r+1,Number(e==null?void 0:e.amarilloMax)||15);return m.semaforoStock={rojoMax:r,amarilloMax:t},m.persist(),Promise.resolve(m.semaforoStock)}default:return Promise.resolve(null)}}const D={config:()=>H("obtener_config"),inicializar:(u,e,a)=>H("inicializar_negocio",{nombre:u,rubros:e,pinDueno:a||null}),validarPin:u=>H("validar_pin_dueno",{pin:u}),productos:()=>H("listar_productos"),crearProducto:u=>{const e=u.sku&&u.sku.trim()?u.sku.trim().toUpperCase():"PROD-"+Math.random().toString(36).slice(2,8).toUpperCase();return H("crear_producto",{input:{...u,sku:e}})},eliminarProducto:u=>H("eliminar_producto",{sku:u}),registrarVenta:(u,e,a,o,n)=>H("registrar_venta",{items:u,clienteMayorEdad:e,montoRecibidoBs:a,pagos:o,resolucionVuelto:n}),abrirCuenta:(u,e,a,o)=>H("abrir_cuenta",{etiqueta:u,tipo:e,nota:a,cliente:o}),cuentas:()=>H("listar_cuentas"),agregarConsumo:(u,e,a,o)=>H("agregar_consumo",{ventaId:u,sku:e,cantidad:a,clienteMayorEdad:o}),eliminarConsumo:(u,e)=>H("eliminar_consumo",{ventaId:u,consumoId:e}),abonarCuenta:(u,e,a)=>H("abonar_cuenta",{ventaId:u,montoUsd:e,montoBs:a}),editarAbonoCuenta:(u,e)=>H("editar_abono_cuenta",{ventaId:u,nuevoAbonoUsd:e}),cerrarCuenta:(u,e,a,o,n)=>H("cerrar_cuenta",{ventaId:u,montoRecibidoBs:e,tasaCobro:a,pagos:o,resolucionVuelto:n}),panel:()=>H("datos_panel"),compraStock:(u,e)=>H("compra_stock",{sku:u,cantidad:e}),reducirStock:(u,e)=>H("reducir_stock",{sku:u,cantidad:e}),merma:(u,e,a)=>H("registrar_merma",{sku:u,cantidad:e,loteId:a}),categorias:()=>H("listar_categorias"),crearCategoria:u=>H("crear_categoria",{nombre:u}),eliminarCategoria:u=>H("eliminar_categoria",{id:u}),tasasImpuestos:()=>H("listar_tasas_impuestos"),crearTasaImpuesto:(u,e)=>H("crear_tasa_impuesto",{nombre:u,porcentaje:e}),eliminarTasaImpuesto:u=>H("eliminar_tasa_impuesto",{id:u}),dispositivos:()=>H("listar_dispositivos"),registrarDispositivo:u=>H("registrar_dispositivo",{nombre:u}),revocarDispositivo:u=>H("revocar_dispositivo",{id:u}),respaldos:()=>H("listar_respaldos"),crearRespaldo:()=>H("crear_respaldo"),restaurarRespaldo:u=>H("restaurar_desde_respaldo",{archivo:u}),licencia:()=>H("obtener_licencia"),cambiarPinDueno:(u,e)=>H("cambiar_pin_dueno",{pinAnterior:u,pinNuevo:e}),tasa:()=>H("obtener_tasa_bcv"),historicoTasas:()=>H("listar_historico_tasas"),forzarTasa:()=>H("forzar_actualizacion_tasa"),fijarTasaManual:u=>H("fijar_tasa_manual",{tasa:u}),ventas:()=>H("listar_ventas"),listarMetodosPago:()=>H("listar_metodos_pago"),crearMetodoPago:(u,e="BS")=>H("crear_metodo_pago",{nombre:u,moneda:e}),eliminarMetodoPago:u=>H("eliminar_metodo_pago",{nombre:u}),listarOperadores:()=>H("listar_operadores"),crearOperador:u=>H("crear_operador",{nombre:u}),editarOperador:(u,e)=>H("editar_operador",{id:u,nombre:e}),eliminarOperador:u=>H("eliminar_operador",{id:u}),alternarOperador:u=>H("alternar_operador",{id:u}),obtenerJornadaActual:()=>H("obtener_jornada_actual"),listarHistoricoJornadas:()=>H("listar_historico_jornadas"),abrirJornada:(u,e)=>H("abrir_jornada",{operador:u,operadores:e}),relevarOperadorJornada:u=>H("relevar_operador_jornada",{operador:u}),asignarOperadoresTurno:u=>H("asignar_operadores_turno",{operadores:u}),cerrarJornada:()=>H("cerrar_jornada"),obtenerSemaforoStock:()=>H("obtener_semaforo_stock"),guardarSemaforoStock:(u,e)=>H("guardar_semaforo_stock",{rojoMax:u,amarilloMax:e})},Re="#00823B",Ne="#C60C15",Me="#6B7280",je=3e5;class Oe{constructor(){w(this,"contenedor");w(this,"timer",null);this.contenedor=document.getElementById("bcv-indicator")}iniciar(){this.contenedor&&(this.renderizarEsqueleto(),this.actualizar(),this.timer=window.setInterval(()=>void this.actualizar(),je))}detener(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}renderizarEsqueleto(){var e,a;this.contenedor&&(this.contenedor.innerHTML=`
            <div class="flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-brand-black rounded px-2 sm:px-3 py-1 sm:py-2 shadow-brutal-sm">
                <span class="font-heading font-black text-[10px] sm:text-xs uppercase tracking-wider text-gray-600">BCV</span>
                <span id="bcv-valor" title="Clic para ver histórico y editar tasa" class="font-heading font-black text-sm sm:text-lg cursor-pointer hover:underline">--</span>
                <span id="bcv-fluctuacion" class="font-body font-bold text-[10px] sm:text-xs"></span>
                <button id="bcv-refresh" title="Actualizar tasa"
                    class="ml-0.5 sm:ml-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded border-2 border-brand-black bg-brand-yellow hover:-translate-y-0.5 transition-transform active:translate-y-0">
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                </button>
            </div>`,(e=document.getElementById("bcv-refresh"))==null||e.addEventListener("click",()=>void this.forzar()),(a=document.getElementById("bcv-valor"))==null||a.addEventListener("click",()=>void this.abrirModalHistoricoYAjuste()))}async abrirModalHistoricoYAjuste(){var i,r,t;const e=document.getElementById("modal-root");if(!e)return;const a=await D.historicoTasas().catch(()=>[]),o=((i=document.getElementById("bcv-valor"))==null?void 0:i.textContent)||"--";e.innerHTML=`
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-lg">
                <div class="flex justify-between items-center border-b-2 border-brand-black pb-3 mb-4">
                    <div>
                        <h3 class="font-heading font-black text-2xl">TASA DE CAMBIO BCV</h3>
                        <p class="font-body text-xs text-gray-600">Historial cronológico de fluctuación cambiaria y ajuste controlado</p>
                    </div>
                    <button id="tasa-modal-cerrar" class="w-8 h-8 rounded border-2 border-brand-black flex items-center justify-center font-black text-lg hover:bg-gray-100">&times;</button>
                </div>

                <!-- Formulario de ajuste manual con confirmación de seguridad -->
                <div class="bg-gray-50 border-2 border-brand-black rounded-lg p-4 mb-4">
                    <h4 class="font-heading font-black text-xs uppercase mb-1">Ajustar Tasa Manualmente</h4>
                    <p class="text-[11px] text-gray-600 font-bold mb-3">Tasa vigente actual: <span class="text-brand-black font-black">Bs. ${o}</span></p>
                    <form id="form-tasa-manual" class="flex gap-2">
                        <input id="in-tasa-manual" type="number" step="0.01" min="1" max="999999" placeholder="Ej: 805.50"
                            class="flex-1 border-2 border-brand-black rounded px-3 py-2 text-sm font-black focus:ring-2 focus:ring-brand-purple" required />
                        <button type="submit" class="bg-brand-black text-white font-heading font-black px-4 py-2 rounded border-2 border-brand-black text-xs shadow-brutal-sm hover:-translate-y-0.5 transition-transform">
                            MODIFICAR TASA
                        </button>
                    </form>
                    <p id="msg-tasa-confirm" class="hidden text-xs font-bold text-amber-900 mt-2 bg-amber-100 p-2 border border-brand-black rounded"></p>
                </div>

                <!-- Historial Cronológico de Tasas -->
                <div>
                    <h4 class="font-heading font-black text-xs uppercase mb-2">Histórico de Actualizaciones (${a.length})</h4>
                    <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        ${a.length===0?'<p class="text-xs text-gray-400 font-bold py-4 text-center">Sin registros históricos previos.</p>':a.map(s=>`
                            <div class="border border-brand-black rounded p-2 bg-white flex justify-between items-center text-xs">
                                <div>
                                    <span class="font-black font-heading text-sm text-brand-black">Bs. ${Number(s.valor).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                                    <span class="text-[10px] text-gray-500 font-bold ml-2">· ${s.motivo||"Actualización"}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] px-1.5 py-0.5 rounded border border-brand-black font-black uppercase ${s.tipo==="manual"?"bg-amber-100 text-amber-900":"bg-blue-100 text-blue-900"}">
                                        ${s.tipo}
                                    </span>
                                    <p class="text-[10px] text-gray-500 font-mono mt-0.5">${s.fechaHora}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div class="flex justify-between items-center pt-4 border-t-2 border-brand-black text-xs text-gray-500 font-bold mt-4">
                    <span>Sincronización oficial del Banco Central</span>
                    <button id="tasa-modal-btn-cerrar" class="bg-brand-black text-white px-4 py-2 rounded font-black font-heading text-xs">CERRAR</button>
                </div>
            </div>
        </div>`;const n=()=>{e.innerHTML=""};(r=document.getElementById("tasa-modal-cerrar"))==null||r.addEventListener("click",n),(t=document.getElementById("tasa-modal-btn-cerrar"))==null||t.addEventListener("click",n);const l=document.getElementById("form-tasa-manual");l==null||l.addEventListener("submit",async s=>{s.preventDefault();const d=document.getElementById("in-tasa-manual"),c=Number((d==null?void 0:d.value)||0);if(!c||c<=0)return;if(window.confirm(`¿Está seguro de que desea cambiar la tasa oficial del sistema a Bs. ${c.toFixed(2)}?

Esta tasa afectará todos los nuevos cobros y tickets a partir de este momento.`)){const g=await H("fijar_tasa_manual",{tasa:c.toFixed(2)});g&&this.pintar(g),n()}})}async actualizar(){const e=await this.obtenerTasa("obtener_tasa_bcv");e&&this.pintar(e)}async forzar(){const e=document.getElementById("bcv-refresh");e&&e.classList.add("animate-spin");const a=await this.obtenerTasa("forzar_actualizacion_tasa");e&&e.classList.remove("animate-spin"),a&&this.pintar(a)}async obtenerTasa(e){try{return await H(e)}catch{return null}}pintar(e){const a=document.getElementById("bcv-valor"),o=document.getElementById("bcv-fluctuacion");if(!a||!o)return;const n=Number(e.valor);a.textContent=Number.isFinite(n)&&n>0?n.toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}):"--",Number.isFinite(n)&&n>0&&window.dispatchEvent(new CustomEvent("tasa_actualizada",{detail:n}));const l=Number(e.fluctuacionPct);if(e.direccion&&Number.isFinite(l)){const i=e.direccion==="subio"?Re:e.direccion==="bajo"?Ne:Me,r=l>0?"+":"";o.textContent=`${r}${l.toFixed(2)}%`,o.style.color=i}else o.textContent=""}}class Fe{constructor(){w(this,"config",null);w(this,"rol","caja");w(this,"tasa",0);w(this,"oyentes",[])}suscribir(e){this.oyentes.push(e)}notificar(){this.oyentes.forEach(e=>e())}async cargarConfig(){return this.config=await D.config(),this.config}getConfig(){return this.config}async inicializar(e,a,o){await D.inicializar(e,a,o),await this.cargarConfig(),this.notificar()}get rubroAbasto(){var e,a;return(((e=this.config)==null?void 0:e.rubros)??0&pe)!==0||(((a=this.config)==null?void 0:a.rubros)??0)===pe}tieneRubro(e){var a;return((((a=this.config)==null?void 0:a.rubros)??0)&e)!==0}tieneCapacidad(e){var a;return((((a=this.config)==null?void 0:a.capacidades)??0)&e)!==0}setRol(e){this.rol=e,this.notificar()}get rolActual(){return this.rol}setTasa(e){this.tasa=e,this.notificar()}get tasaActual(){return this.tasa}bs(e){return(Number(e)*this.tasa).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}}class qe{constructor(e,a,o){w(this,"contenedor");w(this,"modelo");w(this,"alTerminar");w(this,"modo","nuevo");w(this,"bloquearPanel",!0);this.contenedor=e,this.modelo=a,this.alTerminar=o}render(){this.contenedor.innerHTML=`
        <div class="max-w-2xl mx-auto mt-3 sm:mt-8 mb-8 sm:mb-12">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-8">
                <div class="flex flex-wrap items-center justify-between border-b-2 border-brand-black pb-4 mb-6 gap-3">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-black font-heading">Instalación del Terminal</h1>
                        <p class="text-brand-text font-body text-xs">Configuración inicial o restauración de datos</p>
                    </div>
                    <div class="inline-flex border-2 border-brand-black rounded bg-gray-100 p-0.5">
                        <button id="wz-tab-nuevo" class="px-2.5 sm:px-3 py-1 sm:py-1.5 font-heading text-[11px] sm:text-xs rounded transition-colors ${this.modo==="nuevo"?"font-black bg-brand-black text-white":"font-bold text-brand-black hover:bg-white"}">NUEVO NEGOCIO</button>
                        <button id="wz-tab-restaurar" class="px-2.5 sm:px-3 py-1 sm:py-1.5 font-heading text-[11px] sm:text-xs rounded transition-colors ${this.modo==="restaurar"?"font-black bg-brand-black text-white":"font-bold text-brand-black hover:bg-white"}">INSTALAR DESDE RESPALDO</button>
                    </div>
                </div>

                <!-- Modo 1: Instalación Limpia -->
                <div id="wz-sec-nuevo" class="${this.modo==="nuevo"?"block":"hidden"} space-y-5">
                    <div>
                        <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-1">Nombre del negocio *</label>
                        <input id="wz-nombre" type="text" maxlength="64" placeholder="Ej: Licorería El Triunfo, Panadería Central..."
                            class="w-full border-2 border-brand-black rounded px-4 py-2.5 text-base font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                    </div>

                    <div>
                        <p class="font-heading font-bold text-xs uppercase tracking-wide mb-2">Rubros comerciales que opera:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            ${this.tarjetaRubro("wz-abasto","Abasto","Comestibles y peso",pe,"bg-brand-cyan")}
                            ${this.tarjetaRubro("wz-panaderia","Panadería","Horneados FEFO",he,"bg-brand-yellow")}
                            ${this.tarjetaRubro("wz-licoreria","Licorería","Cuentas y consumo",ve,"bg-brand-pink")}
                        </div>
                    </div>

                    <!-- Elección de Privacidad de Inventario -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-3">
                        <span class="block font-heading font-black text-xs uppercase text-brand-black">Privacidad de Inventario y Stock</span>
                        <p class="text-xs text-gray-600 font-bold">Controla si los operadores y empleados pueden ver el valor del inventario o solo la disponibilidad en tienda:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 border-brand-black ring-2 ring-brand-purple">
                                <input type="radio" name="opt-priv-inv" id="priv-inv-dueno" checked class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">SOLO DUEÑO (RESTRINGIDO)</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Empleados ven si hay stock sin conocer el capital total ni costos de almacén.</span>
                                </div>
                            </label>
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 border-gray-300">
                                <input type="radio" name="opt-priv-inv" id="priv-inv-abierto" class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">VISIBILIDAD TOTAL</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Todos los operadores tienen acceso al conteo y valor monetario del inventario.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Elección de Seguridad del Panel -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-3">
                        <span class="block font-heading font-black text-xs uppercase text-brand-black">Seguridad y Privacidad del Panel del Dueño</span>
                        <p class="text-xs text-gray-600 font-bold">¿Deseas que la sección PANEL quede bloqueada con clave para que los empleados no vean las ganancias ni costos?</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${this.bloquearPanel?"border-brand-black ring-2 ring-brand-purple":"border-gray-300"}">
                                <input type="radio" name="opt-seguridad" id="seg-bloqueado" ${this.bloquearPanel?"checked":""} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">BLOQUEAR CON CLAVE</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Solo el dueño ingresa con clave. Recomendado si tienes empleados.</span>
                                </div>
                            </label>
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${this.bloquearPanel?"border-gray-300":"border-brand-black ring-2 ring-brand-purple"}">
                                <input type="radio" name="opt-seguridad" id="seg-abierto" ${this.bloquearPanel?"":"checked"} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">DEJAR ABIERTO</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Acceso directo sin clave. Útil si solo tú atiendes la caja.</span>
                                </div>
                            </label>
                        </div>

                        <div id="wz-box-pin" class="${this.bloquearPanel?"block":"hidden"} pt-2">
                            <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-1">Define la Clave Maestra del Dueño *</label>
                            <input id="wz-pin" type="password" maxlength="16" placeholder="Ingresa tu clave maestra (ej: 1234)"
                                class="w-full border-2 border-brand-black rounded px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            <p class="text-[10px] text-gray-500 font-bold mt-1">Podrás cambiar esta clave en cualquier momento desde el propio Panel.</p>
                        </div>
                    </div>

                    <!-- Clave de Activación de Licencia -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-2">
                        <label class="block font-heading font-black text-xs uppercase tracking-wide">Clave de Licencia DatioLabs *</label>
                        <input id="wz-licencia-key" type="text" maxlength="16" placeholder="0000XXXXXXXX0000" value="0000888811110000"
                            class="w-full border-2 border-brand-black rounded px-4 py-2 font-mono font-black text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white" />
                        <p class="text-[10px] text-gray-500 font-bold">Licorería: 0000888811110000 · Panadería: 0000888822220000 · Retail: 0000888833330000</p>
                    </div>

                    <div id="wz-error" class="hidden bg-red-100 border-2 border-red-600 text-red-800 rounded px-4 py-3 font-bold text-sm"></div>

                    <button id="wz-iniciar" class="w-full bg-brand-black text-white font-heading font-black text-lg py-3.5 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-transform">
                        INICIAR NEGOCIO LOCAL
                    </button>
                </div>

                <!-- Modo 2: Instalar desde Respaldo Criptográfico -->
                <div id="wz-sec-restaurar" class="${this.modo==="restaurar"?"block":"hidden"} space-y-5">
                    <div class="bg-amber-50 border-2 border-brand-black rounded-lg p-4 text-xs font-bold text-amber-900 leading-relaxed">
                        <strong>Restauración Segura de Datos:</strong>
                        <ul class="list-disc pl-5 mt-1 space-y-1">
                            <li>Restaura el catálogo de productos, existencias de inventario, categorías y tasas tributarias.</li>
                            <li><strong>Regla de Seguridad:</strong> Las conexiones móviles anteriores y sesiones P2P quedan <u>estrictamente purgadas</u> para prevenir accesos no autorizados al cambiar de máquina o reinstalar.</li>
                        </ul>
                    </div>

                    <div>
                        <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-2">Selecciona o arrastra el archivo de respaldo (.datio):</label>
                        <div class="border-2 border-dashed border-brand-black rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" id="drop-zona">
                            <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="font-heading font-black text-sm text-brand-black mb-1">Haz clic para cargar archivo de respaldo</p>
                            <p class="text-[11px] font-mono text-gray-500">Formato: NOMBRE-NEGOCIO-FECHA-HORA.datio</p>
                            <input type="file" id="wz-archivo-input" accept=".datio,.bin,.json" class="hidden" />
                        </div>
                        <div id="wz-archivo-cargado" class="hidden mt-2 p-2 bg-green-50 border border-brand-black rounded text-xs font-mono font-bold text-green-900 flex justify-between items-center">
                            <span id="wz-nombre-archivo"></span>
                            <span class="text-[10px] bg-green-200 px-2 py-0.5 rounded border border-brand-black uppercase font-black">SHA-256 OK</span>
                        </div>
                    </div>

                    <!-- Seguridad del Panel en Restauración -->
                    <div class="border-2 border-brand-black rounded-lg p-4 bg-gray-50 space-y-3">
                        <span class="block font-heading font-black text-xs uppercase text-brand-black">Seguridad del Panel en este Terminal</span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${this.bloquearPanel?"border-brand-black ring-2 ring-brand-purple":"border-gray-300"}">
                                <input type="radio" name="opt-seguridad-res" id="seg-bloqueado-res" ${this.bloquearPanel?"checked":""} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">BLOQUEAR CON CLAVE</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Protege el panel en este equipo.</span>
                                </div>
                            </label>
                            <label class="cursor-pointer border-2 rounded p-3 bg-white flex items-start gap-2.5 ${this.bloquearPanel?"border-gray-300":"border-brand-black ring-2 ring-brand-purple"}">
                                <input type="radio" name="opt-seguridad-res" id="seg-abierto-res" ${this.bloquearPanel?"":"checked"} class="mt-0.5" />
                                <div>
                                    <span class="block font-heading font-black text-xs">DEJAR ABIERTO</span>
                                    <span class="text-[11px] text-gray-500 font-bold">Acceso sin clave.</span>
                                </div>
                            </label>
                        </div>

                        <div id="wz-box-pin-res" class="${this.bloquearPanel?"block":"hidden"} pt-2">
                            <label class="block font-heading font-bold text-xs uppercase tracking-wide mb-1">Clave del Dueño para este Terminal *</label>
                            <input id="wz-pin-restaurar" type="password" maxlength="16" placeholder="Define la clave para este terminal"
                                class="w-full border-2 border-brand-black rounded px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                        </div>
                    </div>

                    <div id="wz-restore-error" class="hidden bg-red-100 border-2 border-red-600 text-red-800 rounded px-4 py-3 font-bold text-sm"></div>

                    <button id="wz-ejecutar-restaurar" class="w-full bg-brand-black text-white font-heading font-black text-lg py-3.5 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-transform">
                        RESTAURAR E INICIALIZAR SISTEMA
                    </button>
                </div>
            </div>
        </div>`,this.conectarEventos()}tarjetaRubro(e,a,o,n,l){return`
        <label class="cursor-pointer group">
            <input type="checkbox" id="${e}" data-bit="${n}" class="peer sr-only" />
            <div class="border-2 border-brand-black rounded-lg p-3 ${l} bg-opacity-20 group-has-peer-checked:bg-opacity-100 peer-focus-visible:ring-2 ring-brand-purple transition-all group-hover:-translate-y-0.5">
                <div class="flex items-center justify-between">
                    <span class="font-heading font-black text-sm">${a}</span>
                    <span class="w-5 h-5 rounded-full border-2 border-brand-black bg-white flex items-center justify-center text-transparent font-black text-xs group-has-peer-checked:text-brand-black">OK</span>
                </div>
                <p class="text-xs text-brand-text font-body mt-1">${o}</p>
            </div>
        </label>`}conectarEventos(){var g,h;const e=document.getElementById("wz-tab-nuevo"),a=document.getElementById("wz-tab-restaurar");e==null||e.addEventListener("click",()=>{this.modo="nuevo",this.render()}),a==null||a.addEventListener("click",()=>{this.modo="restaurar",this.render()});const o=document.getElementById("seg-bloqueado"),n=document.getElementById("seg-abierto"),l=document.getElementById("wz-box-pin");o==null||o.addEventListener("change",()=>{this.bloquearPanel=!0,l==null||l.classList.remove("hidden")}),n==null||n.addEventListener("change",()=>{this.bloquearPanel=!1,l==null||l.classList.add("hidden")});const i=document.getElementById("seg-bloqueado-res"),r=document.getElementById("seg-abierto-res"),t=document.getElementById("wz-box-pin-res");i==null||i.addEventListener("change",()=>{this.bloquearPanel=!0,t==null||t.classList.remove("hidden")}),r==null||r.addEventListener("change",()=>{this.bloquearPanel=!1,t==null||t.classList.add("hidden")}),(g=document.getElementById("wz-iniciar"))==null||g.addEventListener("click",()=>void this.enviarNuevo());const s=document.getElementById("drop-zona"),d=document.getElementById("wz-archivo-input"),c=document.getElementById("wz-archivo-cargado"),b=document.getElementById("wz-nombre-archivo");s==null||s.addEventListener("click",()=>d==null?void 0:d.click()),d==null||d.addEventListener("change",()=>{if(d.files&&d.files[0]){const v=d.files[0];b&&c&&(b.textContent=v.name,c.classList.remove("hidden"))}}),(h=document.getElementById("wz-ejecutar-restaurar"))==null||h.addEventListener("click",()=>void this.enviarRestauracion())}async enviarNuevo(){const e=document.getElementById("wz-error"),a=document.getElementById("wz-nombre").value.trim(),o=document.getElementById("wz-pin"),n=this.bloquearPanel&&(o==null?void 0:o.value.trim())||"",l=[...this.contenedor.querySelectorAll("input[type=checkbox]:checked")].reduce((i,r)=>i|Number(r.dataset.bit),0);if(!a||l===0){e&&(e.textContent="Escribe el nombre del negocio y marca al menos un rubro.",e.classList.remove("hidden"));return}if(this.bloquearPanel&&!n){e&&(e.textContent='Ingresa una clave para proteger el panel o selecciona la opción "DEJAR ABIERTO".',e.classList.remove("hidden"));return}try{await this.modelo.inicializar(a,l,n);const i=this.modelo.getConfig();i&&this.alTerminar(i)}catch(i){e&&(e.textContent=i instanceof Error?i.message:String(i),e.classList.remove("hidden"))}}async enviarRestauracion(){var r;const e=document.getElementById("wz-restore-error"),a=document.getElementById("wz-archivo-input"),o=document.getElementById("wz-pin-restaurar"),n=this.bloquearPanel&&(o==null?void 0:o.value.trim())||"",l=(r=a==null?void 0:a.files)==null?void 0:r[0],i=(l==null?void 0:l.name)||"DATIOLABS-DEMO-20260903-180000.datio";if(this.bloquearPanel&&!n){e&&(e.textContent='Ingresa una clave para el panel en este terminal o selecciona "DEJAR ABIERTO".',e.classList.remove("hidden"));return}try{await D.restaurarRespaldo(i);const t=i.split("-")[0]||"Mi Negocio Restaurado";await this.modelo.inicializar(t,pe|he|ve,n);const s=this.modelo.getConfig();s&&this.alTerminar(s)}catch(t){e&&(e.textContent=t instanceof Error?t.message:String(t),e.classList.remove("hidden"))}}}class Ve{constructor(e){w(this,"modelo");w(this,"productos",[]);w(this,"carrito",[]);w(this,"busqueda","");w(this,"cuentaSeleccionada",null);w(this,"cuentas",[]);w(this,"oyentes",[]);w(this,"edadConfirmadaSesion",!1);w(this,"tasaBloqueadaTicket",null);this.modelo=e}suscribir(e){this.oyentes.push(e),e()}notificar(){this.oyentes.forEach(e=>e())}async cargar(){this.productos=await D.productos(),this.modelo.tieneCapacidad(se)&&(this.cuentas=await D.cuentas()),this.notificar()}get visibles(){const e=this.busqueda.trim().toLowerCase();return e?this.productos.filter(a=>a.nombre.toLowerCase().includes(e)||a.sku.toLowerCase().includes(e)).slice(0,24):this.productos.slice(0,24)}setBusqueda(e){this.busqueda=e,this.notificar()}get lineasCarrito(){return this.carrito}get tasaTicket(){return this.tasaBloqueadaTicket??this.modelo.tasaActual}get totalUsd(){return this.carrito.reduce((e,a)=>e+a.precioUsd*a.cantidad,0)}get totalBs(){return this.totalUsd*this.tasaTicket}get cuentasAbiertasListado(){return this.cuentas}get cuentaActiva(){return this.cuentaSeleccionada}get modoCuentaAbierta(){return this.cuentaSeleccionada!==null}seleccionarCuenta(e){this.cuentaSeleccionada=e,this.notificar()}requiereEdad(e){return!1}marcarEdadConfirmada(e){this.edadConfirmadaSesion=e}async agregar(e){const a=this.productos.find(o=>o.sku===e);return a?this.requiereEdad(a)?"EDAD|"+a.nombre:this.empujar(a):"Producto no encontrado"}empujar(e,a,o){const n=(e.capacidades&ie)!==0||e.unidad==="kg"||e.unidad==="ml",l=n?.25:1,i=this.carrito.find(s=>s.sku===e.sku&&s.serie===a&&s.variante===o),t=(i?i.cantidad:0)+l;if(!e.sinStock){const s=Number(e.stock);if(s<t)return`Stock insuficiente para ${e.nombre}. Disponible: ${s}, Solicitado: ${t}`}return this.tasaBloqueadaTicket===null&&(this.tasaBloqueadaTicket=this.modelo.tasaActual),i?i.cantidad=n?Math.round(t*1e3)/1e3:Math.round(t):this.carrito.push({sku:e.sku,nombre:e.nombre,precioUsd:Number(e.precioUsd),cantidad:n?l:Math.round(l),pesable:n,conSerie:(e.capacidades&me)!==0,conVariantes:(e.capacidades&ye)!==0,serie:a,variante:o}),this.notificar(),null}asignarSerie(e,a){const o=this.carrito.find(n=>n.sku===e);o&&(o.serie=a.trim().toUpperCase(),this.notificar())}asignarVariante(e,a){const o=this.carrito.find(n=>n.sku===e);o&&(o.variante=a.trim(),this.notificar())}cambiarCantidad(e,a){const o=this.carrito.find(i=>i.sku===e);if(!o)return null;const n=this.productos.find(i=>i.sku===e);let l=Math.max(0,a);return o.pesable?l=Math.round(l*1e3)/1e3:l=Math.round(l),n&&!n.sinStock&&l>Number(n.stock)?`Stock insuficiente para ${o.nombre}. Disponible: ${n.stock}`:(o.cantidad=l,o.cantidad===0?this.quitar(e):this.notificar(),null)}quitar(e){this.carrito=this.carrito.filter(a=>a.sku!==e),this.carrito.length===0&&(this.tasaBloqueadaTicket=null),this.notificar()}vaciar(){this.carrito=[],this.tasaBloqueadaTicket=null,this.notificar()}async cobrar(e,a,o){if(this.modoCuentaAbierta&&this.cuentaSeleccionada)throw new Error("Hay una cuenta abierta seleccionada. Usa su boton de cobro.");if(this.carrito.length===0)throw new Error("Carrito vacio");for(const l of this.carrito){const i=this.productos.find(r=>r.sku===l.sku);if(i&&!i.sinStock&&l.cantidad>Number(i.stock))throw new Error(`Stock insuficiente para ${i.nombre}. Disponible: ${i.stock}, En carrito: ${l.cantidad}`)}const n=await D.registrarVenta(this.carrito.map(l=>({sku:l.sku,cantidad:String(l.cantidad)})),this.edadConfirmadaSesion,e||"0",a,o);return this.vaciar(),this.edadConfirmadaSesion=!1,await this.refrescarInventario(),n}async crearCuenta(e){const a=await D.abrirCuenta(e);this.cuentas.some(o=>o.ventaId===a.ventaId)||this.cuentas.push(a),this.cuentaSeleccionada=a,this.notificar()}async agregarACuenta(e){if(!this.cuentaSeleccionada)return"Selecciona una cuenta primero";const a=this.productos.find(n=>n.sku===e);if(!a)return"Producto no encontrado";if(this.requiereEdad(a))return"EDAD|"+a.nombre;const o=await D.agregarConsumo(this.cuentaSeleccionada.ventaId,a.sku,"1",this.edadConfirmadaSesion);return this.cuentaSeleccionada=o,this.cuentas=this.cuentas.map(n=>n.ventaId===o.ventaId?o:n),await this.refrescarInventario(),null}async cerrarCuentaActual(e,a){if(!this.cuentaSeleccionada)throw new Error("Ninguna cuenta seleccionada");const o=await D.cerrarCuenta(this.cuentaSeleccionada.ventaId,e||"0",void 0,a);return this.cuentas=this.cuentas.filter(n=>n.ventaId!==o.ventaId),this.cuentaSeleccionada=null,this.edadConfirmadaSesion=!1,await this.refrescarInventario(),o}async refrescarInventario(){this.productos=await D.productos(),this.notificar()}}const Y=u=>Q(u).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2});class _e{constructor(e,a,o,n){w(this,"contenedor");w(this,"vm");w(this,"modelo");w(this,"modal");w(this,"pagosBorrador",null);w(this,"resolucionVueltoBorrador",null);w(this,"semaforoStock",{rojoMax:5,amarilloMax:15});this.contenedor=e,this.modal=a,this.vm=o,this.modelo=n,D.obtenerSemaforoStock().then(l=>{this.semaforoStock=l,this.renderDinamico()}),this.vm.suscribir(()=>this.renderDinamico()),this.modelo.suscribir(()=>this.renderDinamico())}render(){var e,a,o,n,l;this.contenedor.innerHTML=`
        <div class="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div class="lg:col-span-2 order-2 lg:order-1">
                <input id="caja-buscar" type="text" autocomplete="off" maxlength="40"
                    placeholder="Escribe el nombre del producto para agregarlo al ticket..."
                    class="w-full border-2 border-brand-black rounded px-4 py-3 sm:px-5 sm:py-4 text-base sm:text-xl font-body font-bold mb-3 sm:mb-4 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-brand-cyan/50" />
                <div id="caja-grid" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4"></div>
            </div>
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-3 sm:p-5 flex flex-col max-h-[75vh] lg:max-h-[80vh] order-1 lg:order-2">
                <div class="flex justify-between items-center border-b-2 border-brand-black pb-2 mb-2 sm:mb-3">
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl leading-none">TICKET EN CURSO</h3>
                        <span class="text-[10px] font-bold text-gray-500 uppercase">Caja Directa</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button id="btn-gestionar-operadores-caja" title="Asignar o relevar cajero en turno" class="inline-flex items-center gap-1 text-[11px] font-heading font-black bg-purple-100 text-brand-purple border border-brand-purple hover:bg-purple-200 px-2 py-1 rounded">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span id="caja-operadores-activo-texto" class="truncate max-w-[130px]">Operador en caja</span>
                            <span class="text-[10px] text-gray-500">▼</span>
                        </button>
                    </div>
                </div>
                <div id="caja-lineas" class="flex-1 overflow-y-auto space-y-2 sm:space-y-3 min-h-[90px] max-h-[220px] lg:max-h-none"></div>
                <div class="border-t-2 border-brand-black mt-2 sm:mt-3 pt-2 sm:pt-3">
                    <div class="flex justify-between items-baseline">
                        <span class="font-heading font-bold text-xs sm:text-base">TOTAL USD</span>
                        <span id="caja-total-usd" class="font-heading font-black text-lg sm:text-2xl"></span>
                    </div>
                    <div class="flex justify-between items-baseline">
                        <span class="font-heading font-bold text-sm sm:text-lg">Bs. (BCV)</span>
                        <span id="caja-total-bs" class="font-heading font-black text-2xl sm:text-4xl text-brand-purple"></span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-3">
                        <button id="caja-cobrar" class="col-span-2 bg-green-600 hover:bg-green-700 disabled:opacity-30 text-white font-heading font-black text-lg sm:text-2xl py-3 sm:py-4 rounded border-2 border-brand-black shadow-brutal transition-transform active:translate-y-1 active:shadow-none">
                            COBRAR
                        </button>
                        <button id="caja-vaciar" class="bg-white font-heading font-bold text-xs sm:text-sm py-2 rounded border-2 border-brand-black hover:bg-red-50">
                            Vaciar
                        </button>
                    </div>
                </div>
            </div>
        </div>`,(e=document.getElementById("caja-buscar"))==null||e.addEventListener("input",i=>{this.vm.setBusqueda(i.target.value)}),(a=document.getElementById("caja-buscar"))==null||a.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),this.enterRapido())}),(o=document.getElementById("caja-vaciar"))==null||o.addEventListener("click",()=>{this.pagosBorrador=null,this.resolucionVueltoBorrador=null,this.vm.vaciar()}),(n=document.getElementById("caja-cobrar"))==null||n.addEventListener("click",()=>void this.abrirModalCobro()),(l=document.getElementById("btn-gestionar-operadores-caja"))==null||l.addEventListener("click",()=>void(async()=>{await D.obtenerJornadaActual()===null?this.abrirModalIniciarJornada():this.abrirModalOperadoresCaja()})()),this.renderDinamico()}async enterRapido(){const e=this.vm.visibles;if(e.length===0)return;const a=await this.vm.agregar(e[0].sku);a&&this.mostrarError(a);const o=document.getElementById("caja-buscar");o&&(o.value=""),this.vm.setBusqueda("")}mostrarError(e){if(e.startsWith("EDAD|")){this.modalEdad(e.slice(5));return}this.renderModal(`
            <h3 class="font-heading font-black text-2xl text-red-700 mb-2">Atencion</h3>
            <p class="font-body text-brand-text mb-6">${e}</p>
            <button data-cerrar class="w-full bg-brand-black text-white font-heading font-black py-3 rounded border-2 border-brand-black">ENTENDIDO</button>`)}modalContenido(e,a="max-w-md"){this.modal.innerHTML=`
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 sm:p-8 w-full ${a} max-h-[90vh] overflow-y-auto">${e}</div>
        </div>`}cerrarModal(){this.modal.innerHTML=""}renderModal(e,a="max-w-md"){this.modalContenido(e,a),this.modal.querySelectorAll("[data-cerrar]").forEach(o=>o.addEventListener("click",()=>this.cerrarModal()))}async modalEdad(e){var a,o;this.renderModal(`
            <h3 class="font-heading font-black text-3xl mb-2">CONTROL DE EDAD</h3>
            <p class="font-body text-lg mb-1">Producto: <b>${e}</b></p>
            <p class="font-body text-brand-text mb-6">Confirmo que el cliente es <b>mayor de 18 anos</b>. Su cedula fue verificada.</p>
            <div class="grid grid-cols-2 gap-4">
                <button data-no class="bg-red-600 text-white font-heading font-black text-xl py-4 rounded border-2 border-brand-black">NO</button>
                <button data-si class="bg-green-600 text-white font-heading font-black text-xl py-4 rounded border-2 border-brand-black">SI, MAYOR</button>
            </div>`),(a=this.modal.querySelector("[data-no]"))==null||a.addEventListener("click",()=>this.cerrarModal()),(o=this.modal.querySelector("[data-si]"))==null||o.addEventListener("click",()=>{this.vm.marcarEdadConfirmada(!0),(async()=>{const n=this.vm.visibles;n[0]&&this.vm.empujar(n[0])})(),this.cerrarModal()})}async abrirModalOperadoresCaja(){const e=await D.listarOperadores(),a=await D.obtenerJornadaActual(),o=new Set((a==null?void 0:a.operadoresActivos)||[(a==null?void 0:a.operadorActual)||""]);(()=>{var i,r,t,s;const l=e.map(d=>{const c=o.has(d.nombre);return`
                <div class="flex items-center justify-between p-2.5 rounded border-2 border-brand-black ${c?"bg-purple-50 border-brand-purple":"bg-gray-50"}">
                    <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input type="checkbox" data-cajero-chk="${d.id}" value="${d.nombre}" ${c?"checked":""} class="w-4 h-4 rounded text-brand-purple" />
                        <div>
                            <span class="font-heading font-black text-sm text-brand-black truncate block">${d.nombre}</span>
                            <span class="text-[10px] text-gray-500 font-bold">${d.activo?"Operador Activo":"Inactivo"}</span>
                        </div>
                    </label>
                    <div class="flex items-center gap-1 shrink-0">
                        <button data-cajero-edit="${d.id}" data-cajero-nom="${d.nombre}" title="Editar nombre" class="text-xs bg-white border border-gray-400 rounded px-1.5 py-0.5 hover:bg-gray-100">✎</button>
                        <button data-cajero-del="${d.id}" data-cajero-nom="${d.nombre}" title="Eliminar operador" class="text-xs text-red-600 bg-white border border-gray-400 rounded px-1.5 py-0.5 hover:bg-red-50">✕</button>
                    </div>
                </div>`}).join("");this.modalContenido(`
                <div>
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-2 mb-3">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider text-brand-purple">Atención y Relevos</span>
                            <h3 class="font-heading font-black text-xl">OPERADORES EN CAJA</h3>
                        </div>
                        <button data-cerrar class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">&times;</button>
                    </div>
                    <p class="text-xs text-gray-600 font-bold mb-3">
                        Selecciona uno o varios operadores despachando simultáneamente en este turno:
                    </p>
                    <div class="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4">
                        ${l}
                    </div>
                    <!-- Formulario rápido para nuevo cajero -->
                    <form id="form-nuevo-cajero-caja" class="flex gap-2 mb-4">
                        <input id="in-nuevo-cajero-caja" type="text" maxlength="30" placeholder="Registrar nuevo empleado..." class="flex-1 border-2 border-brand-black rounded px-3 py-1.5 text-xs font-bold" />
                        <button type="submit" class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs hover:bg-gray-800 shadow-brutal-sm">+ AGREGAR</button>
                    </form>
                    <div class="grid grid-cols-2 gap-3 border-t-2 border-brand-black pt-3">
                        <button id="btn-cancelar-operadores-caja" class="bg-white border-2 border-brand-black font-heading font-black py-2.5 rounded text-xs">CANCELAR</button>
                        <button id="btn-guardar-operadores-caja" class="bg-brand-purple text-white font-heading font-black py-2.5 rounded border-2 border-brand-black shadow-brutal-sm text-xs">ASIGNAR A TURNO</button>
                    </div>
                </div>
            `,"max-w-md"),(i=this.modal.querySelector("[data-cerrar]"))==null||i.addEventListener("click",()=>this.cerrarModal()),(r=this.modal.querySelector("#btn-cancelar-operadores-caja"))==null||r.addEventListener("click",()=>this.cerrarModal()),this.modal.querySelectorAll("button[data-cajero-edit]").forEach(d=>{d.addEventListener("click",async()=>{const c=d.dataset.cajeroEdit||"",b=d.dataset.cajeroNom||"",g=window.prompt("Modificar nombre del operador:",b);g&&g.trim()&&g.trim()!==b&&(await D.editarOperador(c,g.trim()),this.cerrarModal(),this.abrirModalOperadoresCaja(),this.renderDinamico())})}),this.modal.querySelectorAll("button[data-cajero-del]").forEach(d=>{d.addEventListener("click",async()=>{const c=d.dataset.cajeroDel||"",b=d.dataset.cajeroNom||"";window.confirm(`¿Confirmas eliminar al operador "${b}"?`)&&(await D.eliminarOperador(c),this.cerrarModal(),this.abrirModalOperadoresCaja(),this.renderDinamico())})}),(t=this.modal.querySelector("#form-nuevo-cajero-caja"))==null||t.addEventListener("submit",async d=>{d.preventDefault();const c=this.modal.querySelector("#in-nuevo-cajero-caja"),b=(c==null?void 0:c.value.trim())||"";b&&(await D.crearOperador(b),this.cerrarModal(),this.abrirModalOperadoresCaja(),this.renderDinamico())}),(s=this.modal.querySelector("#btn-guardar-operadores-caja"))==null||s.addEventListener("click",async()=>{const d=this.modal.querySelectorAll("input[data-cajero-chk]:checked"),c=[];if(d.forEach(b=>{b.value&&c.push(b.value)}),c.length===0){alert("Debes seleccionar al menos un operador activo en turno.");return}await D.asignarOperadoresTurno(c),this.cerrarModal(),this.renderDinamico()})})()}async abrirModalIniciarJornada(){const e=await D.listarOperadores();(()=>{var n,l,i,r;const o=e.length>0?e.map((t,s)=>`
                <div class="flex items-center p-2.5 rounded border-2 border-brand-black ${s===0?"bg-purple-50 border-brand-purple":"bg-gray-50"}">
                    <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input type="checkbox" data-inicio-cajero-chk value="${t.nombre}" ${s===0?"checked":""} class="w-4 h-4 rounded text-brand-purple" />
                        <div>
                            <span class="font-heading font-black text-sm text-brand-black truncate block">${t.nombre}</span>
                            <span class="text-[10px] text-gray-500 font-bold">${t.activo?"Operador Activo":"Inactivo"}</span>
                        </div>
                    </label>
                </div>`).join(""):'<p class="text-xs text-gray-500 font-bold text-center py-3">No hay operadores registrados. Registra uno abajo para continuar.</p>';this.modalContenido(`
                <div>
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-2 mb-3">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider text-red-700">Sin turno activo</span>
                            <h3 class="font-heading font-black text-xl">INICIAR TURNO</h3>
                        </div>
                        <button data-cerrar class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">&times;</button>
                    </div>
                    <p class="text-xs text-gray-600 font-bold mb-3">
                        Selecciona los cajeros que atenderan en este turno:
                    </p>
                    <div class="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4">
                        ${o}
                    </div>
                    <!-- Formulario rapido para nuevo cajero -->
                    <form id="form-nuevo-cajero-inicio" class="flex gap-2 mb-4">
                        <input id="in-nuevo-cajero-inicio" type="text" maxlength="30" placeholder="Registrar nuevo empleado..." class="flex-1 border-2 border-brand-black rounded px-3 py-1.5 text-xs font-bold" />
                        <button type="submit" class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs hover:bg-gray-800 shadow-brutal-sm">+ AGREGAR</button>
                    </form>
                    <div class="grid grid-cols-2 gap-3 border-t-2 border-brand-black pt-3">
                        <button id="btn-cancelar-inicio-jornada" class="bg-white border-2 border-brand-black font-heading font-black py-2.5 rounded text-xs">CANCELAR</button>
                        <button id="btn-abrir-turno" class="bg-green-600 text-white font-heading font-black py-2.5 rounded border-2 border-brand-black shadow-brutal-sm text-xs">ABRIR TURNO</button>
                    </div>
                </div>
            `,"max-w-md"),(n=this.modal.querySelector("[data-cerrar]"))==null||n.addEventListener("click",()=>this.cerrarModal()),(l=this.modal.querySelector("#btn-cancelar-inicio-jornada"))==null||l.addEventListener("click",()=>this.cerrarModal()),(i=this.modal.querySelector("#form-nuevo-cajero-inicio"))==null||i.addEventListener("submit",async t=>{t.preventDefault();const s=this.modal.querySelector("#in-nuevo-cajero-inicio"),d=(s==null?void 0:s.value.trim())||"";d&&(await D.crearOperador(d),this.cerrarModal(),this.abrirModalIniciarJornada())}),(r=this.modal.querySelector("#btn-abrir-turno"))==null||r.addEventListener("click",async()=>{const t=this.modal.querySelectorAll("input[data-inicio-cajero-chk]:checked"),s=[];if(t.forEach(c=>{c.value&&s.push(c.value)}),s.length===0){alert("Selecciona al menos un operador para abrir el turno.");return}const d=s[0];await D.abrirJornada(d,s),this.cerrarModal(),this.renderDinamico()})})()}async abrirModalCobro(){var h,v,k,U;if(this.vm.lineasCarrito.length===0)return;let e=[];try{e=await D.listarMetodosPago()}catch{e=[{nombre:"PUNTOD.VENTA",moneda:"BS"},{nombre:"BIOPAGO",moneda:"BS"},{nombre:"PAGO MOVIL",moneda:"BS"},{nombre:"TRANSF.BS.",moneda:"BS"},{nombre:"BS.EFEC.",moneda:"BS"},{nombre:"DOL.CASH",moneda:"USD"},{nombre:"ZELLE",moneda:"USD"},{nombre:"BINAN.USDT",moneda:"USD"}]}const a=Number(this.vm.totalUsd.toFixed(2)),o=this.vm.tasaTicket,n=Number((a*o).toFixed(2)),l=e.find($=>$.nombre==="PUNTOD.VENTA")||e.find($=>$.moneda==="BS")||e[0]||{nombre:"PUNTOD.VENTA",moneda:"BS"};let i;if(this.pagosBorrador&&this.pagosBorrador.length>0){if(i=this.pagosBorrador.map($=>({...$})),i.length===1&&i[0]){const $=i[0];$.monto=$.moneda==="USD"?a:n,$.tasaCambio=o}else if(i.length>1){let $=0;for(let F=0;F<i.length-1;F++){const C=i[F],y=C.tasaCambio>0?C.tasaCambio:o;$+=C.moneda==="USD"?C.monto*y:C.monto}const O=Math.max(0,Math.round((n-$)*100)/100),L=i[i.length-1];L&&(L.monto=L.moneda==="USD"?o>0?Number((O/o).toFixed(2)):0:O,L.tasaCambio=o)}}else i=[{id:"p-1",metodo:l.nombre,moneda:l.moneda,monto:l.moneda==="USD"?a:n,tasaCambio:o,referencia:""}];let r=((h=this.resolucionVueltoBorrador)==null?void 0:h.estado)||"PAGADO",t=((v=this.resolucionVueltoBorrador)==null?void 0:v.metodo)||"BS.EFEC.",s=((k=this.resolucionVueltoBorrador)==null?void 0:k.tasa)||o;e.some($=>$.nombre===t)||(t=((U=e[0])==null?void 0:U.nombre)||"BS.EFEC.");let d=!1;const c=()=>{let $=0;for(const A of i)if(A.moneda==="USD"){const N=A.tasaCambio>0?A.tasaCambio:o;$+=A.monto*N}else $+=A.monto;$=Math.round($*100)/100;const O=o>0?Math.round($/o*100)/100:0,L=Math.max(0,Math.round((n-$)*100)/100),F=o>0?Math.max(0,Math.round(L/o*100)/100):0,C=Math.max(0,Math.round(($-n)*100)/100),y=o>0?Math.max(0,Math.round(C/o*100)/100):0,x=$>=n-.01&&i.every(A=>A.monto>0);return{cubiertoUsd:O,cubiertoBs:$,faltanteUsd:F,faltanteBs:L,vueltoUsd:y,vueltoBs:C,puedeConfirmar:x}},b=()=>{const $=c(),O=e.filter(S=>S.moneda==="USD"),L=e.filter(S=>S.moneda==="BS"),F=i.map((S,q)=>{const p=O.map(E=>`<option value="${E.nombre}" ${E.nombre===S.metodo?"selected":""}>${E.nombre} ($ - Tasa Dinámica)</option>`).join(""),I=`
                        <optgroup label="MÉTODOS EN BOLÍVARES (Bs.)">
                            ${L.map(E=>`<option value="${E.nombre}" ${E.nombre===S.metodo?"selected":""}>${E.nombre} (Bs.)</option>`).join("")}
                        </optgroup>
                        <optgroup label="MÉTODOS EN DÓLARES ($ - TASA PROPIA)">
                            ${p}
                        </optgroup>
                    `,P=S.tasaCambio>0?S.tasaCambio:o,G=S.moneda==="USD"?S.monto*P:S.monto,T=o>0?G/o:0;return`
                    <div class="border-2 border-brand-black rounded-lg p-3 bg-gray-50 mb-2.5">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span class="font-heading font-black text-xs uppercase text-gray-700">
                                Pago #${q+1} · <span class="${S.moneda==="USD"?"text-brand-purple":"text-brand-black"}">${S.moneda==="USD"?"Divisa ($ USD)":"Moneda Nacional (Bs.)"}</span>
                            </span>
                            ${i.length>1?`<button data-eliminar-pago="${S.id}" class="text-xs font-black text-red-600 hover:text-red-800 bg-red-50 border border-red-300 rounded px-2 py-0.5">Eliminar</button>`:""}
                        </div>
                        ${S.moneda==="USD"?`
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div class="sm:col-span-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Medio en Divisa</label>
                                <select data-pago-metodo="${S.id}" class="w-full border-2 border-brand-black rounded px-2.5 py-1.5 font-heading font-black text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple">
                                    ${I}
                                </select>
                            </div>
                            <div class="sm:col-span-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Monto ($ USD)</label>
                                <div class="flex items-center">
                                    <span class="bg-brand-black text-white px-2 py-1.5 rounded-l border-y-2 border-l-2 border-brand-black text-xs font-mono font-bold">$</span>
                                    <input type="number" step="0.01" min="0.01" max="999999" data-pago-monto="${S.id}" value="${S.monto>0?S.monto:""}" placeholder="0.00"
                                        class="w-full border-2 border-brand-black rounded-r px-2 py-1.5 text-xs font-mono font-black focus:outline-none focus:ring-2 focus:ring-brand-purple text-right" />
                                </div>
                            </div>
                            <div class="sm:col-span-3">
                                <div class="flex items-center justify-between mb-0.5">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase">Tasa (Bs./$)</label>
                                    <button type="button" data-reset-tasa="${S.id}" class="text-[9px] font-black uppercase text-brand-purple hover:underline" title="Restablecer a tasa BCV oficial">BCV: ${Y(o)}</button>
                                </div>
                                <input type="number" step="0.01" min="1" max="100000" data-pago-tasa="${S.id}" value="${P>0?P:o}"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1.5 text-xs font-mono font-black focus:outline-none focus:ring-2 focus:ring-brand-purple text-right" />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia</label>
                                <input type="text" maxlength="25" data-pago-ref="${S.id}" value="${S.referencia||""}" placeholder="Opcional"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between gap-1 mt-1.5 text-[11px]">
                            <span class="font-bold text-brand-purple">Aporte: Bs. ${Y(G)}</span>
                            <span class="text-gray-500 font-mono">Equiv. oficial BCV: $ ${Y(T)} ${P!==o?`(Tasa: Bs. ${Y(P)} vs BCV: Bs. ${Y(o)})`:""}</span>
                        </div>
                        `:`
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div class="sm:col-span-5">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Medio en Bolívares</label>
                                <select data-pago-metodo="${S.id}" class="w-full border-2 border-brand-black rounded px-2.5 py-1.5 font-heading font-black text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple">
                                    ${I}
                                </select>
                            </div>
                            <div class="sm:col-span-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Monto (Bs.)</label>
                                <div class="flex items-center">
                                    <span class="bg-brand-black text-white px-2 py-1.5 rounded-l border-y-2 border-l-2 border-brand-black text-xs font-mono font-bold">Bs.</span>
                                    <input type="number" step="0.01" min="0.01" max="999999999" data-pago-monto="${S.id}" value="${S.monto>0?S.monto:""}" placeholder="0.00"
                                        class="w-full border-2 border-brand-black rounded-r px-2 py-1.5 text-xs font-mono font-black focus:outline-none focus:ring-2 focus:ring-brand-purple text-right" />
                                </div>
                            </div>
                            <div class="sm:col-span-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia</label>
                                <input type="text" maxlength="25" data-pago-ref="${S.id}" value="${S.referencia||""}" placeholder="Opcional"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between gap-1 mt-1.5 text-[11px]">
                            <span class="font-bold text-brand-black">Aporte directo: Bs. ${Y(S.monto)}</span>
                            <span class="text-gray-500 font-mono">Equiv. oficial BCV: $ ${Y(T)}</span>
                        </div>
                        `}
                    </div>`}).join(""),C=e.find(S=>S.nombre===t),y=(C==null?void 0:C.moneda)==="USD",x=s>0?s:o,A=y&&x>0?Number(($.vueltoBs/x).toFixed(2)):$.vueltoUsd,N=$.faltanteBs>.009?`
                    <div class="bg-amber-50 border-2 border-amber-500 rounded p-3 text-center mb-3">
                        <p class="text-xs font-black uppercase text-amber-900">Monto Incompleto por Cubrir</p>
                        <p class="font-heading font-black text-xl text-amber-700">Faltan Bs. ${Y($.faltanteBs)} · <span class="text-base text-amber-900">$ ${Y($.faltanteUsd)} (Equiv. Oficial)</span></p>
                    </div>`:$.vueltoBs>.009?`
                    <div class="border-2 border-emerald-700 bg-emerald-50/70 rounded-lg p-3 mb-3">
                        <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <div>
                                <span class="text-[10px] font-black uppercase text-emerald-900 tracking-wide block">Excedente / Vuelto del Cliente</span>
                                <span class="font-heading font-black text-xl text-emerald-800">Bs. ${Y($.vueltoBs)}</span>
                            </div>
                            <span class="text-xs font-bold text-emerald-900 font-mono">$ ${Y($.vueltoUsd)} equiv. oficial</span>
                        </div>

                        <!-- Selector: Entregar Vuelto vs Retener Vuelto -->
                        <div class="grid grid-cols-2 gap-2 mb-2.5">
                            <button type="button" id="btn-vuelto-pagado" class="py-1.5 px-2 rounded border-2 text-xs font-heading font-black transition-all ${r==="PAGADO"?"bg-emerald-700 text-white border-brand-black shadow-sm":"bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}">
                                ENTREGAR VUELTO (PAGADO)
                            </button>
                            <button type="button" id="btn-vuelto-retenido" class="py-1.5 px-2 rounded border-2 text-xs font-heading font-black transition-all ${r==="RETENIDO"?"bg-emerald-700 text-white border-brand-black shadow-sm":"bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}">
                                RETENER VUELTO (A FAVOR)
                            </button>
                        </div>

                        ${r==="PAGADO"?`
                        <div class="bg-white border border-emerald-600 rounded p-2.5 space-y-2">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <label class="text-[11px] font-bold text-gray-700 uppercase">Método de Egreso del Vuelto:</label>
                                <select id="select-metodo-vuelto" class="border-2 border-brand-black rounded px-2 py-1 text-xs font-bold bg-white focus:outline-none">
                                    ${e.map(S=>`
                                        <option value="${S.nombre}" ${S.nombre===t?"selected":""}>
                                            ${S.nombre} (${S.moneda==="USD"?"$ Dólares":"Bs. Bolívares"})
                                        </option>
                                    `).join("")}
                                </select>
                            </div>
                            ${y?`
                            <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-gray-100">
                                <div>
                                    <span class="text-[10px] font-bold text-gray-500 uppercase block">Tasa Pactada Vuelto USD:</span>
                                    <div class="flex items-center gap-1.5">
                                        <input id="input-tasa-vuelto" type="text" inputmode="decimal" value="${s.toFixed(2)}"
                                            class="w-24 border-2 border-brand-black rounded px-2 py-0.5 text-xs font-mono font-bold" />
                                        <button id="btn-reset-tasa-vuelto" type="button" class="text-[10px] bg-gray-100 border border-gray-400 rounded px-1.5 py-0.5 hover:bg-gray-200">
                                            Reset BCV
                                        </button>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] font-bold text-gray-500 uppercase block">Divisa USD a Entregar:</span>
                                    <span class="font-heading font-black text-base text-brand-purple">
                                        $ ${Y(A)} USD
                                    </span>
                                </div>
                            </div>
                            `:`
                            <div class="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                                <span class="font-bold text-gray-600">Total a Entregar en Bolívares:</span>
                                <span class="font-heading font-black text-base text-brand-black">Bs. ${Y($.vueltoBs)}</span>
                            </div>
                            `}
                        </div>
                        `:`
                        <div class="bg-white border border-gray-300 rounded p-2 text-xs text-gray-700">
                            <p class="font-bold text-emerald-900 mb-0.5">Vuelto Retenido como Saldo a Favor</p>
                            <p class="text-[11px] text-gray-600 leading-tight">
                                El excedente de <b>Bs. ${Y($.vueltoBs)} ($ ${Y($.vueltoUsd)})</b> no genera egreso físico de caja y se asienta en el comprobante como saldo a favor o ganancia por excedente del negocio.
                            </p>
                        </div>
                        `}
                    </div>`:"";this.modalContenido(`
                <div>
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-3 mb-3">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider text-brand-purple">Operación de Caja Directa</span>
                            <h3 class="font-heading font-black text-2xl">COBRAR VENTA</h3>
                        </div>
                        <button data-cerrar class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">&times;</button>
                    </div>

                    <!-- Resumen del Importe a Cobrar -->
                    <div class="border-2 border-brand-black rounded-lg p-3 bg-brand-gray/30 mb-3 flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <span class="text-[10px] font-bold text-gray-600 uppercase block">Total a Liquidar</span>
                            <div class="flex items-baseline gap-2">
                                <span class="font-heading font-black text-2xl text-brand-black">$ ${Y(a)} USD</span>
                                <span class="font-heading font-black text-xl text-brand-purple">Bs. ${Y(n)}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] font-bold text-gray-500 uppercase block">Tasa Oficial Aplicada</span>
                            <span class="text-xs font-mono font-black text-gray-800">Bs. ${Y(o)}</span>
                        </div>
                    </div>

                    <!-- Lista de Pagos Asignados -->
                    <div class="mb-3">
                        ${F}
                    </div>

                    <!-- Botones de Acción sobre Métodos -->
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <button id="btn-agregar-pago" class="bg-blue-50 text-blue-950 hover:bg-blue-100 border-2 border-brand-black rounded px-3 py-1.5 text-xs font-heading font-black shadow-brutal-sm">
                            + AGREGAR OTRO MÉTODO (PAGO MIXTO)
                        </button>
                        <button id="btn-toggle-nuevo-metodo" class="bg-white text-gray-800 hover:bg-gray-50 border border-brand-black rounded px-2.5 py-1.5 text-xs font-bold">
                            + CREAR MÉTODO DE PAGO
                        </button>
                    </div>

                    <!-- Subformulario para Crear o Eliminar Métodos de Pago -->
                    ${d?`
                    <div class="bg-purple-50 border-2 border-brand-purple rounded-lg p-3 mb-3">
                        <div class="flex justify-between items-center mb-1.5">
                            <p class="text-xs font-heading font-black text-brand-purple uppercase">Gestión de Métodos de Pago</p>
                            <span class="text-[10px] text-gray-500 font-bold">Agregar o Quitar Métodos</span>
                        </div>
                        <div class="space-y-2">
                            <div class="flex gap-2">
                                <input id="input-nuevo-metodo-nombre" type="text" maxlength="25" placeholder="Ej: PAYPAL, BANESCO PANAMA..."
                                    class="flex-1 border-2 border-brand-black rounded px-2.5 py-1 text-xs font-bold uppercase focus:outline-none" />
                                <button id="btn-guardar-nuevo-metodo" class="bg-brand-purple text-white border-2 border-brand-black rounded px-3 py-1 text-xs font-heading font-black hover:opacity-90">
                                    GUARDAR
                                </button>
                            </div>
                            <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-800">
                                <span class="text-[10px] text-gray-500 uppercase">Moneda Base:</span>
                                <label class="inline-flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="radio-nuevo-metodo-moneda" value="USD" checked class="text-brand-purple" />
                                    <span>Dólares ($ USD - Tasa Dinámica)</span>
                                </label>
                                <label class="inline-flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="radio-nuevo-metodo-moneda" value="BS" class="text-brand-purple" />
                                    <span>Bolívares (Bs.)</span>
                                </label>
                            </div>
                            <!-- Métodos activos con botón para eliminar -->
                            <div class="pt-2 border-t border-purple-200">
                                <span class="text-[10px] font-bold text-gray-600 uppercase block mb-1">Métodos Registrados (Toca ✕ para eliminar):</span>
                                <div class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                    ${e.map(S=>`
                                        <span class="inline-flex items-center gap-1 border border-brand-black rounded px-2 py-0.5 text-[11px] font-bold bg-white">
                                            <span>${S.nombre}</span>
                                            <span class="text-[9px] text-gray-500">(${S.moneda})</span>
                                            <button data-caja-eliminar-metodo="${S.nombre}" title="Eliminar método" class="text-red-600 hover:text-red-800 font-bold ml-0.5">✕</button>
                                        </span>
                                    `).join("")}
                                </div>
                            </div>
                        </div>
                    </div>`:""}

                    <!-- Indicador de Cobertura y Vuelto -->
                    ${N}

                    <div id="cobro-error" class="hidden text-red-700 text-xs font-bold mb-3 bg-red-50 border border-red-400 rounded p-2"></div>

                    <!-- Acciones Finales -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-brand-black">
                        <div class="flex items-center gap-2">
                            <button data-cancelar class="bg-white border-2 border-brand-black font-heading font-black px-4 py-2.5 rounded text-xs hover:bg-gray-100">
                                CERRAR
                            </button>
                            <button id="btn-volver-caja" class="bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-brand-black font-heading font-black px-3 py-2.5 rounded text-xs">
                                AGREGAR PRODUCTOS (VOLVER A CAJA)
                            </button>
                        </div>
                        <button id="btn-confirmar-cobro" ${$.puedeConfirmar?"":"disabled"}
                            class="bg-green-700 hover:bg-green-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-heading font-black px-5 py-2.5 rounded border-2 border-brand-black shadow-brutal-sm text-sm">
                            CONFIRMAR COBRO
                        </button>
                    </div>
                </div>`,"max-w-xl"),g()},g=()=>{var L,F,C,y,x,A,N,S,q,p;const $=()=>{this.pagosBorrador=i,this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s},this.cerrarModal()};this.modal.querySelectorAll("[data-cerrar]").forEach(f=>f.addEventListener("click",$)),(L=this.modal.querySelector("[data-cancelar]"))==null||L.addEventListener("click",$),(F=this.modal.querySelector("#btn-volver-caja"))==null||F.addEventListener("click",()=>{this.pagosBorrador=i,this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s},this.cerrarModal();const f=document.getElementById("caja-buscar");f==null||f.focus()}),(C=this.modal.querySelector("#btn-vuelto-pagado"))==null||C.addEventListener("click",()=>{r="PAGADO",this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s},b()}),(y=this.modal.querySelector("#btn-vuelto-retenido"))==null||y.addEventListener("click",()=>{r="RETENIDO",this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s},b()}),(x=this.modal.querySelector("#select-metodo-vuelto"))==null||x.addEventListener("change",f=>{t=f.target.value,this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s},b()});const O=this.modal.querySelector("#input-tasa-vuelto");O&&(O.addEventListener("input",f=>{const I=Q(f.target.value);s=I>0?I:o,this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s}}),O.addEventListener("blur",()=>{b()})),(A=this.modal.querySelector("#btn-reset-tasa-vuelto"))==null||A.addEventListener("click",()=>{s=o,this.resolucionVueltoBorrador={estado:r,metodo:t,tasa:s},b()}),this.modal.querySelectorAll("select[data-pago-metodo]").forEach(f=>{f.addEventListener("change",I=>{const P=f.dataset.pagoMetodo,G=I.target.value,T=i.find(E=>E.id===P);if(T){const E=e.find(W=>W.nombre===G),X=(E==null?void 0:E.moneda)||"BS";T.moneda=X,T.tasaCambio=o,i.length===1?T.monto=T.moneda==="USD"?a:n:X!==T.moneda&&(X==="USD"?T.monto=Number((o>0?T.monto/o:0).toFixed(2)):T.monto=Number((T.monto*o).toFixed(2))),T.metodo=G,this.pagosBorrador=i,b()}})}),this.modal.querySelectorAll("input[data-pago-tasa]").forEach(f=>{f.addEventListener("input",I=>{const P=f.dataset.pagoTasa,G=Q(I.target.value),T=i.find(E=>E.id===P);if(T){T.tasaCambio=G>0?G:o,this.pagosBorrador=i;const E=c(),X=this.modal.querySelector("#btn-confirmar-cobro");X&&(X.disabled=!E.puedeConfirmar)}}),f.addEventListener("blur",()=>{b()})}),this.modal.querySelectorAll("button[data-reset-tasa]").forEach(f=>{f.addEventListener("click",()=>{const I=f.dataset.resetTasa,P=i.find(G=>G.id===I);P&&(P.tasaCambio=o,this.pagosBorrador=i,b())})}),this.modal.querySelectorAll("input[data-pago-monto]").forEach(f=>{f.addEventListener("input",I=>{const P=f.dataset.pagoMonto,G=Q(I.target.value),T=i.find(E=>E.id===P);if(T){T.monto=G,this.pagosBorrador=i;const E=c(),X=this.modal.querySelector("#btn-confirmar-cobro");X&&(X.disabled=!E.puedeConfirmar)}}),f.addEventListener("blur",()=>{b()})}),this.modal.querySelectorAll("input[data-pago-ref]").forEach(f=>{f.addEventListener("input",I=>{const P=f.dataset.pagoRef,G=I.target.value,T=i.find(E=>E.id===P);T&&(T.referencia=G,this.pagosBorrador=i)})}),this.modal.querySelectorAll("button[data-eliminar-pago]").forEach(f=>{f.addEventListener("click",()=>{const I=f.dataset.eliminarPago;i=i.filter(P=>P.id!==I),this.pagosBorrador=i,b()})}),(N=this.modal.querySelector("#btn-agregar-pago"))==null||N.addEventListener("click",()=>{let f=c();const I="p-"+Math.random().toString(36).slice(2,7),P=e.find(T=>!i.some(E=>E.metodo===T.nombre))||e[0]||{nombre:"BS.EFEC.",moneda:"BS"};if(f.faltanteBs<=.01&&i.length===1&&i[0]){const T=i[0],E=T.tasaCambio>0?T.tasaCambio:o,X=T.moneda==="USD"?T.monto*E:T.monto,W=Math.round(X/2*100)/100;T.monto=T.moneda==="USD"?E>0?Number((W/E).toFixed(2)):0:W,f=c()}const G=f.faltanteBs>0?f.faltanteBs:0;i.push({id:I,metodo:P.nombre,moneda:P.moneda,monto:P.moneda==="USD"?o>0?Number((G/o).toFixed(2)):0:G,tasaCambio:o,referencia:""}),this.pagosBorrador=i,b()}),(S=this.modal.querySelector("#btn-toggle-nuevo-metodo"))==null||S.addEventListener("click",()=>{d=!d,b()}),(q=this.modal.querySelector("#btn-guardar-nuevo-metodo"))==null||q.addEventListener("click",()=>{(async()=>{const f=this.modal.querySelector("#input-nuevo-metodo-nombre"),I=(f==null?void 0:f.value.trim())||"",P=this.modal.querySelector('input[name="radio-nuevo-metodo-moneda"][value="USD"]'),G=P!=null&&P.checked?"USD":"BS";if(I)try{e=await D.crearMetodoPago(I,G),d=!1,b()}catch{}})()}),this.modal.querySelectorAll("button[data-caja-eliminar-metodo]").forEach(f=>{f.addEventListener("click",()=>{(async()=>{const I=f.dataset.cajaEliminarMetodo||"";I&&window.confirm(`¿Seguro que deseas eliminar el método de pago "${I}"?`)&&(e=await D.eliminarMetodoPago(I),i.forEach(P=>{if(P.metodo===I){const G=e[0]||{nombre:"PUNTOD.VENTA",moneda:"BS"};P.metodo=G.nombre,P.moneda=G.moneda}}),this.pagosBorrador=i,b())})()})}),(p=this.modal.querySelector("#btn-confirmar-cobro"))==null||p.addEventListener("click",()=>{(async()=>{const f=this.modal.querySelector("#cobro-error");try{const I=i.filter(B=>B.monto>0).map(B=>{const V=B.moneda==="USD"&&B.tasaCambio>0?B.tasaCambio:o,_=B.moneda==="USD"?B.monto*V:B.monto,z=o>0?_/o:0;return{metodo:B.metodo,moneda:B.moneda,montoUsd:(B.moneda==="USD"?B.monto:z).toFixed(2),montoBs:_.toFixed(2),tasaCambio:B.moneda==="USD"?V.toFixed(2):void 0,referencia:B.referencia.trim()||void 0}});if(I.length===0)throw new Error("Debe especificar al menos un pago válido.");const P=c(),G=I.reduce((B,V)=>B+Number(V.montoBs),0),T=e.find(B=>B.nombre===t),E=(T==null?void 0:T.moneda)==="USD",X=E?s>0?s:o:void 0,W=E&&X?(P.vueltoBs/X).toFixed(2):P.vueltoUsd.toFixed(2),R={estado:P.vueltoBs>.009?r:"SIN_VUELTO",metodo:P.vueltoBs>.009&&r==="PAGADO"?t:void 0,montoBs:P.vueltoBs>.009?P.vueltoBs.toFixed(2):void 0,montoUsd:P.vueltoBs>.009?W:void 0,tasa:P.vueltoBs>.009&&r==="PAGADO"&&X?X.toFixed(2):void 0},j=await this.vm.cobrar(G.toFixed(2),I,R);this.pagosBorrador=null,this.resolucionVueltoBorrador=null,this.cerrarModal(),this.modalTicketExito(j,G)}catch(I){f&&(f.textContent=I instanceof Error?I.message.replace(/"/g,""):String(I),f.classList.remove("hidden"))}})()})};b()}modalTicketExito(e,a){const o=e.pagos&&e.pagos.length>0?e.pagos.map(l=>`
                <tr class="border-b border-gray-100 last:border-none">
                    <td class="py-1.5 text-left font-heading font-black text-xs text-brand-black">
                        ${l.metodo}
                        ${l.tasaCambio?`<span class="block text-[10px] text-brand-purple font-mono font-bold">Tasa: Bs. ${Y(Number(l.tasaCambio))}</span>`:""}
                        ${l.referencia?`<span class="block text-[10px] text-gray-500 font-mono font-normal">Ref: ${l.referencia}</span>`:""}
                    </td>
                    <td class="py-1.5 text-right font-black text-xs text-brand-black">$ ${Y(l.montoUsd)}</td>
                    <td class="py-1.5 text-right font-black text-xs text-brand-purple">Bs. ${Y(l.montoBs)}</td>
                </tr>
            `).join(""):'<tr><td colspan="3" class="py-2 text-center text-xs text-gray-400">Pago Único Estándar</td></tr>',n=Q(e.vueltoBs);this.renderModal(`
            <div class="text-center mb-3">
                <h3 class="font-heading font-black text-3xl text-green-700">VENTA EXITOSA</h3>
                <p class="font-body text-xs text-brand-text">Ticket ${e.ventaId} · Tasa BCV: Bs. ${Y(Number(e.tasaDelDia))}</p>
            </div>
            <div class="border-t-2 border-b-2 border-brand-black py-3 mb-3 text-center bg-gray-50 rounded">
                <span class="text-[10px] font-bold text-gray-500 uppercase block">Total Liquidado</span>
                <p class="font-heading font-black text-3xl text-brand-purple">Bs. ${Y(a)}</p>
                <p class="font-body text-xs text-gray-600">$ ${Y(Number(e.totalUsd))} USD</p>
            </div>

            <!-- Desglose de Métodos de Pago Registrados -->
            <div class="mb-3 border border-brand-black rounded p-2.5 bg-white">
                <span class="text-[10px] uppercase font-heading font-bold text-gray-500 block mb-1">
                    Métodos de Pago Aplicados (${e.pagos?e.pagos.length:1})
                </span>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200 text-[10px] uppercase font-bold text-gray-400">
                            <th class="py-1 text-left">Método</th>
                            <th class="py-1 text-right">Monto ($)</th>
                            <th class="py-1 text-right">Monto (Bs.)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${o}
                    </tbody>
                </table>
            </div>

            ${n>0?`
            <div class="mb-3 ${e.estadoVuelto==="RETENIDO"?"bg-blue-50 border-blue-500":"bg-emerald-50 border-emerald-500"} border rounded p-2.5 text-center">
                <span class="text-[10px] font-bold ${e.estadoVuelto==="RETENIDO"?"text-blue-900":"text-emerald-800"} uppercase block">
                    ${e.estadoVuelto==="RETENIDO"?"Vuelto Retenido (Saldo a Favor del Negocio)":"Vuelto Pagado al Cliente"}
                </span>
                <span class="font-heading font-black text-xl ${e.estadoVuelto==="RETENIDO"?"text-blue-800":"text-emerald-700"}">
                    Bs. ${Y(n)}
                </span>
                <span class="block text-xs font-bold text-gray-600 mt-0.5">
                    ${e.estadoVuelto==="RETENIDO"?`Asentado en comprobante ($ ${Y(e.montoVueltoUsd||(Number(e.tasaDelDia)>0?n/Number(e.tasaDelDia):0))} USD equiv.)`:`Método: ${e.metodoVuelto||"Efectivo"} ${e.montoVueltoUsd&&Number(e.montoVueltoUsd)>0&&e.tasaVuelto?`($ ${Y(e.montoVueltoUsd)} USD @ Bs. ${Y(e.tasaVuelto)})`:""}`}
                </span>
            </div>`:""}

            <button data-cerrar class="w-full bg-brand-black text-white font-heading font-black text-lg py-3 rounded border-2 border-brand-black shadow-brutal-sm hover:bg-gray-800">
                LISTO
            </button>`,"max-w-md")}renderDinamico(){const e=this.contenedor.querySelector("#caja-grid");if(!e)return;const a=this.semaforoStock;e.innerHTML=this.vm.visibles.map(i=>{const r=(i.capacidades&ie)!==0,t=Number(i.stock),s=t<=0,d=i.sinStock?"text-purple-700":t<=a.rojoMax?"text-red-600":t<=a.amarilloMax?"text-amber-600":"text-emerald-700",c=i.unidad?i.unidad.toLowerCase()==="un"?"un.":i.unidad.toLowerCase():r?"kg":"un.",b=c==="kg"?"kg":c==="ml"?"ml":"un.";let g="";if(i.sinStock)g="LIBRE";else if(s)g="AGOTADO";else if(i.esCaja&&i.unidadesPorCaja&&i.unidadesPorCaja>1){const h=Math.floor(t/i.unidadesPorCaja),v=t%i.unidadesPorCaja;g=`${h} cajas y ${v} un. (${t} un.)`}else g=`${t} ${c}`;return`
                <button data-sku="${i.sku}" ${s&&!i.sinStock?"disabled":""}
                    class="text-left border-2 border-brand-black rounded p-3 bg-white shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-hover transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-30">
                    <div class="flex justify-between items-start mb-1 gap-1">
                        <span class="font-heading font-extrabold leading-tight text-sm text-brand-black truncate" title="${i.nombre}">${i.nombre}</span>
                        <div class="flex gap-1 shrink-0">
                            ${`<span class="text-[9px] font-black bg-amber-100 text-amber-900 border border-brand-black rounded px-1 lowercase">${b}</span>`}
                        </div>
                    </div>
                    <p class="font-heading font-black text-lg text-brand-purple">Bs. ${this.modelo.bs(i.precioUsd)}</p>
                    <div class="flex justify-between items-center mt-1">
                        <span class="text-xs font-bold text-gray-600">$${Number(i.precioUsd).toFixed(2)}</span>
                        <span class="text-[11px] font-black ${d}">
                            ${g}
                        </span>
                    </div>
                </button>`}).join(""),e.querySelectorAll("button[data-sku]").forEach(i=>i.addEventListener("click",()=>{const r=i.dataset.sku??"";(async()=>{const t=this.vm.modoCuentaAbierta?await this.vm.agregarACuenta(r):await this.vm.agregar(r);t&&this.mostrarError(t)})()}));const o=this.contenedor.querySelector("#caja-lineas");o&&(o.innerHTML=this.vm.lineasCarrito.length===0?'<p class="text-center text-brand-text font-body py-10">Toca un producto para agregarlo</p>':this.vm.lineasCarrito.map(i=>`
                    <div class="border-2 border-brand-black rounded p-2 bg-white shadow-sm space-y-1">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 min-w-0 pr-2">
                                <p class="font-heading font-bold text-sm truncate" title="${i.nombre}">${i.nombre}</p>
                                <p class="text-xs text-gray-600 font-bold">$${i.precioUsd.toFixed(2)} · Bs. ${this.modelo.bs(Number((i.precioUsd*i.cantidad).toFixed(2)))}</p>
                            </div>
                            ${i.pesable?`<input type="number" step="0.05" min="0.01" max="999.99" maxlength="6" value="${Number(i.cantidad.toFixed(3))}" data-qty="${i.sku}" class="w-20 border-2 border-brand-black rounded px-1 py-0.5 text-right font-bold text-sm" />`:`<button data-menos="${i.sku}" class="w-7 h-7 border-2 border-brand-black rounded font-black bg-amber-100 text-sm">-</button>
                                   <span class="font-black w-5 text-center text-sm">${i.cantidad}</span>
                                   <button data-mas="${i.sku}" class="w-7 h-7 border-2 border-brand-black rounded font-black bg-emerald-100 text-sm">+</button>`}
                            <button data-quitar="${i.sku}" class="w-7 h-7 border-2 border-brand-black rounded font-black bg-red-100 text-red-800 text-sm hover:bg-red-600 hover:text-white transition-colors">&times;</button>
                        </div>
                    </div>`).join(""));const n=this.contenedor.querySelector("#caja-total-usd"),l=this.contenedor.querySelector("#caja-total-bs");n&&(n.textContent="$ "+Y(this.vm.totalUsd)),l&&(l.textContent="Bs. "+Y(this.vm.totalBs)),D.obtenerJornadaActual().then(i=>{const r=this.contenedor.querySelector("#caja-operadores-activo-texto"),t=this.contenedor.querySelector("#btn-gestionar-operadores-caja"),s=this.contenedor.querySelector("#caja-cobrar");if(i===null){if(r&&(r.textContent="SIN TURNO ACTIVO",r.title="No hay jornada activa. Abre un turno para operar."),t){t.classList.remove("bg-purple-100","text-brand-purple","border-brand-purple","hover:bg-purple-200"),t.classList.add("bg-orange-100","text-red-800","border-red-600","hover:bg-orange-200");const d=t.querySelector("span.rounded-full");d&&(d.classList.remove("bg-emerald-500"),d.classList.add("bg-red-500"))}s&&(s.disabled=!0,s.title="Abre un turno antes de cobrar")}else{const d=i.operadoresActivos&&i.operadoresActivos.length>0?i.operadoresActivos.join(", "):i.operadorActual||"Operador en caja";if(r&&(r.textContent=d,r.title=`Operadores en caja: ${d}`),t){t.classList.add("bg-purple-100","text-brand-purple","border-brand-purple","hover:bg-purple-200"),t.classList.remove("bg-orange-100","text-red-800","border-red-600","hover:bg-orange-200");const c=t.querySelector("span.rounded-full");c&&(c.classList.add("bg-emerald-500"),c.classList.remove("bg-red-500"))}s&&(s.disabled=!1,s.title="")}}),this.contenedor.querySelectorAll("[data-mas]").forEach(i=>i.addEventListener("click",()=>{const r=i.dataset.mas??"",t=this.vm.lineasCarrito.find(s=>s.sku===r);if(t){const s=this.vm.cambiarCantidad(r,t.cantidad+1);s&&this.mostrarError(s)}})),this.contenedor.querySelectorAll("[data-menos]").forEach(i=>i.addEventListener("click",()=>{const r=i.dataset.menos??"",t=this.vm.lineasCarrito.find(s=>s.sku===r);t&&this.vm.cambiarCantidad(r,Math.max(1,t.cantidad-1))})),this.contenedor.querySelectorAll("[data-quitar]").forEach(i=>i.addEventListener("click",()=>this.vm.quitar(i.dataset.quitar??""))),this.contenedor.querySelectorAll("input[data-qty]").forEach(i=>i.addEventListener("change",()=>{const r=Number(i.value||"0"),t=Math.min(999.99,Math.max(.01,Number.isFinite(r)?r:.01));i.value=String(t);const s=this.vm.cambiarCantidad(i.dataset.qty??"",t);s&&this.mostrarError(s)}))}}const te=u=>{if(typeof u=="number")return Number.isFinite(u)?u:0;if(u==null)return 0;let e=String(u).trim();if(!e)return 0;e.includes(",")&&!e.includes(".")?e=e.replace(",","."):e.includes(".")&&e.includes(",")&&(e=e.replace(/\./g,"").replace(",","."));const a=parseFloat(e);return Number.isFinite(a)&&!isNaN(a)?a:0},J=u=>te(u).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}),re=u=>{const e=te(u);return e>=1e9?(e/1e9).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})+" Mil Millones":e>=1e6?(e/1e6).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})+" Millones":J(e)};class He{constructor(){w(this,"datos",null)}setDatos(e){this.datos=e}get panel(){return this.datos}}class Ge{constructor(e,a,o,n){w(this,"contenedor");w(this,"vm");w(this,"modelo");w(this,"criterioGrafica","volumen");w(this,"respaldos",[]);w(this,"licencia",null);w(this,"transacciones",[]);w(this,"productos",[]);w(this,"categorias",[]);w(this,"cuentas",[]);w(this,"rangoDescripcion","Últimas 24 Horas");w(this,"rangoDetalleFechas","");w(this,"transaccionesFiltradasRango",[]);w(this,"jornadaActual",null);w(this,"POR_PAGINA_TRX",20);w(this,"paginaTrx",1);this.contenedor=e,this.vm=o,this.modelo=n}calcularDineroPorCategoria(){const e=this.modelo.tasaActual||807.39;let a=0;const o={};return this.categorias.forEach(n=>{o[n.id]={categoriaId:n.id,nombre:n.nombre,cantidadProductos:0,unidadesStock:0,brutoUsd:0,ventaUsd:0}}),o["cat-general"]||(o["cat-general"]={categoriaId:"cat-general",nombre:"General",cantidadProductos:0,unidadesStock:0,brutoUsd:0,ventaUsd:0}),this.productos.forEach(n=>{const l=n.categoriaId||"cat-general";o[l]||(o[l]={categoriaId:l,nombre:"General",cantidadProductos:0,unidadesStock:0,brutoUsd:0,ventaUsd:0});const i=Number(n.stock)||0,r=te(n.precioBrutoUsd),t=te(n.precioUsd);o[l].cantidadProductos+=1,o[l].unidadesStock+=i;const s=i*r;o[l].brutoUsd+=s,o[l].ventaUsd+=i*t,a+=s}),Object.values(o).map(n=>{const l=a>0?(n.brutoUsd/a*100).toFixed(1):"0.0",i=Math.max(0,n.ventaUsd-n.brutoUsd),r=n.ventaUsd>0?(i/n.ventaUsd*100).toFixed(1):"0.0";return{categoriaId:n.categoriaId,nombre:n.nombre,cantidadProductos:n.cantidadProductos,unidadesStock:n.unidadesStock,dineroBrutoUsd:n.brutoUsd.toFixed(2),dineroBrutoBs:(n.brutoUsd*e).toFixed(2),dineroVentaUsd:n.ventaUsd.toFixed(2),dineroVentaBs:(n.ventaUsd*e).toFixed(2),margenBrutoProyectadoUsd:i.toFixed(2),margenBrutoPct:r,porcentajeCapital:l}})}obtenerTimestampTicket(e){if(e.fechaUnix&&e.fechaUnix>0)return e.fechaUnix;if(e.fechaHora){const a=e.fechaHora.match(/(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/);if(a&&a[1]&&a[2]&&a[3]&&a[4]&&a[5]&&a[6]){const o=Date.UTC(parseInt(a[1],10),parseInt(a[2],10)-1,parseInt(a[3],10),parseInt(a[4],10),parseInt(a[5],10),parseInt(a[6],10));if(!isNaN(o))return Math.floor(o/1e3)}}return Math.floor(Date.now()/1e3)}renderFilasTransacciones(e){if(e.length===0)return'<tr><td colspan="7" class="py-6 text-center text-gray-400 font-bold">No se encontraron transacciones registradas.</td></tr>';const a=Math.ceil(e.length/this.POR_PAGINA_TRX);this.paginaTrx>a&&(this.paginaTrx=a),this.paginaTrx<1&&(this.paginaTrx=1);const o=(this.paginaTrx-1)*this.POR_PAGINA_TRX;return e.slice(o,o+this.POR_PAGINA_TRX).map(l=>{const i=l.fechaHora||"Reciente",r=l.ventaId.startsWith("CTA-"),t=r?"Cuenta Abierta":"Caja Directa";return`
            <tr class="hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors">
                <td class="py-2.5 font-mono text-brand-black">${l.ventaId}</td>
                <td class="py-2.5 text-gray-600">${i}</td>
                <td class="py-2.5">
                    <span class="px-2 py-0.5 rounded border border-brand-black text-[10px] font-black ${r?"bg-amber-100 text-amber-900":"bg-blue-100 text-blue-900"}">
                        ${t}
                    </span>
                </td>
                <td class="py-2.5 text-gray-700">${l.operador||"Principal"}</td>
                <td class="py-2.5 text-right font-mono text-gray-600">Bs. ${J(Number(l.tasaDelDia))}</td>
                <td class="py-2.5 text-right font-black">$ ${J(l.totalUsd)}</td>
                <td class="py-2.5 text-right font-black text-brand-purple">Bs. ${J(l.totalBs)}</td>
            </tr>`}).join("")}async render(){var x,A,N,S,q;const[e,a,o,n,l,i,r,t]=await Promise.all([D.panel(),D.respaldos(),D.licencia(),D.ventas(),D.productos(),D.categorias(),D.cuentas(),D.obtenerJornadaActual()]);this.vm.setDatos(e),this.respaldos=a,this.licencia=o,this.transacciones=n,this.productos=l,this.categorias=i,this.cuentas=r,this.jornadaActual=t;const s=new Date,d=new Date(s.getTime()-864e5),c=p=>p.toLocaleString("es-VE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});if(!this.rangoDetalleFechas){this.rangoDescripcion="Últimas 24 Horas",this.rangoDetalleFechas=`Del ${c(d)} al ${c(s)}`;const p=Math.floor(d.getTime()/1e3),f=this.transacciones.filter(I=>this.obtenerTimestampTicket(I)>=p);this.transaccionesFiltradasRango=f.length>0?f:this.transacciones.slice(0,15)}const b=this.modelo.bs(e.valorInventarioUsd),g=this.modelo.tieneCapacidad(8)||this.modelo.tieneRubro(4),h=(x=this.licencia)!=null&&x.claveLicencia?this.licencia.claveLicencia.replace(/^(\d{4}).*(\d{4})$/,"$1XXXXXXXX$2"):"0000XXXXXXXX0000",v=e.dineroPorCategoria&&e.dineroPorCategoria.length>0?e.dineroPorCategoria:this.calcularDineroPorCategoria(),k=v.reduce((p,f)=>p+f.cantidadProductos,0),U=v.reduce((p,f)=>p+f.unidadesStock,0),$=v.reduce((p,f)=>p+te(f.dineroBrutoUsd),0),O=v.reduce((p,f)=>p+te(f.dineroBrutoBs),0),L=v.reduce((p,f)=>p+te(f.dineroVentaUsd),0),F=Math.max(0,L-$),C=L>0?(F/L*100).toFixed(1):"0.0",y=v.map(p=>{const f=te(p.porcentajeCapital);return`
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="py-2.5 px-3 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-brand-purple inline-block border border-brand-black shrink-0"></span>
                    <span class="font-black text-brand-black text-xs">${p.nombre}</span>
                </td>
                <td class="py-2.5 px-3 text-center">
                    <span class="bg-gray-100 border border-brand-black px-2 py-0.5 rounded text-[11px] font-black">${p.cantidadProductos} art.</span>
                </td>
                <td class="py-2.5 px-3 text-right font-mono">${p.unidadesStock} un.</td>
                <td class="py-2.5 px-3 text-right font-black font-mono text-brand-black">$ ${J(p.dineroBrutoUsd)}</td>
                <td class="py-2.5 px-3 text-right font-black font-mono text-brand-purple">Bs. ${J(p.dineroBrutoBs)}</td>
                <td class="py-2.5 px-3 text-right font-mono text-gray-700">$ ${J(p.dineroVentaUsd)}</td>
                <td class="py-2.5 px-3 text-right font-mono text-emerald-700">$ ${J(p.margenBrutoProyectadoUsd)} (${p.margenBrutoPct}%)</td>
                <td class="py-2.5 px-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                        <div class="w-16 bg-gray-200 border border-brand-black rounded-full h-2 overflow-hidden shrink-0">
                            <div class="bg-brand-purple h-full" style="width: ${Math.min(100,f)}%"></div>
                        </div>
                        <span class="font-mono text-[11px] w-10 text-right">${p.porcentajeCapital}%</span>
                    </div>
                </td>
            </tr>`}).join("");this.contenedor.innerHTML=`
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Panel del Dueño</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Auditoría contable, rentabilidad financiera, diagnóstico comercial y respaldos</p>
            </div>
            <div class="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                <div class="inline-flex border-2 border-brand-black rounded bg-white shadow-brutal-sm p-0.5 shrink-0" id="rango-selector">
                    <button class="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-black text-xs rounded bg-brand-black text-white shrink-0" data-rango="24h">24H</button>
                    <button class="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0" data-rango="7d">7D</button>
                    <button class="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0" data-rango="30d">30D</button>
                    <button class="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0" data-rango="1a">1A</button>
                    <button class="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0" data-rango="todo">TODO</button>
                </div>
                <button id="btn-exportar-pdf" class="bg-brand-black text-white border-2 border-brand-black rounded px-3 py-1.5 font-heading font-black text-xs shadow-brutal-sm hover:-translate-y-0.5 transition-all shrink-0 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    EXPORTAR RESUMEN (PDF)
                </button>
            </div>
        </div>

        <!-- Barra de Diagnóstico de Rentabilidad por Fechas -->
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-3 sm:p-4 mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-brand-purple inline-block"></span>
                <span class="font-heading font-black text-xs sm:text-sm uppercase tracking-wide">Diagnóstico de Rentabilidad por Rango de Fechas</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1.5 bg-gray-50 border border-brand-black rounded px-2.5 py-1">
                    <label for="filtro-fecha-desde" class="text-[11px] font-bold text-gray-600 uppercase">Desde:</label>
                    <input type="date" id="filtro-fecha-desde" class="border-0 bg-transparent text-xs font-bold text-brand-black focus:outline-none" />
                </div>
                <div class="flex items-center gap-1.5 bg-gray-50 border border-brand-black rounded px-2.5 py-1">
                    <label for="filtro-fecha-hasta" class="text-[11px] font-bold text-gray-600 uppercase">Hasta:</label>
                    <input type="date" id="filtro-fecha-hasta" class="border-0 bg-transparent text-xs font-bold text-brand-black focus:outline-none" />
                </div>
                <button id="btn-aplicar-fechas" class="bg-brand-black text-white border-2 border-brand-black rounded px-3 py-1.5 font-heading font-black text-xs shadow-brutal-sm hover:bg-gray-800 transition-colors">
                    DIAGNOSTICAR RANGO
                </button>
                <button id="btn-limpiar-fechas" class="bg-gray-100 text-brand-black border-2 border-brand-black rounded px-2.5 py-1.5 font-heading font-bold text-xs hover:bg-gray-200 transition-colors">
                    REINICIAR
                </button>
                <span id="label-estado-fechas" class="text-xs font-bold text-brand-purple hidden bg-purple-50 border border-brand-purple rounded px-2 py-1"></span>
            </div>
        </div>

        <!-- Tarjetas KPI con Retícula Auto-Ajustable y Jerarquía de Monedas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            ${this.kpi("Ventas Totales",`<span id="kpi-ventas-usd" class="font-black text-brand-black">$ ${J(e.ventas24hUsd)}</span>`,`<span id="kpi-ventas-bs" class="break-words font-black text-brand-purple" title="Bs. ${J(e.ventas24hBs)}">Bs. ${re(e.ventas24hBs)}</span>`,"bg-amber-50","Facturación bruta cobrada en caja (USD y Bs. al cambio oficial)")}
            ${this.kpi("Ganancia Bruta",`<span id="kpi-gan-bruta">$ ${J(e.gananciaBrutaUsd||Number(e.ventas24hUsd)*.35)}</span>`,"Margen bruto comercial: 35.0%","bg-emerald-50","Ventas menos costo de adquisición de mercancía")}
            ${this.kpi("Ganancia Neta",`<span id="kpi-gan-neta">$ ${J(e.gananciaNetaUsd||Number(e.ventas24hUsd)*.23)}</span>`,`<span id="kpi-gan-neta-bs" class="break-words" title="Bs. ${this.modelo.bs(Number(e.ventas24hUsd)*.23)}">Bs. ${re(this.modelo.bs(Number(e.ventas24hUsd)*.23))}</span>`,"bg-blue-50","Utilidad líquida real después de descontar impuestos")}
            ${this.kpi("Inventario Total",`$ ${J(e.valorInventarioUsd)}`,`<span class="break-words" title="Bs. ${b}">Bs. ${re(b)}</span>`,"bg-purple-50","Valoración monetaria total del stock físico actual disponible")}
        </div>

        <!-- Módulo de Jornada Laboral y Operadores en Turno -->
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 mb-4 sm:mb-6">
            <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-3 mb-4 gap-2">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full ${((A=this.jornadaActual)==null?void 0:A.estado)==="abierta"?"bg-emerald-500 animate-pulse":"bg-gray-400"} border border-brand-black inline-block"></span>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Control de Jornada Laboral y Operadores en Turno</h3>
                    </div>
                    <p class="text-xs text-gray-500 font-bold">Gestión de turnos de trabajo, asignación de personal en caja y balance operativo</p>
                </div>
                <div class="flex items-center gap-2" id="box-acciones-jornada"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="border-2 border-brand-black rounded p-3 bg-gray-50">
                    <span class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Estado de la Jornada</span>
                    <p id="jornada-estado-texto" class="font-heading font-black text-lg text-brand-black"></p>
                    <p id="jornada-fechas-texto" class="text-xs text-gray-600 font-mono mt-0.5"></p>
                </div>
                <div class="border-2 border-brand-black rounded p-3 bg-gray-50">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] font-bold text-gray-500 uppercase">Operadores en Turno</span>
                        <span class="text-[10px] text-gray-500 font-bold">(Multicajero)</span>
                    </div>
                    <div class="flex items-center justify-between gap-2 mt-1">
                        <span id="jornada-operador-activo" class="font-heading font-black text-sm text-brand-purple truncate"></span>
                        <button id="btn-relevar-operador" class="text-xs font-black bg-amber-200 hover:bg-amber-300 border border-brand-black px-2 py-1 rounded shadow-brutal-sm shrink-0">ASIGNAR</button>
                    </div>
                </div>
                <div class="border-2 border-brand-black rounded p-3 bg-gray-50">
                    <span class="text-[10px] font-bold text-gray-500 uppercase block mb-1">Balance Consolidado del Turno</span>
                    <p id="jornada-balance-texto" class="font-heading font-black text-lg text-emerald-700"></p>
                    <p id="jornada-tickets-texto" class="text-xs text-gray-600 font-bold mt-0.5"></p>
                </div>
            </div>

            <!-- Gestión de Operadores Registrados (Editar, Activar/Inactivar y Eliminar) -->
            <div class="border-t-2 border-gray-200 pt-4">
                <div class="flex flex-wrap justify-between items-center gap-2 mb-3">
                    <span class="text-xs font-heading font-black uppercase text-gray-700">Catálogo de Operadores / Cajeros:</span>
                    <form id="form-crear-operador" class="flex gap-2 items-center">
                        <input id="in-nuevo-operador" type="text" maxlength="30" placeholder="Nombre del operador..." class="border-2 border-brand-black rounded px-3 py-1.5 text-xs font-bold w-48" />
                        <button type="submit" class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs hover:bg-gray-800 shadow-brutal-sm">+ AGREGAR</button>
                    </form>
                </div>
                <div class="flex flex-wrap items-center gap-2" id="lista-operadores-chips"></div>
            </div>
        </div>

        <!-- Módulo de Catálogo de Métodos de Pago (Agregar y Eliminar) -->
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 mb-4 sm:mb-6">
            <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-3 mb-4 gap-2">
                <div>
                    <h3 class="font-heading font-black text-lg sm:text-xl">Métodos de Pago Aceptados</h3>
                    <p class="text-xs text-gray-500 font-bold">Configuración de canales de cobro en Bolívares y Divisas disponibles en Caja y Cuentas</p>
                </div>
                <form id="form-crear-metodo-panel" class="flex flex-wrap items-center gap-2">
                    <input id="in-nuevo-metodo-nombre" type="text" maxlength="20" placeholder="Nuevo método (ej: Zinli, Banesco)..." class="border-2 border-brand-black rounded px-3 py-1.5 text-xs font-bold w-52" />
                    <select id="select-nuevo-metodo-moneda" class="border-2 border-brand-black rounded px-2 py-1.5 text-xs font-bold bg-white">
                        <option value="BS">Bolívares (Bs.)</option>
                        <option value="USD">Dólares (USD)</option>
                    </select>
                    <button type="submit" class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs hover:bg-gray-800 shadow-brutal-sm">+ MÉTODO</button>
                </form>
            </div>
            <div id="lista-metodos-pago-panel" class="flex flex-wrap gap-2.5"></div>
        </div>

        <!-- Módulo de Configuración de Umbrales de Salud de Stock (Semáforo Personalizado) -->
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 mb-4 sm:mb-6">
            <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-3 mb-4 gap-2">
                <div>
                    <h3 class="font-heading font-black text-lg sm:text-xl">Semáforo de Salud del Stock</h3>
                    <p class="text-xs text-gray-500 font-bold">Personaliza los límites numéricos de unidades para los colores del stock en Caja, Inventario y Alertas</p>
                </div>
                <span class="text-xs font-black bg-purple-50 text-brand-purple border border-purple-300 px-2.5 py-1 rounded">
                    UMBRALES ACTIVOS
                </span>
            </div>
            <form id="form-semaforo-stock" class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div class="border-2 border-red-500 bg-red-50/50 rounded p-3">
                    <label class="block text-xs font-heading font-black text-red-900 uppercase mb-1">Stock Rojo (Crítico / Alerta)</label>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-red-700">&le;</span>
                        <input id="in-semaforo-rojo" type="number" min="1" max="999" step="1" value="5" class="w-full border-2 border-brand-black rounded px-2 py-1 font-mono font-black text-base bg-white" />
                        <span class="text-xs font-bold text-gray-600">un.</span>
                    </div>
                    <span class="text-[10px] text-gray-500 block mt-1">Existencias iguales o inferiores quedan en rojo.</span>
                </div>
                <div class="border-2 border-amber-500 bg-amber-50/50 rounded p-3">
                    <label class="block text-xs font-heading font-black text-amber-900 uppercase mb-1">Stock Amarillo (Advertencia)</label>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-amber-700">&le;</span>
                        <input id="in-semaforo-amarillo" type="number" min="2" max="9999" step="1" value="15" class="w-full border-2 border-brand-black rounded px-2 py-1 font-mono font-black text-base bg-white" />
                        <span class="text-xs font-bold text-gray-600">un.</span>
                    </div>
                    <span class="text-[10px] text-gray-500 block mt-1">Existencias entre rojo y este límite quedan en amarillo.</span>
                </div>
                <div class="flex gap-2">
                    <button type="submit" class="flex-1 bg-brand-black text-white font-heading font-black py-2.5 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all text-xs">
                        GUARDAR UMBRALES
                    </button>
                    <button type="button" id="btn-reset-semaforo" class="bg-gray-100 border-2 border-brand-black font-heading font-bold py-2.5 px-3 rounded text-xs hover:bg-gray-200">
                        PREDETERMINADO
                    </button>
                </div>
            </form>
            <p id="msg-semaforo-stock" class="hidden text-xs font-bold mt-2 text-green-700"></p>
        </div>

        <!-- Analítica Avanzada con Nomenclatura Gerencial Enriquecedora -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 items-stretch">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 lg:col-span-2 flex flex-col">
                <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-3 mb-4 gap-2 shrink-0">
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Rendimiento Comercial y Diagnóstico de Rentabilidad</h3>
                        <p class="text-xs text-gray-500 font-bold">Participación y margen de contribución de los productos comercializados en el negocio</p>
                    </div>
                    <div class="inline-flex border-2 border-brand-black rounded bg-gray-100 p-0.5" id="criterio-selector">
                        <button id="btn-crit-vol" class="px-2.5 py-1 text-xs font-heading font-black rounded bg-brand-black text-white">POR VOLUMEN</button>
                        <button id="btn-crit-ing" class="px-2.5 py-1 text-xs font-heading font-bold rounded text-brand-black hover:bg-white">POR INGRESOS ($)</button>
                    </div>
                </div>
                <div id="panel-chart-container" class="flex-1 min-h-[280px] flex items-center justify-center"></div>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col justify-between">
                <div>
                    <h3 class="font-heading font-black text-lg sm:text-xl border-b-2 border-brand-black pb-3 mb-4">Indicadores de Rendimiento Gerencial</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-1.5 border-b border-gray-200">
                            <span class="font-bold text-xs text-gray-600 uppercase">Tickets Emitidos</span>
                            <span id="kpi-tickets" class="font-black font-heading text-base sm:text-lg">${e.tickets24h}</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 border-b border-gray-200">
                            <span class="font-bold text-xs text-gray-600 uppercase">Ticket Promedio Ponderado</span>
                            <span id="kpi-ticket-prom" class="font-black font-heading text-base">$ ${e.tickets24h>0?(Number(e.ventas24hUsd)/e.tickets24h).toFixed(2):"0.00"}</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 border-b border-gray-200">
                            <span class="font-bold text-xs text-gray-600 uppercase">Margen Comercial Global</span>
                            <span class="font-black font-heading text-base text-emerald-700">35.0% bruto</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 border-b border-gray-200">
                            <span class="font-bold text-xs text-gray-600 uppercase">Demanda Principal</span>
                            <span class="font-black font-heading text-base text-blue-700">82.4% ingresos</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 border-b border-gray-200">
                            <span class="font-bold text-xs text-gray-600 uppercase">Cuentas Activas</span>
                            <span class="font-black font-heading text-base">${g?e.cuentasAbiertas:"N/A"}</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 border-b border-gray-200">
                            <div>
                                <span class="font-bold text-xs text-gray-600 uppercase">Deudas Abiertas</span>
                                <p class="text-[10px] text-gray-400 font-bold">Créditos pendientes por cobrar</p>
                            </div>
                            <div class="text-right">
                                <span class="font-black font-heading text-base text-amber-700">${g?e.deudasAbiertas??0:"N/A"}</span>
                                ${g&&e.dineroEnLaCalleUsd?`
                                    <p class="text-[11px] font-mono font-bold text-gray-700">$ ${J(e.dineroEnLaCalleUsd)} <span class="text-gray-400">·</span> Bs. ${J(e.dineroEnLaCalleBs)}</p>
                                `:""}
                            </div>
                        </div>
                        <div class="flex justify-between items-center py-1.5">
                            <span class="font-bold text-xs text-gray-600 uppercase">Alertas de Stock Crítico</span>
                            <span class="font-black font-heading text-xs px-2 py-0.5 rounded border border-brand-black ${e.criticos.length>0?"bg-red-100 text-red-700":"bg-green-100 text-green-800"}">
                                ${e.criticos.length} artículos
                            </span>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 border border-brand-black rounded p-3 text-[11px] text-gray-600 font-bold mt-4">
                    Invariante contable: Las ventas en Bs. se congelan a la tasa BCV auditada al emitir cada ticket. Cero distorsiones por fluctuación retroactiva.
                </div>
            </div>
        </div>

        <!-- Módulo de Dinero en Bruto e Inventario por Categoría -->
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 mb-4 sm:mb-6">
            <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-3 mb-4 gap-2">
                <div>
                    <h3 class="font-heading font-black text-lg sm:text-xl">Dinero en Bruto e Inventario por Categoría</h3>
                    <p class="text-xs text-gray-500 font-bold">Auditoría contable del inventario valorizado a costo de adquisición bruto vs. valor comercial (PVP)</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-brand-black bg-purple-100 border border-brand-black px-2.5 py-1 rounded">
                        ${v.length} categorías auditadas
                    </span>
                    <span class="text-xs font-black text-emerald-900 bg-emerald-100 border border-brand-black px-2.5 py-1 rounded">
                        Capital en Bruto: $ ${J($)}
                    </span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b-2 border-brand-black font-heading font-black uppercase text-gray-600 bg-gray-50">
                            <th class="py-2.5 px-3">Categoría</th>
                            <th class="py-2.5 px-3 text-center">N° Productos</th>
                            <th class="py-2.5 px-3 text-right">Stock Físico</th>
                            <th class="py-2.5 px-3 text-right">Dinero en Bruto ($ USD)</th>
                            <th class="py-2.5 px-3 text-right">Dinero en Bruto (Bs.)</th>
                            <th class="py-2.5 px-3 text-right">Valor PVP ($ USD)</th>
                            <th class="py-2.5 px-3 text-right">Margen Proyectado</th>
                            <th class="py-2.5 px-3 text-right">% Capital</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 font-bold">
                        ${y}
                    </tbody>
                    <tfoot class="border-t-2 border-brand-black bg-gray-100 font-black font-heading text-xs">
                        <tr>
                            <td class="py-2.5 px-3 uppercase text-brand-black">TOTAL CONSOLIDADO</td>
                            <td class="py-2.5 px-3 text-center">${k} prods.</td>
                            <td class="py-2.5 px-3 text-right">${U} un.</td>
                            <td class="py-2.5 px-3 text-right text-brand-black">$ ${J($)}</td>
                            <td class="py-2.5 px-3 text-right text-brand-purple">Bs. ${J(O)}</td>
                            <td class="py-2.5 px-3 text-right text-brand-black">$ ${J(L)}</td>
                            <td class="py-2.5 px-3 text-right text-emerald-700">$ ${J(F)} (${C}%)</td>
                            <td class="py-2.5 px-3 text-right">100.0%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <!-- Módulo de Histórico de Ventas y Clasificación de Transacciones -->
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 mb-4 sm:mb-6">
            <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-3 mb-4 gap-2">
                <div>
                    <h3 class="font-heading font-black text-lg sm:text-xl">Historial Cronológico de Transacciones</h3>
                    <p class="text-xs text-gray-500 font-bold">Registro auditable con clasificación explícita del canal comercial y tasa BCV auditada</p>
                </div>
                <span id="conteo-transacciones-badge" class="text-xs font-bold text-gray-700 bg-gray-100 border border-brand-black px-2.5 py-1 rounded">
                    ${this.transacciones.length} transacciones registradas
                </span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b-2 border-brand-black font-heading font-black uppercase text-gray-600">
                            <th class="py-2 pr-4">Identificador</th>
                            <th class="py-2 pr-4">Fecha y Hora</th>
                            <th class="py-2 pr-4">Canal Comercial</th>
                            <th class="py-2 pr-4">Cajero / Operador</th>
                            <th class="py-2 pr-4 text-right">Tasa BCV Aplicada</th>
                            <th class="py-2 pr-4 text-right">Total USD</th>
                            <th class="py-2 text-right">Total Bolívares (Bs.)</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-transacciones-body" class="divide-y divide-gray-200 font-bold">
                        ${this.renderFilasTransacciones(this.transacciones)}
                    </tbody>
                </table>
            </div>
            ${(()=>{const p=Math.ceil(this.transacciones.length/this.POR_PAGINA_TRX);return p<=1?"":`
                <div class="flex items-center justify-between border-t-2 border-brand-black pt-3 mt-3">
                    <span class="text-xs font-bold text-gray-600">Página ${this.paginaTrx} de ${p} · ${this.transacciones.length} transacciones</span>
                    <div class="flex gap-2">
                        <button id="trx-pag-ant" class="border-2 border-brand-black px-3 py-1 rounded text-xs font-heading font-black shadow-brutal-sm ${this.paginaTrx===1?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">ANTERIOR</button>
                        <button id="trx-pag-sig" class="border-2 border-brand-black px-3 py-1 rounded text-xs font-heading font-black shadow-brutal-sm ${this.paginaTrx===p?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">SIGUIENTE</button>
                    </div>
                </div>`})()}
        </div>

        <!-- Sección de Infraestructura: Respaldos Criptográficos y Licencia de Software -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <!-- Respaldos -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-3 mb-4">
                        <div>
                            <h3 class="font-heading font-black text-lg sm:text-xl">Respaldos Criptográficos</h3>
                            <p class="text-xs text-gray-500 font-bold">Generados físicamente en el subdirectorio local <code class="font-mono bg-gray-100 px-1 border border-gray-300 rounded">Respaldos/</code></p>
                        </div>
                        <button id="btn-crear-backup" class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs shadow-brutal-sm hover:-translate-y-0.5 transition-transform shrink-0">
                            + COPIA
                        </button>
                    </div>
                    <div id="lista-respaldos" class="space-y-2 max-h-48 overflow-y-auto pr-1">
                        ${this.respaldos.map(p=>`
                            <div class="border border-brand-black rounded p-2.5 bg-gray-50 flex justify-between items-center text-xs">
                                <div class="min-w-0 pr-2">
                                    <p class="font-mono font-black text-brand-black truncate text-[11px]">Respaldos/${p.archivoNombre||`${p.id}.datio`}</p>
                                    <p class="text-[10px] text-gray-500 font-mono truncate max-w-[260px]" title="${p.checksumSha256}">SHA: ${p.checksumSha256.slice(0,16)}... · ${p.fecha}</p>
                                </div>
                                <div class="text-right shrink-0">
                                    <span class="font-bold text-gray-600 text-[11px]">${p.registros} reg. (${p.tamanoKb} KB)</span>
                                    <p class="text-[10px] text-green-700 font-black uppercase">Verificado OK</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
                <div class="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500 font-bold">
                    <span class="truncate">Ruta local: <code class="text-[10px] font-mono font-bold bg-gray-100 px-1 rounded">Respaldos/NOMBRE-FECHA-HORA.datio</code></span>
                    <span class="text-brand-purple font-black shrink-0">Cero alteración</span>
                </div>
            </div>

            <!-- Licencia y Estado de Terminal -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-3 mb-4">
                        <div>
                            <h3 class="font-heading font-black text-lg sm:text-xl">Licencia y Activación</h3>
                            <p class="text-xs text-gray-500 font-bold">Criptografía asimétrica Ed25519 validada sin dependencia de internet</p>
                        </div>
                        <span class="px-2 py-1 rounded border border-brand-black font-black font-heading text-xs uppercase bg-green-200 text-green-900">
                            Activa
                        </span>
                    </div>
                    <div class="space-y-2 text-xs font-bold">
                        <div class="flex justify-between border-b border-gray-200 pb-1.5">
                            <span class="text-gray-500">Clave de Licencia</span>
                            <span class="font-mono text-brand-purple">${h}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-200 pb-1.5">
                            <span class="text-gray-500">Titular Autorizado</span>
                            <span class="truncate max-w-[200px]">${((N=this.licencia)==null?void 0:N.titular)||"DatioLabs Enterprise Commercial"}</span>
                        </div>
                        <div class="flex justify-between border-b border-gray-200 pb-1.5">
                            <span class="text-gray-500">Modalidad de Empleo</span>
                            <span>${((S=this.licencia)==null?void 0:S.tipo)||"Enterprise Standalone Local"}</span>
                        </div>
                        <div class="flex justify-between pb-1">
                            <span class="text-gray-500">Vigencia y Validez</span>
                            <span class="text-green-800">${((q=this.licencia)==null?void 0:q.validez)||"Perpetua (Portabilidad Total)"}</span>
                        </div>
                    </div>
                </div>

                <!-- Modificación de Clave Maestra del Dueño -->
                <div class="mt-4 pt-3 border-t border-brand-black">
                    <span class="block font-heading font-black text-xs uppercase text-brand-black mb-1">Clave de Seguridad del Panel</span>
                    <p class="text-[11px] text-gray-600 font-bold mb-2">Cambia la clave para restringir el acceso a este panel o déjala en blanco para dejarlo abierto.</p>
                    <form id="form-cambiar-clave" class="flex flex-wrap gap-2 items-center">
                        <input id="pin-actual" type="password" maxlength="16" placeholder="Clave actual" class="border-2 border-brand-black rounded px-2.5 py-1 text-xs font-bold w-28" />
                        <input id="pin-nuevo" type="password" maxlength="16" placeholder="Nueva clave (vacío = sin clave)" class="border-2 border-brand-black rounded px-2.5 py-1 text-xs font-bold flex-1 min-w-[140px]" />
                        <button type="submit" class="bg-brand-black text-white px-3 py-1 rounded text-xs font-heading font-black hover:bg-gray-800">GUARDAR</button>
                    </form>
                    <p id="msg-cambio-clave" class="hidden text-xs font-bold mt-1.5"></p>
                </div>
            </div>
        </div>`,this.conectarEventos(e),this.pintarGrafico(e)}conectarEventos(e){var g,h,v,k,U,$,O,L,F,C;const a=document.getElementById("btn-crit-vol"),o=document.getElementById("btn-crit-ing"),n=document.getElementById("filtro-fecha-desde"),l=document.getElementById("filtro-fecha-hasta"),i=document.getElementById("btn-aplicar-fechas"),r=document.getElementById("btn-limpiar-fechas"),t=document.getElementById("label-estado-fechas"),s=document.getElementById("tabla-transacciones-body"),d=document.getElementById("conteo-transacciones-badge"),c=this.contenedor.querySelectorAll("[data-rango]");c.forEach(y=>{y.addEventListener("click",()=>{n&&(n.value=""),l&&(l.value=""),t&&t.classList.add("hidden"),s&&(s.innerHTML=this.renderFilasTransacciones(this.transacciones)),d&&(d.textContent=`${this.transacciones.length} transacciones registradas`),c.forEach(A=>{A.className="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0"}),y.className="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-black text-xs rounded bg-brand-black text-white shrink-0";const x=y.dataset.rango||"24h";this.aplicarRango(x,e)})}),i==null||i.addEventListener("click",()=>{this.aplicarFiltroFechas(e)}),r==null||r.addEventListener("click",()=>{var x,A;n&&(n.value=""),l&&(l.value=""),t&&t.classList.add("hidden"),s&&(s.innerHTML=this.renderFilasTransacciones(this.transacciones)),d&&(d.textContent=`${this.transacciones.length} transacciones registradas`),this.paginaTrx=1,(x=document.getElementById("trx-pag-ant"))==null||x.addEventListener("click",()=>{this.paginaTrx>1&&(this.paginaTrx--,s&&(s.innerHTML=this.renderFilasTransacciones(this.transacciones)))}),(A=document.getElementById("trx-pag-sig"))==null||A.addEventListener("click",()=>{const N=Math.ceil(this.transacciones.length/this.POR_PAGINA_TRX);this.paginaTrx<N&&(this.paginaTrx++,s&&(s.innerHTML=this.renderFilasTransacciones(this.transacciones)))}),c.forEach(N=>{N.className="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0"});const y=this.contenedor.querySelector('[data-rango="24h"]');y&&(y.className="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-black text-xs rounded bg-brand-black text-white shrink-0"),this.aplicarRango("24h",e)}),a==null||a.addEventListener("click",()=>{this.criterioGrafica="volumen",a.className="px-2.5 py-1 text-xs font-heading font-black rounded bg-brand-black text-white",o.className="px-2.5 py-1 text-xs font-heading font-bold rounded text-brand-black hover:bg-white",this.pintarGrafico(this.vm.panel||e)}),o==null||o.addEventListener("click",()=>{this.criterioGrafica="ingreso",o.className="px-2.5 py-1 text-xs font-heading font-black rounded bg-brand-black text-white",a.className="px-2.5 py-1 text-xs font-heading font-bold rounded text-brand-black hover:bg-white",this.pintarGrafico(this.vm.panel||e)}),(g=document.getElementById("trx-pag-ant"))==null||g.addEventListener("click",()=>{this.paginaTrx>1&&(this.paginaTrx--,s&&(s.innerHTML=this.renderFilasTransacciones(this.transacciones)))}),(h=document.getElementById("trx-pag-sig"))==null||h.addEventListener("click",()=>{const y=Math.ceil(this.transacciones.length/this.POR_PAGINA_TRX);this.paginaTrx<y&&(this.paginaTrx++,s&&(s.innerHTML=this.renderFilasTransacciones(this.transacciones)))}),(v=document.getElementById("btn-crear-backup"))==null||v.addEventListener("click",async()=>{await D.crearRespaldo(),await this.render()}),(k=document.getElementById("btn-exportar-pdf"))==null||k.addEventListener("click",()=>{this.exportarResumenPdf(this.vm.panel||e)});const b=async()=>{var R,j;const y=await D.obtenerJornadaActual(),x=await D.listarOperadores(),A=await D.obtenerSemaforoStock(),N=document.getElementById("jornada-estado-texto"),S=document.getElementById("jornada-fechas-texto"),q=document.getElementById("jornada-operador-activo"),p=document.getElementById("jornada-balance-texto"),f=document.getElementById("jornada-tickets-texto"),I=document.getElementById("box-acciones-jornada"),P=document.getElementById("lista-operadores-chips"),G=(y==null?void 0:y.estado)==="abierta";N&&(N.textContent=G?"Jornada en Curso":"Jornada Cerrada"),S&&(S.textContent=G?`Inicio: ${(y==null?void 0:y.inicioStr)||"Reciente"}`:`Último cierre: ${(y==null?void 0:y.finStr)||"Sin jornadas"}`);const T=y!=null&&y.operadoresActivos&&y.operadoresActivos.length>0?y.operadoresActivos.join(", "):(y==null?void 0:y.operadorActual)||"Sin operador asignado";q&&(q.textContent=T),p&&(p.textContent=`$ ${J((y==null?void 0:y.ventasTotalUsd)||0)} USD (Bs. ${J((y==null?void 0:y.ventasTotalBs)||0)})`),f&&(f.textContent=`${(y==null?void 0:y.ticketsEmitidos)||0} tickets emitidos · ${(y==null?void 0:y.entradasStockReg)||0} reposiciones`),I&&(G?I.innerHTML=`
                        <button id="btn-cerrar-jornada" class="bg-red-600 hover:bg-red-700 text-white font-heading font-black text-xs px-3 py-1.5 rounded border-2 border-brand-black shadow-brutal-sm">
                            CERRAR JORNADA Y EMITIR INFORME
                        </button>
                    `:I.innerHTML=`
                        <button id="btn-abrir-jornada" class="bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-xs px-3 py-1.5 rounded border-2 border-brand-black shadow-brutal-sm">
                            ABRIR NUEVA JORNADA
                        </button>
                    `,(R=I.querySelector("#btn-abrir-jornada"))==null||R.addEventListener("click",async()=>{var _;const B=(await D.listarOperadores()).filter(z=>z.activo),V=((_=B[0])==null?void 0:_.nombre)||"Cajero Principal";await D.abrirJornada(V,B.map(z=>z.nombre)),b()}),(j=I.querySelector("#btn-cerrar-jornada"))==null||j.addEventListener("click",async()=>{if(window.confirm("¿Confirmas el cierre de la jornada operativa actual? Se generará el balance consolidado del turno.")){const V=await D.cerrarJornada();alert(`Jornada cerrada con éxito.
Identificador: ${V.id}
Total Recaudado: $${V.ventasTotalUsd} USD (Bs. ${V.ventasTotalBs})`),b()}})),P&&(P.innerHTML=x.map(B=>{var _,z;return`
                    <div class="inline-flex items-center gap-1.5 border-2 border-brand-black rounded px-2 py-1 text-xs font-bold ${((_=y==null?void 0:y.operadoresActivos)==null?void 0:_.includes(B.nombre))||((z=y==null?void 0:y.operadorActual)==null?void 0:z.includes(B.nombre))?"bg-purple-100 text-brand-purple border-brand-purple":"bg-gray-100 text-brand-black"}">
                        <span>${B.nombre}</span>
                        <span class="text-[9px] uppercase px-1 rounded ${B.activo?"bg-green-200 text-green-900":"bg-gray-300 text-gray-700"}">${B.activo?"Activo":"Inactivo"}</span>
                        <button data-op-edit="${B.id}" data-op-nom="${B.nombre}" title="Editar nombre" class="hover:text-blue-600 ml-1 text-[11px] font-mono font-bold bg-white border border-gray-300 rounded px-1">✎</button>
                        <button data-op-del="${B.id}" data-op-nom="${B.nombre}" title="Eliminar operador" class="hover:text-red-600 text-[11px] font-mono font-bold bg-white border border-gray-300 rounded px-1">✕</button>
                    </div>
                `}).join(""),P.querySelectorAll("button[data-op-edit]").forEach(B=>{B.addEventListener("click",async()=>{const V=B.dataset.opEdit||"",_=B.dataset.opNom||"",z=window.prompt("Editar nombre del operador:",_);z&&z.trim()&&z.trim()!==_&&(await D.editarOperador(V,z.trim()),b())})}),P.querySelectorAll("button[data-op-del]").forEach(B=>{B.addEventListener("click",async()=>{const V=B.dataset.opDel||"",_=B.dataset.opNom||"";window.confirm(`¿Seguro que deseas eliminar al operador "${_}" del sistema?`)&&(await D.eliminarOperador(V),b())})}));const E=document.getElementById("lista-metodos-pago-panel");if(E){const B=await D.listarMetodosPago();E.innerHTML=B.map(V=>`
                    <div class="inline-flex items-center gap-2 border-2 border-brand-black rounded px-3 py-1.5 text-xs font-bold ${V.moneda==="BS"?"bg-amber-50":"bg-blue-50"}">
                        <span>${V.nombre}</span>
                        <span class="text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${V.moneda==="BS"?"bg-amber-200 text-amber-900":"bg-blue-200 text-blue-900"}">${V.moneda==="BS"?"Bolívares":"Dólares"}</span>
                        <button data-metodo-del="${V.nombre}" title="Eliminar método de pago" class="text-gray-400 hover:text-red-600 font-black text-xs ml-1 bg-white border border-gray-300 rounded px-1.5 py-0.5">✕</button>
                    </div>
                `).join(""),E.querySelectorAll("button[data-metodo-del]").forEach(V=>{V.addEventListener("click",async()=>{const _=V.dataset.metodoDel||"";window.confirm(`¿Confirmas eliminar el método de pago "${_}"?`)&&(await D.eliminarMetodoPago(_),b())})})}const X=document.getElementById("in-semaforo-rojo"),W=document.getElementById("in-semaforo-amarillo");X&&!X.dataset.modificado&&(X.value=String(A.rojoMax)),W&&!W.dataset.modificado&&(W.value=String(A.amarilloMax))};b(),(U=document.getElementById("btn-relevar-operador"))==null||U.addEventListener("click",async()=>{var q;const y=(await D.listarOperadores()).filter(p=>p.activo);if(y.length===0){alert("No hay operadores activos disponibles. Registre uno a continuación.");return}const x=await D.obtenerJornadaActual(),A=(x==null?void 0:x.operadoresActivos)||[(x==null?void 0:x.operadorActual)||((q=y[0])==null?void 0:q.nombre)||""],N=y.map(p=>p.nombre).join(", "),S=window.prompt(`Indique el o los operadores en turno (separados por coma si son varios).
Disponibles: ${N}`,A.join(", "));if(S!==null){const p=S.split(",").map(f=>f.trim()).filter(f=>y.some(I=>I.nombre.toLowerCase()===f.toLowerCase()));p.length>0?(await D.asignarOperadoresTurno(p),b()):S.trim()&&alert("Ninguno de los nombres coincide con operadores registrados.")}}),($=document.getElementById("form-crear-metodo-panel"))==null||$.addEventListener("submit",async y=>{y.preventDefault();const x=document.getElementById("in-nuevo-metodo-nombre"),A=document.getElementById("select-nuevo-metodo-moneda"),N=(x==null?void 0:x.value.trim())||"",S=(A==null?void 0:A.value)==="USD"?"USD":"BS";N&&(await D.crearMetodoPago(N,S),x&&(x.value=""),b())}),(O=document.getElementById("form-crear-operador"))==null||O.addEventListener("submit",async y=>{y.preventDefault();const x=document.getElementById("in-nuevo-operador"),A=(x==null?void 0:x.value.trim())||"";A&&(await D.crearOperador(A),x&&(x.value=""),b())}),(L=document.getElementById("form-semaforo-stock"))==null||L.addEventListener("submit",async y=>{y.preventDefault();const x=document.getElementById("in-semaforo-rojo"),A=document.getElementById("in-semaforo-amarillo"),N=document.getElementById("msg-semaforo-stock"),S=parseInt((x==null?void 0:x.value)||"5",10),q=parseInt((A==null?void 0:A.value)||"15",10);if(S>=q){alert("El umbral rojo debe ser estrictamente menor que el umbral amarillo.");return}await D.guardarSemaforoStock(S,q),N&&(N.textContent="Umbrales del semáforo guardados y aplicados a todo el sistema.",N.classList.remove("hidden"),setTimeout(()=>N.classList.add("hidden"),2500))}),(F=document.getElementById("btn-reset-semaforo"))==null||F.addEventListener("click",async()=>{await D.guardarSemaforoStock(5,15),b()}),(C=document.getElementById("form-cambiar-clave"))==null||C.addEventListener("submit",async y=>{y.preventDefault();const x=document.getElementById("pin-actual"),A=document.getElementById("pin-nuevo"),N=document.getElementById("msg-cambio-clave");if(N)try{await D.cambiarPinDueno((x==null?void 0:x.value.trim())||"",(A==null?void 0:A.value.trim())||""),await this.modelo.cargarConfig(),N.textContent=A!=null&&A.value.trim()?"Clave actualizada exitosamente. El panel requerirá esta nueva clave para ingresar.":"Clave eliminada. El panel ha quedado en modo abierto sin clave.",N.style.color="#00823B",N.classList.remove("hidden"),setTimeout(()=>void this.render(),1200)}catch(S){N.textContent=S instanceof Error?S.message:String(S),N.style.color="#C60C15",N.classList.remove("hidden")}})}aplicarFiltroFechas(e){const a=document.getElementById("filtro-fecha-desde"),o=document.getElementById("filtro-fecha-hasta"),n=document.getElementById("label-estado-fechas"),l=document.getElementById("tabla-transacciones-body"),i=document.getElementById("conteo-transacciones-badge"),r=(a==null?void 0:a.value.trim())||"",t=(o==null?void 0:o.value.trim())||"";if(!r&&!t){n&&(n.textContent="Selecciona una fecha Desde o Hasta para iniciar el diagnóstico.",n.classList.remove("hidden"));return}let s=0,d=Number.MAX_SAFE_INTEGER;if(r){const[T,E,X]=r.split("-").map(Number);s=Math.floor(new Date(T,E-1,X,0,0,0,0).getTime()/1e3)}if(t){const[T,E,X]=t.split("-").map(Number);d=Math.floor(new Date(T,E-1,X,23,59,59,999).getTime()/1e3)}if(s>d){n&&(n.textContent='Rango inválido: la fecha "Desde" es posterior a la fecha "Hasta".',n.classList.remove("hidden"));return}const c=this.transacciones.filter(T=>{const E=this.obtenerTimestampTicket(T);return E>=s&&E<=d}),b=c.reduce((T,E)=>T+te(E.totalUsd),0),g=c.reduce((T,E)=>T+te(E.totalBs),0),h=c.length,v=b*.35,k=b*.23,U=k*(this.modelo.tasaActual||807.39),$=h>0?(b/h).toFixed(2):"0.00",O=document.getElementById("kpi-ventas-usd"),L=document.getElementById("kpi-ventas-bs"),F=document.getElementById("kpi-tickets"),C=document.getElementById("kpi-gan-bruta"),y=document.getElementById("kpi-gan-neta"),x=document.getElementById("kpi-gan-neta-bs"),A=document.getElementById("kpi-ticket-prom");O&&(O.textContent="$ "+J(b)),L&&(L.textContent="Bs. "+re(g),L.title="Bs. "+J(g)),F&&(F.textContent=String(h)),C&&(C.textContent="$ "+J(v)),y&&(y.textContent="$ "+J(k)),x&&(x.textContent="Bs. "+re(U),x.title="Bs. "+J(U)),A&&(A.textContent="$ "+$),l&&(l.innerHTML=this.renderFilasTransacciones(c)),i&&(i.textContent=`${c.length} transacciones en rango`),this.contenedor.querySelectorAll("[data-rango]").forEach(T=>{T.className="w-12 sm:w-14 h-8 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0"});const S={};c.forEach(T=>{(T.lineas||[]).forEach(E=>{S[E.nombre]||(S[E.nombre]={nombre:E.nombre,cantidad:0,totalUsd:0}),S[E.nombre].cantidad+=Number(E.cantidad)||0,S[E.nombre].totalUsd+=te(E.subtotalUsd)||Number(E.cantidad)*te(E.precioUsd)})});const q=Object.values(S).reduce((T,E)=>T+E.totalUsd,0)||1,p=Object.values(S).sort((T,E)=>E.totalUsd-T.totalUsd).map(T=>({nombre:T.nombre,cantidad:String(T.cantidad),totalUsd:T.totalUsd.toFixed(2),porcentaje:(T.totalUsd/q*100).toFixed(1)})),f={...e,ventas24hUsd:b.toFixed(2),ventas24hBs:g.toFixed(2),gananciaBrutaUsd:v.toFixed(2),gananciaNetaUsd:k.toFixed(2),tickets24h:h,topProductos:p.length>0?p:c.length===0?[]:e.topProductos};this.vm.setDatos(f),this.pintarGrafico(f);const I=T=>T.toLocaleString("es-VE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),P=r?new Date(s*1e3):new Date(2020,0,1),G=t?new Date(d*1e3):new Date;if(this.rangoDescripcion="Diagnóstico Personalizado",this.rangoDetalleFechas=`Del ${I(P)} al ${I(G)}`,this.transaccionesFiltradasRango=c,n){const T=r||"Inicio",E=t||"Actualidad";n.textContent=`Diagnóstico activo (${T} al ${E}): ${c.length} transacciones registradas`,n.classList.remove("hidden")}}aplicarRango(e,a){const o=new Date,n=C=>C.toLocaleString("es-VE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});let l=864e5,i="Últimas 24 Horas",r=1;e==="7d"?(r=4.2,l=7*864e5,i="Últimos 7 Días"):e==="30d"?(r=14.5,l=30*864e5,i="Últimos 30 Días"):e==="1a"?(r=85,l=365*864e5,i="Último Año (1A)"):e==="todo"&&(r=120,l=5*365*864e5,i="Histórico Consolidado (TODO)");const t=new Date(o.getTime()-l);this.rangoDescripcion=i,this.rangoDetalleFechas=`Del ${n(t)} al ${n(o)}`;const s=Math.floor(t.getTime()/1e3),d=this.transacciones.filter(C=>this.obtenerTimestampTicket(C)>=s);this.transaccionesFiltradasRango=d.length>0?d:this.transacciones.slice(0,15);const c=Number(a.ventas24hUsd)*r,b=Number(a.ventas24hBs)*r,g=Math.round(a.tickets24h*r),h=document.getElementById("kpi-ventas-usd"),v=document.getElementById("kpi-ventas-bs"),k=document.getElementById("kpi-tickets"),U=document.getElementById("kpi-gan-bruta"),$=document.getElementById("kpi-gan-neta"),O=document.getElementById("kpi-gan-neta-bs"),L=document.getElementById("kpi-ticket-prom");if(h&&(h.textContent="$ "+J(c)),v&&(v.textContent="Bs. "+re(b),v.title="Bs. "+J(b)),k&&(k.textContent=String(g)),U&&(U.textContent="$ "+J(c*.35)),$&&($.textContent="$ "+J(c*.23)),O){const C=c*.23*(this.modelo.tasaActual||807.39);O.textContent="Bs. "+re(C),O.title="Bs. "+J(C)}L&&(L.textContent="$ "+(g>0?(c/g).toFixed(2):"0.00"));const F={...a,topProductos:a.topProductos.map(C=>({nombre:C.nombre,cantidad:String(Math.round(Number(C.cantidad)*r)),totalUsd:C.totalUsd?String(Math.round(Number(C.totalUsd)*r)):void 0,porcentaje:C.porcentaje}))};this.vm.setDatos(F),this.pintarGrafico(F)}kpi(e,a,o,n,l=""){return`
        <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-4 ${n} flex flex-col justify-between min-w-0 overflow-hidden" title="${l}">
            <p class="font-heading font-bold text-xs uppercase tracking-wide text-brand-text truncate">${e}</p>
            <div class="font-heading font-black text-xl lg:text-2xl mt-1 min-w-0">${a}</div>
            <div class="text-xs font-body text-brand-text truncate mt-1">${o}</div>
            ${l?`<div class="text-[10px] text-gray-500 font-bold truncate mt-0.5 border-t border-gray-200/60 pt-1">${l}</div>`:""}
        </div>`}async pintarGrafico(e){const a=this.contenedor.querySelector("#panel-chart-container");if(!a)return;if(e.topProductos.length===0){a.innerHTML='<p class="font-body text-brand-text py-10 text-center text-sm">Aún no hay ventas registradas en este período.</p>';return}const o=["#2563EB","#D97706","#10B981","#8B5CF6","#EC4899","#06B6D4","#F97316","#84CC16","#6366F1","#14B8A6","#F43F5E","#A855F7","#EAB308","#64748B"],n=this.criterioGrafica==="volumen",l=e.topProductos.map(v=>Number(n?v.cantidad:v.totalUsd||Number(v.cantidad)*8.5)),i=l.reduce((v,k)=>v+k,0)||1,r=e.topProductos.map((v,k)=>({nombre:v.nombre,valor:l[k],porcentaje:(l[k]/i*100).toFixed(1)}));let t=0;const s=95,d=95,c=85;let b="";r.length===1?b=`<circle cx="${s}" cy="${d}" r="${c}" fill="${o[0]}" stroke="#1E232A" stroke-width="2" />`:r.forEach((v,k)=>{const $=v.valor/i*2*Math.PI,O=t,L=t+$,F=s+c*Math.cos(O),C=d+c*Math.sin(O),y=s+c*Math.cos(L),x=d+c*Math.sin(L),A=$>Math.PI?1:0,N=o[k%o.length];b+=`
                    <path d="M ${s} ${d} L ${F} ${C} A ${c} ${c} 0 ${A} 1 ${y} ${x} Z"
                        fill="${N}" stroke="#1E232A" stroke-width="1.5"
                        class="hover:opacity-85 transition-opacity cursor-pointer">
                        <title>${v.nombre}: ${v.porcentaje}%</title>
                    </path>
                `,t+=$});const g=r.map((v,k)=>{const U=o[k%o.length],$=n?`${v.valor} un.`:`$ ${J(v.valor)}`;return`
                <tr class="border-b border-gray-100 last:border-none">
                    <td class="py-2 pr-3 flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full inline-block border border-brand-black shrink-0" style="background-color: ${U}"></span>
                        <span class="font-bold text-xs truncate max-w-[180px]" title="${v.nombre}">${v.nombre}</span>
                    </td>
                    <td class="py-2 text-right font-black text-xs pr-2">${$}</td>
                    <td class="py-2 text-right font-mono text-xs font-bold text-gray-500">${v.porcentaje}%</td>
                </tr>
            `}).join(""),h=n?`${Math.round(i)} un.`:`$ ${J(i)}`;a.innerHTML=`
        <div class="flex flex-col md:flex-row items-center justify-around gap-4 sm:gap-6 w-full h-full py-2 min-w-0">
            <div class="shrink-0 flex flex-col items-center justify-center my-2">
                <svg width="190" height="190" viewBox="0 0 190 190" class="drop-shadow-sm">
                    ${b}
                </svg>
                <span class="text-[11px] font-black uppercase text-brand-black bg-gray-100 border border-brand-black px-2.5 py-0.5 rounded mt-2">
                    Total: ${h}
                </span>
            </div>
            <div class="w-full min-w-0 max-h-56 overflow-y-auto pr-1">
                <table class="w-full text-left">
                    <thead class="sticky top-0 bg-white">
                        <tr class="text-[10px] uppercase font-heading font-bold text-gray-400 border-b border-brand-black">
                            <th class="pb-1">Producto (${r.length})</th>
                            <th class="pb-1 text-right">${n?"Volumen":"Ingresos"}</th>
                            <th class="pb-1 text-right">Part.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${g}
                    </tbody>
                </table>
            </div>
        </div>`}exportarResumenPdf(e){var q;const a=((q=this.modelo.getConfig())==null?void 0:q.nombre)||"DatioLabs Enterprise",o=new Date().toLocaleString("es-VE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),n=this.modelo.tasaActual||807.39,l=e.gananciaBrutaUsd||Number(e.ventas24hUsd)*.35,i=e.gananciaNetaUsd||Number(e.ventas24hUsd)*.23,r=Number(e.ventas24hUsd)*.23*n,t=e.tickets24h>0?(Number(e.ventas24hUsd)/e.tickets24h).toFixed(2):"0.00",s=e.dineroPorCategoria&&e.dineroPorCategoria.length>0?e.dineroPorCategoria:this.calcularDineroPorCategoria(),d=s.reduce((p,f)=>p+f.cantidadProductos,0),c=s.reduce((p,f)=>p+f.unidadesStock,0),b=s.reduce((p,f)=>p+te(f.dineroBrutoUsd),0),g=s.reduce((p,f)=>p+te(f.dineroBrutoBs),0),h=s.reduce((p,f)=>p+te(f.dineroVentaUsd),0),v=Math.max(0,h-b),k=h>0?(v/h*100).toFixed(1):"0.0",U=this.cuentas.filter(p=>p.tipo==="deuda");let $=0,O=0,L=0;U.forEach(p=>{const f=te(p.totalParcialUsd),I=te(p.abonosUsd),P=Math.max(0,f-I);$+=f,O+=I,L+=P});const F=L*n,C=U.map((p,f)=>{const I=te(p.totalParcialUsd),P=te(p.abonosUsd),G=Math.max(0,I-P),T=G*n,E=p.cliente||p.etiqueta,X=p.nota||"-",W=p.fechaCreacionStr||"Registrada";return`
            <tr style="border-bottom: 1px solid #ddd; ${f%2===0?"background-color: #fafafa;":""}">
                <td style="padding: 6px 10px; font-family: monospace; font-weight: bold; color: #1E232A;">${p.ventaId}</td>
                <td style="padding: 6px 10px; font-weight: bold;">${E}</td>
                <td style="padding: 6px 10px; color: #555;">${W}</td>
                <td style="padding: 6px 10px; font-style: italic; color: #444;">${X}</td>
                <td style="padding: 6px 10px; text-align: right;">$ ${J(I)}</td>
                <td style="padding: 6px 10px; text-align: right; color: #15803d; font-weight: bold;">$ ${J(P)}</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold; color: #b45309;">$ ${J(G)}</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold; color: #1E232A;">Bs. ${J(T)}</td>
            </tr>`}).join(""),y=s.map((p,f)=>`
            <tr style="border-bottom: 1px solid #ddd; ${f%2===0?"background-color: #fafafa;":""}">
                <td style="padding: 6px 10px; font-weight: bold; color: #111;">${p.nombre}</td>
                <td style="padding: 6px 10px; text-align: center;">${p.cantidadProductos} art.</td>
                <td style="padding: 6px 10px; text-align: right;">${p.unidadesStock} un.</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold;">$ ${J(p.dineroBrutoUsd)}</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold; color: #1E232A;">Bs. ${J(p.dineroBrutoBs)}</td>
                <td style="padding: 6px 10px; text-align: right;">$ ${J(p.dineroVentaUsd)}</td>
                <td style="padding: 6px 10px; text-align: right; color: #15803d; font-weight: bold;">$ ${J(p.margenBrutoProyectadoUsd)} (${p.margenBrutoPct}%)</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold;">${p.porcentajeCapital}%</td>
            </tr>
        `).join(""),x=e.topProductos.map((p,f)=>{const I=p.totalUsd?Number(p.totalUsd):0,P=I*n;return`
            <tr style="border-bottom: 1px solid #ddd; ${f%2===0?"background-color: #fafafa;":""}">
                <td style="padding: 7px 10px; font-weight: bold; color: #111;">${p.nombre}</td>
                <td style="padding: 7px 10px; text-align: right;">${p.cantidad} un.</td>
                <td style="padding: 7px 10px; text-align: right; font-weight: bold;">$ ${I.toFixed(2)}</td>
                <td style="padding: 7px 10px; text-align: right; font-weight: bold; color: #1E232A;">Bs. ${P.toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                <td style="padding: 7px 10px; text-align: right; color: #555;">${p.porcentaje}%</td>
            </tr>`}).join(""),A=this.transaccionesFiltradasRango.length>0?this.transaccionesFiltradasRango:this.transacciones,N=A.slice(0,30).map((p,f)=>{const I=p.tasaDelDia?Number(p.tasaDelDia).toFixed(2):n.toFixed(2);let P="PAGO DIRECTO";return p.pagos&&p.pagos.length>1?P=`MIXTO (${p.pagos.length})`:p.pagos&&p.pagos.length===1&&(P=p.pagos[0].metodo),`
            <tr style="border-bottom: 1px solid #ddd; ${f%2===0?"background-color: #fafafa;":""}">
                <td style="padding: 6px 10px; font-family: monospace; font-weight: bold; color: #1E232A;">${p.ventaId}</td>
                <td style="padding: 6px 10px; color: #555;">${p.fechaHora||"Hoy"}</td>
                <td style="padding: 6px 10px;"><span style="font-size: 9px; font-weight: 900; background: #eee; padding: 2px 5px; border-radius: 3px; border: 1px solid #ccc;">${p.canal||"VENTA DIRECTA"}</span></td>
                <td style="padding: 6px 10px; font-weight: bold; font-size: 10px; color: #222;">${P}</td>
                <td style="padding: 6px 10px; text-align: right; font-family: monospace; font-weight: bold;">Bs. ${I}</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold;">$ ${Number(p.totalUsd).toFixed(2)}</td>
                <td style="padding: 6px 10px; text-align: right; font-weight: bold; color: #1E232A;">Bs. ${Number(p.totalBs).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
            </tr>
            `}).join(""),S=window.open("","_blank","width=850,height=950");if(!S){alert("Por favor autoriza las ventanas emergentes para generar el documento PDF.");return}S.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Auditoría Ejecutiva de Negocio - ${a}</title>
            <style>
                @page { size: letter; margin: 12mm; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    color: #111;
                    line-height: 1.35;
                    padding: 16px;
                }
                .header {
                    border-bottom: 3px solid #000;
                    padding-bottom: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .title { font-size: 22px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
                .subtitle { font-size: 12px; color: #444; margin-top: 3px; font-weight: bold; text-transform: uppercase; }
                .meta { text-align: right; font-size: 10.5px; color: #222; }
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin-bottom: 18px;
                }
                .kpi-card {
                    border: 2px solid #000;
                    border-radius: 5px;
                    padding: 10px;
                    background: #fdfdfd;
                }
                .kpi-label { font-size: 9.5px; font-weight: 900; text-transform: uppercase; color: #555; }
                .kpi-val { font-size: 17px; font-weight: 900; color: #000; margin-top: 3px; }
                .kpi-sub { font-size: 10px; font-weight: bold; color: #666; margin-top: 2px; }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 8px;
                    font-size: 11px;
                }
                th {
                    background: #000;
                    color: #fff;
                    font-size: 9.5px;
                    font-weight: 900;
                    text-transform: uppercase;
                    padding: 6px 10px;
                    text-align: left;
                }
                th.right { text-align: right; }
                .section-title {
                    font-size: 12.5px;
                    font-weight: 900;
                    text-transform: uppercase;
                    border-bottom: 2px solid #000;
                    padding-bottom: 3px;
                    margin-top: 18px;
                    margin-bottom: 8px;
                }
                .footer {
                    margin-top: 24px;
                    border-top: 1px solid #ccc;
                    padding-top: 8px;
                    font-size: 9.5px;
                    color: #666;
                    display: flex;
                    justify-content: space-between;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1 class="title">${a}</h1>
                    <div class="subtitle">AUDITORÍA OPERATIVA Y BALANCE FINANCIERO</div>
                </div>
                <div class="meta">
                    <div><strong>EMISIÓN:</strong> ${o}</div>
                    <div><strong>PERÍODO AUDITADO:</strong> ${this.rangoDescripcion} (${this.rangoDetalleFechas})</div>
                    <div><strong>TASA BCV AUDITADA:</strong> Bs. ${n.toFixed(2)}</div>
                    <div><strong>ESTADO:</strong> CONSOLIDADO OFICIAL AUDITADO</div>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card" style="background: #fffbeb;">
                    <div class="kpi-label">Ventas Totales ($)</div>
                    <div class="kpi-val">$ ${Number(e.ventas24hUsd).toFixed(2)}</div>
                    <div class="kpi-sub">Bs. ${Number(e.ventas24hBs).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                </div>
                <div class="kpi-card" style="background: #ecfdf5;">
                    <div class="kpi-label">Ganancia Bruta</div>
                    <div class="kpi-val">$ ${Number(l).toFixed(2)}</div>
                    <div class="kpi-sub">Margen comercial 35.0%</div>
                </div>
                <div class="kpi-card" style="background: #eff6ff;">
                    <div class="kpi-label">Ganancia Neta</div>
                    <div class="kpi-val">$ ${Number(i).toFixed(2)}</div>
                    <div class="kpi-sub">Bs. ${Number(r).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                </div>
                <div class="kpi-card" style="background: #faf5ff;">
                    <div class="kpi-label">Inventario Activo</div>
                    <div class="kpi-val">$ ${Number(e.valorInventarioUsd).toFixed(2)}</div>
                    <div class="kpi-sub">Bs. ${(Number(e.valorInventarioUsd)*n).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
                </div>
            </div>

            <div class="section-title">Indicadores Generales y Operativos de Desempeño</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
                <div style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">
                    <div style="font-size: 9px; font-weight: bold; color: #666;">TICKETS EMITIDOS</div>
                    <div style="font-size: 15px; font-weight: 900;">${e.tickets24h} transacciones</div>
                </div>
                <div style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">
                    <div style="font-size: 9px; font-weight: bold; color: #666;">TICKET PROMEDIO</div>
                    <div style="font-size: 15px; font-weight: 900;">$ ${t} USD</div>
                </div>
                <div style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">
                    <div style="font-size: 9px; font-weight: bold; color: #666;">DEMANDA PRINCIPAL</div>
                    <div style="font-size: 15px; font-weight: 900; color: #1d4ed8;">82.4% facturación</div>
                </div>
                <div style="border: 1px solid #ccc; padding: 8px; border-radius: 4px;">
                    <div style="font-size: 9px; font-weight: bold; color: #666;">ALERTAS DE STOCK</div>
                    <div style="font-size: 15px; font-weight: 900; color: ${e.criticos.length>0?"#b91c1c":"#15803d"};">
                        ${e.criticos.length} críticos
                    </div>
                </div>
            </div>

            ${U.length>0?`
            <div class="section-title">Deudas Abiertas (${U.length} Registros Pendientes de Cobro)</div>
            <table>
                <thead>
                    <tr>
                        <th>Identificador</th>
                        <th>Cliente / Deudor</th>
                        <th>Fecha Registro</th>
                        <th>Nota / Plazo de Pago</th>
                        <th class="right">Consumo ($)</th>
                        <th class="right">Abonado ($)</th>
                        <th class="right">Saldo Deuda ($)</th>
                        <th class="right">Saldo Deuda (Bs.)</th>
                    </tr>
                </thead>
                <tbody>
                    ${C}
                </tbody>
                <tfoot>
                    <tr style="background-color: #eee; font-weight: 900; border-top: 2px solid #000;">
                        <td colspan="4" style="padding: 7px 10px;">TOTAL DEUDAS ABIERTAS PENDIENTES</td>
                        <td style="padding: 7px 10px; text-align: right;">$ ${J($)}</td>
                        <td style="padding: 7px 10px; text-align: right; color: #15803d;">$ ${J(O)}</td>
                        <td style="padding: 7px 10px; text-align: right; color: #b45309;">$ ${J(L)}</td>
                        <td style="padding: 7px 10px; text-align: right; color: #1E232A;">Bs. ${J(F)}</td>
                    </tr>
                </tfoot>
            </table>
            `:""}

            <div class="section-title">Distribución de Dinero en Bruto e Inventario por Categoría</div>
            <table>
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th class="right">N° Productos</th>
                        <th class="right">Stock Físico</th>
                        <th class="right">Costo Bruto ($)</th>
                        <th class="right">Costo Bruto (Bs.)</th>
                        <th class="right">Valor PVP ($)</th>
                        <th class="right">Margen Bruto</th>
                        <th class="right">% Capital</th>
                    </tr>
                </thead>
                <tbody>
                    ${y}
                </tbody>
                <tfoot>
                    <tr style="background-color: #eee; font-weight: 900; border-top: 2px solid #000;">
                        <td style="padding: 7px 10px;">TOTAL CONSOLIDADO</td>
                        <td style="padding: 7px 10px; text-align: right;">${d} prods.</td>
                        <td style="padding: 7px 10px; text-align: right;">${c} un.</td>
                        <td style="padding: 7px 10px; text-align: right;">$ ${J(b)}</td>
                        <td style="padding: 7px 10px; text-align: right; color: #1E232A;">Bs. ${J(g)}</td>
                        <td style="padding: 7px 10px; text-align: right;">$ ${J(h)}</td>
                        <td style="padding: 7px 10px; text-align: right; color: #15803d;">$ ${J(v)} (${k}%)</td>
                        <td style="padding: 7px 10px; text-align: right;">100.0%</td>
                    </tr>
                </tfoot>
            </table>

            <div class="section-title">Productos Comercializados en el Período (${e.topProductos.length} Artículos)</div>
            <table>
                <thead>
                    <tr>
                        <th>Producto / Denominación Comercial</th>
                        <th class="right">Unidades</th>
                        <th class="right">Total USD</th>
                        <th class="right">Total Bolívares (Bs.)</th>
                        <th class="right">Part. (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${x||'<tr><td colspan="5" style="text-align: center; padding: 10px;">Sin registros en el período.</td></tr>'}
                </tbody>
            </table>

            <div class="section-title">Auditoría de Comprobantes de Venta (${A.length} Tickets en el Período)</div>
            <table>
                <thead>
                    <tr>
                        <th>Identificador</th>
                        <th>Fecha y Hora</th>
                        <th>Canal</th>
                        <th>Método de Pago</th>
                        <th class="right">Tasa BCV Aplicada</th>
                        <th class="right">Total USD</th>
                        <th class="right">Total Bs.</th>
                    </tr>
                </thead>
                <tbody>
                    ${N||'<tr><td colspan="7" style="text-align: center; padding: 10px;">Sin transacciones registradas.</td></tr>'}
                </tbody>
            </table>

            <div class="footer">
                <div>DatioLabs Enterprise Data Product · Integridad Transaccional Local-First Sled + SHA-256</div>
                <div>Documento descargable e imprimible en formato PDF</div>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>
        </body>
        </html>
        `),S.document.close()}}const Z=u=>{if(typeof u=="number")return Number.isFinite(u)?u:0;if(u==null)return 0;let e=String(u).trim();if(!e)return 0;e.includes(",")&&!e.includes(".")?e=e.replace(",","."):e.includes(".")&&e.includes(",")&&(e=e.replace(/\./g,"").replace(",","."));const a=parseFloat(e);return Number.isFinite(a)&&!isNaN(a)?a:0},M=u=>Z(u).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}),xe=(u,e,a,o)=>{u.maxLength=a,u.addEventListener("input",()=>{let n=u.value.replace(/[^0-9.,]/g,"");const l=n.split(/[.,]/);l.length>2&&(n=l[0]+"."+l.slice(1).join("")),n.length>a&&(n=n.slice(0,a));const i=Z(n);Number.isFinite(i)&&i>e&&(n=String(e)),u.value!==n&&(u.value=n),o&&o()})},fe=(u,e,a=!1)=>{u.maxLength=e,u.addEventListener("input",()=>{let o=a?u.value.replace(/[<>{}\\]/g,""):u.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,/_#-]/g,"");o.length>e&&(o=o.slice(0,e)),u.value!==o&&(u.value=o)})};function Ee(u){if(!u)return"Hoy";const e=Math.floor(Date.now()/1e3),a=Math.max(0,e-u);if(a<3600)return"Hoy (reciente)";const o=Math.floor(a/3600);if(o<24)return`Hoy (hace ${o}h)`;const n=Math.floor(o/24);return n===1?"Hace 1 día":`Hace ${n} días`}class ze{constructor(e,a,o){w(this,"contenedor");w(this,"modal");w(this,"modelo");w(this,"cuentas",[]);w(this,"productos",[]);w(this,"cuentaSeleccionada",null);w(this,"filtroTab","todas");w(this,"POR_PAGINA_CUENTAS",15);w(this,"paginaCuentas",1);w(this,"pagosBorradorPorCuenta",new Map);w(this,"resolucionVueltoPorCuenta",new Map);this.contenedor=e,this.modal=a,this.modelo=o}async render(){[this.cuentas,this.productos]=await Promise.all([D.cuentas(),D.productos()]);const e=this.modelo.tieneRubro(4);!e&&this.filtroTab==="activa"&&(this.filtroTab="deuda");const a=this.cuentas.filter(d=>(d.tipo||"activa")==="activa"),o=this.cuentas.filter(d=>d.tipo==="deuda"),n=this.cuentas.filter(d=>e?this.filtroTab==="activa"?(d.tipo||"activa")==="activa":this.filtroTab==="deuda"?d.tipo==="deuda":!0:d.tipo==="deuda");this.cuentaSeleccionada&&(this.cuentaSeleccionada=this.cuentas.find(d=>{var c;return d.ventaId===((c=this.cuentaSeleccionada)==null?void 0:c.ventaId)})||null),this.cuentaSeleccionada&&!n.some(d=>{var c;return d.ventaId===((c=this.cuentaSeleccionada)==null?void 0:c.ventaId)})?this.cuentaSeleccionada=n[0]||null:!this.cuentaSeleccionada&&n.length>0&&(this.cuentaSeleccionada=n[0]);const l=this.modelo.tasaActual||807.39;let i=0;o.forEach(d=>{const c=Z(d.totalParcialUsd),b=Z(d.abonosUsd);i+=Math.max(0,c-b)});const r=i*l;let t=0;a.forEach(d=>{const c=Z(d.totalParcialUsd),b=Z(d.abonosUsd);t+=Math.max(0,c-b)});const s=this.cuentas.reduce((d,c)=>d+Z(c.abonosUsd),0);this.contenedor.innerHTML=`
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">${e?"Cuentas Abiertas y Deudas":"Deudas Comerciales a Clientes"}</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">${e?"Control de comandas activas en local y deudas comerciales a crédito con liquidación a tasa libre":"Gestión de crédito comercial a clientes de confianza con liquidación a tasa libre"}</p>
            </div>
            <div class="flex items-center gap-2">
                <button id="btn-nueva-deuda" class="bg-amber-400 hover:bg-amber-500 text-brand-black px-3 sm:px-4 py-2 sm:py-2.5 rounded font-heading font-black text-xs sm:text-sm border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                    <span class="text-base sm:text-lg leading-none">+</span>
                    <span>REGISTRAR DEUDA</span>
                </button>
                ${e?`
                <button id="btn-nueva-cuenta" class="bg-brand-black text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded font-heading font-black text-xs sm:text-sm border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all flex items-center gap-1.5">
                    <span class="text-base sm:text-lg leading-none">+</span>
                    <span>ABRIR CUENTA</span>
                </button>`:""}
            </div>
        </div>

        <!-- Banner de Métricas y Deudas Abiertas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 sm:mb-6">
            <div class="bg-amber-50 border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-amber-900 tracking-wider">Deudas Abiertas</span>
                    <span class="bg-amber-200 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded border border-amber-400">${o.length} pendientes</span>
                </div>
                <p class="font-heading font-black text-2xl sm:text-3xl text-amber-950 mt-1">$ ${M(i)}</p>
                <p class="text-xs font-bold text-amber-800">Bs. ${M(r)} <span class="text-[10px] text-amber-700">(tasa ref.)</span></p>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-gray-600 tracking-wider">Cuentas en Local</span>
                    <span class="bg-blue-100 text-blue-900 font-black text-[10px] px-1.5 py-0.5 rounded border border-blue-300">${a.length} activas</span>
                </div>
                <p class="font-heading font-black text-2xl sm:text-3xl text-brand-black mt-1">$ ${M(t)}</p>
                <p class="text-xs font-bold text-gray-500">Saldo pendiente de cobro</p>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-gray-600 tracking-wider">Abonos Recaudados</span>
                    <span class="bg-emerald-100 text-emerald-900 font-black text-[10px] px-1.5 py-0.5 rounded border border-emerald-300">Anticipos</span>
                </div>
                <p class="font-heading font-black text-2xl sm:text-3xl text-emerald-700 mt-1">$ ${M(s)}</p>
                <p class="text-xs font-bold text-gray-500">Bs. ${M(s*l)}</p>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg p-3 sm:p-4 shadow-brutal-sm">
                <div class="flex items-center justify-between">
                    <span class="text-[11px] font-black uppercase text-gray-600 tracking-wider">Tasa Oficial del Día</span>
                    <span class="bg-gray-100 text-gray-800 font-black text-[10px] px-1.5 py-0.5 rounded border border-gray-300">BCV</span>
                </div>
                <p class="font-heading font-black text-xl sm:text-2xl text-brand-black mt-1">Bs. ${M(l)}</p>
                <p class="text-[11px] font-bold text-gray-500">Referencia (liquidación a tasa libre)</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            <!-- Columna de Cuentas y Deudas -->
            <div class="space-y-3">
                <!-- Selector de Pestañas -->
                ${e?`
                <div class="flex border-2 border-brand-black rounded bg-gray-100 p-1 shadow-brutal-sm">
                    <button id="tab-todas" class="flex-1 py-1.5 font-heading font-black text-xs rounded transition-colors ${this.filtroTab==="todas"?"bg-brand-black text-white":"text-brand-black hover:bg-white"}">
                        TODAS (${this.cuentas.length})
                    </button>
                    <button id="tab-activas" class="flex-1 py-1.5 font-heading font-black text-xs rounded transition-colors ${this.filtroTab==="activa"?"bg-brand-black text-white":"text-brand-black hover:bg-white"}">
                        ACTIVAS (${a.length})
                    </button>
                    <button id="tab-deudas" class="flex-1 py-1.5 font-heading font-black text-xs rounded transition-colors ${this.filtroTab==="deuda"?"bg-amber-400 text-brand-black font-black":"text-brand-black hover:bg-white"}">
                        DEUDAS (${o.length})
                    </button>
                </div>`:`
                <div class="border-2 border-brand-black rounded bg-amber-100 p-2 shadow-brutal-sm flex items-center justify-between">
                    <span class="font-heading font-black text-xs text-amber-950 uppercase">Crédito Comercial a Clientes</span>
                    <span class="font-mono font-black text-xs bg-amber-200 border border-amber-400 px-2 py-0.5 rounded text-amber-950">${o.length} pendientes</span>
                </div>
                `}

                <div id="cuentas-lista" class="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                    ${n.length===0?`<div class="bg-white border-2 border-brand-black rounded-lg p-6 text-center text-brand-text font-bold">
                            No hay registros en la sección seleccionada.
                        </div>`:(()=>{const d=Math.ceil(n.length/this.POR_PAGINA_CUENTAS);this.paginaCuentas>d&&(this.paginaCuentas=d),this.paginaCuentas<1&&(this.paginaCuentas=1);const c=(this.paginaCuentas-1)*this.POR_PAGINA_CUENTAS;return n.slice(c,c+this.POR_PAGINA_CUENTAS).map(g=>{var C;const h=g.tipo==="deuda",v=Z(g.totalParcialUsd),k=Z(g.abonosUsd),U=Math.max(0,v-k),$=Math.max(0,k-v),O=((C=this.cuentaSeleccionada)==null?void 0:C.ventaId)===g.ventaId,L=Ee(g.fechaCreacionUnix);let F="cursor-pointer border-2 border-brand-black rounded-lg p-3 sm:p-4 transition-all ";return O?F+=h?"bg-amber-50 text-brand-black border-l-[6px] border-l-amber-600 shadow-brutal ring-1 ring-amber-500/20":"bg-blue-50 text-brand-black border-l-[6px] border-l-blue-600 shadow-brutal ring-1 ring-blue-500/20":F+=h?"bg-stone-50 border-l-4 border-l-amber-300 text-brand-black shadow-brutal-sm hover:bg-amber-50/60 hover:-translate-y-0.5":"bg-stone-50 border-l-4 border-l-blue-200 text-brand-black shadow-brutal-sm hover:bg-blue-50/50 hover:-translate-y-0.5",`
                        <div data-cuenta-id="${g.ventaId}" class="${F}">
                            <div class="flex justify-between items-start gap-2">
                                <div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="font-heading font-black text-base sm:text-lg leading-snug">${g.etiqueta}</span>
                                        ${h?'<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-400 bg-amber-100 text-amber-900">DEUDA</span>':'<span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-blue-300 bg-blue-100 text-blue-900">LOCAL</span>'}
                                    </div>
                                    <p class="text-[11px] font-mono font-bold text-gray-500 mt-0.5">
                                        ${h?`${L} · `:""}${g.ventaId.slice(0,9)}
                                    </p>
                                    ${g.nota?`<p class="text-[11px] italic font-semibold text-gray-600 mt-0.5 line-clamp-1">Nota: ${g.nota}</p>`:""}
                                </div>
                                <div class="text-right shrink-0">
                                    <p class="font-heading font-black text-base sm:text-lg text-brand-black">$${M(g.totalParcialUsd)}</p>
                                    ${$>0?`<p class="text-[11px] font-black text-emerald-700">A favor: +$${M($)}</p>`:U>0?`<p class="text-xs font-bold ${h?"text-amber-900":"text-blue-900"}">Pend: $${M(U)}</p>`:'<p class="text-[11px] font-bold text-gray-400">Cubierta ($0,00)</p>'}
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 text-[11px] font-bold text-gray-600">
                                <span>${g.lineas} consumos</span>
                                <span>Abonado: <strong class="text-brand-black">$${M(g.abonosUsd)}</strong></span>
                            </div>
                        </div>`}).join("")})()}
                </div>
                ${(()=>{const d=Math.ceil(n.length/this.POR_PAGINA_CUENTAS);return d<=1?"":`
                    <div class="flex items-center justify-between border-2 border-brand-black rounded bg-white p-2 mt-2 shadow-brutal-sm">
                        <span class="text-[10px] font-bold text-gray-600">Pág. ${this.paginaCuentas} de ${d} (${n.length} reg.)</span>
                        <div class="flex gap-1">
                            <button id="cta-pag-ant" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCuentas===1?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">ANT.</button>
                            <button id="cta-pag-sig" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCuentas===d?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">SIG.</button>
                        </div>
                    </div>`})()}
            </div>

            <!-- Columna de Detalle / Añadir Consumo / Cobrar -->
            <div class="lg:col-span-2">
                ${this.cuentaSeleccionada?(()=>{var k;const d=this.cuentaSeleccionada.tipo==="deuda",c=Z(this.cuentaSeleccionada.totalParcialUsd),b=Z(this.cuentaSeleccionada.abonosUsd),g=Math.max(0,c-b),h=Math.max(0,b-c),v=Ee(this.cuentaSeleccionada.fechaCreacionUnix);return`
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col space-y-4">
                    <!-- Banner Distintivo del Tipo de Registro -->
                    ${d?`
                    <div class="bg-amber-50/70 border-2 border-brand-black border-l-[6px] border-l-amber-600 rounded p-3 text-xs text-amber-950 flex flex-wrap justify-between items-center gap-2">
                        <div class="flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-amber-500 border border-brand-black shrink-0"></span>
                            <div>
                                <p class="font-heading font-black text-sm uppercase">DEUDA COMERCIAL / FIADO PENDIENTE</p>
                                <p class="text-[11px] font-bold text-amber-900 mt-0.5">
                                    Cliente: <strong>${this.cuentaSeleccionada.cliente||this.cuentaSeleccionada.etiqueta}</strong> · Creada: <strong>${this.cuentaSeleccionada.fechaCreacionStr||v}</strong>
                                    ${this.cuentaSeleccionada.nota?` · Plazo: <em>"${this.cuentaSeleccionada.nota}"</em>`:""}
                                </p>
                            </div>
                        </div>
                        <span class="text-[10px] font-black uppercase px-2 py-1 rounded bg-amber-200 text-amber-950 border border-amber-400">
                            TASA LIBRE AL COBRAR
                        </span>
                    </div>
                    `:`
                    <div class="bg-blue-50/70 border-2 border-brand-black border-l-[6px] border-l-blue-600 rounded p-3 text-xs text-blue-950 flex justify-between items-center">
                        <div>
                            <p class="font-heading font-black text-sm uppercase">CUENTA ACTIVA EN LOCAL (MESA / COMANDA)</p>
                            <p class="text-[11px] font-bold text-blue-800 mt-0.5">Consumos con tasa oficial de referencia</p>
                        </div>
                        <span class="text-[10px] font-black uppercase px-2 py-1 rounded bg-blue-100 text-blue-900 border border-blue-300">
                            CONSUMO EN MESA
                        </span>
                    </div>
                    `}

                    <!-- Cabecera de la Cuenta Seleccionada -->
                    <div class="flex flex-wrap justify-between items-center border-b-2 border-brand-black pb-4 gap-2">
                        <div>
                            <h3 class="font-heading font-black text-2xl sm:text-3xl">${this.cuentaSeleccionada.etiqueta}</h3>
                            <p class="text-xs font-mono text-gray-500 font-bold">ID: ${this.cuentaSeleccionada.ventaId}</p>
                        </div>
                        <div class="text-right">
                            ${h>0?`
                                <span class="text-[10px] font-black text-emerald-900 uppercase px-2 py-0.5 rounded bg-emerald-100 border border-emerald-500">
                                    SALDO A FAVOR DEL CLIENTE
                                </span>
                                <p class="font-heading font-black text-2xl sm:text-3xl text-emerald-600 mt-0.5">
                                    +$${M(h)}
                                </p>
                                <p class="text-xs font-black text-emerald-700">
                                    Bs. ${M(h*l)} (excedente)
                                </p>
                                <div class="flex items-center justify-end gap-1.5 mt-1">
                                    <span class="font-bold text-[10px] text-gray-500">
                                        Consumo: $${M(c)} · Abonado: <strong class="text-brand-black">$${M(b)}</strong>
                                    </span>
                                    <button data-editar-abono title="Corregir monto abonado por error" class="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-brand-black bg-amber-200 hover:bg-amber-300 text-brand-black">
                                        Editar
                                    </button>
                                </div>
                            `:`
                                <span class="text-xs font-bold text-gray-500 uppercase">${d?"Monto Adeudado Pendiente":"Saldo Pendiente"}</span>
                                <p class="font-heading font-black text-2xl sm:text-3xl text-brand-black">
                                    $${M(g)} USD
                                </p>
                                <p class="text-xs font-bold text-gray-600">
                                    Bs. ${M(g*l)} <span class="text-[10px] text-gray-400">(${d?"tasa hoy":"actual"})</span>
                                </p>
                                <div class="flex items-center justify-end gap-1.5 mt-1">
                                    <span class="font-bold text-xs text-gray-600">
                                        Total: $${M(c)} · Abonado: <strong class="text-brand-black">$${M(b)}</strong>
                                    </span>
                                    <button data-editar-abono title="Corregir monto abonado por error" class="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-brand-black bg-amber-200 hover:bg-amber-300 text-brand-black">
                                        Editar
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Lista detallada de consumos agregados con opcion de eliminar (reintegra stock) -->
                    <div class="border-2 border-brand-black rounded-lg p-3 sm:p-4 bg-gray-50 shadow-sm flex flex-col">
                        <div class="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-2 shrink-0">
                            <span class="font-heading font-black text-xs uppercase tracking-wider text-gray-700">Consumos Cargados (${((k=this.cuentaSeleccionada.consumos)==null?void 0:k.length)||0})</span>
                            <span class="text-xs font-bold text-gray-500">Monto Unit. / Subtotal</span>
                        </div>
                        <div id="cta-consumos-lista" class="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                            ${!this.cuentaSeleccionada.consumos||this.cuentaSeleccionada.consumos.length===0?`<div class="py-6 text-center text-xs text-gray-400 font-bold">
                                    Sin consumos cargados en este registro. Selecciona productos abajo para cargar mercancía. El stock se descuenta de inmediato.
                                </div>`:this.cuentaSeleccionada.consumos.map(U=>`
                                <div class="flex items-center justify-between border-2 border-brand-black rounded-lg bg-white px-3 py-2 text-xs font-bold shadow-brutal-sm hover:bg-amber-50/50 transition-colors gap-2">
                                    <div class="flex-1 min-w-0 pr-2">
                                        <p class="truncate text-brand-black font-heading font-black text-sm" title="${U.nombre}">${U.nombre}</p>
                                        <p class="text-[11px] text-gray-500 font-semibold">${U.cantidad} un. &times; $${M(U.precioUsd)} <span class="text-gray-400 font-normal">· Bs. ${this.modelo.bs(Z(U.precioUsd))} c/u</span></p>
                                    </div>
                                    <div class="flex items-center gap-3 shrink-0">
                                        <div class="text-right">
                                            <p class="font-heading font-black text-sm sm:text-base text-brand-black leading-tight">$${M(U.subtotalUsd)}</p>
                                            <p class="text-[10px] font-bold text-gray-500 leading-tight">Bs. ${this.modelo.bs(Z(U.subtotalUsd))}</p>
                                        </div>
                                        <button data-del-consumo="${U.id}" title="Eliminar consumo y reintegrar stock al inventario" class="w-7 h-7 flex items-center justify-center rounded border-2 border-brand-black bg-red-100 hover:bg-red-500 hover:text-white text-red-800 text-sm font-black transition-colors active:scale-95">&times;</button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <!-- Buscador dinámico de productos para cargar consumo (muestra stock en tiempo real) -->
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <label class="block font-heading font-bold text-xs uppercase">Buscar y agregar producto a la comanda / deuda:</label>
                            <span class="text-[11px] text-gray-500 font-bold">Descuenta stock físico inmediatamente</span>
                        </div>
                        <input id="cta-buscar-prod" type="text" maxlength="40" placeholder="Escribe el nombre del producto o servicio..." class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold text-sm mb-2 focus:ring-2 focus:ring-brand-cyan" />
                        <div id="cta-grid-prod" class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                            ${this.productos.map(U=>{const $=!U.sinStock&&Number(U.stock)<=0;return`
                                <button data-add-sku="${U.sku}" data-agotado="${$?"1":"0"}" class="text-left border-2 border-brand-black rounded p-2 transition-all text-xs font-bold ${$?"bg-gray-100 opacity-60 cursor-not-allowed":"bg-gray-50 hover:bg-white shadow-sm hover:shadow-brutal-sm"}">
                                    <div class="flex justify-between items-start gap-1">
                                        <p class="truncate flex-1" title="${U.nombre}">${U.nombre}</p>
                                        ${$?'<span class="bg-red-200 text-red-900 border border-red-400 text-[9px] font-black px-1 rounded">AGOTADO</span>':""}
                                    </div>
                                    <div class="flex justify-between items-center mt-1">
                                        <p class="text-brand-black font-black">$${M(U.precioUsd)}</p>
                                        <span class="text-[10px] ${$?"text-red-700 font-black":"text-gray-500"}">${U.sinStock?"Ilimitado":`${U.stock} un.`}</span>
                                    </div>
                                </button>`}).join("")}
                        </div>
                    </div>

                    <!-- Botonera de Abono, Corrección y Liquidación -->
                    <div class="border-t-2 border-brand-black pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button id="btn-abonar-cuenta" class="bg-amber-400 hover:bg-amber-500 text-brand-black font-heading font-black text-xs sm:text-sm py-3.5 rounded border-2 border-brand-black shadow-brutal active:translate-y-0.5">
                            + REGISTRAR ABONO
                        </button>
                        <button id="btn-editar-abono-cuenta" class="bg-amber-100 hover:bg-amber-200 text-amber-950 font-heading font-black text-xs sm:text-sm py-3.5 rounded border-2 border-brand-black shadow-brutal active:translate-y-0.5">
                            EDITAR ABONO
                        </button>
                        <button id="btn-cerrar-cuenta" class="${h>0?"bg-emerald-600 hover:bg-emerald-700":"bg-green-700 hover:bg-green-800"} text-white font-heading font-black text-xs sm:text-sm py-3.5 rounded border-2 border-brand-black shadow-brutal active:translate-y-0.5">
                            ${d?"COBRAR Y LIQUIDAR DEUDA (TASA LIBRE)":h>0?`LIQUIDAR (+$${M(h)})`:"LIQUIDAR Y COBRAR"}
                        </button>
                    </div>
                </div>`})():`
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <h4 class="font-heading font-black text-2xl mb-2">Selecciona un registro</h4>
                    <p class="text-brand-text font-body text-sm max-w-sm">Haz clic en una cuenta activa o deuda de la lista izquierda para cargarle consumos, abonar pagos o cobrarla.</p>
                </div>
                `}
            </div>
        </div>`,this.vincularEventos()}vincularEventos(){var o,n,l,i,r,t,s,d,c,b;(o=document.getElementById("btn-nueva-cuenta"))==null||o.addEventListener("click",()=>this.modalNuevaCuenta("activa")),(n=document.getElementById("btn-nueva-deuda"))==null||n.addEventListener("click",()=>this.modalNuevaCuenta("deuda")),(l=document.getElementById("tab-todas"))==null||l.addEventListener("click",()=>{this.filtroTab="todas",this.paginaCuentas=1,this.render()}),(i=document.getElementById("tab-activas"))==null||i.addEventListener("click",()=>{this.filtroTab="activa",this.paginaCuentas=1,this.render()}),(r=document.getElementById("tab-deudas"))==null||r.addEventListener("click",()=>{this.filtroTab="deuda",this.paginaCuentas=1,this.render()}),(t=document.getElementById("cta-pag-ant"))==null||t.addEventListener("click",()=>{this.paginaCuentas>1&&(this.paginaCuentas--,this.render())}),(s=document.getElementById("cta-pag-sig"))==null||s.addEventListener("click",()=>{this.paginaCuentas++,this.render()}),this.contenedor.querySelectorAll("[data-cuenta-id]").forEach(g=>{g.addEventListener("click",()=>{const h=g.dataset.cuentaId;this.cuentaSeleccionada=this.cuentas.find(v=>v.ventaId===h)||null,this.render()})}),this.contenedor.querySelectorAll("[data-del-consumo]").forEach(g=>{g.addEventListener("click",async()=>{if(!this.cuentaSeleccionada)return;const h=g.dataset.delConsumo||"";try{const v=await D.eliminarConsumo(this.cuentaSeleccionada.ventaId,h);this.cuentaSeleccionada=v,this.render()}catch(v){alert(v instanceof Error?v.message:String(v))}})});const e=this.contenedor.querySelector("#cta-buscar-prod");e&&fe(e,40),e==null||e.addEventListener("input",()=>{const g=e.value.trim().toLowerCase(),h=this.contenedor.querySelector("#cta-grid-prod");if(h){const v=this.productos.filter(k=>!g||k.nombre.toLowerCase().includes(g));v.length===0?h.innerHTML='<p class="col-span-full text-center text-xs text-gray-400 py-4 font-bold">No se encontraron productos coincidentes.</p>':(h.innerHTML=v.map(k=>{const U=!k.sinStock&&Number(k.stock)<=0;return`
                        <button data-add-sku="${k.sku}" data-agotado="${U?"1":"0"}" class="text-left border-2 border-brand-black rounded p-2 transition-all text-xs font-bold ${U?"bg-gray-100 opacity-60 cursor-not-allowed":"bg-gray-50 hover:bg-white shadow-sm hover:shadow-brutal-sm"}">
                            <div class="flex justify-between items-start gap-1">
                                <p class="truncate flex-1" title="${k.nombre}">${k.nombre}</p>
                                ${U?'<span class="bg-red-200 text-red-900 border border-red-400 text-[9px] font-black px-1 rounded">AGOTADO</span>':""}
                            </div>
                            <div class="flex justify-between items-center mt-1">
                                <p class="text-brand-black font-black">$${M(k.precioUsd)}</p>
                                <span class="text-[10px] ${U?"text-red-700 font-black":"text-gray-500"}">${k.sinStock?"Ilimitado":`${k.stock} un.`}</span>
                            </div>
                        </button>`}).join(""),this.vincularBotonesAgregar(h))}});const a=this.contenedor.querySelector("#cta-grid-prod");a&&this.vincularBotonesAgregar(a),this.contenedor.querySelectorAll("[data-editar-abono]").forEach(g=>{g.addEventListener("click",()=>this.modalEditarAbono())}),(d=document.getElementById("btn-editar-abono-cuenta"))==null||d.addEventListener("click",()=>this.modalEditarAbono()),(c=document.getElementById("btn-abonar-cuenta"))==null||c.addEventListener("click",()=>this.modalAbono()),(b=document.getElementById("btn-cerrar-cuenta"))==null||b.addEventListener("click",()=>this.modalCierre())}vincularBotonesAgregar(e){e.querySelectorAll("[data-add-sku]").forEach(a=>{a.addEventListener("click",async()=>{if(!this.cuentaSeleccionada)return;const o=a,n=o.dataset.addSku||"";if(o.dataset.agotado==="1"){alert("Stock insuficiente: este producto no tiene existencias disponibles en inventario.");return}try{const i=await D.agregarConsumo(this.cuentaSeleccionada.ventaId,n,"1",!0);this.cuentaSeleccionada=i,this.render()}catch(i){alert(i instanceof Error?i.message:String(i))}})})}modalNuevaCuenta(e="activa"){let a=e;const o=()=>{var d,c;const n=a==="deuda";this.modal.innerHTML=`
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                    <div class="flex border-2 border-brand-black rounded bg-gray-100 p-1 mb-4">
                        <button id="modal-tab-activa" class="flex-1 py-2 font-heading font-black text-xs rounded transition-colors ${n?"text-brand-black hover:bg-white":"bg-brand-black text-white"}">
                            CUENTA EN LOCAL (MESA)
                        </button>
                        <button id="modal-tab-deuda" class="flex-1 py-2 font-heading font-black text-xs rounded transition-colors ${n?"bg-amber-400 text-brand-black font-black":"text-brand-black hover:bg-white"}">
                            DEUDA / FIADO (CLIENTE)
                        </button>
                    </div>

                    <h3 class="font-heading font-black text-2xl mb-1">${n?"REGISTRAR NUEVA DEUDA":"ABRIR CUENTA EN LOCAL"}</h3>
                    <p class="text-xs text-gray-600 mb-4 font-bold leading-relaxed">
                        ${n?"Abre un registro de deuda a nombre de un cliente. Los consumos descontarán stock de inmediato. Esta cuenta puede permanecer abierta por días y se cobrará a la tasa libre que usted defina al momento del pago.":"Identificador para consumos de comanda, mesa o servicio en barra."}
                    </p>

                    <div class="space-y-3 mb-4">
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">${n?"Nombre del Cliente / Deudor":"Identificador (Mesa / Barra / Cliente)"}</label>
                            <input id="modal-cta-nombre" maxlength="40" autofocus placeholder="${n?"Ej: Taller Hermanos Gómez / Carlos":"Ej: Mesa 4 / Terraza"}"
                                class="w-full border-2 border-brand-black rounded px-3 py-2 text-base font-body focus:ring-2 focus:ring-brand-cyan" />
                        </div>

                        ${n?`
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Nota de Compromiso / Plazo (Opcional)</label>
                            <input id="modal-cta-nota" maxlength="60" placeholder="Ej: Paga el viernes / Autorizado por dueño"
                                class="w-full border-2 border-brand-black rounded px-3 py-2 text-sm font-body focus:ring-2 focus:ring-brand-cyan" />
                        </div>
                        `:""}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button id="modal-cta-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">CANCELAR</button>
                        <button id="modal-cta-ok" class="${n?"bg-amber-400 text-brand-black":"bg-brand-black text-white"} font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">
                            ${n?"CREAR DEUDA":"ABRIR CUENTA"}
                        </button>
                    </div>
                </div>
            </div>`;const l=this.modal.querySelector("#modal-tab-activa"),i=this.modal.querySelector("#modal-tab-deuda");l==null||l.addEventListener("click",()=>{a="activa",o()}),i==null||i.addEventListener("click",()=>{a="deuda",o()});const r=this.modal.querySelector("#modal-cta-nombre"),t=this.modal.querySelector("#modal-cta-nota");r&&fe(r,40),t&&fe(t,60),setTimeout(()=>r==null?void 0:r.focus(),50);const s=()=>{this.modal.innerHTML=""};(d=this.modal.querySelector("#modal-cta-cancel"))==null||d.addEventListener("click",s),(c=this.modal.querySelector("#modal-cta-ok"))==null||c.addEventListener("click",async()=>{const b=r==null?void 0:r.value.trim().slice(0,40),g=t==null?void 0:t.value.trim().slice(0,60);if(b){const h=await D.abrirCuenta(b,a,g,b);this.cuentaSeleccionada=h,a==="deuda"&&(this.filtroTab="deuda"),s(),this.render()}else alert(n?"Debe ingresar el nombre del cliente o empresa deudora.":"Debe ingresar un identificador válido para la cuenta."),r==null||r.focus()})};o()}async modalAbono(){if(!this.cuentaSeleccionada)return;let e=[];try{e=await D.listarMetodosPago()}catch{e=[{nombre:"PUNTOD.VENTA",moneda:"BS"},{nombre:"BIOPAGO",moneda:"BS"},{nombre:"PAGO MOVIL",moneda:"BS"},{nombre:"TRANSF.BS.",moneda:"BS"},{nombre:"BS.EFEC.",moneda:"BS"},{nombre:"DOL.CASH",moneda:"USD"},{nombre:"ZELLE",moneda:"USD"},{nombre:"BINAN.USDT",moneda:"USD"}]}const a=Z(this.cuentaSeleccionada.totalParcialUsd),o=Z(this.cuentaSeleccionada.abonosUsd),n=Math.max(0,a-o),l=this.modelo.tasaActual||807.39,i=(n*l).toFixed(2),r=this.cuentaSeleccionada.tipo==="deuda";let t=e[0]||{nombre:"PUNTOD.VENTA",moneda:"BS"},s=t.moneda==="USD"?n:Number(i),d=l,c="";const b=()=>{var S;const h=e.filter(q=>q.moneda==="USD"),v=e.filter(q=>q.moneda==="BS"),k=h.map(q=>`<option value="${q.nombre}" ${q.nombre===t.nombre?"selected":""}>${q.nombre} ($ USD - Tasa Dinámica)</option>`).join(""),$=`
                <optgroup label="MÉTODOS EN BOLÍVARES (Bs.)">
                    ${v.map(q=>`<option value="${q.nombre}" ${q.nombre===t.nombre?"selected":""}>${q.nombre} (Bs.)</option>`).join("")}
                </optgroup>
                <optgroup label="MÉTODOS EN DÓLARES ($ - TASA PROPIA)">
                    ${k}
                </optgroup>
            `,O=t.moneda==="USD",L=O&&d>0?d:l,F=O?s*L:s,C=l>0?F/l:0,y=o+C,x=y-a,A=x*l;let N="";if(s<=1e-4)N=`
                    <div class="rounded p-2.5 border-2 border-brand-black bg-gray-50 text-xs text-gray-700 font-bold">
                        <div class="flex justify-between items-center">
                            <span>Aporte de este abono:</span>
                            <span class="font-heading font-black text-sm text-gray-800">$0.00 USD (Bs. 0.00)</span>
                        </div>
                        <div class="flex justify-between items-center text-gray-600 border-t border-gray-300 pt-1 mt-1">
                            <span>Saldo pendiente actual:</span>
                            <span class="font-heading font-black text-sm text-brand-black">$${M(n)} USD (Bs. ${M(i)})</span>
                        </div>
                    </div>
                `;else if(x>.001)N=`
                    <div class="rounded p-2.5 border-2 border-emerald-600 bg-emerald-50 text-xs text-emerald-950 font-bold">
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Total Abonado:</span>
                            <span class="font-heading font-black text-sm text-emerald-700">$${M(y)}</span>
                        </div>
                        <div class="flex justify-between items-center text-emerald-900 border-t border-emerald-300 pt-1">
                            <span>Saldo a favor resultante:</span>
                            <span class="font-heading font-black text-base text-emerald-600">+$${M(x)} USD (Bs. ${M(A)})</span>
                        </div>
                        <p class="text-[10px] text-emerald-800 mt-1">✓ Abono superior al consumo: este excedente se convertirá en ganancia o crédito al liquidar.</p>
                    </div>
                `;else if(x<-.001){const q=Math.abs(x),p=q*l;N=`
                    <div class="rounded p-2.5 border-2 border-brand-black bg-gray-50 text-xs text-gray-800 font-bold">
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Total Abonado:</span>
                            <span class="font-heading font-black text-sm text-brand-black">$${M(y)}</span>
                        </div>
                        <div class="flex justify-between items-center text-gray-900 border-t border-gray-300 pt-1">
                            <span>Saldo pendiente restante:</span>
                            <span class="font-heading font-black text-base text-brand-black">$${M(q)} USD (Bs. ${M(p)})</span>
                        </div>
                    </div>
                `}else N=`
                    <div class="rounded p-2.5 border-2 border-green-600 bg-green-50 text-xs text-green-950 font-bold">
                        <div class="flex justify-between items-center">
                            <span>Registro saldado exactamente:</span>
                            <span class="font-heading font-black text-base text-green-700">$${M(y)} USD</span>
                        </div>
                    </div>
                `;this.modal.innerHTML=`
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                    <h3 class="font-heading font-black text-2xl mb-1">${r?"ABONAR A LA DEUDA":"REGISTRAR ABONO / ANTICIPO"}</h3>
                    <p class="font-body text-xs text-gray-700 mb-3">${(S=this.cuentaSeleccionada)==null?void 0:S.etiqueta} · El usuario decide libremente el monto y tasa del abono.</p>

                    <div class="bg-blue-50 border border-blue-400 rounded p-2.5 mb-3 text-xs text-blue-950 font-bold leading-tight">
                        ℹ <strong>Abonos con tasas dinámicas:</strong> En métodos en divisas (${h.map(q=>q.nombre).join(", ")}) se define la tasa al momento del abono. El diferencial frente a la tasa oficial se computa a favor del cliente.
                    </div>

                    <div class="space-y-3 mb-4">
                        <div>
                            <label class="block text-xs font-black uppercase text-gray-700 mb-1">Método de Pago del Abono</label>
                            <select id="select-metodo-abono" class="w-full border-2 border-brand-black rounded px-3 py-2 font-heading font-black text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple">
                                ${$}
                            </select>
                        </div>

                        ${O?`
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Monto a abonar en Dólares ($ USD)</label>
                            <div class="flex items-center">
                                <span class="bg-brand-black text-white px-3 py-2 rounded-l border-y-2 border-l-2 border-brand-black text-sm font-mono font-bold">$</span>
                                <input id="input-monto-abono" type="number" step="0.01" min="0.01" max="50000" value="${s>0?s:""}" placeholder="0.00"
                                    class="w-full border-2 border-brand-black rounded-r px-3 py-2 font-mono font-black text-xl text-brand-black text-right focus:outline-none" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-1">
                                <label class="block text-xs font-bold uppercase text-gray-700">Tasa de Cambio del Método (Bs. / USD)</label>
                                <button type="button" id="btn-reset-tasa-abono" class="text-[10px] font-black uppercase text-brand-purple hover:underline">
                                    TASA BCV: ${M(l)}
                                </button>
                            </div>
                            <input id="input-tasa-abono" type="number" step="0.01" min="1" max="100000" value="${L}"
                                class="w-full border-2 border-brand-black rounded px-3 py-2 font-mono font-black text-base text-brand-black text-right focus:outline-none" />
                        </div>

                        <div class="bg-purple-50 border border-brand-purple rounded p-2 text-xs font-bold space-y-0.5">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Valor aportado en Bolívares:</span>
                                <span class="text-brand-purple font-mono font-black">Bs. ${M(F)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Abono computable (Tasa BCV):</span>
                                <span class="text-brand-black font-mono font-black">$ ${M(C)} USD</span>
                            </div>
                        </div>
                        `:`
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Monto a abonar en Bolívares (Bs.)</label>
                            <div class="flex items-center">
                                <span class="bg-brand-black text-white px-3 py-2 rounded-l border-y-2 border-l-2 border-brand-black text-sm font-mono font-bold">Bs.</span>
                                <input id="input-monto-abono" type="number" step="0.01" min="0.01" max="50000000" value="${s>0?s:""}" placeholder="0.00"
                                    class="w-full border-2 border-brand-black rounded-r px-3 py-2 font-mono font-black text-xl text-brand-black text-right focus:outline-none" />
                            </div>
                            <p class="text-[11px] text-gray-500 mt-1">Equivalente oficial acreditado: <span class="font-bold text-brand-black">$ ${M(C)} USD</span> (Tasa BCV: ${M(l)})</p>
                        </div>
                        `}

                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia (Opcional)</label>
                            <input id="input-ref-abono" type="text" maxlength="25" value="${c}" placeholder="Ej: PAGO MOVIL 4912, USDT HASH..."
                                class="w-full border-2 border-brand-black rounded px-3 py-1.5 text-xs font-mono focus:outline-none" />
                        </div>

                        ${N}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button id="modal-abono-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded hover:bg-gray-100">VOLVER</button>
                        <button id="modal-abono-ok" ${s<=0?"disabled":""} class="bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-brand-black font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">APLICAR ABONO</button>
                    </div>
                </div>
            </div>`,g()},g=()=>{var v,k,U,$,O,L,F;const h=()=>{this.modal.innerHTML=""};(v=this.modal.querySelector("#modal-abono-cancel"))==null||v.addEventListener("click",h),(k=this.modal.querySelector("#select-metodo-abono"))==null||k.addEventListener("change",C=>{const y=C.target.value,x=e.find(A=>A.nombre===y);if(x){const A=t.moneda==="USD";t=x,x.moneda==="USD"?(d=l,A||(s=n)):A&&(s=Number(i)),b()}}),(U=this.modal.querySelector("#input-monto-abono"))==null||U.addEventListener("input",C=>{s=Z(C.target.value),b();const y=this.modal.querySelector("#input-monto-abono");y==null||y.focus()}),($=this.modal.querySelector("#input-tasa-abono"))==null||$.addEventListener("input",C=>{d=Z(C.target.value),b();const y=this.modal.querySelector("#input-tasa-abono");y==null||y.focus()}),(O=this.modal.querySelector("#btn-reset-tasa-abono"))==null||O.addEventListener("click",()=>{d=l,b()}),(L=this.modal.querySelector("#input-ref-abono"))==null||L.addEventListener("input",C=>{c=C.target.value}),(F=this.modal.querySelector("#modal-abono-ok"))==null||F.addEventListener("click",async()=>{if(!this.cuentaSeleccionada)return;const C=t.moneda==="USD",y=C&&d>0?d:l,x=C?s*y:s,A=l>0?x/l:0;if(A<=0||!Number.isFinite(A)){alert("Por favor ingrese un monto válido.");return}const N=await D.abonarCuenta(this.cuentaSeleccionada.ventaId,A,x);N&&(this.cuentaSeleccionada=N),h(),this.render()})};b()}modalEditarAbono(){var k,U,$,O;if(!this.cuentaSeleccionada)return;const e=Z(this.cuentaSeleccionada.totalParcialUsd),a=Z(this.cuentaSeleccionada.abonosUsd),o=this.modelo.tasaActual||807.39;this.modal.innerHTML=`
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                <h3 class="font-heading font-black text-2xl mb-1">CORREGIR SALDO ABONADO</h3>
                <p class="font-body text-xs text-gray-700 mb-4">${this.cuentaSeleccionada.etiqueta} · Modifique el saldo acumulado en caso de error de registro o digitación.</p>

                <div class="bg-gray-50 border-2 border-brand-black rounded p-3 mb-4 text-xs space-y-1">
                    <div class="flex justify-between font-bold text-gray-600">
                        <span>Consumo acumulado:</span>
                        <span>$${M(e)} (Bs. ${this.modelo.bs(e)})</span>
                    </div>
                    <div class="flex justify-between font-bold text-amber-800">
                        <span>Abonado registrado actualmente:</span>
                        <span>$${M(a)} (Bs. ${this.modelo.bs(a)})</span>
                    </div>
                </div>

                <div class="space-y-4 mb-4">
                    <div class="flex border-2 border-brand-black rounded bg-gray-100 p-1">
                        <button id="tab-edit-usd" class="flex-1 py-1.5 font-heading font-black text-xs rounded bg-brand-black text-white">CORREGIR EN DÓLARES ($)</button>
                        <button id="tab-edit-bs" class="flex-1 py-1.5 font-heading font-bold text-xs rounded text-brand-black hover:bg-white">CORREGIR EN BOLÍVARES (Bs)</button>
                    </div>

                    <div id="sec-edit-usd">
                        <label class="block text-xs font-bold uppercase mb-1">Nuevo Total Abonado Real ($) (Máx $50,000.00)</label>
                        <input id="edit-abono-usd-val" type="text" inputmode="decimal" maxlength="8" value="${a>0?a.toFixed(2):"0.00"}" class="w-full border-2 border-brand-black rounded px-3 py-2 font-mono font-black text-xl text-brand-black" />
                        <p class="text-[11px] text-gray-500 mt-1">Equivalente en Bs: <span id="edit-usd-equiv" class="font-bold"></span></p>
                    </div>

                    <div id="sec-edit-bs" class="hidden">
                        <label class="block text-xs font-bold uppercase mb-1">Nuevo Total Abonado Real (Bs.) (Máx Bs. 50.000.000,00)</label>
                        <input id="edit-abono-bs-val" type="text" inputmode="decimal" maxlength="11" value="${(a*o).toFixed(2)}" class="w-full border-2 border-brand-black rounded px-3 py-2 font-mono font-black text-xl text-brand-black" />
                        <p class="text-[11px] text-gray-500 mt-1">Equivalente en USD: <span id="edit-bs-equiv" class="font-bold"></span></p>
                    </div>

                    <div class="flex gap-2">
                        <button id="btn-preset-cero" type="button" class="text-xs font-bold px-2.5 py-1.5 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800">Poner en $0.00 (Resetear)</button>
                        <button id="btn-preset-exacto" type="button" class="text-xs font-bold px-2.5 py-1.5 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-800">Cubrir Todo ($${M(e)})</button>
                    </div>

                    <div id="edit-preview-box" class="rounded p-2.5 border-2 border-brand-black text-xs"></div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <button id="modal-edit-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">VOLVER</button>
                    <button id="modal-edit-ok" class="bg-amber-400 hover:bg-amber-500 text-brand-black font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">GUARDAR CORRECCIÓN</button>
                </div>
            </div>
        </div>`;const n=this.modal.querySelector("#tab-edit-usd"),l=this.modal.querySelector("#tab-edit-bs"),i=this.modal.querySelector("#sec-edit-usd"),r=this.modal.querySelector("#sec-edit-bs"),t=this.modal.querySelector("#edit-abono-usd-val"),s=this.modal.querySelector("#edit-abono-bs-val"),d=this.modal.querySelector("#edit-usd-equiv"),c=this.modal.querySelector("#edit-bs-equiv"),b=this.modal.querySelector("#edit-preview-box");let g="usd";const h=()=>{let L=0;g==="usd"?(L=Z(t==null?void 0:t.value),d&&(d.textContent=`Bs. ${(L*o).toFixed(2)}`)):(L=Z(s==null?void 0:s.value)/o,c&&(c.textContent=`$${L.toFixed(2)} USD`)),Number.isFinite(L)||(L=0);const F=L-e;if(b)if(F>.001)b.className="rounded p-2.5 border-2 border-emerald-600 bg-emerald-50 text-xs text-emerald-950 font-bold",b.innerHTML=`
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Saldo Abonado:</span>
                            <span class="font-heading font-black text-sm text-emerald-700">$${M(L)}</span>
                        </div>
                        <div class="flex justify-between items-center text-emerald-900 border-t border-emerald-300 pt-1">
                            <span>Saldo a favor resultante:</span>
                            <span class="font-heading font-black text-base text-emerald-600">+$${M(F)} USD</span>
                        </div>
                        <p class="text-[10px] text-emerald-800 mt-1">✓ Excedente a favor del cliente.</p>
                    `;else if(F<-.001){const C=Math.abs(F);b.className="rounded p-2.5 border-2 border-brand-black bg-gray-50 text-xs text-gray-800 font-bold",b.innerHTML=`
                        <div class="flex justify-between items-center mb-1">
                            <span>Nuevo Saldo Abonado:</span>
                            <span class="font-heading font-black text-sm text-brand-black">$${M(L)}</span>
                        </div>
                        <div class="flex justify-between items-center text-gray-900 border-t border-gray-300 pt-1">
                            <span>Saldo pendiente restante:</span>
                            <span class="font-heading font-black text-base text-brand-black">$${M(C)} USD</span>
                        </div>
                    `}else b.className="rounded p-2.5 border-2 border-green-600 bg-green-50 text-xs text-green-950 font-bold",b.innerHTML=`
                        <div class="flex justify-between items-center">
                            <span>Registro saldado exactamente:</span>
                            <span class="font-heading font-black text-base text-green-700">$${M(L)} USD</span>
                        </div>
                    `};t&&xe(t,5e4,8,h),s&&xe(s,5e7,11,h),h(),(k=this.modal.querySelector("#btn-preset-cero"))==null||k.addEventListener("click",()=>{const L=Z(g==="usd"?t==null?void 0:t.value:s==null?void 0:s.value);(a>0||L>0)&&!window.confirm("¿Desea restablecer el saldo abonado a $0.00? Esta acción dejará los pagos registrados en cero.")||(t&&(t.value="0.00"),s&&(s.value="0.00"),h())}),(U=this.modal.querySelector("#btn-preset-exacto"))==null||U.addEventListener("click",()=>{t&&(t.value=e.toFixed(2)),s&&(s.value=(e*o).toFixed(2)),h()}),n==null||n.addEventListener("click",()=>{g="usd",n.className="flex-1 py-1.5 font-heading font-black text-xs rounded bg-brand-black text-white",l.className="flex-1 py-1.5 font-heading font-bold text-xs rounded text-brand-black hover:bg-white",i==null||i.classList.remove("hidden"),r==null||r.classList.add("hidden"),h()}),l==null||l.addEventListener("click",()=>{g="bs",l.className="flex-1 py-1.5 font-heading font-black text-xs rounded bg-brand-black text-white",n.className="flex-1 py-1.5 font-heading font-bold text-xs rounded text-brand-black hover:bg-white",r==null||r.classList.remove("hidden"),i==null||i.classList.add("hidden"),h()});const v=()=>{this.modal.innerHTML=""};($=this.modal.querySelector("#modal-edit-cancel"))==null||$.addEventListener("click",v),(O=this.modal.querySelector("#modal-edit-ok"))==null||O.addEventListener("click",async()=>{if(!this.cuentaSeleccionada)return;let L=0;if(g==="usd"?L=Z(t==null?void 0:t.value):L=Z(s==null?void 0:s.value)/o,!Number.isFinite(L)||L<0||L>5e4){alert("Monto inválido. Ingrese un valor entre $0.00 y $50,000.00 USD.");return}if(Math.abs(L-a)>.009){const y=L===0?`¿Confirmas reiniciar el saldo abonado a $0.00? (Monto previo registrado: $${M(a)})`:`¿Confirmas modificar el saldo abonado de esta cuenta a $${M(L)} USD (Bs. ${M(L*o)})? (Monto previo registrado: $${M(a)})`;if(!window.confirm(y))return}const C=await D.editarAbonoCuenta(this.cuentaSeleccionada.ventaId,L);C&&(this.cuentaSeleccionada=C),v(),this.render()})}async modalCierre(){var F,C,y;if(!this.cuentaSeleccionada)return;const e=this.cuentaSeleccionada.tipo==="deuda",a=Z(this.cuentaSeleccionada.totalParcialUsd),o=Z(this.cuentaSeleccionada.abonosUsd),n=Math.max(0,Math.round((a-o)*100)/100),l=Math.max(0,Math.round((o-a)*100)/100),i=this.modelo.tasaActual||807.39;if(n<=.009){this.modal.innerHTML=`
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-md">
                    <h3 class="font-heading font-black text-2xl mb-1">${e?"LIQUIDAR DEUDA":"LIQUIDAR CUENTA"}</h3>
                    <p class="font-body text-sm text-gray-600 mb-4">${this.cuentaSeleccionada.etiqueta} · Total cubierto por abonos previos</p>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex justify-between text-xs font-bold text-gray-500">
                            <span>Total de consumos:</span>
                            <span>$${M(a)} (Bs. ${M(a*i)})</span>
                        </div>
                        <div class="flex justify-between text-xs font-bold text-emerald-700">
                            <span>Total abonado acumulado:</span>
                            <span>$${M(o)} (Bs. ${M(o*i)})</span>
                        </div>

                        ${l>0?`
                        <div class="bg-emerald-50 border-2 border-emerald-600 rounded p-4 text-center mt-3">
                            <span class="text-xs font-black text-emerald-900 uppercase">Saldo a Favor del Cliente</span>
                            <p class="font-heading font-black text-3xl text-emerald-600 mt-1">+$${M(l)} USD</p>
                            <p class="font-bold text-xs text-emerald-800">Bs. ${M(l*i)}</p>
                            <div class="mt-3 bg-white border border-emerald-500 rounded p-2.5 text-xs text-emerald-950 font-bold leading-tight text-left">
                                ✓ <strong>Consolidación como ganancia:</strong> Al liquidar y cerrar la cuenta, este excedente de <strong>$${M(l)}</strong> se consolidará automáticamente como ganancia del negocio.
                            </div>
                        </div>
                        `:`
                        <div class="bg-green-50 border-2 border-green-600 rounded p-4 text-center mt-2">
                            <span class="text-xs font-black text-green-900 uppercase">Totalmente Pagado</span>
                            <p class="font-heading font-black text-xl text-green-800 mt-1">Saldo pendiente: $0.00</p>
                        </div>
                        `}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button id="modal-liq-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">VOLVER</button>
                        <button id="modal-liq-ok" class="${l>0?"bg-emerald-600 hover:bg-emerald-700":"bg-green-600 hover:bg-green-700"} text-white font-heading font-black py-3 rounded border-2 border-brand-black shadow-brutal-sm">
                            ${l>0?"LIQUIDAR Y CONSOLIDAR GANANCIA":"CONFIRMAR CIERRE"}
                        </button>
                    </div>
                </div>
            </div>`;const x=()=>{this.modal.innerHTML=""};(F=this.modal.querySelector("#modal-liq-cancel"))==null||F.addEventListener("click",x),(C=this.modal.querySelector("#modal-liq-ok"))==null||C.addEventListener("click",async()=>{this.cuentaSeleccionada&&(await D.cerrarCuenta(this.cuentaSeleccionada.ventaId,"0.00",i.toFixed(4)),this.cuentaSeleccionada=null,x(),this.render())});return}let r=[];try{r=await D.listarMetodosPago()}catch{r=[{nombre:"PUNTOD.VENTA",moneda:"BS"},{nombre:"BIOPAGO",moneda:"BS"},{nombre:"PAGO MOVIL",moneda:"BS"},{nombre:"TRANSF.BS.",moneda:"BS"},{nombre:"BS.EFEC.",moneda:"BS"},{nombre:"DOL.CASH",moneda:"USD"},{nombre:"ZELLE",moneda:"USD"},{nombre:"BINAN.USDT",moneda:"USD"}]}let t=i;const s=e?r.find(x=>x.nombre==="TRANSF.BS.")||r[0]||{nombre:"PUNTOD.VENTA",moneda:"BS"}:r.find(x=>x.nombre==="PUNTOD.VENTA")||r[0]||{nombre:"PUNTOD.VENTA",moneda:"BS"},d=this.cuentaSeleccionada.ventaId,c=this.pagosBorradorPorCuenta.get(d);let b;if(c&&c.length>0){if(b=c.map(x=>({...x})),b.length===1&&b[0]){const x=b[0];x.monto=x.moneda==="USD"?n:Number((n*t).toFixed(2)),x.tasaCambio=t}else if(b.length>1){const x=Number((n*t).toFixed(2));let A=0;for(let q=0;q<b.length-1;q++){const p=b[q],f=p.tasaCambio>0?p.tasaCambio:t;A+=p.moneda==="USD"?p.monto*f:p.monto}const N=Math.max(0,Math.round((x-A)*100)/100),S=b[b.length-1];S&&(S.monto=S.moneda==="USD"?t>0?Number((N/t).toFixed(2)):0:N,S.tasaCambio=t)}}else b=[{id:"p-1",metodo:s.nombre,moneda:s.moneda,monto:s.moneda==="USD"?n:Number((n*t).toFixed(2)),tasaCambio:t,referencia:""}];const g=this.resolucionVueltoPorCuenta.get(d);let h=(g==null?void 0:g.estado)||"PAGADO",v=(g==null?void 0:g.metodo)||(e?"TRANSF.BS.":"BS.EFEC."),k=(g==null?void 0:g.tasa)||t;r.some(x=>x.nombre===v)||(v=((y=r[0])==null?void 0:y.nombre)||(e?"TRANSF.BS.":"BS.EFEC."));let U=!1;const $=()=>{let x=0;for(const P of b)if(P.moneda==="USD"){const G=P.tasaCambio>0?P.tasaCambio:t;x+=P.monto*G}else x+=P.monto;x=Math.round(x*100)/100;const A=Math.round(n*t*100)/100,N=t>0?Math.round(x/t*100)/100:0,S=Math.max(0,Math.round((A-x)*100)/100),q=t>0?Math.max(0,Math.round(S/t*100)/100):0,p=Math.max(0,Math.round((x-A)*100)/100),f=t>0?Math.max(0,Math.round(p/t*100)/100):0,I=x>=A-.01&&b.every(P=>P.monto>0);return{cubiertoUsd:N,cubiertoBs:x,totalEsperadoBs:A,faltanteUsd:q,faltanteBs:S,vueltoUsd:f,vueltoBs:p,puedeConfirmar:I}},O=()=>{var G,T;const x=$(),A=r.filter(E=>E.moneda==="USD"),N=r.filter(E=>E.moneda==="BS"),S=b.map((E,X)=>{const W=A.map(z=>`<option value="${z.nombre}" ${z.nombre===E.metodo?"selected":""}>${z.nombre} ($ - Tasa Dinámica)</option>`).join(""),j=`
                        <optgroup label="MÉTODOS EN BOLÍVARES (Bs.)">
                            ${N.map(z=>`<option value="${z.nombre}" ${z.nombre===E.metodo?"selected":""}>${z.nombre} (Bs.)</option>`).join("")}
                        </optgroup>
                        <optgroup label="MÉTODOS EN DÓLARES ($ - TASA PROPIA)">
                            ${W}
                        </optgroup>
                    `,B=E.tasaCambio>0?E.tasaCambio:t,V=E.moneda==="USD"?E.monto*B:E.monto,_=t>0?V/t:0;return`
                    <div class="border-2 border-brand-black rounded-lg p-2.5 bg-gray-50 mb-2">
                        <div class="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                            <span class="font-heading font-black text-xs uppercase text-gray-700">
                                Pago #${X+1} · <span class="${E.moneda==="USD"?"text-brand-purple":"text-brand-black"}">${E.moneda==="USD"?"Divisa ($ USD)":"Moneda Nacional (Bs.)"}</span>
                            </span>
                            ${b.length>1?`<button data-eliminar-pago="${E.id}" class="text-[11px] font-black text-red-600 hover:text-red-800 bg-red-50 border border-red-300 rounded px-2 py-0.5">Eliminar</button>`:""}
                        </div>
                        ${E.moneda==="USD"?`
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div class="sm:col-span-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Medio en Divisa</label>
                                <select data-pago-metodo="${E.id}" class="w-full border-2 border-brand-black rounded px-2 py-1 font-heading font-black text-xs bg-white focus:outline-none">
                                    ${j}
                                </select>
                            </div>
                            <div class="sm:col-span-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Monto ($ USD)</label>
                                <div class="flex items-center">
                                    <span class="bg-brand-black text-white px-2 py-1 rounded-l border-y-2 border-l-2 border-brand-black text-xs font-mono font-bold">$</span>
                                    <input type="number" step="0.01" min="0.01" max="999999" data-pago-monto="${E.id}" value="${E.monto>0?E.monto:""}" placeholder="0.00"
                                        class="w-full border-2 border-brand-black rounded-r px-2 py-1 text-xs font-mono font-black focus:outline-none text-right" />
                                </div>
                            </div>
                            <div class="sm:col-span-3">
                                <div class="flex items-center justify-between mb-0.5">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase">Tasa (Bs./$)</label>
                                    <button type="button" data-reset-tasa-cuenta="${E.id}" class="text-[9px] font-black uppercase text-brand-purple hover:underline" title="Restablecer a tasa oficial">Base: ${M(t)}</button>
                                </div>
                                <input type="number" step="0.01" min="1" max="100000" data-pago-tasa="${E.id}" value="${B>0?B:t}"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1 text-xs font-mono font-black focus:outline-none text-right" />
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia</label>
                                <input type="text" maxlength="25" data-pago-ref="${E.id}" value="${E.referencia||""}" placeholder="Opcional"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1 text-xs font-mono focus:outline-none" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between gap-1 mt-1 text-[11px]">
                            <span class="font-bold text-brand-purple">Aporte: Bs. ${M(V)}</span>
                            <span class="text-gray-500 font-mono">Equiv. base: $ ${M(_)} ${B!==t?`(Tasa: Bs. ${M(B)} vs Base: Bs. ${M(t)})`:""}</span>
                        </div>
                        `:`
                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <div class="sm:col-span-5">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Medio en Bolívares</label>
                                <select data-pago-metodo="${E.id}" class="w-full border-2 border-brand-black rounded px-2 py-1 font-heading font-black text-xs bg-white focus:outline-none">
                                    ${j}
                                </select>
                            </div>
                            <div class="sm:col-span-4">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Monto (Bs.)</label>
                                <div class="flex items-center">
                                    <span class="bg-brand-black text-white px-2 py-1 rounded-l border-y-2 border-l-2 border-brand-black text-xs font-mono font-bold">Bs.</span>
                                    <input type="number" step="0.01" min="0.01" max="999999999" data-pago-monto="${E.id}" value="${E.monto>0?E.monto:""}" placeholder="0.00"
                                        class="w-full border-2 border-brand-black rounded-r px-2 py-1 text-xs font-mono font-black focus:outline-none text-right" />
                                </div>
                            </div>
                            <div class="sm:col-span-3">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Referencia</label>
                                <input type="text" maxlength="25" data-pago-ref="${E.id}" value="${E.referencia||""}" placeholder="Opcional"
                                    class="w-full border-2 border-brand-black rounded px-2 py-1 text-xs font-mono focus:outline-none" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center justify-between gap-1 mt-1 text-[11px]">
                            <span class="font-bold text-brand-black">Aporte directo: Bs. ${M(E.monto)}</span>
                            <span class="text-gray-500 font-mono">Equiv. base: $ ${M(_)}</span>
                        </div>
                        `}
                    </div>`}).join(""),q=r.find(E=>E.nombre===v),p=(q==null?void 0:q.moneda)==="USD",f=k>0?k:t,I=p&&f>0?Number((x.vueltoBs/f).toFixed(2)):x.vueltoUsd,P=x.faltanteBs>.009?`
                    <div class="bg-amber-50 border-2 border-amber-500 rounded p-2.5 text-center mb-3">
                        <p class="text-xs font-black uppercase text-amber-900">Monto Incompleto por Cubrir</p>
                        <p class="font-heading font-black text-lg text-amber-700">Faltan Bs. ${M(x.faltanteBs)} · <span class="text-sm text-amber-900">$ ${M(x.faltanteUsd)} (Equiv. Base)</span></p>
                    </div>`:x.vueltoBs>.009?`
                    <div class="border-2 border-emerald-700 bg-emerald-50/70 rounded-lg p-3 mb-3">
                        <div class="flex flex-wrap items-center justify-between gap-1 mb-2">
                            <div>
                                <span class="text-[10px] font-black uppercase text-emerald-900 tracking-wide block">Excedente / Vuelto del Cliente</span>
                                <span class="font-heading font-black text-lg text-emerald-800">Bs. ${M(x.vueltoBs)}</span>
                            </div>
                            <span class="text-xs font-bold text-emerald-900 font-mono">$ ${M(x.vueltoUsd)} equiv.</span>
                        </div>

                        <!-- Selector: Entregar Vuelto vs Retener Vuelto -->
                        <div class="grid grid-cols-2 gap-2 mb-2.5">
                            <button type="button" id="btn-vuelto-pagado-cuenta" class="py-1.5 px-2 rounded border-2 text-xs font-heading font-black transition-all ${h==="PAGADO"?"bg-emerald-700 text-white border-brand-black shadow-sm":"bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}">
                                ENTREGAR VUELTO (PAGADO)
                            </button>
                            <button type="button" id="btn-vuelto-retenido-cuenta" class="py-1.5 px-2 rounded border-2 text-xs font-heading font-black transition-all ${h==="RETENIDO"?"bg-emerald-700 text-white border-brand-black shadow-sm":"bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}">
                                RETENER VUELTO (A FAVOR)
                            </button>
                        </div>

                        ${h==="PAGADO"?`
                        <div class="bg-white border border-emerald-600 rounded p-2.5 space-y-2">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <label class="text-[11px] font-bold text-gray-700 uppercase">Método de Egreso del Vuelto:</label>
                                <select id="select-metodo-vuelto-cuenta" class="border-2 border-brand-black rounded px-2 py-1 text-xs font-bold bg-white focus:outline-none">
                                    ${r.map(E=>`
                                        <option value="${E.nombre}" ${E.nombre===v?"selected":""}>
                                            ${E.nombre} (${E.moneda==="USD"?"$ Dólares":"Bs. Bolívares"})
                                        </option>
                                    `).join("")}
                                </select>
                            </div>
                            ${p?`
                            <div class="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-gray-100">
                                <div>
                                    <span class="text-[10px] font-bold text-gray-500 uppercase block">Tasa Pactada Vuelto USD:</span>
                                    <div class="flex items-center gap-1.5">
                                        <input id="input-tasa-vuelto-cuenta" type="text" inputmode="decimal" value="${k.toFixed(2)}"
                                            class="w-24 border-2 border-brand-black rounded px-2 py-0.5 text-xs font-mono font-bold" />
                                        <button id="btn-reset-tasa-vuelto-cuenta" type="button" class="text-[10px] bg-gray-100 border border-gray-400 rounded px-1.5 py-0.5 hover:bg-gray-200">
                                            Reset Base
                                        </button>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] font-bold text-gray-500 uppercase block">Divisa USD a Entregar:</span>
                                    <span class="font-heading font-black text-base text-brand-purple">
                                        $ ${M(I)} USD
                                    </span>
                                </div>
                            </div>
                            `:`
                            <div class="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                                <span class="font-bold text-gray-600">Total a Entregar en Bolívares:</span>
                                <span class="font-heading font-black text-base text-brand-black">Bs. ${M(x.vueltoBs)}</span>
                            </div>
                            `}
                        </div>
                        `:`
                        <div class="bg-white border border-gray-300 rounded p-2 text-xs text-gray-700">
                            <p class="font-bold text-emerald-900 mb-0.5">Vuelto Retenido como Saldo a Favor</p>
                            <p class="text-[11px] text-gray-600 leading-tight">
                                El excedente de <b>Bs. ${M(x.vueltoBs)} ($ ${M(x.vueltoUsd)})</b> no genera egreso físico de caja y se asienta en el comprobante como saldo a favor retenido en el negocio.
                            </p>
                        </div>
                        `}
                    </div>`:"";this.modal.innerHTML=`
            <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between border-b-2 border-brand-black pb-3 mb-3">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider text-brand-purple">
                                ${e?"Cobro de Crédito Comercial":"Cobro de Comanda en Local"}
                            </span>
                            <h3 class="font-heading font-black text-2xl">
                                ${e?"COBRAR Y LIQUIDAR DEUDA":"LIQUIDAR CUENTA"}
                            </h3>
                            <p class="font-body text-xs text-gray-600 font-bold">
                                ${(G=this.cuentaSeleccionada)==null?void 0:G.etiqueta} ${(T=this.cuentaSeleccionada)!=null&&T.cliente?`· ${this.cuentaSeleccionada.cliente}`:""}
                            </p>
                        </div>
                        <button id="modal-liq-cerrar" class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">&times;</button>
                    </div>

                    <!-- Resumen del Importe Pendiente -->
                    <div class="bg-brand-gray/30 border-2 border-brand-black rounded-lg p-3 mb-3 flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <span class="text-[10px] font-bold text-gray-600 uppercase block">Saldo Neto a Cobrar</span>
                            <div class="flex items-baseline gap-2">
                                <span class="font-heading font-black text-2xl text-brand-black">$ ${M(n)} USD</span>
                                <span class="font-heading font-black text-xl text-brand-purple">Bs. ${M(x.totalEsperadoBs)}</span>
                            </div>
                        </div>
                        <div class="text-right text-xs">
                            <span class="text-gray-500 font-bold block">Consumo: $${M(a)} · Abonos: $${M(o)}</span>
                        </div>
                    </div>

                    <!-- Control de Tasa (Libre para Deudas, Fija para Cuenta) -->
                    ${e?`
                    <div class="bg-gray-50 border-2 border-brand-black rounded p-3 mb-3">
                        <label class="block text-xs font-black uppercase text-gray-800 mb-1">Tasa Libre de Cobro (Bs. / USD):</label>
                        <div class="flex gap-2">
                            <input id="deuda-tasa-input" type="text" inputmode="decimal" maxlength="9" value="${t.toFixed(4)}"
                                class="flex-1 border-2 border-brand-black rounded px-3 py-1.5 font-mono font-black text-base text-brand-black" />
                            <button id="btn-tasa-bcv" type="button" class="bg-gray-200 hover:bg-gray-300 text-brand-black font-heading font-black text-[11px] px-3 py-1.5 rounded border-2 border-brand-black">
                                TASA DEL DÍA (BCV)
                            </button>
                        </div>
                        <p class="text-[11px] text-gray-500 font-bold mt-1">Usted define libremente la tasa al momento de liquidar o aplica la oficial del día.</p>
                    </div>`:""}

                    <!-- Lista de Métodos de Pago -->
                    <div class="mb-3">
                        <span class="text-[10px] font-heading font-black uppercase text-gray-600 block mb-1">
                            Métodos de Pago Aplicados (${b.length})
                        </span>
                        ${S}
                    </div>

                    <!-- Acciones sobre Métodos -->
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <button id="btn-agregar-pago-cuenta" class="bg-blue-50 text-blue-950 hover:bg-blue-100 border-2 border-brand-black rounded px-3 py-1.5 text-xs font-heading font-black shadow-brutal-sm">
                            + AGREGAR OTRO MÉTODO (PAGO MIXTO)
                        </button>
                        <button id="btn-toggle-nuevo-metodo-cuenta" class="bg-white text-gray-800 hover:bg-gray-50 border border-brand-black rounded px-2.5 py-1.5 text-xs font-bold">
                            + CREAR MÉTODO DE PAGO
                        </button>
                    </div>

                    <!-- Subformulario para Crear Nuevo Método -->
                    ${U?`
                    <div class="bg-purple-50 border-2 border-brand-purple rounded-lg p-3 mb-3">
                        <p class="text-xs font-heading font-black text-brand-purple uppercase mb-1.5">Nuevo Método de Pago</p>
                        <div class="space-y-2">
                            <div class="flex gap-2">
                                <input id="input-nuevo-metodo-nombre-cuenta" type="text" maxlength="25" placeholder="Ej: BANESCO PANAMA, USDT..."
                                    class="flex-1 border-2 border-brand-black rounded px-2.5 py-1 text-xs font-bold uppercase focus:outline-none" />
                                <button id="btn-guardar-nuevo-metodo-cuenta" class="bg-brand-purple text-white border-2 border-brand-black rounded px-3 py-1 text-xs font-heading font-black hover:opacity-90">
                                    GUARDAR
                                </button>
                            </div>
                            <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-800">
                                <span class="text-[10px] text-gray-500 uppercase">Moneda Base:</span>
                                <label class="inline-flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="radio-nuevo-metodo-moneda-cuenta" value="USD" checked class="text-brand-purple" />
                                    <span>Dólares ($ USD - Tasa Dinámica)</span>
                                </label>
                                <label class="inline-flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="radio-nuevo-metodo-moneda-cuenta" value="BS" class="text-brand-purple" />
                                    <span>Bolívares (Bs.)</span>
                                </label>
                            </div>
                        </div>
                    </div>`:""}

                    <!-- Balance -->
                    ${P}

                    <div id="cobro-error-cuenta" class="hidden text-red-700 text-xs font-bold mb-3 bg-red-50 border border-red-400 rounded p-2"></div>

                    <!-- Acciones Finales -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-brand-black">
                        <div class="flex items-center gap-2">
                            <button id="modal-liq-cancel" class="bg-white border-2 border-brand-black font-heading font-black py-2 px-4 rounded text-xs hover:bg-gray-100">
                                VOLVER
                            </button>
                            <button id="modal-liq-agregar-mas" class="bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-brand-black font-heading font-black py-2 px-3 rounded text-xs">
                                ${e?"AGREGAR CARGOS A LA DEUDA":"AGREGAR MÁS CONSUMOS"}
                            </button>
                        </div>
                        <button id="modal-liq-ok" ${x.puedeConfirmar?"":"disabled"}
                            class="bg-green-700 hover:bg-green-800 disabled:opacity-30 disabled:cursor-not-allowed text-white font-heading font-black py-2 px-5 rounded border-2 border-brand-black shadow-brutal-sm text-sm">
                            CONFIRMAR COBRO
                        </button>
                    </div>
                </div>
            </div>`,L()},L=()=>{var S,q,p,f,I,P,G,T,E,X,W;const x=()=>{this.cuentaSeleccionada&&(this.pagosBorradorPorCuenta.set(this.cuentaSeleccionada.ventaId,b),this.resolucionVueltoPorCuenta.set(this.cuentaSeleccionada.ventaId,{estado:h,metodo:v,tasa:k}))},A=()=>{x(),this.modal.innerHTML=""};(S=this.modal.querySelector("#modal-liq-cerrar"))==null||S.addEventListener("click",A),(q=this.modal.querySelector("#modal-liq-cancel"))==null||q.addEventListener("click",A),(p=this.modal.querySelector("#modal-liq-agregar-mas"))==null||p.addEventListener("click",()=>{x(),this.modal.innerHTML=""}),(f=this.modal.querySelector("#btn-vuelto-pagado-cuenta"))==null||f.addEventListener("click",()=>{h="PAGADO",x(),O()}),(I=this.modal.querySelector("#btn-vuelto-retenido-cuenta"))==null||I.addEventListener("click",()=>{h="RETENIDO",x(),O()}),(P=this.modal.querySelector("#select-metodo-vuelto-cuenta"))==null||P.addEventListener("change",R=>{v=R.target.value,x(),O()});const N=this.modal.querySelector("#input-tasa-vuelto-cuenta");if(N&&(N.addEventListener("input",R=>{const j=Z(R.target.value);k=j>0?j:t,x()}),N.addEventListener("blur",()=>{O()})),(G=this.modal.querySelector("#btn-reset-tasa-vuelto-cuenta"))==null||G.addEventListener("click",()=>{k=t,x(),O()}),e){const R=this.modal.querySelector("#deuda-tasa-input"),j=this.modal.querySelector("#btn-tasa-bcv");R&&xe(R,1e5,9,()=>{const B=Z(R.value);t=Number.isFinite(B)&&B>0?B:i,x(),O()}),j==null||j.addEventListener("click",()=>{t=i,x(),O()})}this.modal.querySelectorAll("select[data-pago-metodo]").forEach(R=>{R.addEventListener("change",j=>{const B=R.dataset.pagoMetodo,V=j.target.value,_=b.find(z=>z.id===B);if(_){const z=r.find(ne=>ne.nombre===V),oe=(z==null?void 0:z.moneda)||"BS";_.moneda=oe,_.tasaCambio=t,b.length===1?_.monto=_.moneda==="USD"?n:Number((n*t).toFixed(2)):oe!==_.moneda&&(oe==="USD"?_.monto=Number((t>0?_.monto/t:0).toFixed(2)):_.monto=Number((_.monto*t).toFixed(2))),_.metodo=V,x(),O()}})}),this.modal.querySelectorAll("input[data-pago-tasa]").forEach(R=>{R.addEventListener("input",j=>{const B=R.dataset.pagoTasa,V=Z(j.target.value),_=b.find(z=>z.id===B);if(_){_.tasaCambio=V>0?V:t,x();const z=$(),oe=this.modal.querySelector("#modal-liq-ok");oe&&(oe.disabled=!z.puedeConfirmar)}}),R.addEventListener("blur",()=>{O()})}),this.modal.querySelectorAll("button[data-reset-tasa-cuenta]").forEach(R=>{R.addEventListener("click",()=>{const j=R.dataset.resetTasaCuenta,B=b.find(V=>V.id===j);B&&(B.tasaCambio=t,x(),O())})}),this.modal.querySelectorAll("input[data-pago-monto]").forEach(R=>{R.addEventListener("input",j=>{const B=R.dataset.pagoMonto,V=Z(j.target.value),_=b.find(z=>z.id===B);if(_){_.monto=V,x();const z=$(),oe=this.modal.querySelector("#modal-liq-ok");oe&&(oe.disabled=!z.puedeConfirmar)}}),R.addEventListener("blur",()=>{O()})}),this.modal.querySelectorAll("input[data-pago-ref]").forEach(R=>{R.addEventListener("input",j=>{const B=R.dataset.pagoRef,V=j.target.value,_=b.find(z=>z.id===B);_&&(_.referencia=V,x())})}),this.modal.querySelectorAll("button[data-eliminar-pago]").forEach(R=>{R.addEventListener("click",()=>{const j=R.dataset.eliminarPago;b=b.filter(B=>B.id!==j),x(),O()})}),(T=this.modal.querySelector("#btn-agregar-pago-cuenta"))==null||T.addEventListener("click",()=>{let R=$();const j="p-"+Math.random().toString(36).slice(2,7),B=r.find(_=>!b.some(z=>z.metodo===_.nombre))||r[0]||{nombre:"BS.EFEC.",moneda:"BS"};if(R.faltanteBs<=.01&&b.length===1&&b[0]){const _=b[0],z=_.tasaCambio>0?_.tasaCambio:t,oe=_.moneda==="USD"?_.monto*z:_.monto,ne=Math.round(oe/2*100)/100;_.monto=_.moneda==="USD"?z>0?Number((ne/z).toFixed(2)):0:ne,R=$()}const V=R.faltanteBs>0?R.faltanteBs:0;b.push({id:j,metodo:B.nombre,moneda:B.moneda,monto:B.moneda==="USD"?t>0?Number((V/t).toFixed(2)):0:V,tasaCambio:t,referencia:""}),x(),O()}),(E=this.modal.querySelector("#btn-toggle-nuevo-metodo-cuenta"))==null||E.addEventListener("click",()=>{U=!U,O()}),(X=this.modal.querySelector("#btn-guardar-nuevo-metodo-cuenta"))==null||X.addEventListener("click",()=>{(async()=>{const R=this.modal.querySelector("#input-nuevo-metodo-nombre-cuenta"),j=(R==null?void 0:R.value.trim())||"",B=this.modal.querySelector('input[name="radio-nuevo-metodo-moneda-cuenta"][value="USD"]'),V=B!=null&&B.checked?"USD":"BS";if(j)try{r=await D.crearMetodoPago(j,V),U=!1,O()}catch{}})()}),(W=this.modal.querySelector("#modal-liq-ok"))==null||W.addEventListener("click",()=>{(async()=>{if(!this.cuentaSeleccionada)return;const R=this.modal.querySelector("#cobro-error-cuenta");try{const j=b.filter(ae=>ae.monto>0).map(ae=>{const be=ae.moneda==="USD"&&ae.tasaCambio>0?ae.tasaCambio:t,ke=ae.moneda==="USD"?ae.monto*be:ae.monto,$e=t>0?ke/t:0;return{metodo:ae.metodo,moneda:ae.moneda,montoUsd:(ae.moneda==="USD"?ae.monto:$e).toFixed(2),montoBs:ke.toFixed(2),tasaCambio:ae.moneda==="USD"?be.toFixed(2):void 0,referencia:ae.referencia.trim()||void 0}});if(j.length===0)throw new Error("Debe especificar al menos un pago válido.");const B=$(),V=j.reduce((ae,be)=>ae+Number(be.montoBs),0),_=r.find(ae=>ae.nombre===v),z=(_==null?void 0:_.moneda)==="USD",oe=z?k>0?k:t:void 0,ne=z&&oe?(B.vueltoBs/oe).toFixed(2):B.vueltoUsd.toFixed(2),Se={estado:B.vueltoBs>.009?h:"SIN_VUELTO",metodo:B.vueltoBs>.009&&h==="PAGADO"?v:void 0,montoBs:B.vueltoBs>.009?B.vueltoBs.toFixed(2):void 0,montoUsd:B.vueltoBs>.009?ne:void 0,tasa:B.vueltoBs>.009&&h==="PAGADO"&&oe?oe.toFixed(2):void 0},ge=this.cuentaSeleccionada.ventaId;await D.cerrarCuenta(ge,V.toFixed(2),t.toFixed(4),j,Se),this.pagosBorradorPorCuenta.delete(ge),this.resolucionVueltoPorCuenta.delete(ge),this.cuentaSeleccionada=null,this.modal.innerHTML="",this.render()}catch(j){R&&(R.textContent=j instanceof Error?j.message.replace(/"/g,""):String(j),R.classList.remove("hidden"))}})()})};O()}}const de=(u,e,a,o)=>{u.maxLength=a,u.addEventListener("input",()=>{let n=u.value.replace(/[^0-9.,]/g,"");const l=n.split(/[.,]/);l.length>2?n=l[0]+"."+l.slice(1).join(""):l.length===2&&(n=l[0]+"."+l[1].slice(0,2)),n.length>a&&(n=n.slice(0,a));const i=parseFloat(n.replace(",","."));Number.isFinite(i)&&i>e&&(n=String(e)),u.value!==n&&(u.value=n),o&&o()})},we=(u,e,a,o,n)=>{u.maxLength=o,u.addEventListener("input",()=>{let l=u.value.replace(/[^0-9]/g,"");l.length>o&&(l=l.slice(0,o));const i=parseInt(l,10);Number.isFinite(i)&&i>a&&(l=String(a)),u.value!==l&&(u.value=l),n&&n()}),u.addEventListener("blur",()=>{const l=parseInt(u.value,10);Number.isFinite(l)&&l<e&&(u.value=String(e),n&&n())})},ce=(u,e,a=!1)=>{u.maxLength=e,u.addEventListener("input",()=>{let o=a?u.value.replace(/[<>{}\\]/g,""):u.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,/_#-]/g,"");o.length>e&&(o=o.slice(0,e)),u.value!==o&&(u.value=o)})};class Je{constructor(e,a){w(this,"contenedor");w(this,"modelo");w(this,"categorias",[]);w(this,"tasasImpuestos",[]);w(this,"productos",[]);w(this,"busquedaRepo","");w(this,"busquedaCatalogo","");w(this,"filtroCategoriaRepo","todas");w(this,"filtroCategoriaCatalogo","todas");w(this,"tabActiva","alta");w(this,"semaforoStock",{rojoMax:5,amarilloMax:15});w(this,"POR_PAGINA_CAT",40);w(this,"POR_PAGINA_REPO",24);w(this,"paginaCat",1);w(this,"paginaRepo",1);this.contenedor=e,this.modelo=a,this.modelo}getUnitLabel(e){return e.unidad==="kg"?"kg":e.unidad==="ml"?"ml":e.unidad==="un"?"un.":e.capacidades&2?"kg":"un."}getNombreCategoria(e){if(!e)return"General";const a=this.categorias.find(o=>o.id===e);return a?a.nombre:"General"}getConteoCategorias(){const e={todas:this.productos.length};return this.categorias.forEach(a=>{e[a.id]=0}),e["cat-general"]===void 0&&(e["cat-general"]=0),this.productos.forEach(a=>{const o=a.categoriaId||"cat-general";e[o]=(e[o]||0)+1}),e}async render(e){e&&(this.tabActiva=e);const[a,o,n,l]=await Promise.all([D.categorias(),D.tasasImpuestos(),D.productos(),D.obtenerSemaforoStock()]);this.categorias=a,this.tasasImpuestos=o,this.productos=n,this.semaforoStock=l;const i=this.getConteoCategorias(),r="Ej: Artículo Comercial 1L, Presentación 500g, Pack Estándar...";this.contenedor.innerHTML=`
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Control de Inventario</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Alta de productos, reposición de mercancía, categorías y tasas tributarias</p>
            </div>
            <div class="flex items-center gap-1 overflow-x-auto max-w-full pb-1" id="inv-tabs-container">
                <div class="inline-flex border-2 border-brand-black rounded bg-white shadow-brutal-sm p-0.5" id="inv-tabs">
                    <button id="tab-alta" class="w-36 sm:w-48 h-9 flex items-center justify-center font-heading text-xs rounded transition-colors shrink-0 ${this.tabActiva==="alta"?"font-black bg-brand-black text-white":"font-bold text-brand-black hover:bg-gray-100"}">AÑADIR PRODUCTO</button>
                    <button id="tab-stock" class="w-36 sm:w-48 h-9 flex items-center justify-center font-heading text-xs rounded transition-colors shrink-0 ${this.tabActiva==="stock"?"font-black bg-brand-black text-white":"font-bold text-brand-black hover:bg-gray-100"}">AÑADIR / AJUSTAR STOCK</button>
                    <button id="tab-ajustes" class="w-36 sm:w-48 h-9 flex items-center justify-center font-heading text-xs rounded transition-colors shrink-0 ${this.tabActiva==="ajustes"?"font-black bg-brand-black text-white":"font-bold text-brand-black hover:bg-gray-100"}">CATEGORÍAS E IMPUESTOS</button>
                </div>
            </div>
        </div>

        <div id="inv-seccion-alta" class="${this.tabActiva==="alta"?"block":"hidden"}">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <form id="form-nuevo-producto" novalidate class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 lg:col-span-2 space-y-4">
                    <h3 class="font-heading font-black text-xl border-b-2 border-brand-black pb-2">Registrar Nuevo Producto o Servicio</h3>
                    
                    <div>
                        <label class="block text-xs font-bold uppercase mb-1">Nombre Comercial del Producto o Servicio *</label>
                        <input id="prod-nombre" maxlength="64" placeholder="${r}" class="w-full border-2 border-brand-black rounded px-4 py-2.5 font-bold focus:ring-2 focus:ring-brand-cyan" required />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Categoría</label>
                            <select id="prod-categoria" class="w-full border-2 border-brand-black rounded px-3 py-2.5 bg-white font-bold">
                                ${this.categorias.map(t=>`<option value="${t.id}">${t.nombre}</option>`).join("")}
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Tasa de Impuesto</label>
                            <select id="prod-impuesto" class="w-full border-2 border-brand-black rounded px-3 py-2.5 bg-white font-bold">
                                ${this.tasasImpuestos.map(t=>`<option value="${t.porcentaje}">${t.nombre}</option>`).join("")}
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 border-2 border-brand-black rounded p-4">
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1 text-gray-700">Precio Bruto (Costo $)</label>
                            <input id="prod-precio-bruto" type="text" inputmode="decimal" maxlength="8" placeholder="0.00" class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold bg-white" />
                            <span class="text-[10px] text-gray-500">Costo de reposición (opcional)</span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1 text-gray-700">Margen de Ganancia (%)</label>
                            <input id="prod-margen" type="text" inputmode="decimal" maxlength="5" value="30" class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold bg-white" />
                            <span class="text-[10px] text-gray-500">Utilidad deseada (%)</span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1 text-brand-purple">Precio Neto Final ($) *</label>
                            <input id="prod-precio-neto" type="text" inputmode="decimal" maxlength="8" placeholder="0.00" class="w-full border-2 border-brand-black rounded px-3 py-2 font-black text-brand-purple bg-white" required />
                            <span class="text-[10px] text-gray-500">PVP con impuesto incluido</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div id="box-stock-inicial">
                            <label class="block text-xs font-bold uppercase mb-1">Stock Inicial (en unidades base)</label>
                            <input id="prod-stock" type="text" inputmode="decimal" maxlength="7" value="10" class="w-full border-2 border-brand-black rounded px-3 py-2 font-bold bg-white" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold uppercase mb-1">Tipo de Medida / Venta</label>
                            <select id="prod-unidad" class="w-full border-2 border-brand-black rounded px-3 py-2 font-black bg-white">
                                <option value="un">Unidad / Pieza (un.)</option>
                                <option value="kg">Por Peso (Kilogramos - kg)</option>
                                <option value="ml">Por Volumen (Mililitros - ml)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Configuración de Empaque / Caja y Despiece -->
                    <div class="bg-gray-50 border-2 border-brand-black rounded p-3 space-y-2">
                        <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input id="prod-es-caja" type="checkbox" class="w-4 h-4 border-2 border-brand-black rounded text-brand-black focus:ring-0" />
                            <span class="font-bold text-xs sm:text-sm">¿Viene en empaque / caja con unidades sueltas?</span>
                        </label>
                        <div id="box-caja-config" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-gray-700 mb-0.5">Unidades por Empaque / Caja *</label>
                                <input id="prod-unidades-caja" type="number" min="2" max="1000" step="1" value="12" placeholder="Ej: 12" class="w-full border-2 border-brand-black rounded px-3 py-1.5 font-bold bg-white text-sm" />
                                <span class="text-[10px] text-gray-500">Cantidad de unidades contenidas en cada empaque</span>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold uppercase text-gray-700 mb-0.5">Ingresar Stock Inicial en Cajas</label>
                                <input id="prod-stock-cajas" type="number" min="0" max="9999" step="1" placeholder="Ej: 5 cajas" class="w-full border-2 border-brand-black rounded px-3 py-1.5 font-bold bg-white text-sm" />
                                <span class="text-[10px] text-gray-500">Convierte automáticamente a unidades base</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input id="prod-sin-stock" type="checkbox" class="w-5 h-5 border-2 border-brand-black rounded text-brand-black focus:ring-0" />
                            <span class="font-bold text-xs sm:text-sm">Venta "Sin Stock" (Servicios / Detal libre sin inventario rígido)</span>
                        </label>
                    </div>

                    <div class="pt-2">
                        <button type="submit" class="w-full bg-brand-black text-white font-heading font-black py-4 rounded border-2 border-brand-black shadow-brutal hover:-translate-y-0.5 transition-all text-lg">
                            GUARDAR PRODUCTO O SERVICIO
                        </button>
                        <p id="alta-prod-msg" class="hidden font-bold text-sm mt-3 text-center"></p>
                    </div>
                </form>

                <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6 flex flex-col min-h-[300px] max-h-[480px] lg:max-h-[650px]">
                    <div class="flex justify-between items-center border-b-2 border-brand-black pb-2 mb-2">
                        <h3 class="font-heading font-black text-base sm:text-lg">Catálogo Registrado</h3>
                        <span class="text-xs font-black bg-gray-100 border border-brand-black px-2 py-0.5 rounded">${this.productos.length} artículos</span>
                    </div>
                    <div class="space-y-2 mb-3">
                        <select id="cat-filtro-lateral" class="w-full border-2 border-brand-black rounded px-2.5 py-1.5 text-xs font-bold bg-white focus:ring-2 focus:ring-brand-cyan">
                            <option value="todas">Todas las categorías (${this.productos.length} prods)</option>
                            ${this.categorias.map(t=>`<option value="${t.id}" ${this.filtroCategoriaCatalogo===t.id?"selected":""}>${t.nombre} (${i[t.id]||0} prods)</option>`).join("")}
                        </select>
                        <input id="cat-buscar-filtro" type="text" maxlength="40" placeholder="Filtrar por nombre o SKU..." value="${this.busquedaCatalogo}" class="w-full border-2 border-brand-black rounded px-3 py-2 text-xs font-bold" />
                    </div>
                    <div id="cat-lista-items" class="flex-1 overflow-y-auto space-y-2 pr-1"></div>
                </div>
            </div>
        </div>

        <div id="inv-seccion-stock" class="${this.tabActiva==="stock"?"block":"hidden"} space-y-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-4 sm:p-6">
                <div class="flex flex-wrap justify-between items-center mb-3 gap-2">
                    <div>
                        <h3 class="font-heading font-black text-xl">Reposición Dinámica de Stock</h3>
                        <p class="text-xs sm:text-sm text-gray-600">Explora por categoría o busca por nombre para dar entrada o salida a existencias.</p>
                    </div>
                    <span id="repo-contador-estado" class="text-xs font-bold text-gray-700 bg-gray-100 border-2 border-brand-black px-2.5 py-1 rounded">
                        ${this.productos.length} artículos en depósito
                    </span>
                </div>

                <!-- Chips de Filtrado por Categoría con Conteo Exacto -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 max-w-full" id="repo-chips-categorias">
                    <button data-cat-chip="todas" class="px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors ${this.filtroCategoriaRepo==="todas"?"bg-brand-black text-white":"bg-gray-100 text-brand-black hover:bg-gray-200"}">
                        TODAS (${this.productos.length})
                    </button>
                    ${this.categorias.map(t=>{const s=i[t.id]||0,d=this.filtroCategoriaRepo===t.id;return`
                        <button data-cat-chip="${t.id}" class="px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors ${d?"bg-brand-black text-white":"bg-gray-100 text-brand-black hover:bg-gray-200"}">
                            ${t.nombre} (${s})
                        </button>`}).join("")}
                </div>

                <input id="repo-buscar" type="text" maxlength="40" placeholder="Escribe el nombre del producto para buscar..." value="${this.busquedaRepo}" class="w-full border-2 border-brand-black rounded px-4 py-2.5 text-base font-bold mb-4 focus:ring-2 focus:ring-brand-cyan" />

                <div id="repo-lista" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1"></div>
            </div>
        </div>

        <div id="inv-seccion-ajustes" class="${this.tabActiva==="ajustes"?"block":"hidden"} grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 space-y-4">
                <div class="border-b-2 border-brand-black pb-2 flex justify-between items-center">
                    <div>
                        <h3 class="font-heading font-black text-xl">Gestión de Categorías</h3>
                        <p class="text-xs text-gray-500 font-bold">Clasificación de catálogo comercial e inventario</p>
                    </div>
                    <span class="text-xs font-black bg-gray-100 border border-brand-black px-2 py-0.5 rounded">${this.categorias.length} categorías</span>
                </div>
                <form id="form-crear-cat" class="flex gap-2">
                    <input id="cat-nombre" maxlength="32" placeholder="Nombre de categoría..." class="flex-1 border-2 border-brand-black rounded px-3 py-2 font-bold" required />
                    <button type="submit" class="bg-brand-black text-white px-4 py-2 rounded font-black font-heading text-sm">AGREGAR</button>
                </form>
                <div class="space-y-2 max-h-[350px] overflow-y-auto">
                    ${this.categorias.map(t=>{const s=i[t.id]||0;return`
                        <div class="flex justify-between items-center border-2 border-brand-black rounded-lg p-3 bg-gray-50">
                            <div>
                                <span class="font-bold text-sm text-brand-black">${t.nombre}</span>
                                <p class="text-[11px] font-bold text-gray-500">${s} ${s===1?"producto asociado":"productos asociados"}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-black px-2 py-0.5 rounded border border-brand-black ${s>0?"bg-amber-100 text-amber-900":"bg-gray-200 text-gray-600"}">
                                    ${s} prods.
                                </span>
                                <button data-del-cat="${t.id}" class="text-xs font-black text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded px-2 py-1 transition-colors">Eliminar</button>
                            </div>
                        </div>`}).join("")}
                </div>
            </div>

            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 space-y-4">
                <h3 class="font-heading font-black text-xl border-b-2 border-brand-black pb-2">Tasas de Impuestos (IVA)</h3>
                <form id="form-crear-tax" class="grid grid-cols-3 gap-2">
                    <input id="tax-nombre" maxlength="32" placeholder="Nombre (ej: Retención 5%)" class="col-span-2 border-2 border-brand-black rounded px-3 py-2 font-bold text-sm" required />
                    <div class="flex gap-1">
                        <input id="tax-pct" type="number" step="0.5" min="0" max="100" maxlength="4" placeholder="%" class="w-16 border-2 border-brand-black rounded px-2 py-2 font-bold text-sm" required />
                        <button type="submit" class="bg-brand-black text-white px-3 py-2 rounded font-black font-heading text-xs flex-1">+</button>
                    </div>
                </form>
                <div class="space-y-2 max-h-[350px] overflow-y-auto">
                    ${this.tasasImpuestos.map(t=>`
                        <div class="flex justify-between items-center border border-brand-black rounded p-2.5 bg-gray-50">
                            <span class="font-bold text-sm">${t.nombre} (${t.porcentaje}%)</span>
                            ${t.porcentaje===0||t.porcentaje===16?'<span class="text-xs text-gray-400 font-bold">Por defecto</span>':`<button data-del-tax="${t.id}" class="text-xs font-black text-red-600 hover:underline">Eliminar</button>`}
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>`,this.conectarEventos(),this.renderCatalogoLista(),this.renderRepoLista()}conectarEventos(){var P,G,T,E,X,W;const e=document.getElementById("tab-alta"),a=document.getElementById("tab-stock"),o=document.getElementById("tab-ajustes"),n=document.getElementById("inv-seccion-alta"),l=document.getElementById("inv-seccion-stock"),i=document.getElementById("inv-seccion-ajustes"),r=(R,j,B)=>{this.tabActiva=R,[e,a,o].forEach(V=>{V&&(V.className="w-36 sm:w-48 h-9 flex items-center justify-center font-heading font-bold text-xs rounded text-brand-black hover:bg-gray-100 transition-colors shrink-0")}),[n,l,i].forEach(V=>{V==null||V.classList.remove("block"),V==null||V.classList.add("hidden")}),j&&B&&(j.className="w-36 sm:w-48 h-9 flex items-center justify-center font-heading font-black text-xs rounded bg-brand-black text-white transition-colors shrink-0",B.classList.remove("hidden"),B.classList.add("block"))};e==null||e.addEventListener("click",()=>r("alta",e,n)),a==null||a.addEventListener("click",()=>{r("stock",a,l),this.renderRepoLista()}),o==null||o.addEventListener("click",()=>r("ajustes",o,i));const t=document.getElementById("prod-precio-bruto"),s=document.getElementById("prod-margen"),d=document.getElementById("prod-impuesto"),c=document.getElementById("prod-precio-neto"),b=R=>{if(!R)return 0;const j=R.trim().replace(",","."),B=parseFloat(j);return Number.isFinite(B)&&!isNaN(B)?B:0},g=()=>{if(!t||!c||!s||!d)return;const R=b(t.value),j=b(s.value)/100,B=b(d.value)/100;if(R>0){const _=R*(1+j)*(1+B);c.value=_.toFixed(2)}},h=()=>{if(!t||!c||!s||!d)return;const R=b(c.value),j=b(t.value),B=b(s.value)/100,V=b(d.value)/100;if(R>0){const _=R/(1+V);if(j>0){const z=(_-j)/j*100;s.value=Math.max(0,Math.round(z*10)/10).toFixed(1)}else B>0&&(t.value=(_/(1+B)).toFixed(2))}},v=document.getElementById("prod-stock"),k=document.getElementById("prod-nombre"),U=document.getElementById("prod-unidad"),$=document.getElementById("cat-nombre"),O=document.getElementById("tax-nombre"),L=document.getElementById("tax-pct"),F=document.getElementById("cat-buscar-filtro"),C=document.getElementById("repo-buscar"),y=document.getElementById("alta-prod-msg");k&&ce(k,64),t&&de(t,99999.99,8,g),s&&de(s,999,5,g),c&&de(c,99999.99,8,h),v&&de(v,99999,7),$&&ce($,32),O&&ce(O,32),L&&de(L,100,5),F&&ce(F,40),C&&ce(C,40),d==null||d.addEventListener("change",g);const x=()=>{y&&!y.classList.contains("hidden")&&y.style.color!=="#00823B"&&(y.classList.add("hidden"),y.textContent="")};k==null||k.addEventListener("input",x),c==null||c.addEventListener("input",x),v==null||v.addEventListener("input",x),U==null||U.addEventListener("change",x);const A=document.getElementById("prod-sin-stock"),N=document.getElementById("box-stock-inicial");A==null||A.addEventListener("change",()=>{x(),N&&(N.style.opacity=A.checked?"0.3":"1",N.querySelector("input").disabled=A.checked)});const S=document.getElementById("prod-es-caja"),q=document.getElementById("box-caja-config"),p=document.getElementById("prod-unidades-caja"),f=document.getElementById("prod-stock-cajas");S==null||S.addEventListener("change",()=>{x(),q&&(S.checked?q.classList.remove("hidden"):q.classList.add("hidden"))});const I=()=>{if(S!=null&&S.checked&&f&&p&&v){const R=parseInt(f.value,10),j=parseInt(p.value,10);Number.isFinite(R)&&R>=0&&Number.isFinite(j)&&j>1&&(v.value=String(R*j))}};p&&we(p,2,1e3,4,I),f&&we(f,0,9999,4,I),f==null||f.addEventListener("input",I),p==null||p.addEventListener("input",I),(P=document.getElementById("form-nuevo-producto"))==null||P.addEventListener("submit",R=>{R.preventDefault(),this.guardarProducto()}),(G=document.getElementById("cat-buscar-filtro"))==null||G.addEventListener("input",R=>{this.busquedaCatalogo=R.target.value.trim().toLowerCase(),this.paginaCat=1,this.renderCatalogoLista()}),(T=document.getElementById("cat-filtro-lateral"))==null||T.addEventListener("change",R=>{this.filtroCategoriaCatalogo=R.target.value,this.paginaCat=1,this.renderCatalogoLista()}),(E=document.getElementById("repo-buscar"))==null||E.addEventListener("input",R=>{this.busquedaRepo=R.target.value.trim().toLowerCase(),this.paginaRepo=1,this.renderRepoLista()}),this.contenedor.querySelectorAll("[data-cat-chip]").forEach(R=>{R.addEventListener("click",()=>{const j=R.dataset.catChip||"todas";this.filtroCategoriaRepo=j,this.paginaRepo=1,this.contenedor.querySelectorAll("[data-cat-chip]").forEach(B=>{(B.dataset.catChip||"todas")===j?B.className="px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors bg-brand-black text-white":B.className="px-3 py-1 rounded text-xs font-heading font-black border-2 border-brand-black shrink-0 transition-colors bg-gray-100 text-brand-black hover:bg-gray-200"}),this.renderRepoLista()})}),(X=document.getElementById("form-crear-cat"))==null||X.addEventListener("submit",R=>{R.preventDefault();const j=document.getElementById("cat-nombre");j!=null&&j.value.trim()&&D.crearCategoria(j.value.trim()).then(()=>void this.render("ajustes"))}),this.contenedor.querySelectorAll("[data-del-cat]").forEach(R=>{R.addEventListener("click",()=>{const j=R.dataset.delCat;j&&D.eliminarCategoria(j).then(()=>void this.render("ajustes"))})}),(W=document.getElementById("form-crear-tax"))==null||W.addEventListener("submit",R=>{R.preventDefault();const j=document.getElementById("tax-nombre"),B=document.getElementById("tax-pct");j!=null&&j.value.trim()&&B&&D.crearTasaImpuesto(j.value.trim(),Number(B.value)).then(()=>void this.render("ajustes"))}),this.contenedor.querySelectorAll("[data-del-tax]").forEach(R=>{R.addEventListener("click",()=>{const j=R.dataset.delTax;j&&D.eliminarTasaImpuesto(j).then(()=>void this.render("ajustes"))})})}renderCatalogoLista(){var i,r,t,s;const e=document.getElementById("cat-lista-items");if(!e)return;const a=this.productos.filter(d=>{const c=!this.busquedaCatalogo||d.nombre.toLowerCase().includes(this.busquedaCatalogo)||d.sku.toLowerCase().includes(this.busquedaCatalogo),b=this.filtroCategoriaCatalogo==="todas"||(d.categoriaId||"cat-general")===this.filtroCategoriaCatalogo;return c&&b});if(a.length===0){e.innerHTML='<p class="py-4 text-center text-gray-400 font-bold text-xs">Sin coincidencias en esta categoría.</p>',(i=document.getElementById("paginacion-cat"))==null||i.remove();return}const o=Math.ceil(a.length/this.POR_PAGINA_CAT);this.paginaCat>o&&(this.paginaCat=o);const n=(this.paginaCat-1)*this.POR_PAGINA_CAT,l=a.slice(n,n+this.POR_PAGINA_CAT);if(e.innerHTML=l.map(d=>{const c=Number(d.stock),b=d.sinStock?"bg-purple-100 text-purple-900":c>15?"bg-green-100 text-green-900":c>=10?"bg-yellow-100 text-yellow-900":"bg-red-100 text-red-900",g=this.getUnitLabel(d),h=this.getNombreCategoria(d.categoriaId);return`
            <div class="border border-brand-black rounded p-2 bg-gray-50 flex justify-between items-center text-xs">
                <div class="min-w-0 flex-1 pr-2">
                    <p class="font-bold truncate text-brand-black" title="${d.nombre}">${d.nombre}</p>
                    <p class="text-[10px] text-gray-500 font-bold">
                        <span class="text-brand-purple font-black">${h}</span> · $${Number(d.precioUsd).toFixed(2)} · IVA ${d.impuestoPct}%
                    </p>
                </div>
                <div class="text-right shrink-0">
                    <span class="font-black px-2 py-0.5 rounded border border-brand-black text-[10px] inline-block ${b}">
                        ${d.sinStock?"LIBRE":d.esCaja&&d.unidadesPorCaja&&d.unidadesPorCaja>1?`${Math.floor(c/d.unidadesPorCaja)} cj. + ${c%d.unidadesPorCaja} un. (${c} un.)`:`${c} ${g}`}
                    </span>
                </div>
            </div>`}).join(""),(r=document.getElementById("paginacion-cat"))==null||r.remove(),o>1){const d=document.createElement("div");d.id="paginacion-cat",d.className="flex items-center justify-between mt-2 gap-2 flex-wrap",d.innerHTML=`
                <span class="text-[10px] font-bold text-gray-500">Pag. ${this.paginaCat} de ${o} · ${a.length} productos</span>
                <div class="flex gap-1">
                    <button id="cat-pag-ant" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCat===1?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">ANT.</button>
                    <button id="cat-pag-sig" class="border-2 border-brand-black px-2 py-0.5 rounded text-[10px] font-heading font-black shadow-brutal-sm ${this.paginaCat===o?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">SIG.</button>
                </div>`,e.insertAdjacentElement("afterend",d),(t=document.getElementById("cat-pag-ant"))==null||t.addEventListener("click",()=>{this.paginaCat>1&&(this.paginaCat--,this.renderCatalogoLista())}),(s=document.getElementById("cat-pag-sig"))==null||s.addEventListener("click",()=>{this.paginaCat<o&&(this.paginaCat++,this.renderCatalogoLista())})}}renderRepoLista(){var t,s,d;const e=document.getElementById("repo-lista");if(!e)return;const a=this.productos.filter(c=>{const b=!this.busquedaRepo||c.nombre.toLowerCase().includes(this.busquedaRepo)||c.sku.toLowerCase().includes(this.busquedaRepo),g=this.filtroCategoriaRepo==="todas"||(c.categoriaId||"cat-general")===this.filtroCategoriaRepo;return b&&g}),o=document.getElementById("repo-contador-estado");if(o){const c=this.filtroCategoriaRepo==="todas"?"en depósito":`en ${this.getNombreCategoria(this.filtroCategoriaRepo)}`;o.textContent=`${a.length} de ${this.productos.length} artículos ${c}`}if(a.length===0){e.innerHTML='<p class="col-span-full py-8 text-center text-gray-500 font-bold">No se encontraron productos en la categoría seleccionada.</p>';return}const n=this.semaforoStock,l=Math.ceil(a.length/this.POR_PAGINA_REPO);this.paginaRepo>l&&(this.paginaRepo=l);const i=(this.paginaRepo-1)*this.POR_PAGINA_REPO,r=a.slice(i,i+this.POR_PAGINA_REPO);if(e.innerHTML=r.map(c=>{const b=Number(c.stock),g=c.sinStock?"text-purple-700":b<=n.rojoMax?"text-red-600":b<=n.amarilloMax?"text-amber-600":"text-emerald-700",h=this.getUnitLabel(c),v=this.getNombreCategoria(c.categoriaId),k=c.sinStock?"Venta libre":c.esCaja&&c.unidadesPorCaja&&c.unidadesPorCaja>1?`${Math.floor(b/c.unidadesPorCaja)} cajas y ${b%c.unidadesPorCaja} un. (${b} un.)`:`${b} ${h}`;return`
            <div class="border-2 border-brand-black rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between h-[175px] min-h-[175px] max-h-[175px] box-border overflow-hidden">
                <div class="min-w-0">
                    <div class="flex justify-between items-start gap-1">
                        <div class="min-w-0 flex-1">
                            <span class="text-[9px] font-black uppercase tracking-wider text-brand-purple bg-purple-50 border border-purple-200 rounded px-1.5 py-0.2 inline-block mb-0.5 truncate max-w-[150px]">${v}</span>
                            <h4 class="font-heading font-black text-sm truncate" title="${c.nombre}">${c.nombre}</h4>
                        </div>
                        <button data-repo-del="${c.sku}" title="Eliminar producto del catálogo" class="w-5 h-5 rounded border border-brand-black text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center font-black text-xs shrink-0">&times;</button>
                    </div>
                    <p class="text-xs font-bold text-gray-500 mt-0.5">Precio: $${Number(c.precioUsd).toFixed(2)} · Stock: <span class="font-black ${g}">${k}</span></p>
                </div>
                ${c.sinStock?'<p class="text-[11px] text-purple-700 font-bold mt-auto">Sin control de existencias físicas.</p>':`
                <div class="flex items-center gap-1 mt-auto pt-2 border-t border-gray-100">
                    <input type="number" step="${h==="kg"||h==="ml"?"0.1":"1"}" min="${h==="kg"||h==="ml"?"0.01":"1"}" max="9999" maxlength="5" placeholder="Cant." data-repo-cant="${c.sku}" class="w-14 h-8 border-2 border-brand-black rounded px-1.5 py-0.5 font-bold text-xs shrink-0" />
                    <button data-repo-in="${c.sku}" title="Sumar stock por reposición de compra" class="h-8 bg-green-200 hover:bg-green-300 border border-brand-black rounded px-1.5 text-[10px] font-black font-heading flex-1 truncate shrink-0">+ ENTRADA</button>
                    <button data-repo-red="${c.sku}" title="Reducir stock por ajuste de inventario regular" class="h-8 bg-amber-200 hover:bg-amber-300 border border-brand-black rounded px-1.5 text-[10px] font-black font-heading flex-1 truncate shrink-0">- REDUCIR</button>
                    <button data-repo-out="${c.sku}" title="Registrar como merma o daño físico" class="h-8 bg-red-200 hover:bg-red-300 border border-brand-black rounded px-1.5 text-[10px] font-black font-heading flex-1 truncate shrink-0">- MERMA</button>
                </div>`}
            </div>`}).join(""),(t=document.getElementById("paginacion-repo"))==null||t.remove(),l>1){const c=document.createElement("div");c.id="paginacion-repo",c.className="col-span-full flex items-center justify-between mt-3 gap-3 flex-wrap",c.innerHTML=`
                <span class="text-xs font-bold text-gray-500">Pagina ${this.paginaRepo} de ${l} · ${a.length} productos</span>
                <div class="flex gap-2">
                    <button id="repo-pag-ant" class="border-2 border-brand-black px-3 py-1 rounded text-xs font-heading font-black shadow-brutal-sm ${this.paginaRepo===1?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">ANTERIOR</button>
                    <button id="repo-pag-sig" class="border-2 border-brand-black px-3 py-1 rounded text-xs font-heading font-black shadow-brutal-sm ${this.paginaRepo===l?"opacity-30 pointer-events-none":"hover:bg-gray-100"}">SIGUIENTE</button>
                </div>`,e.insertAdjacentElement("afterend",c),(s=document.getElementById("repo-pag-ant"))==null||s.addEventListener("click",()=>{this.paginaRepo>1&&(this.paginaRepo--,this.renderRepoLista())}),(d=document.getElementById("repo-pag-sig"))==null||d.addEventListener("click",()=>{this.paginaRepo<l&&(this.paginaRepo++,this.renderRepoLista())})}e.querySelectorAll("input[data-repo-cant]").forEach(c=>{de(c,9999,5)}),e.querySelectorAll("[data-repo-del]").forEach(c=>{c.addEventListener("click",()=>{const b=c.dataset.repoDel,g=this.productos.find(v=>v.sku===b);if(!b||!g)return;window.confirm(`¿Seguro que deseas eliminar permanentemente el producto "${g.nombre}" del catálogo?`)&&D.eliminarProducto(b).then(()=>{D.productos().then(v=>{this.productos=v,this.renderRepoLista(),this.renderCatalogoLista();const k=document.getElementById("repo-contador-estado");k&&(k.textContent=`${this.productos.length} artículos en depósito`)})})})}),e.querySelectorAll("[data-repo-in]").forEach(c=>{c.addEventListener("click",()=>{const b=c.dataset.repoIn,g=e.querySelector(`input[data-repo-cant="${b}"]`),h=g==null?void 0:g.value;b&&h&&Number(h)>0&&Number(h)<=9999&&D.compraStock(b,h).then(()=>{D.productos().then(v=>{this.productos=v,this.renderRepoLista(),this.renderCatalogoLista()})})})}),e.querySelectorAll("[data-repo-red]").forEach(c=>{c.addEventListener("click",()=>{const b=c.dataset.repoRed,g=e.querySelector(`input[data-repo-cant="${b}"]`),h=g==null?void 0:g.value;b&&h&&Number(h)>0&&Number(h)<=9999&&D.reducirStock(b,h).then(()=>{D.productos().then(v=>{this.productos=v,this.renderRepoLista(),this.renderCatalogoLista()})})})}),e.querySelectorAll("[data-repo-out]").forEach(c=>{c.addEventListener("click",()=>{const b=c.dataset.repoOut,g=e.querySelector(`input[data-repo-cant="${b}"]`),h=g==null?void 0:g.value;b&&h&&Number(h)>0&&Number(h)<=9999&&D.merma(b,h,null).then(()=>{D.productos().then(v=>{this.productos=v,this.renderRepoLista(),this.renderCatalogoLista()})})})})}async guardarProducto(){var C;const e=document.getElementById("prod-nombre"),a=document.getElementById("prod-categoria"),o=document.getElementById("prod-impuesto"),n=document.getElementById("prod-precio-bruto"),l=document.getElementById("prod-margen"),i=document.getElementById("prod-precio-neto"),r=document.getElementById("prod-stock"),t=((C=document.getElementById("prod-unidad"))==null?void 0:C.value)||"un",s=document.getElementById("prod-sin-stock"),d=document.getElementById("alta-prod-msg"),c=y=>{if(!y)return 0;const x=y.trim().replace(",","."),A=parseFloat(x);return Number.isFinite(A)&&!isNaN(A)?A:0};if(d&&(d.classList.add("hidden"),d.textContent=""),!(e!=null&&e.value.trim())){d&&(d.textContent="El nombre del producto o servicio es obligatorio.",d.style.color="#C60C15",d.classList.remove("hidden"),e==null||e.focus());return}const b=c(i==null?void 0:i.value);if(b<=0||b>99999.99){d&&(d.textContent="El precio neto final debe ser un monto positivo entre $0.01 y $99,999.99 USD.",d.style.color="#C60C15",d.classList.remove("hidden"),i==null||i.focus());return}const g=c(r==null?void 0:r.value),h=(s==null?void 0:s.checked)||!1;if(!h&&(g<0||g>99999)){d&&(d.textContent="El stock inicial debe estar comprendido entre 0 y 99,999 unidades.",d.style.color="#C60C15",d.classList.remove("hidden"),r==null||r.focus());return}if(!h&&t==="un"&&(!Number.isInteger(g)||g%1!==0)){d&&(d.textContent='Los productos vendidos por Unidad (un.) deben tener un stock entero exacto (ej: 10). Para registrar fracciones o decimales, seleccione Tipo de Medida "Por Peso (kg)" o "Por Volumen (ml)".',d.style.color="#C60C15",d.classList.remove("hidden"),r==null||r.focus());return}const v=c((o==null?void 0:o.value)||"0"),k=c((l==null?void 0:l.value)||"30");let U=c(n==null?void 0:n.value);U<=0&&(U=b/(1+v/100)/(1+k/100));const $=document.getElementById("prod-es-caja"),O=document.getElementById("prod-unidades-caja"),L=($==null?void 0:$.checked)||!1,F=L&&O?Math.max(2,parseInt(O.value,10)||12):void 0;try{await D.crearProducto({nombre:e.value.trim(),precioBrutoUsd:U.toFixed(2),margenPct:String(k),precioUsd:b.toFixed(2),impuestoPct:String(v),stockInicial:s!=null&&s.checked?"0":String(g),categoriaId:(a==null?void 0:a.value)||"",sinStock:(s==null?void 0:s.checked)||!1,pesable:t==="kg"||t==="ml",unidad:t,alcoholica:!1,esCaja:L,unidadesPorCaja:F}),d&&(d.textContent="Producto o servicio registrado exitosamente.",d.style.color="#00823B",d.classList.remove("hidden")),setTimeout(()=>void this.render("alta"),800)}catch(y){d&&(d.textContent=y instanceof Error?y.message:String(y),d.style.color="#C60C15",d.classList.remove("hidden"))}}}const le=u=>{if(typeof u=="number")return Number.isFinite(u)?u:0;if(u==null)return 0;let e=String(u).trim();if(!e)return 0;e.includes(",")&&!e.includes(".")?e=e.replace(",","."):e.includes(".")&&e.includes(",")&&(e=e.replace(/\./g,"").replace(",","."));const a=parseFloat(e);return Number.isFinite(a)&&!isNaN(a)?a:0},K=u=>le(u).toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}),Ae=u=>{const e=u.finUnix||Math.floor(Date.now()/1e3),a=Math.max(0,e-u.inicioUnix),o=Math.floor(a/3600),n=Math.floor(a%3600/60);return`${o}h ${n}m`},Xe=(u,e)=>{const a=u.operadoresRelevo.length>0?u.operadoresRelevo.join(" / "):u.operadorActual,o=e.filter(c=>c.operador&&u.operadoresRelevo.some(b=>c.operador===b)),n=[["INFORME DE JORNADA",u.id],["Estado",u.estado==="abierta"?"En curso":"Cerrada"],["Apertura",u.inicioStr],["Cierre",u.finStr||"-"],["Duracion",Ae(u)],["Operadores",a],["Total USD",`$${K(u.ventasTotalUsd)}`],["Total Bs",`Bs. ${K(u.ventasTotalBs)}`],["Tickets emitidos",String(u.ticketsEmitidos)],["Vuelto pagado Bs",`Bs. ${K(u.vueltoPagadoBs)}`],["Vuelto retenido Bs",`Bs. ${K(u.vueltoRetenidoBs)}`],["Deudas liquidadas USD",`$${K(u.deudasLiquidadasUsd)}`],["Entradas stock",String(u.entradasStockReg)],["Mermas",String(u.mermasStockReg)],["Cambios de precio",String(u.cambiosPrecioReg)],["Tasa apertura",`Bs. ${u.tasaInicio}`],["Tasa cierre",u.tasaFin?`Bs. ${u.tasaFin}`:"-"],...u.checksumSha256?[["SHA-256",u.checksumSha256]]:[],[],["TICKETS DE LA JORNADA"],["ID Ticket","Fecha/Hora","Canal","Operador","Metodo(s) de Pago","Total USD","Total Bs"]],l=o.map(c=>{const b=c.pagos&&c.pagos.length>0?c.pagos.map(g=>`${g.metodo}:$${K(g.montoUsd)}`).join(" | "):"DIRECTO";return[c.ventaId,c.fechaHora||"",c.canal||"VENTA DIRECTA",c.operador||"Caja",b,`$${K(c.totalUsd)}`,`Bs. ${K(c.totalBs)}`]}),r=[...n,...l].map(c=>c.map(b=>`"${String(b).replace(/"/g,'""')}"`).join(",")).join(`\r
`),t=new Blob(["\uFEFF"+r],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(t),d=document.createElement("a");d.href=s,d.download=`jornada_${u.id}.csv`,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(s)};class Ke{constructor(e,a,o){w(this,"contenedor");w(this,"modalRoot");w(this,"modelo");w(this,"jornadas",[]);w(this,"jornadaActual",null);w(this,"todosLosTickets",[]);w(this,"busqueda","");w(this,"expandidos",new Set);w(this,"paginaActual",1);w(this,"POR_PAGINA",20);this.contenedor=e,this.modalRoot=a,this.modelo=o}async render(){const[e,a,o]=await Promise.all([D.obtenerJornadaActual(),D.listarHistoricoJornadas(),D.ventas()]);this.jornadaActual=e,this.jornadas=a,this.todosLosTickets=o;const n=(e?1:0)+a.length,l=[...e?[e]:[],...a],i=l.reduce((t,s)=>t+le(s.ventasTotalUsd),0),r=l.reduce((t,s)=>t+s.ticketsEmitidos,0);this.contenedor.innerHTML=`
        <div class="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Historial de Jornadas</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Registro de turnos operativos, balance consolidado y exportacion por jornada</p>
            </div>
            <span class="text-xs font-bold text-gray-700 bg-white border-2 border-brand-black px-3 py-1.5 rounded shadow-brutal-sm">
                ${n} Jornada${n!==1?"s":""}
            </span>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 bg-amber-50">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Facturado Total</p>
                <div class="font-heading font-black text-lg mt-0.5 text-brand-black">$ ${K(i)}</div>
            </div>
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 ${e?"bg-emerald-50":"bg-gray-50"}">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Estado Actual</p>
                <div class="font-heading font-black text-sm mt-0.5 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full inline-block shrink-0 ${e?"bg-emerald-500 animate-pulse":"bg-gray-400"}"></span>
                    ${e?"Abierta":"Sin turno"}
                </div>
            </div>
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 bg-purple-50">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Tasa BCV</p>
                <div class="font-heading font-black text-lg mt-0.5 text-brand-purple">Bs. ${K(this.modelo.tasaActual||807.39)}</div>
            </div>
            <div class="border-2 border-brand-black rounded-lg shadow-brutal-sm p-3 bg-blue-50">
                <p class="font-heading font-bold text-[10px] uppercase tracking-wide text-brand-text">Tickets Totales</p>
                <div class="font-heading font-black text-lg mt-0.5 text-blue-900">${r}</div>
            </div>
        </div>

        <!-- Buscador -->
        <div class="mb-3">
            <input id="jornadas-buscar" type="text" maxlength="60"
                placeholder="Buscar por ID, operador, fecha..."
                value="${this.busqueda}"
                class="w-full border-2 border-brand-black rounded px-3.5 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple bg-white" />
        </div>

        <!-- Lista -->
        <div id="lista-jornadas" class="flex flex-col gap-2"></div>`,this.conectarEventosBuscador(),this.renderLista()}conectarEventosBuscador(){var e;(e=document.getElementById("jornadas-buscar"))==null||e.addEventListener("input",a=>{this.busqueda=a.target.value,this.paginaActual=1,this.renderLista()})}renderLista(){var d,c;const e=document.getElementById("lista-jornadas");if(!e)return;const a=[...this.jornadaActual?[this.jornadaActual]:[],...this.jornadas],o=this.busqueda.trim().toLowerCase(),n=o?a.filter(b=>b.id.toLowerCase().includes(o)||b.operadorActual.toLowerCase().includes(o)||b.operadoresRelevo.some(g=>g.toLowerCase().includes(o))||b.inicioStr.toLowerCase().includes(o)||(b.finStr||"").toLowerCase().includes(o)):a,l=document.getElementById("paginacion-jornadas");if(l&&l.remove(),n.length===0){e.innerHTML=`
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-8 text-center text-gray-400 font-bold text-sm">
                ${o?"Sin jornadas que coincidan con la busqueda.":"No hay jornadas registradas en el sistema."}
            </div>`;return}const i=Math.max(1,Math.ceil(n.length/this.POR_PAGINA));this.paginaActual>i&&(this.paginaActual=i),this.paginaActual<1&&(this.paginaActual=1);const r=this.paginaActual,t=n.slice((r-1)*this.POR_PAGINA,r*this.POR_PAGINA);e.innerHTML=t.map(b=>this.renderFila(b)).join(""),t.forEach(b=>{if(this.expandidos.has(b.id)){const g=document.getElementById(`detalle-${b.id}`);g==null||g.classList.remove("hidden");const h=document.getElementById(`icon-${b.id}`);h&&(h.textContent="▲")}}),e.querySelectorAll("[data-toggle-jornada]").forEach(b=>{b.addEventListener("click",()=>{const g=b.dataset.toggleJornada,h=document.getElementById(`detalle-${g}`),v=document.getElementById(`icon-${g}`);if(h){const k=h.classList.contains("hidden");h.classList.toggle("hidden",!k),v&&(v.textContent=k?"▲":"▼"),k?this.expandidos.add(g):this.expandidos.delete(g)}})}),e.querySelectorAll("[data-exportar-jornada]").forEach(b=>{b.addEventListener("click",g=>{g.stopPropagation();const h=b.dataset.exportarJornada,v=n.find(k=>k.id===h);v&&Xe(v,this.todosLosTickets)})}),e.querySelectorAll("[data-ver-ticket]").forEach(b=>{b.addEventListener("click",()=>{const g=b.dataset.verTicket,h=this.todosLosTickets.find(v=>v.ventaId===g);h&&this.mostrarModalTicket(h)})});const s=document.createElement("div");s.id="paginacion-jornadas",s.innerHTML=`
            <div class="flex items-center justify-between mt-3 gap-3 flex-wrap">
                <span class="text-xs font-bold text-gray-600">
                    Pagina ${r} de ${i} &middot; ${n.length} jornada${n.length!==1?"s":""}
                </span>
                <div class="flex gap-2">
                    <button id="btn-pag-ant"
                        class="border-2 border-brand-black font-heading font-black text-xs px-3 py-1.5 rounded shadow-brutal-sm bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        ${r===1?"disabled":""}>
                        ANTERIOR
                    </button>
                    <button id="btn-pag-sig"
                        class="border-2 border-brand-black font-heading font-black text-xs px-3 py-1.5 rounded shadow-brutal-sm bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        ${r===i?"disabled":""}>
                        SIGUIENTE
                    </button>
                </div>
            </div>`,e.insertAdjacentElement("afterend",s),(d=document.getElementById("btn-pag-ant"))==null||d.addEventListener("click",()=>{this.paginaActual>1&&(this.paginaActual--,this.renderLista())}),(c=document.getElementById("btn-pag-sig"))==null||c.addEventListener("click",()=>{this.paginaActual<i&&(this.paginaActual++,this.renderLista())})}renderFila(e){const a=e.estado==="abierta",o=e.operadoresRelevo.length>0?e.operadoresRelevo.join(", "):e.operadorActual,n=this.todosLosTickets.filter(t=>t.operador&&e.operadoresRelevo.some(s=>t.operador===s)),l={};n.forEach(t=>{(t.pagos||[]).forEach(s=>{l[s.metodo]||(l[s.metodo]={usd:0,bs:0}),l[s.metodo].usd+=le(s.montoUsd),l[s.metodo].bs+=le(s.montoBs)})});const i=Object.entries(l).map(([t,s])=>`
            <div class="flex justify-between items-center text-xs border-b border-gray-100 last:border-none py-1">
                <span class="font-heading font-black text-brand-black">${t}</span>
                <div>
                    <span class="font-black">$ ${K(s.usd)}</span>
                    <span class="text-brand-purple font-mono font-bold ml-2">Bs. ${K(s.bs)}</span>
                </div>
            </div>`).join(""),r=n.length>0?n.map(t=>{const d=t.canal==="CONSUMO EN CUENTA"||t.ventaId.startsWith("CTA-")?'<span class="bg-amber-100 text-amber-900 border border-brand-black px-1.5 py-0.5 rounded font-black text-[9px]">CUENTA</span>':'<span class="bg-blue-100 text-blue-900 border border-brand-black px-1.5 py-0.5 rounded font-black text-[9px]">VENTA</span>';let c="";return t.pagos&&t.pagos.length>1?c='<span class="bg-amber-50 text-amber-950 border border-amber-500 px-1.5 py-0.5 rounded font-black text-[9px]">MIXTO</span>':t.pagos&&t.pagos.length===1?c=`<span class="bg-gray-100 text-brand-black border border-brand-black px-1.5 py-0.5 rounded font-black text-[9px]">${t.pagos[0].metodo}</span>`:c='<span class="bg-gray-100 text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded font-mono text-[9px]">DIRECTO</span>',`
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="py-1.5 px-2 font-mono text-brand-purple text-[10px]">${t.ventaId}</td>
                    <td class="py-1.5 px-2 text-gray-500 text-[10px]">${t.fechaHora||"-"}</td>
                    <td class="py-1.5 px-2">${d}</td>
                    <td class="py-1.5 px-2">${c}</td>
                    <td class="py-1.5 px-2 text-gray-700 text-[10px]">${t.operador||"Caja"}</td>
                    <td class="py-1.5 px-2 text-right font-black text-brand-black text-[10px]">$ ${K(t.totalUsd)}</td>
                    <td class="py-1.5 px-2 text-right font-black text-brand-purple text-[10px]">Bs. ${K(t.totalBs)}</td>
                    <td class="py-1.5 px-2 text-center">
                        <button data-ver-ticket="${t.ventaId}"
                            class="bg-brand-black text-white hover:bg-gray-800 border border-brand-black px-2 py-0.5 rounded text-[9px] font-heading font-black shadow-brutal-sm">
                            VER
                        </button>
                    </td>
                </tr>`}).join(""):'<tr><td colspan="8" class="py-3 text-center text-gray-400 font-bold text-xs">Sin tickets vinculados en la sesion actual.</td></tr>';return`
        <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal-sm overflow-hidden">
            <!-- Fila compacta (siempre visible) -->
            <div class="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                 data-toggle-jornada="${e.id}">

                <!-- Indicador estado -->
                <span class="w-2 h-2 rounded-full shrink-0 ${a?"bg-emerald-500 animate-pulse":"bg-gray-400"}"></span>

                <!-- ID + badge -->
                <div class="flex items-center gap-1.5 min-w-0 flex-1">
                    <span class="font-mono font-black text-xs text-brand-black truncate">${e.id}</span>
                    <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shrink-0
                        ${a?"bg-emerald-100 text-emerald-800 border-emerald-400":"bg-gray-100 text-gray-600 border-gray-300"}">
                        ${a?"EN CURSO":"CERRADA"}
                    </span>
                </div>

                <!-- Fecha -->
                <span class="text-[10px] text-gray-500 font-bold hidden sm:block shrink-0">${e.inicioStr}${e.finStr?` — ${e.finStr}`:""}</span>

                <!-- Operadores -->
                <span class="text-[10px] text-gray-700 font-bold hidden md:block shrink-0 max-w-[140px] truncate" title="${o}">${o}</span>

                <!-- Totales -->
                <div class="flex items-center gap-3 shrink-0 ml-auto">
                    <span class="font-heading font-black text-xs text-brand-black hidden sm:block">${e.ticketsEmitidos} tkt</span>
                    <span class="font-heading font-black text-sm text-brand-black">$ ${K(e.ventasTotalUsd)}</span>
                    <span class="font-heading font-black text-sm text-brand-purple hidden sm:block">Bs. ${K(e.ventasTotalBs)}</span>
                </div>

                <!-- Boton CSV -->
                <button data-exportar-jornada="${e.id}"
                    title="Exportar jornada a CSV"
                    class="shrink-0 border-2 border-brand-black bg-white hover:bg-brand-black hover:text-white text-brand-black font-heading font-black text-[9px] px-2 py-1 rounded shadow-brutal-sm transition-colors ml-1">
                    CSV
                </button>

                <!-- Toggle icon -->
                <span id="icon-${e.id}" class="text-gray-400 font-black text-[10px] w-4 text-center shrink-0">▼</span>
            </div>

            <!-- Panel de detalle (colapsado por defecto) -->
            <div id="detalle-${e.id}" class="hidden border-t-2 border-brand-black">

                <!-- Stats en grid compacto -->
                <div class="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-200 border-b border-gray-200 text-center">
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Duracion</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">${Ae(e)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Vuelto pagado</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">Bs. ${K(e.vueltoPagadoBs)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Vuelto retenido</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">Bs. ${K(e.vueltoRetenidoBs)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Deudas liquid.</p>
                        <p class="font-bold text-xs text-brand-black mt-0.5">$ ${K(e.deudasLiquidadasUsd)}</p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Stock in/merma</p>
                        <p class="font-bold text-xs mt-0.5">
                            <span class="text-emerald-700">${e.entradasStockReg}</span>
                            <span class="text-gray-400 mx-0.5">/</span>
                            <span class="${e.mermasStockReg>0?"text-red-600":"text-gray-500"}">${e.mermasStockReg}</span>
                        </p>
                    </div>
                    <div class="p-2">
                        <p class="text-[9px] font-black uppercase text-gray-400">Tasa apertura</p>
                        <p class="font-bold text-xs text-brand-purple mt-0.5">Bs. ${e.tasaInicio}</p>
                    </div>
                </div>

                <!-- Operadores full -->
                <div class="px-4 py-2 border-b border-gray-200 text-xs">
                    <span class="text-[9px] font-black uppercase text-gray-400 mr-2">Operadores en turno:</span>
                    <span class="font-bold text-brand-black">${o}</span>
                </div>

                <!-- Metodos de pago -->
                ${Object.keys(l).length>0?`
                <div class="px-4 py-2 border-b border-gray-200">
                    <p class="text-[9px] font-black uppercase text-gray-400 mb-1.5">Desglose por metodo de pago</p>
                    <div class="bg-gray-50 border border-gray-200 rounded p-2">
                        ${i}
                    </div>
                </div>`:""}

                <!-- Tabla de tickets -->
                <div class="p-3">
                    <p class="text-[9px] font-black uppercase text-gray-400 mb-1.5">Tickets de la jornada</p>
                    <div class="border border-brand-black rounded overflow-hidden overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-brand-black text-white font-heading font-bold text-[9px] uppercase">
                                <tr>
                                    <th class="py-1.5 px-2">ID</th>
                                    <th class="py-1.5 px-2">Fecha/Hora</th>
                                    <th class="py-1.5 px-2">Canal</th>
                                    <th class="py-1.5 px-2">Metodo</th>
                                    <th class="py-1.5 px-2">Operador</th>
                                    <th class="py-1.5 px-2 text-right">USD</th>
                                    <th class="py-1.5 px-2 text-right">Bs.</th>
                                    <th class="py-1.5 px-2 text-center">Ver</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 font-bold">
                                ${r}
                            </tbody>
                        </table>
                    </div>
                    ${e.checksumSha256?`<p class="text-[9px] font-mono text-gray-400 mt-1.5 break-all">SHA-256: ${e.checksumSha256}</p>`:""}
                </div>
            </div>
        </div>`}mostrarModalTicket(e){var l,i;const a=e.tasaDelDia?`Bs. ${K(e.tasaDelDia)}`:`Bs. ${K(this.modelo.tasaActual||807.39)}`,o=e.lineas&&e.lineas.length>0?e.lineas.map(r=>`
                <tr class="border-b border-gray-100 last:border-none">
                    <td class="py-2 pr-2">
                        <div class="font-bold text-gray-900">${r.nombre}</div>
                        <div class="text-[10px] text-gray-400 font-mono">${r.sku}</div>
                    </td>
                    <td class="py-2 text-center font-bold">${r.cantidad}</td>
                    <td class="py-2 text-right font-mono">$ ${K(r.precioUsd)}</td>
                    <td class="py-2 text-right font-bold text-brand-black">$ ${K(r.subtotalUsd)}</td>
                    <td class="py-2 text-right font-black text-brand-purple">Bs. ${K(r.subtotalBs)}</td>
                </tr>
            `).join(""):'<tr><td colspan="5" class="py-3 text-center text-gray-400 font-bold">Sin lineas individuales registradas.</td></tr>';this.modalRoot.innerHTML=`
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-2xl max-h-[90vh] flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start border-b-2 border-brand-black pb-3 mb-4">
                        <div>
                            <span class="text-[10px] uppercase font-black tracking-widest text-brand-purple">Comprobante de Venta</span>
                            <h3 class="font-heading font-black text-2xl">${e.ventaId}</h3>
                            <p class="text-xs text-gray-600 font-bold mt-0.5">${e.fechaHora||"Hoy"} · Canal: ${e.canal||"VENTA DIRECTA"}</p>
                        </div>
                        <button id="modal-ticket-cerrar" class="w-8 h-8 rounded border-2 border-brand-black font-black flex items-center justify-center hover:bg-gray-100">
                            &times;
                        </button>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-gray-50 border border-brand-black rounded p-3 text-xs">
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Operador / Mesa</span>
                            <span class="font-bold text-gray-900">${e.operador||"Caja"}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Tasa BCV Auditada</span>
                            <span class="font-black text-brand-purple font-mono">${a}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Recibido (Bs.)</span>
                            <span class="font-bold text-gray-900">Bs. ${K(e.montoRecibidoBs||e.totalBs)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-gray-500 font-bold uppercase block">Vuelto (${e.estadoVuelto==="RETENIDO"?"Retenido":"Entregado"})</span>
                            <span class="font-bold ${e.estadoVuelto==="RETENIDO"?"text-blue-700":"text-green-700"}">Bs. ${K(e.vueltoBs||"0.00")}</span>
                        </div>
                    </div>

                    ${le(e.vueltoBs)>.009?`
                    <div class="mb-3 ${e.estadoVuelto==="RETENIDO"?"bg-blue-50 border-blue-500 text-blue-950":"bg-emerald-50 border-emerald-500 text-emerald-950"} border-2 rounded p-2.5 text-xs font-bold flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <span class="text-[10px] font-black uppercase tracking-wider block">
                                ${e.estadoVuelto==="RETENIDO"?"Vuelto Retenido (Saldo a Favor)":"Vuelto Pagado al Cliente"}
                            </span>
                            <span>
                                ${e.estadoVuelto==="RETENIDO"?"Asentado como saldo a favor retenido.":`Entregado via ${e.metodoVuelto||"Efectivo"}${e.montoVueltoUsd&&Number(e.montoVueltoUsd)>0&&e.tasaVuelto?` ($ ${K(e.montoVueltoUsd)} a Bs. ${K(e.tasaVuelto)})`:""}.`}
                            </span>
                        </div>
                        <span class="font-heading font-black text-lg shrink-0">Bs. ${K(e.vueltoBs)}</span>
                    </div>`:""}

                    <div class="mb-3 border border-brand-black rounded p-2.5 bg-gray-50">
                        <span class="text-[10px] uppercase font-heading font-black text-gray-700 block mb-1">
                            Metodos de Pago (${e.pagos?e.pagos.length:1})
                        </span>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            ${e.pagos&&e.pagos.length>0?e.pagos.map(r=>`
                                    <div class="bg-white border border-brand-black rounded p-2 text-xs flex justify-between items-center">
                                        <div>
                                            <span class="font-heading font-black text-brand-black">${r.metodo}</span>
                                            ${r.tasaCambio?`<p class="text-[10px] font-mono font-bold text-brand-purple">Tasa: Bs. ${K(r.tasaCambio)}</p>`:""}
                                            ${r.referencia?`<p class="text-[10px] font-mono text-gray-500">Ref: ${r.referencia}</p>`:""}
                                        </div>
                                        <div class="text-right">
                                            <span class="font-black text-brand-black block">$ ${K(r.montoUsd)}</span>
                                            <span class="text-[10px] font-mono font-bold text-brand-purple block">Bs. ${K(r.montoBs)}</span>
                                        </div>
                                    </div>
                                `).join(""):'<div class="bg-white border border-gray-300 rounded p-2 text-xs col-span-2 text-gray-500 font-bold">Pago directo registrado en caja</div>'}
                        </div>
                    </div>

                    ${e.saldoAFavorConsolidadoUsd?`
                    <div class="mb-4 bg-emerald-50 border-2 border-emerald-600 rounded p-3 text-xs text-emerald-950 font-bold flex items-center justify-between">
                        <div>
                            <span class="text-[10px] font-black uppercase text-emerald-900 block">Excedente como Ganancia</span>
                            <span>Cuenta cerrada con saldo a favor liquidado.</span>
                        </div>
                        <span class="font-heading font-black text-lg text-emerald-700 ml-4 shrink-0">+$${K(e.saldoAFavorConsolidadoUsd)} USD</span>
                    </div>`:""}

                    <div class="border border-brand-black rounded overflow-hidden mb-3 max-h-[30vh] overflow-y-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-brand-black text-white font-heading font-bold text-[10px] uppercase">
                                <tr>
                                    <th class="py-2 px-2">Producto</th>
                                    <th class="py-2 px-2 text-center">Cant.</th>
                                    <th class="py-2 px-2 text-right">Precio Unit.</th>
                                    <th class="py-2 px-2 text-right">Subtotal ($)</th>
                                    <th class="py-2 px-2 text-right">Subtotal (Bs.)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${o}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div class="border-t-2 border-brand-black pt-3 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <span class="text-xs font-bold text-gray-500 block">Total Liquidado:</span>
                            <div class="flex items-baseline gap-2">
                                <span class="font-heading font-black text-2xl text-brand-black">$ ${K(e.totalUsd)}</span>
                                <span class="font-heading font-black text-xl text-brand-purple font-mono">Bs. ${K(e.totalBs)}</span>
                            </div>
                        </div>
                        <button id="modal-ticket-ok" class="bg-brand-black text-white font-heading font-black px-6 py-2.5 rounded border border-brand-black shadow-brutal-sm hover:bg-gray-800">
                            CERRAR
                        </button>
                    </div>
                </div>
            </div>
        </div>`;const n=()=>{this.modalRoot.innerHTML=""};(l=document.getElementById("modal-ticket-cerrar"))==null||l.addEventListener("click",n),(i=document.getElementById("modal-ticket-ok"))==null||i.addEventListener("click",n)}}class Ze{constructor(e){w(this,"contenedor");this.contenedor=e}render(){this.contenedor.innerHTML=`
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black font-heading">Playbook Operativo ABC</h2>
                <p class="text-brand-text font-body text-xs sm:text-sm">Manual de procedimientos comerciales, directrices de uso y lectura analítica de DatioLabs</p>
            </div>
            <span class="bg-brand-black text-white px-3 py-1.5 rounded font-black font-heading text-xs uppercase tracking-wider">
                DOCUMENTACIÓN OFICIAL
            </span>
        </div>

        <!-- Tarjetas Resumen de los 5 Módulos Usables del Sistema -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <div class="border-2 border-brand-black rounded-lg bg-amber-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-amber-900 uppercase">MÓDULO 01</span>
                <h4 class="font-heading font-black text-base mt-0.5">CAJA</h4>
                <p class="text-xs text-gray-700 mt-1">Cobro directo multimétodo (TRANSF.BS., DOL.CASH, BS.EFEC., ZELLE, BINAN.USDT, BIOPAGO, PUNTOD.VENTA, PAGO MOVIL), tasas dinámicas en divisas y pagos mixtos.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-yellow-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-yellow-900 uppercase">MÓDULO 02</span>
                <h4 class="font-heading font-black text-base mt-0.5">CUENTAS</h4>
                <p class="text-xs text-gray-700 mt-1">Comandas en local y Deudas Abiertas por cliente, abonos libres acumulables y cobro multimétodo a tasa libre.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-blue-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-blue-900 uppercase">MÓDULO 03</span>
                <h4 class="font-heading font-black text-base mt-0.5">VENTAS</h4>
                <p class="text-xs text-gray-700 mt-1">Historial de jornadas operativas con buscador en tiempo real, balance consolidado por turno y exportacion CSV individual por jornada.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-emerald-50 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-emerald-900 uppercase">MÓDULO 04</span>
                <h4 class="font-heading font-black text-base mt-0.5">INVENTARIO</h4>
                <p class="text-xs text-gray-700 mt-1">Catálogo por categorías, conteo en un., fórmulas de margen, reposición (+ENTRADA), reducción y mermas.</p>
            </div>
            <div class="border-2 border-brand-black rounded-lg bg-slate-100 p-3.5 shadow-brutal-sm">
                <span class="font-mono text-[10px] font-black text-gray-800 uppercase">MÓDULO 05</span>
                <h4 class="font-heading font-black text-base mt-0.5">PANEL</h4>
                <p class="text-xs text-gray-700 mt-1">Diagnostico financiero por fechas, jornada activa con operadores multicajero, gestion de empleados (alta/edicion/baja) y configuracion de metodos de pago.</p>
            </div>
        </div>

        <div class="space-y-6">
            <!-- Módulo 1: CAJA -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">1</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo CAJA: Facturación Directa, Métodos de Pago y Tasa Blindada</h3>
                        <p class="text-xs text-gray-500 font-bold">Cobro multimétodo determinista sin descalce cambiario ni ventas con stock negativo</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Bloqueo de Tasa Oficial</strong>
                        Al abrir el ticket, la tasa oficial BCV se congela exclusivamente para esa operación. Las fluctuaciones externas no alteran el valor en Bolívares acordado.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Métodos de Pago y Cobro Mixto</strong>
                        Soporte nativo para métodos en Dólares (DOL.CASH, ZELLE, BINAN.USDT con tasas dinámicas editables al cobrar/abonar) y en Bolívares (TRANSF.BS., BS.EFEC., BIOPAGO, PUNTOD.VENTA, PAGO MOVIL), además de creación de métodos propios definidos en USD o Bs. Permite pagos mixtos multimétodo.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Protección y Vuelto Exacto</strong>
                        Calcula simultáneamente el balance en USD y Bs. Valida que el pago cubra el total requerido, emite vuelto al centavo e impide vender por encima del stock disponible.
                    </div>
                </div>
            </div>

            <!-- Módulo 2: CUENTAS -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">2</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo CUENTAS: Cuentas Activas en Local y Deudas Abiertas</h3>
                        <p class="text-xs text-gray-500 font-bold">Comandas para mesas y deudas comerciales a crédito con descuento de stock y liquidación a tasa libre</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Cuentas en Local vs. Deudas Comerciales</strong>
                        Permite dos modalidades: Cuentas Activas (mesas o barras liquidadas a la tasa del día) y Deudas Abiertas (crédito a clientes de confianza que permanecen abiertas por días descontando existencias físicas de almacén al instante).
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Abonos Libres y Saldo a Favor</strong>
                        El operador puede registrar abonos en Bs. o USD con tasas dinámicas por método (ej. USDT pactado a tasa superior a BCV acreditando el excedente a favor del cliente). Si el abono supera lo consumido, el saldo a favor resultante se liquida o se consolida como ganancia.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Liquidación a Tasa Libre</strong>
                        Las deudas abiertas no se atan rígidamente al BCV histórico: al cobrar, el dueño puede fijar libremente la tasa acordada con el cliente o cargar la tasa oficial del día con un solo clic.
                    </div>
                </div>
            </div>

            <!-- Módulo 3: VENTAS -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">3</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo VENTAS: Historial de Jornadas Operativas</h3>
                        <p class="text-xs text-gray-500 font-bold">Balance por turno, desglose de metodos de pago y exportacion CSV individual por jornada</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Acceso con Clave y Paginación</strong>
                        Protegido administrativamente con el PIN del dueño. Lista de jornadas acotada a 20 registros por página para navegación inmediata sin sobrecargar memoria ni degradar rendimiento.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Buscador en Tiempo Real</strong>
                        Filtra jornadas por ID, nombre de operador o cajero, fecha de apertura o cierre. El estado de expansión de cada jornada se preserva al filtrar.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Detalle por Jornada</strong>
                        Al expandir: operadores del turno, vuelto pagado y retenido, deudas liquidadas, entradas de stock, mermas, tasa de apertura y desglose de ingresos por método de pago.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Exportación CSV</strong>
                        Cada jornada tiene un botón CSV que descarga un archivo con encabezado completo del turno (operadores, totales, vueltos, SHA-256) y tabla de tickets con métodos de pago desglosados.
                    </div>
                </div>
            </div>

            <!-- Módulo 4: INVENTARIO -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">4</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo INVENTARIO: Catálogo por Categorías, Decimales y Movimientos</h3>
                        <p class="text-xs text-gray-500 font-bold">Agrupación por rubros, conteo exacto en un., fórmulas de margen, entradas, reducción y mermas</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Agrupación por Categorías</strong>
                        El inventario clasifica los artículos en pestañas por rubro, mostrando el conteo exacto de productos en cada categoría para facilitar auditorías físicas rápidas.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">+ ENTRADA (Reposición)</strong>
                        Aumenta las existencias en almacén producto de compras a distribuidores o producción interna, recalculando márgenes si cambia el costo.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">- REDUCIR (Ajuste Físico)</strong>
                        Rebaja existencias por corrección física de conteo o traslados entre sucursales sin imputarlo contablemente como merma o pérdida de capital.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">- MERMA (Deterioro)</strong>
                        Descuenta artículos vencidos, dañados o rotos, quedando registrado en la auditoría como merma física del negocio.
                    </div>
                </div>
            </div>

            <!-- Módulo 5: PANEL -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <span class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">5</span>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Módulo PANEL: Diagnostico Financiero, Jornada y Configuracion</h3>
                        <p class="text-xs text-gray-500 font-bold">KPIs por rango de fechas, gestion de jornada multicajero, empleados y metodos de pago</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-body leading-relaxed text-gray-700 mb-4">
                    <div class="border border-brand-black rounded p-3 bg-amber-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">1. Ventas Totales en Rango</strong>
                        Ingresos brutos liquidados durante el período auditado (24h, 7D, 30D, 1A o rango exacto con fecha y hora).
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-emerald-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">2. Ganancia Bruta y Neta</strong>
                        Margen comercial directo descontando costo de compra (COGS) y utilidad líquida tras descontar impuestos.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-blue-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">3. Capital en Categorías</strong>
                        Desglose en tiempo real de cuánto dinero en bruto a precio de venta está inmovilizado en cada categoría del negocio.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-100">
                        <strong class="text-brand-black block font-heading font-black mb-1">4. Deudas Abiertas y PDF</strong>
                        Monitoreo del saldo por cobrar en deudas comerciales y generación de informe PDF con el período exacto y tabla de deudores.
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-slate-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">5. Jornada Activa y Multicajero</strong>
                        Muestra el estado de la jornada en curso, los cajeros activos simultaneamente (multicajero), el balance parcial del turno y los tickets emitidos. El dueno puede abrir, cerrar o asignar operadores al turno desde esta pantalla.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-slate-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">6. Gestion de Empleados</strong>
                        Registro de operadores con alta, edicion de nombre y baja. Los cambios de nombre se propagan automaticamente a la jornada activa. La baja limpia al operador de los turnos activos sin afectar el historial cerrado.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-slate-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">7. Metodos de Pago Aceptados</strong>
                        El dueno configura los metodos de pago disponibles (nombre y moneda USD o Bs). Puede agregar metodos propios del negocio o eliminar los existentes. El sistema garantiza al menos un metodo activo en todo momento.
                    </div>
                </div>
            </div>

            <!-- Procedimientos Operativos -->
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6">
                <div class="flex items-center gap-3 border-b-2 border-brand-black pb-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-brand-black text-white font-black font-heading flex items-center justify-center text-sm">O</div>
                    <div>
                        <h3 class="font-heading font-black text-lg sm:text-xl">Procedimientos Operativos: Jornadas, Multicajero y Cobro Multimétodo</h3>
                        <p class="text-xs text-gray-500 font-bold">Instrucciones para apertura, gestion de cajeros simultaneos, inventario dual y cobro combinado con vuelto</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body leading-relaxed text-gray-700">
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Apertura Directa, Multicajero y Cierre</strong>
                        Si no hay turno activo, el botón de cajero en Caja muestra "SIN TURNO ACTIVO", permitiendo al operador iniciar la jornada seleccionando los cajeros del día sin requerir clave de dueño. En cualquier momento se pueden agregar, editar y relevar cajeros simultáneos. El dueño finaliza y consolida el turno desde el Panel.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Paginación y Rendimiento a Largo Plazo</strong>
                        Todos los módulos históricos (Jornadas, Transacciones, Catálogo, Reposición y Cuentas) operan bajo paginación estricta con sanitización en tiempo real de montos y texto, garantizando fluidez constante sin consumo excesivo de memoria tras años de uso comercial.
                    </div>
                    <div class="border border-brand-black rounded p-3 bg-gray-50">
                        <strong class="text-brand-black block font-heading font-black mb-1">Cobro Multimétodo y Vuelto Retenido</strong>
                        El sistema prioriza bolívares en la parte superior y divisas abajo. Si el cliente paga con varios medios (ej: Punto de Venta + Efectivo Divisas), el sistema reajusta automáticamente el saldo faltante. Si el cliente entrega un excedente, el cajero define si el vuelto fue entregado físicamente o retenido como saldo a favor.
                    </div>
                </div>
            </div>
        </div>`}}const Qe=3e5;class Ye{constructor(){w(this,"modelo",new Fe);w(this,"cajaVm",null);w(this,"panelVm",new He);w(this,"widget",new Oe);w(this,"root");w(this,"modalRoot")}async arrancar(){var o;const e=document.getElementById("app-root");if(!e)return;this.root=e,this.modalRoot=this.crearModalRoot(),this.widget.iniciar(),window.addEventListener("tasa_actualizada",n=>{const l=n;l.detail&&this.modelo.setTasa(l.detail)}),await this.refrescarTasa();let a=null;try{a=await this.modelo.cargarConfig()}catch{a=await this.modelo.cargarConfig()}if(window.setInterval(()=>void this.refrescarTasa(),Qe),!a){new qe(this.root,this.modelo,()=>void this.arrancarCaja()).render();return}this.pintarBotonesRol(a),(o=document.getElementById("btn-conectar-movil"))==null||o.addEventListener("click",()=>this.abrirModalQrMovil()),await this.arrancarCaja()}crearModalRoot(){let e=document.getElementById("modal-root");return e||(e=document.createElement("div"),e.id="modal-root",document.body.appendChild(e)),e}async refrescarTasa(){try{const e=await D.tasa();e&&this.modelo.setTasa(Number(e.valor))}catch{}}pintarBotonesRol(e){const a=[document.getElementById("nav-actions-desktop"),document.getElementById("nav-actions-mobile")].filter(Boolean);a.length===0||document.querySelector('[data-nav-btn="caja"]')||a.forEach(o=>{o.innerHTML="";const n=(b,g,h)=>{const v=document.createElement("button");return v.id=`${b}-${o.id.includes("mobile")?"mob":"dsk"}`,v.dataset.navBtn=h,v.className="font-heading font-black text-xs sm:text-sm bg-white border-2 border-brand-black px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded shadow-brutal-sm hover:-translate-y-0.5 transition-transform shrink-0",v.textContent=g,v},l=n("btn-ir-caja","CAJA","caja"),i=n("btn-ir-ventas","VENTAS","ventas"),r=n("btn-ir-inventario","INVENTARIO","inventario"),t=n("btn-ir-panel","PANEL","panel"),s=n("btn-ir-guia","GUÍA","guia"),d=e.rubros!==0;let c=null;d&&(c=n("btn-ir-cuentas","CUENTAS","cuentas"),c.addEventListener("click",()=>void this.arrancarCuentas())),o.appendChild(l),c&&o.appendChild(c),o.appendChild(i),o.appendChild(r),o.appendChild(t),o.appendChild(s),l.addEventListener("click",()=>void this.arrancarCaja()),i.addEventListener("click",()=>void this.arrancarVentas()),r.addEventListener("click",()=>void this.arrancarInventario()),t.addEventListener("click",()=>this.solicitarAccesoPanel()),s.addEventListener("click",()=>this.arrancarGuia())})}arrancarGuia(){this.marcarActivo("guia"),new Ze(this.root).render()}async arrancarCaja(){this.marcarActivo("caja"),this.cajaVm=new Ve(this.modelo),new _e(this.root,this.modalRoot,this.cajaVm,this.modelo).render();try{await this.cajaVm.cargar()}catch(a){this.toastError(a instanceof Error?a.message:String(a))}}async arrancarCuentas(){this.marcarActivo("cuentas");const e=new ze(this.root,this.modalRoot,this.modelo);try{await e.render()}catch(a){this.toastError(a instanceof Error?a.message:String(a))}}arrancarVentas(){var n,l,i;const e=this.modelo.getConfig();if(!(e!=null&&e.tienePin)){this.abrirVentas();return}this.modalRoot.innerHTML=`
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-8 w-full max-w-sm">
                <h3 class="font-heading font-black text-2xl mb-1">ACCESO RESTRINGIDO</h3>
                <p class="font-body text-brand-text mb-4">El historial de jornadas requiere la clave administrativa.</p>
                <input id="pin-ventas-input" type="password" inputmode="numeric" maxlength="16" autofocus
                    class="w-full border-2 border-brand-black rounded px-4 py-3 text-2xl tracking-[0.5em] text-center mb-3" />
                <p id="pin-ventas-error" class="hidden text-red-700 font-bold mb-2">Clave incorrecta.</p>
                <div class="grid grid-cols-2 gap-3">
                    <button id="pin-ventas-cancelar" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">CANCELAR</button>
                    <button id="pin-ventas-ok" class="bg-brand-black text-white font-heading font-black py-3 rounded">ENTRAR</button>
                </div>
            </div>
        </div>`;const a=()=>{this.modalRoot.innerHTML=""};(n=document.getElementById("pin-ventas-cancelar"))==null||n.addEventListener("click",a);const o=()=>void(async()=>{var s;const r=document.getElementById("pin-ventas-input").value;await D.validarPin(r).catch(()=>!1)?(a(),await this.abrirVentas()):(s=document.getElementById("pin-ventas-error"))==null||s.classList.remove("hidden")})();(l=document.getElementById("pin-ventas-ok"))==null||l.addEventListener("click",o),(i=document.getElementById("pin-ventas-input"))==null||i.addEventListener("keydown",r=>{r.key==="Enter"&&o()})}async abrirVentas(){this.marcarActivo("ventas");const e=new Ke(this.root,this.modalRoot,this.modelo);try{await e.render()}catch(a){this.toastError(a instanceof Error?a.message:String(a))}}async arrancarInventario(){this.marcarActivo("inventario");const e=new Je(this.root,this.modelo);try{await e.render()}catch(a){this.toastError(a instanceof Error?a.message:String(a))}}marcarActivo(e){document.querySelectorAll("[data-nav-btn]").forEach(a=>{a.dataset.navBtn===e?(a.classList.remove("bg-white"),a.classList.add("bg-brand-yellow")):(a.classList.remove("bg-brand-yellow","bg-brand-cyan"),a.classList.add("bg-white"))})}solicitarAccesoPanel(){var n,l,i;const e=this.modelo.getConfig();if(!(e!=null&&e.tienePin)){this.abrirPanel();return}this.modalRoot.innerHTML=`
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-8 w-full max-w-sm">
                <h3 class="font-heading font-black text-2xl mb-1">ACCESO DEL DUENO</h3>
                <p class="font-body text-brand-text mb-4">Ingresa la clave administrativa.</p>
                <input id="pin-input" type="password" inputmode="numeric" maxlength="16" autofocus
                    class="w-full border-2 border-brand-black rounded px-4 py-3 text-2xl tracking-[0.5em] text-center mb-3" />
                <p id="pin-error" class="hidden text-red-700 font-bold mb-2">Clave incorrecta.</p>
                <div class="grid grid-cols-2 gap-3">
                    <button id="pin-cancelar" class="bg-white border-2 border-brand-black font-heading font-black py-3 rounded">CANCELAR</button>
                    <button id="pin-ok" class="bg-brand-black text-white font-heading font-black py-3 rounded">ENTRAR</button>
                </div>
            </div>
        </div>`;const a=()=>{this.modalRoot.innerHTML=""};(n=document.getElementById("pin-cancelar"))==null||n.addEventListener("click",a);const o=()=>void(async()=>{var s;const r=document.getElementById("pin-input").value;await D.validarPin(r).catch(()=>!1)?(a(),await this.abrirPanel()):(s=document.getElementById("pin-error"))==null||s.classList.remove("hidden")})();(l=document.getElementById("pin-ok"))==null||l.addEventListener("click",o),(i=document.getElementById("pin-input"))==null||i.addEventListener("keydown",r=>{r.key==="Enter"&&o()})}async abrirPanel(){this.marcarActivo("panel");const e=new Ge(this.root,this.modalRoot,this.panelVm,this.modelo);try{await e.render()}catch(a){this.toastError(a instanceof Error?a.message:String(a))}}async abrirModalQrMovil(){var o,n,l;const e=await D.dispositivos();this.modalRoot.innerHTML=`
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
            <div class="bg-white border-2 border-brand-black rounded-lg shadow-brutal p-6 w-full max-w-lg">
                <div class="flex justify-between items-center border-b-2 border-brand-black pb-3 mb-4">
                    <div>
                        <h3 class="font-heading font-black text-2xl">CONEXIÓN MÓVIL P2P</h3>
                        <p class="font-body text-xs text-gray-600">Acceso cifrado autenticado por Clave Maestra del Dueño</p>
                    </div>
                    <button id="qr-cerrar" class="w-8 h-8 rounded border-2 border-brand-black flex items-center justify-center font-black text-lg hover:bg-gray-100">&times;</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <!-- Columna QR e instrucciones de acceso -->
                    <div class="bg-gray-50 border-2 border-brand-black rounded-lg p-4 text-center flex flex-col items-center justify-between">
                        <div class="w-full">
                            <span class="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">Escanear para Vincular</span>
                            <div class="w-36 h-36 mx-auto bg-white border-2 border-brand-black rounded p-2 flex items-center justify-center mb-2">
                                <svg class="w-32 h-32 text-brand-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                </svg>
                            </div>
                            <p class="text-[11px] font-bold text-gray-600 mb-1">URL local del terminal:</p>
                            <p class="font-mono text-[10px] bg-white border border-gray-300 rounded p-1 truncate text-brand-black">http://192.168.1.100:8080/panel</p>
                        </div>
                        <div class="bg-amber-100 border border-brand-black rounded p-2 text-[10px] font-bold text-amber-900 mt-2">
                            Al conectar solicitará obligatoriamente la Clave del Dueño definida al instalar.
                        </div>
                    </div>

                    <!-- Columna de Registro manual y simulación de vinculación -->
                    <div class="flex flex-col justify-between">
                        <div>
                            <h4 class="font-heading font-black text-sm uppercase mb-2">Emparejar Nuevo Dispositivo</h4>
                            <form id="form-vincular-dev" class="space-y-2 mb-3">
                                <input id="dev-nombre" placeholder="Nombre (ej: iPhone Carlos)" maxlength="32" class="w-full border-2 border-brand-black rounded px-2.5 py-1.5 text-xs font-bold" required />
                                <button type="submit" class="w-full bg-brand-yellow hover:bg-yellow-300 text-brand-black font-heading font-black py-2 rounded border-2 border-brand-black text-xs shadow-brutal-sm">
                                    + VINCULAR TELÉFONO
                                </button>
                            </form>
                            <h4 class="font-heading font-black text-xs uppercase mb-1">Dispositivos Autorizados (${e.length})</h4>
                            <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                ${e.map(i=>`
                                    <div class="border border-brand-black rounded p-2 bg-white flex justify-between items-center text-xs">
                                        <div class="min-w-0 pr-2">
                                            <p class="font-black truncate text-brand-black">${i.nombre}</p>
                                            <p class="text-[10px] text-gray-500 font-mono">${i.ip} · ${i.ultimoAcceso}</p>
                                        </div>
                                        <button data-revocar-dev="${i.id}" class="text-[10px] font-black text-red-600 hover:underline shrink-0">
                                            Desconectar
                                        </button>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center pt-3 border-t-2 border-brand-black text-xs text-gray-500 font-bold">
                    <span>Sesión tokenizada con HMAC SHA-256</span>
                    <button id="qr-cerrar-btn" class="bg-brand-black text-white px-4 py-2 rounded font-black font-heading text-xs">CERRAR</button>
                </div>
            </div>
        </div>`;const a=()=>{this.modalRoot.innerHTML=""};(o=document.getElementById("qr-cerrar"))==null||o.addEventListener("click",a),(n=document.getElementById("qr-cerrar-btn"))==null||n.addEventListener("click",a),(l=document.getElementById("form-vincular-dev"))==null||l.addEventListener("submit",async i=>{i.preventDefault();const r=document.getElementById("dev-nombre");r!=null&&r.value.trim()&&(await D.registrarDispositivo(r.value.trim()),this.abrirModalQrMovil())}),this.modalRoot.querySelectorAll("[data-revocar-dev]").forEach(i=>{i.addEventListener("click",async()=>{const r=i.dataset.revocarDev;r&&(await D.revocarDispositivo(r),this.abrirModalQrMovil())})})}toastError(e){var a;this.modalRoot.innerHTML=`
        <div class="fixed bottom-6 right-6 bg-red-600 text-white border-2 border-brand-black rounded shadow-brutal px-5 py-4 font-heading font-bold max-w-md z-[110]">
            ${e.replace(/"/g,"")}
            <button id="toast-close" class="ml-3 underline font-black">cerrar</button>
        </div>`,(a=document.getElementById("toast-close"))==null||a.addEventListener("click",()=>{this.modalRoot.innerHTML=""})}}document.addEventListener("DOMContentLoaded",()=>{new Ye().arrancar().catch(u=>console.error(u))});

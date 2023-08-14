import { TamanioMuesta } from "../utils/calidad";
import { logoLito, bien, mal } from "./imagenes";
export function cuerpoDocumento(tamanioMuestras: TamanioMuesta[], pde: any, nivelInspeccion:number,usuarioRegistroInspeccion:string) {
    const d = new Date();
    const fecha= ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +d.getFullYear();
    
    tamanioMuestras.forEach(x=>x.totalKits)
    const template =
        [
            {
                image: 'logoLito',
                fit: [150, 150],
                margin: [0, 0, 0, 20]
            },
            {
                text: 'RESUMEN DE INSPECCIÓN ',
                fontSize: 12,
                alignment: 'center',
            },
            {
                text: 'Nombre del PDE',
                style: 'sectionHeader'
            },
            {
                columns: [
                    [
                        { text: pde.nombre, style: 'textoNormal' },
                    ],
                    [
                        {
                            text: `Fecha: ${fecha}`,
                            alignment: 'right',
                            style: 'textoNormal'
                        },
                        {
                            text: `Registrado por: ${usuarioRegistroInspeccion}`,
                            alignment: 'right',
                            style: 'textoNormal'
                        },
                        {
                            text: `Nivel de inspección: ${nivelInspeccion}`,
                            alignment: 'right',
                            style: 'textoNormal'
                        },
                    ]
                ]
            },
            {
                table: {
                    headerRows: 1,
                    style: 'tablaInspeccion',
                    widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Número de parte', style: 'cabecera' },
                            { text: 'Total de kits', style: 'cabecera' },
                            { text: 'Tamaño muestra', style: 'cabecera' },
                            { text: 'Aceptados (Muestra)', style: 'cabecera' },
                            { text: 'Rechazados (Muestra) ', style: 'cabecera' },
                            { text: 'Aceptados (Inspección)', style: 'cabeceraNegra' },
                            { text: 'Rechazados (Inspección)', style: 'cabeceraNegra' },
                            { text: '', style: 'cabeceraNegra' },
                        ],
                        ...tamanioMuestras.map(m => {
                            return [
                                { text: m.nombreCaja, style: "textoTablaCentrado" },
                                { text: m.totalKits, style: "textoTablaDerecha" },
                                { text: m.tamanioMuestra, style: "textoTablaDerecha" },
                                { text: m.toleranciaAceptados, style: "textoTablaDerecha" },
                                { text: m.toleranciaRechazados, style: "textoTablaDerecha" },
                                { text: m.aceptadosInspeccion, style: "textoTablaDerecha" },
                                { text: m.rechazadosInspeccion, style: "textoTablaDerecha" },
                                showStatus(m)
                            ]
                        }),
                        [
                            { text: 'TOTALES', style: 'cabecera' },
                            { text: tamanioMuestras.map(x=>x.totalKits).reduce((a,b)=>Number(a)+Number(b)), style: 'cabeceraDerecha' },
                            { text: tamanioMuestras.map(x=>x.tamanioMuestra).reduce((a,b)=>Number(a)+Number(b)), style: 'cabeceraDerecha' },
                            { text: tamanioMuestras.map(x=>x.toleranciaAceptados).reduce((a,b)=>Number(a)+Number(b)), style: 'cabeceraDerecha' },
                            { text: tamanioMuestras.map(x=>x.toleranciaRechazados).reduce((a,b)=>Number(a)+Number(b)), style: 'cabeceraDerecha' },
                            { text: tamanioMuestras.map(x=>x.aceptadosInspeccion).reduce((a,b)=>Number(a)+Number(b)), style: 'cabeceraNegraDerecha' },
                            { text: tamanioMuestras.map(x=>x.rechazadosInspeccion).reduce((a,b)=>Number(a)+Number(b)), style: 'cabeceraNegraDerecha' },
                            { text: '', style: 'cabeceraNegra' },

                        ]
                    ]
                }
            },
        ];
    const images = {
        logoLito: `data:image/png;base64,${logoLito}`,
        bien: `data:image/png;base64,${bien}`,
        mal: `data:image/png;base64,${mal}`
    };
    const styles = {
        textoNormal: {
            fontSize: 9,
            margin: [0, 0, 0, 10]
        },
        tablaInspeccion: {
            fontSize: 8,
            margin: [0, 0, 0, 20],
        },
        textoTablaDerecha: {
            fontSize: 8,
            alignment: 'right'
        },
        textoTablaCentrado: {
            fontSize: 8,
            alignment: 'center'
        },
        cabecera: {
            bold: true,
            fontSize: 7,
            fillColor: '#436784',
            color: "white",
            alignment: 'center'
        },
        cabeceraDerecha: {
            bold: true,
            fontSize: 7,
            fillColor: '#436784',
            color: "white",
            alignment: 'right'
        },
        cabeceraNegra: {
            bold: true,
            fontSize: 7,
            fillColor: '#373434 ',
            color: "white",
            alignment: 'center'
        },
        cabeceraNegraDerecha: {
            bold: true,
            fontSize: 7,
            fillColor: '#373434 ',
            color: "white",
            alignment: 'right'
        },
        sectionHeader: {
            bold: true,
            fontSize: 9,
            margin: [0, 0, 0, 0]
        }
    };
    return { template, images, styles };
}

function showStatus(muestra: TamanioMuesta) {

    if (muestra.aceptadosInspeccion > 0 || muestra.rechazadosInspeccion > 0) {
        return {
            image: muestra.rechazadosInspeccion <= muestra.toleranciaRechazados ? 'bien' : 'mal',
            fit: [15, 15],
            margin: [20, 0, 0, 0]
        };
    }
    return { text: "", style: "textoTabla" }
}




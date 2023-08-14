import { obtenerMatrix } from "src/app/utils/utils";

export const CajaImpresion:any = ()=> {
    const logoLito = "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";
    
    
    return [
        {
            // image: `data:image/png;base64,${logoLito}`,
            // fit: [100, 100],
            // alignment: 'center',
            // margin: [0, 0, 0, 20]            
        },        
        {
            text: 'Contiene 21  kits',
            fontSize:10,
            characterSpacing:5,
            alignment: 'center',
            color: '#FFFFFF'    ,
            background:"black"        
        },
        {
            text: 'Customer Details',
            style: 'sectionHeader'
        },
        {
            columns: [
                [
                    { text: "Direccion", style: 'textoNormal' },
                    { text: "Email", style: 'textoNormal' },
                    { text: "Contacto", style: 'textoNormal' },
                ],
                [
                    {
                        text: `Date: ${new Date().toLocaleString()}`,
                        alignment: 'right',
                        style: 'textoNormal'
                    },
                    {
                        text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
                        alignment: 'right',
                        style: 'textoNormal'
                    }
                ]
            ]
        },
        {
            text: 'Order Details',
            style: 'sectionHeader',
            margin: [0, 0, 0, 40],
        },        
        {
            text: "",
            margin: [0, 0, 0, 10],
            style: 'textoNormal'
        },
        {
            columns: [                
                [{
                    image: obtenerMatrix(),
                    width: 250,
                    alignment: 'center',
                    margin: [0, 0, 0, 5]
                }],                
            ]
        },
        {
            text: "CAJA",
            fontSize: 50,
            bold: true,
            alignment: 'center',
            margin: [0, 50, 0, 10],
            color: '#047886'
        }        
    ];
};




export interface Budget {
    id: number;
    items: Item[];
    subTotal?: number;
    unexpected?: number;
    total?: number;
    contributions?: Contribution[];
    financialAnalysis?: FinancialAnalysis;
    discounts?: Discounts;
}

export interface Item {
    name?: string,
    description: string[];
    unity: string[];
    expenditures?: Expenditure[];
    total?: number;
    id?: number;
}

export interface Expenditure {
    first?: Expenditure;
    id: number,
    description: string;
    quantity: number;
    time?: number;
    dedication?: number;
    unityValue: number;
    total?: number;
    totalWithoutFP?: number;
    fp?: number;
    unityWithFP?: number;
    totalWithFP?: number;
    comment: string;
    logisticComment?: string;
    contrated: boolean;
    realCost?: number;
    approved?: boolean;
    unity?: string;
    eliminated?: boolean;
    created?: boolean;
}

export interface Contribution {
    type: string;
    title: string;
    items: ContributionItem[];
}

export interface ContributionItem {
    name: string;
    value?: number;
}

export interface FinancialAnalysis {
    clients: number;
    min: number;
    estimated: number;
    balanceClients: number;
    rate: number;
    balance: number;
    finalTotal: FinalTotal;
}

export interface FinalTotal {
  grossIncome: number;
  contributions: number;
  income: number;
  expenses: number;
  escess: number;
}

export interface Discounts {
  discountItems: DiscountItems[];
}

export interface DiscountItems {
  rate: string;
  quotas?: number;
  value?: number;
  total?: number;
  balance?: number;
}

export function createNewBudget(id: number): Budget {
    const items = [PERSONAL, MATERIAL, EQUIP, TRANSPORT, GASTRONOMY, COMERCIAL, COMUNICATION, LOCATION, SOFTWARE, OTHER];
    const contributions: Contribution[]= [
        {
            type: 'UDEA',
            title: 'RESOLUCIÓN RECTORAL 1189 de 1990',
            items: [
                { name: 'Manejo y costos administración (10%)' },
                { name: 'Educación Continua' }
            ]
        },
        {
            type: 'ING',
            title: 'RESOLUCIÓN DECANATO 059 de 2013',
            items: [
                { name: 'Educación Continua' }
            ]
        }
    ];
    const discounts: Discounts = {
      discountItems: [
        { rate: RATES[0] },
        { rate: RATES[1] },
        { rate: RATES[2] },
        { rate: RATES[3] },
        { rate: RATES[4] },
        { rate: RATES[5] },
        { rate: RATES[6] }
      ]
    }

    return {
        id: id,
        items: items,
        contributions: contributions,
        discounts: discounts
    }
}

const RATES: string[] = ['Publico UdeA + PP', 'Grupos + PP', 'Público UdeA', 'Grupos', 'Tarifa Plena', 'Tarifa Plena + PP', 'Especiales'];

export const PERSONAL: Item = {
  id: 0,
  name: 'Personal/Recurso Humano',
  description: [
      'Auxiliar',
      'Auxiliar Logístico',
      'Contrato (CIS)',
      'Coordinador Proyectos',
      'Experto',
      'Mensajero',
      'Monitor',
      'Practicante',
      'Profesional',
      'Vinculado (UdeA)'
    ],
    unity: [
      'Año',
      'Día',
      'Entregable',
      'Hora',
      'Mes',
      'Semestre',
      'Trimestre'
    ]
  }
  
  export const MATERIAL: Item = {
    id: 1,
    name: 'Materiales/Suministros/Obra Fisica',
    description: [
      'Agendas',
      'Baterías',
      'Block iris',
      'Bolsa Personalizada',
      'Bolsillo',
      'Borrador de Goma',
      'Borrador de Tablero',
      'Botas de Seguridad',
      'Caja de colores',
      'Camisetas',
      'Carpeta AZ',
      'Carpeta Catálogo 1"',
      'Carpeta Catálogo 2"',
      'Carpeta Catálogo 3"',
      'Carpeta Celuguía/Legajadora Carta',
      'Carpeta Celuguía/Legajadora Oficio',
      'Carpeta Institucional',
      'Carpeta Personalizada',
      'Carpeta Plástica Carta',
      'Carpeta Plástica Oficio',
      'Cascos de Seguridad',
      'Chaleco Identificación',
      'Cinta Plástica Emabalar',
      'Cinta Plástica Embalar',
      'Cinta Plástica Enmascarar',
      'Cinta Plástica Transparente',
      'Clips Mariposa',
      'Clips Metálicos',
      'Cuaderno Grande',
      'Cuaderno Pequeño',
      'Equipo para trabajo en altura',
      'Escarapelas',
      'Fotocopias',
      'Gorras',
      'Impresiones a color',
      'Labels',
      'Lapicero',
      'Lapicero Intitucional/Personalizado',
      'Lápiz',
      'Libreta Bitácora',
      'Libreta Institucional/Personalizada',
      'Maletín Institucional/Personalizado',
      'Marcador de Tablero',
      'Marcador Permanente',
      'Opalinas',
      'Overol',
      'Pilas',
      'Pliegos de papel',
      'Portapendones',
      'Postick',
      'Recarga impresora',
      'Resma de papel',
      'Revisteros',
      'Señalador Tablero',
      'Sitckers',
      'Sobres de manila',
      'Tabla Portapapeles',
      'Tijeras',
      'Torre de Discos',
      'Equipos de protección',
      'Equipos de trabajo en altura',
      'Insumos de Oficina',
      'Otros'
    ],
    unity: [
      'Unidad',
      'Global'
    ]
  }
  
  export const EQUIP: Item = {
    id: 2,
    name: 'Equipos/Maquinaria',
    description: [
      'Adquisición Cámara Fotográfica',
      'Adquisición Computador Escritorio',
      'Adquisición Computador Portátil',
      'Adquisición de Tablet´s',
      'Adquisición Escaner',
      'Adquisición Impresoras',
      'Adquisición USB',
      'Adquisición insumos de Laboratorio',
      'Adquisición equipos de Laboratorio',
      'Alquiler Computador Esctritorio',
      'Alquiler Computador Portátil',
      'Alquiler Datáfono',
      'Alquiler de Tarima',
      'Alquiler Equipos de Laboratorio',
      'Alquiler insumos de Laboratorio',
      'Alquiler Escaner',
      'Alquiler Impresoras',
      'Alquiler Mobiliario Stand',
      'Alquiler Panelería',
      'Alquiler Servicio de Sonido',
      'Alquiler Servicios Audiovisuales (Sonido + Luces + Video)',
      'Alquiler Servicios de Luces',
      'Cables de Red/HDMI/Datos/VGA/Convertidor USB y RED',
      'Extensión Eléctrica',
      'GPS',
      'Otros'
    ],
    unity: [
      'Año',
      'Día',
      'Entregable',
      'Hora',
      'Mes',
      'Semestre',
      'Trimestre',
      'Unidad',
      'Global'
    ]
  }
  
  export const TRANSPORT: Item = {
    id: 3,
    name: 'Transporte/Sostenimiento en Campo',
    description: [
      'Tiquetes avión',
      'Transporte Bus',
      'Transporte Buseta',
      'Transporte Camioneta',
      'Transporte no Convencional',
      'Transporte Taxi',
      'Transporte Van',
      'Viáticos',
      'Otro'
    ],
    unity: [
      'Día',
      'Hora',
      'Trayecto'    
    ]
  }
  
  export  const GASTRONOMY: Item = {
    id: 4,
    name: 'Gastronomía',
    description: [
      'Almuerzo con Servicio',
      'Almuerzo Empacado',
      'Botellas de agua',
      'Cena con Servicio',
      'Cena Empacado',
      'Coctel',
      'Estación de Café',
      'Grupos Culturales',
      'Refrigerio',
      'Servicio de Alimentación',
      'Otro' 
    ],
    unity: [
      'Unidad',
      'Global'    
    ]
  }
  
  export  const COMERCIAL: Item = {
    id: 5,
    name: 'Estrategia Comunicacional/Comercial',
    description: [
      'Afiche',
      'Agenda Programática',
      'Anuncio de Prensa',
      'Anuncio de Revista',
      'Automatización de procesos del CESET',
      'Banners',
      'Boletín de Prensa',
      'Bonos de Descuento',
      'Brochure',
      'Carne',
      'Cuña radial ',
      'Diseño Página Web',
      'Identidad Grafíca',
      'Impresiones',
      'Pasacalle',
      'Pauta en Televisión ',
      'Pendón',
      'Pieza Gráfica',
      'Plataforma Mail Marketing',
      'Plataforma Pagos en Linea',
      'Plegables',
      'Post para Redes',
      'Posters',
      'Rompe Tráfico',
      'Señaletica',
      'Slides',
      'Social Media',
      'Souvenirs',
      'Tarjetas de Invitación',
      'Tarjetas de Presentación',
      'Totems',
      'Video',
      'Volantes',
      'Habladores',
      'Otros'
    ],
    unity: [
      'Unidad',
      'Global'
    ]
  }
  
  export const COMUNICATION: Item = {
    id: 6,
    name: 'Comunicaciones',
    description: [
      'Plan de Datos',
      'Plan de Voz',
      'Equipo Celular',
      'Envío de Correspondencia',
      'Otro'
    ],
    unity: [
      'Unidad',
      'Global'
    ]
  }

  export const LOCATION: Item = {
    id: 7,
    name: 'Locaciones',
    description: [
      'Auditorio',
      'Aula de cómputo',
      'Laboratorio',
      'Salón de Clase',
      'Salones de eventos',
      'Otro'
    ],
    unity: [
      'Día',
      'Global',
      'Hora',
      'Unidad'    
    ]
  }
  
  export const SOFTWARE: Item = {
    id: 8,
    name: 'Software',
    description: [
      'Licencia Wiz IQ',
      'Licencia Adobe',
      'Plataforma Moodle',
      'Desarrollo de contenidos',
      'Mantenimiento Plataforma',
      'Plataforma Wen Conference',
      'Licencia ArcGis',
      'Licencia AutoCad',
      'Licencia Projetc',
      'Licencia Inventor',
      'Licencia Acces',
      'Licencia Office',
      'Otro'
    ],
    unity: [
      'Global',
      'Unidad'    
    ]
  }
  
  export const OTHER: Item = {
    id: 9,
    name: 'Otros',
    description: [
      'Normas',
      'Permisos',
      'Pólizas',
      'Seguro',
      'Servicios de Laboratorio',
      'Servicios Técnicos',
      'Otro'    
    ],
    unity: [
      'Global',
      'Unidad'    
    ]
  }
  
  export const ITEMS: Item[] = [PERSONAL, MATERIAL, EQUIP, TRANSPORT, GASTRONOMY, COMERCIAL, COMUNICATION, LOCATION, SOFTWARE, OTHER];
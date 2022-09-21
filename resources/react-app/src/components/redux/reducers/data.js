export const FilterItems = [
  {
    name: "searchText",
    title: "متن جستجو",
    label: "متن جستجو",
    value: ""
  },
  {
    name: "class",
    title: "نوع مجموعه",
    label: "",
    value: null
  },
  {
    name: "type",
    title: "طبقه بندی",
    label: "",
    value: null
  },
  {
    name: "categoryId",
    title: "دسته بندی",
    label: "",
    value: null
  },
  {
    name: "countryId",
    title: "کشور",
    label: "iran",
    value: 80
  },
  {
    name: "provinceId",
    title: "استان",
    label: "",
    value: null
  },
  {
    name: "cityId",
    title: "شهر",
    label: "",
    value: null
  },
  {
    name: "idpId",
    title: "شهرک صنعتی",
    label: "",
    value: null
  },
  {
    name: "ftzId",
    title: "منطقه آزاد تجاری-صنعتی",
    label: "",
    value: null
  },
  {
    name: "insideOfIdp",
    title: "مستقر در شهرک صنعتی",
    label: "مستقر در شهرک صنعتی",
    value: false
  },
  {
    name: "outsideOfIdp",
    title: "خارج از شهرک صنعتی",
    label: "خارج از شهرک صنعتی",
    value: false
  },
  {
    name: "insideOfFtz",
    title: "مستقر در منطقه آزاد تجاری-صنعتی",
    label: "مستقر در منطقه آزاد تجاری-صنعتی",
    value: false
  },
  {
    name: "outsideOfFtz",
    title: "خارج از منطقه آزاد تجاری-صنعتی",
    label: "خارج از منطقه آزاد تجاری-صنعتی",
    value: false
  },
  {
    name: "openDate",
    title: "تاریخ افتتاحیه",
    label: "تاریخ افتتاحیه",
    value: null
  },
  {
    name: "closeDate",
    title: "تاریخ اختتامیه",
    label: "تاریخ اختتامیه",
    value: null
  },
  {
    name: "openTime",
    title: "زمان شروع بازدید",
    label: "زمان شروع بازدید",
    value: null
  },
  {
    name: "closeTime",
    title: "زمان اتمام بازدید",
    label: "زمان اتمام بازدید",
    value: null
  }
];
export default FilterItems;
export const Classes = [
  {
    id: 1,
    value: "idp",
    label: "شهرک های صنعتی",
    icon: "icons/special-flat/factory.svg"
  },
  {
    id: 2,
    value: "prd",
    label: "واحدهای صنعتی-تولیدی",
    icon: "icons/special-flat/manufacturing.svg"
  },
  {
    id: 3,
    value: "gld",
    label: "واحدهای صنفی",
    icon: "icons/special-flat/shop.svg"
  },
  {
    id: 4,
    value: "prv",
    label: "تامین کنندگان",
    icon: "icons/special-flat/growth.svg"
  },
  {
    id: 5,
    value: "ofc",
    label: "واحدهای اداری",
    icon: "icons/special-flat/folder(1).svg"
  },
  {
    id: 6,
    value: "ftz",
    label: "مناطق آزاد تجاری-صنعتی",
    icon: "icons/special-flat/airplane.svg"
  },
  {
    id: 7,
    value: "act",
    label: "اتاق بازرگانی و تشکل ها",
    icon: "icons/special-flat/teamwork(1).svg"
  },
  {
    id: 8,
    value: "exb",
    label: "نمایشگاه ها",
    icon: "icons/special-flat/museum.svg"
  },
  {
    id: 9,
    value: "wtd",
    label: "نیازمندی ها",
    icon: "icons/special-flat/agreement.svg"
  }
];
export const Types = [
  {
    id: 1,
    value: "factory",
    label: "کارخانه",
    class: "prd",
    icon: null
  },
  {
    id: 2,
    value: "workshop",
    label: "کارگاه",
    class: "prd",
    icon: ""
  },
  {
    id: 3,
    value: "produce",
    label: "تولیدی",
    class: "gld",
    icon: null
  },
  {
    id: 4,
    value: "contribute",
    label: "توزیعی",
    class: "gld",
    icon: ""
  },
  {
    id: 5,
    value: "service",
    label: "خدماتی",
    class: "gld",
    icon: null
  },
  {
    id: 6,
    value: "technical",
    label: "فنی",
    class: "gld",
    icon: null
  },
  {
    id: 7,
    value: "clearance",
    label: "ترخیص کاران",
    class: "prv",
    icon: null
  },
  {
    id: 8,
    value: "import-export",
    label: "صادرات-واردات",
    class: "prv",
    icon: null
  },
  {
    id: 9,
    value: "mineral",
    label: "مواد اولیه",
    class: "prv",
    icon: null
  },
  {
    id: 10,
    value: "mine",
    label: "معادن",
    class: "prv",
    icon: null
  },
  {
    id: 11,
    value: "farming",
    label: "کشاورزی",
    class: "prv",
    icon: null
  },
  {
    id: 12,
    value: "demand",
    label: "تقاضا",
    class: "wtd",
    icon: null
  },
  {
    id: 13,
    value: "offer",
    label: "عرضه",
    class: "wtd",
    icon: null
  },
  {
    id: 14,
    value: "ad",
    label: "تبلیغات",
    class: "wtd",
    icon: null
  },
  {
    id: 15,
    value: "hire",
    label: "استخدام",
    class: "wtd",
    icon: null
  },
  {
    id: 16,
    value: "state",
    label: "داخلی",
    class: "exb",
    icon: null
  },
  {
    id: 17,
    value: "global",
    label: "خارجی",
    class: "exb",
    icon: null
  },
  {
    id: 18,
    value: "local",
    label: "محلی",
    class: "exb",
    icon: null
  },
  {
    id: 19,
    value: "idp",
    label: "شهرک های صنعتی",
    class: "exb",
    icon: null
  }
];
export const HomeBlocks = [
  {
    label: "واحدهای صنعتی-تولیدی",
    collection: "prd",
    collectionLabel: "واحدهای صنعتی-تولیدی",
    type: "factory",
    typeLabel: "کارخانه ها",
    icon: "icons/special-flat/factory.svg"
  },
  {
    label: "کارگاه ها",
    collection: "prd",
    collectionLabel: "واحدهای صنعتی-تولیدی",
    type: "workshop",
    typeLabel: "کارگاه ها",
    icon: "icons/special-flat/warehouses.svg"
  },
  {
    label: "نمایشگاه ها",
    collection: "exb",
    icon: "icons/special-flat/museum.svg"
  },
  {
    label: "نیازمندی ها",
    collection: "wtd",
    icon: "icons/special-flat/agreement.svg"
  },
  {
    label: "تامین کنندگان",
    collection: "prv",
    icon: "icons/special-flat/growth.svg"
  },
  {
    label: "مناطق آزاد تجاری - صنعتی",
    collection: "ftz",
    icon: "icons/special-flat/airplane.svg"
  },
  {
    label: "اتاق بازرگانی و تشکل ها",
    collection: "act",
    icon: "icons/special-flat/teamwork(1).svg"
  },
  {
    label: "واحدهای اداری",
    collection: "ofc",
    icon: "icons/special-flat/folder(1).svg"
  }
];
export const ClassesOfAddingNewItem = [
  {
    value: "prd",
    label: "واحد صنعتی",
    icon: "icons/special-flat/manufacturing.svg",
  },
  {
    value: "gld",
    label: "واحد صنفی",
    icon: "icons/special-flat/shop.svg"
  },
  {
    value: "exb",
    label: "نمایشگاه",
    icon: "icons/special-flat/museum.svg"
  },
  {
    value: "prt",
    label: "شرکت در نمایشگاه",
    icon: "icons/special-flat/museum.svg"
  },
  {
    value: "wtd",
    label: "نیازمندی",
    icon: "icons/special-flat/agreement.svg"
  },
  {
    value: "prv",
    label: "تامین کننده",
    icon: "icons/special-flat/growth.svg"
  },
  {
    value: "ofc",
    label: "واحد اداری",
    icon: "icons/special-flat/folder(1).svg"
  },
  {
    value: "act",
    label: "انجمن و تشکل",
    icon: "icons/special-flat/teamwork(1).svg"
  }
];
export const DataStoreOfAddNewItem = [
  {
    name: "class",
    value: "",
    label: "",
  },
  {
    name: "type",
    value: "",
    label: "",
  },
  {
    name: "categoryId",
    value: "",
    label: "",
  },
  {
    name: "countryId",
    value: 80,
    label: "Iran",
  },
  {
    name: "provinceId",
    value: "",
    label: "",
  },
  {
    name: "cityId",
    value: "",
    label: "",
  },
  {
    name: "exbId",
    value: "",
    label: "",
  },
  {
    name: "companyId",
    value: "",
    label: "",
  },
  {
    name: "executorId",
    value: "",
    label: "",
  },
  {
    name: "idpId",
    value: "",
    label: "",
  },
  {
    name: "ftzId",
    value: "",
    label: "",
  },
  {
    name: "isInIdp",
    value: false,
    label: "مستقر در شهرک صنعتی"
  },
  {
    name: "isInFtz",
    value: false,
    label: "مستقر در منطقه آزاد تجاری-صنعتی"
  },
  {
    name: "title",
    value: ''
  },
  {
    name: "dsc",
    value: '',
  },

  {
    name: "userToken",
    value: '',
  },
  {
    name: "collectionableType",
    value: 'App\\Collection',
    label: "",
  },
  {
    name: "collectionableId",
    value: '',
    label: "",
  },
];
export const Relations = [
  {
    name: 'products',
    show: ['prd', 'prv', 'prt', 'gld'],
    label: 'محصولات',
    icon: 'icons/special-flat/assembly.svg',
  },
  {
    name: 'participants',
    show: ['exb'],
    label: 'شرکت کننده ها',
    icon: 'icons/special-flat/museum(1).svg',
  },
  {
    name: 'services',
    show: ['ofc', 'act'],
    label: 'خدمات',
    icon: 'icons/special-flat/assembly.svg',
  },
  {
    name: 'news',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'idp', 'ftz', 'act', 'exb'],
    label: 'اخبار',
    icon: 'icons/special-flat/news.svg',
  },
  {
    name: 'wantads',
    show: ['prd', 'prv', 'gld', 'ofc', 'idp', 'ftz', 'exb', 'act'],
    label: 'نیازمندیها',
    icon: 'icons/special-flat/agreement.svg',
  },
  {
    name: 'boards',
    show: ['prd', 'prv', 'ofc', 'idp', 'ftz', 'exb', 'act'],
    label: 'هیئت مدیره',
    icon: 'icons/special-flat/team.svg'
  },
  {
    name: 'slides',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'idp', 'ftz', 'act', 'exb', 'pdc', 'wtd'],
    label: 'اسلاید ها',
    icon: 'icons/special-flat/slider.svg',
  },
  {
    name: 'addresses',
    show: ['prd', 'prv', 'gld', 'prt', 'ofc', 'idp', 'ftz', 'act', 'exb', 'wtd'],
    label: 'آدرس ها',
    icon: 'icons/special-flat/location.svg',
  },
  {
    name: 'phones',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'idp', 'ftz', 'act', 'exb', 'wtd'],
    label: 'تلفن ها',
    icon: 'icons/special-flat/telephone.svg',
  },
  {
    name: 'socialMedias',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'idp', 'ftz', 'act', 'exb', 'wtd'],
    label: 'شبکه های اجتماعی',
    icon: 'icons/special-flat/social-media.svg',
  },
  {
    name: 'agents',
    show: ['prd', 'prv', 'prt', 'gld', 'ofc', 'idp', 'ftz', 'act', 'exb'],
    label: 'نمایندگی ها',
    icon: 'icons/special-flat/marketing.svg',
  },
  {
    name: 'catalogs',
    show: ['prd', 'prv', 'prt', 'gld'],
    label: 'کاتالوگ',
    icon: 'icons/special-flat/catalog.svg',
  }
]
export const inputs = [
  {
    relation: ['product', 'products', 'pdc'],
    inputs: [
      {
        name: 'categoryId',
        variant: 'linear-nested',
        type: 'select',
      },
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'dsc',
        type: 'textarea',
      }
    ],
  }
];
export const socialMedias = [
  {
    value: 'website',
    label: 'وبسایت',
    icon: 'icons/special-flat/domain.svg'
  },
  {
    value: 'email',
    label: 'ایمیل',
    icon: 'icons/special-flat/email.svg'
  },
  {
    value: 'soroush',
    label: 'سروش',
    icon: 'images/social-medias/soroush.png'
  },
  {
    value: 'eitaa',
    label: 'ایتا',
    icon: 'images/social-medias/eitaa.png'
  },
  {
    value: 'bale',
    label: 'بله',
    icon: 'images/social-medias/bale.png'
  },
  {
    value: 'aparat',
    label: 'آپارات',
    icon: 'images/social-medias/aparat.png'
  },
  {
    value: 'instagram',
    label: 'اینستاگرام',
    icon: 'images/social-medias/instagram.png'
  },
  {
    value: 'telegram',
    label: 'تلگرام',
    icon: 'images/social-medias/telegram.png'
  },
  {
    value: 'whatsapp',
    label: 'واتساپ',
    icon: 'images/social-medias/whatsapp.png'
  },
  {
    value: 'facebook',
    label: 'فیسبوک',
    icon: 'images/social-medias/facebook.png'
  },
  {
    value: 'twitter',
    label: 'توییتر',
    icon: 'images/social-medias/twitter.png'
  },
  {
    value: 'linkedin',
    label: 'لینکدین',
    icon: 'images/social-medias/linkedin.png'
  },
];
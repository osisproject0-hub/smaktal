export const currentUser = {
  id: 'user1',
  name: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  avatarId: 'avatar1',
  jurusan: 'Teknik Komputer & Jaringan',
  kelas: 'XI TKJ 1',
  house: 'Nusantara',
  points: 175,
};

export const houses = [
  { id: 'nusantara', name: 'Nusantara', points: 12540, emblemId: 'house_nusantara' },
  { id: 'garuda', name: 'Garuda', points: 11890, emblemId: 'house_garuda' },
  { id: 'cendekia', name: 'Cendekia', points: 11230, emblemId: 'house_cendekia' },
  { id: 'pertiwi', name: 'Pertiwi', points: 10850, emblemId: 'house_pertiwi' },
];

export const leaderboard = [
  { id: 'user1', name: 'Budi Santoso', points: 175, avatarId: 'avatar1', house: 'Nusantara' },
  { id: 'user2', name: 'Ani Wijaya', points: 162, avatarId: 'avatar2', house: 'Garuda' },
  { id: 'user3', name: 'Citra Lestari', points: 158, avatarId: 'avatar3', house: 'Cendekia' },
  { id: 'user4', name: 'Eko Prasetyo', points: 145, avatarId: 'avatar4', house: 'Pertiwi' },
];

export const skillTree = {
  name: 'Teknik Komputer & Jaringan',
  tiers: [
    {
      name: 'Dasar',
      skills: [
        { id: 'sk01', name: 'Dasar Jaringan', unlocked: true, description: 'Memahami konsep dasar jaringan komputer.' },
        { id: 'sk02', name: 'Perakitan Komputer', unlocked: true, description: 'Mampu merakit dan membongkar PC.' },
      ],
    },
    {
      name: 'Menengah',
      skills: [
        { id: 'sk03', name: 'Konfigurasi Router', unlocked: true, description: 'Konfigurasi dasar router dan switch.' },
        { id: 'sk04', name: 'Instalasi OS Jaringan', unlocked: false, description: 'Instalasi sistem operasi server.' },
        { id: 'sk05', name: 'Manajemen Kabel', unlocked: true, description: 'Teknik crimping dan penataan kabel.' },
      ],
    },
    {
      name: 'Lanjutan',
      skills: [
        { id: 'sk06', name: 'Administrasi Server', unlocked: false, description: 'Mengelola layanan server (Web, DNS, DHCP).' },
        { id: 'sk07', name: 'Keamanan Jaringan', unlocked: false, description: 'Konfigurasi firewall dan deteksi intrusi.' },
      ],
    },
    {
      name: 'Spesialis',
      skills: [
        { id: 'sk08', name: 'Cloud Computing', unlocked: false, description: 'Dasar-dasar platform cloud (AWS, GCP, Azure).' },
      ],
    },
  ],
};

export const wellbeingResources = [
  { id: 'res1', type: 'Video', title: 'Manajemen Stres untuk Pelajar', source: 'YouTube', imageId: 'resource_video' },
  { id: 'res2', type: 'Artikel', title: 'Cara Belajar Efektif di Era Digital', source: 'Blog Sekolah', imageId: 'resource_article' },
  { id: 'res3', type: 'Podcast', title: 'Kesehatan Mental Remaja', source: 'Spotify', imageId: 'resource_podcast' },
];

export const learningTopics = [
    { value: 'pemrograman-web', label: 'Pemrograman Web' },
    { value: 'jaringan-dasar', label: 'Jaringan Dasar' },
    { value: 'administrasi-server', label: 'Administrasi Server' },
    { value: 'desain-grafis', label: 'Desain Grafis' },
]

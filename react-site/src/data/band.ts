export type Member = {
  name: string;
  role: string;
  photo: { src: string; pos: string };
};

export const band: Member[] = [
  { name: 'Andrea Giardina',  role: 'Chitarra', photo: { src: '/assets/img/band/giardina.jpg',    pos: '50% 40%' } },
  { name: 'Sergio Grandoni',  role: 'Batteria', photo: { src: '/assets/img/band/sergio.jpg',      pos: '50% 35%' } },
  { name: 'Andrea De Blasi',  role: 'Voce',     photo: { src: '/assets/img/band/deblasi.webp',    pos: '50% 35%' } },
  { name: 'Paulina Pieprzka', role: 'Voce',     photo: { src: '/assets/img/band/paulina.webp',    pos: '50% 40%' } },
  { name: 'Giorgio Massi',    role: 'Tastiera', photo: { src: '/assets/img/band/massi.webp',      pos: '50% 35%' } },
  { name: 'Stefano Proietti', role: 'Basso',    photo: { src: '/assets/img/band/proietti.webp',   pos: '50% 40%' } },
];

import AnimateNumbers from './AnimateNumbers';
import animateNumbersVariants from './AnimateNumbers/variants';
import BentoBox from './BentoBox';
import bentoBoxVariants from './BentoBox/variants';
import Carousel from './Carousel';
import carouselVariants from './Carousel/variants';
import Cursor from './Cursor';
import cursorVariants from './Cursor/variants';
import Map from './Map';
import mapVariants from './Map/variants';
import MotionScroll from './MotionScroll';
import motionScrollVariants from './MotionScroll/variants';
import ProgressBar from './ProgressBar';
import progressBarVariants from './ProgressBar/variants';
import ScrambleText from './ScrambleText';
import scrambleTextVariants from './ScrambleText/variants';
import ScrolledPart from './ScrolledPart';
import scrolledPartVariants from './ScrolledPart/variants';
import Ticker from './Ticker';
import tickerVariants from './Ticker/variants';
import TypeWriter from './TypeWriter';
import typeWriterVariants from './TypeWriter/variants';

const animationCatalog = [
  {
    number: '01',
    folder: 'Map',
    title: 'Map Leaflet',
    description: 'Komponen react-leaflet yang menampilkan titik koordinat di peta.',
    Component: Map,
    variants: mapVariants,
  },
  {
    number: '02',
    folder: 'ProgressBar',
    title: 'Progress Bar',
    description: 'Indikator progress halaman yang bergerak mengikuti scroll.',
    Component: ProgressBar,
    variants: progressBarVariants,
  },
  {
    number: '03',
    folder: 'BentoBox',
    title: 'BentoBox Cards',
    description: 'Mixed bento layout untuk metric, feature, profile, dan list cards.',
    Component: BentoBox,
    variants: bentoBoxVariants,
  },
  {
    number: '04',
    folder: 'MotionScroll',
    title: 'Motion Scroll',
    description: 'Kartu Motion yang muncul saat masuk viewport.',
    Component: MotionScroll,
    variants: motionScrollVariants,
  },
  {
    number: '05',
    folder: 'Carousel',
    title: 'Carousel',
    description: 'Daftar model animasi carousel yang siap dibangun bertahap.',
    Component: Carousel,
    variants: carouselVariants,
  },
  {
    number: '06',
    folder: 'AnimateNumbers',
    title: 'Animate Numbers',
    description: 'Model animasi angka untuk counter, statistik, dan metric cards.',
    Component: AnimateNumbers,
    variants: animateNumbersVariants,
  },
  {
    number: '07',
    folder: 'ScrambleText',
    title: 'Scramble Text',
    description: 'Model animasi teks acak untuk efek reveal dan hover.',
    Component: ScrambleText,
    variants: scrambleTextVariants,
  },
  {
    number: '08',
    folder: 'TypeWriter',
    title: 'TypeWriter',
    description: 'Model animasi teks mengetik untuk headline atau label.',
    Component: TypeWriter,
    variants: typeWriterVariants,
  },
  {
    number: '09',
    folder: 'Ticker',
    title: 'Ticker',
    description: 'Model animasi baris berjalan untuk berita, angka, atau label.',
    Component: Ticker,
    variants: tickerVariants,
  },
  {
    number: '10',
    folder: 'Cursor',
    title: 'Cursor',
    description: 'Model efek cursor untuk interaksi hover dan pointer.',
    Component: Cursor,
    variants: cursorVariants,
  },
  {
    number: '11',
    folder: 'ScrolledPart',
    title: 'Scrolled Part',
    description: 'Model section yang berubah saat halaman discroll.',
    Component: ScrolledPart,
    variants: scrolledPartVariants,
  },
];

export default animationCatalog;

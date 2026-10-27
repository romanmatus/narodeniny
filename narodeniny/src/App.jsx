import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ChevronLeft, ChevronRight, Heart, Pause, Play, X } from 'lucide-react'
import memoryVideo from '../fotky/C6DE2B15-F717-4780-8133-725DE151FBDA (1).mp4'
import stickerLittleThinking from '../nalepky/29EC708E-523F-462E-B8C5-A96F1646F266.png'
import stickerLittlePortrait from '../nalepky/56A73958-DEC0-42B7-8E32-A1E7C787DD39.png'
import stickerCatFlowers from '../nalepky/5722C620-60B3-49FE-8B51-597830081CC9.png'
import stickerSurprise from '../nalepky/9CAB8B06-45F5-430E-866B-B0F2CCCC5562.png'
import stickerWinter from '../nalepky/AF789D95-924D-41B7-AF54-B0F8A9E6707E.png'
import stickerMoustache from '../nalepky/B22534CC-9C44-4A53-8FE9-69E8E482A8FE.png'
import stickerBabyHeart from '../nalepky/baby-heart-transparent.png'
import stickerNo18 from '../nalepky/no-18-sign.png'
import stickerChildhood from '../nalepky/D1EB43E0-661F-47A3-A333-F31E0D3003CA.png'
import stickerVideo from '../nalepky/F2158E3C-551D-43CC-9377-6D8F624262B7.png'
import stickerLittlePink from '../nalepky/little-emmka-pink-transparent.png'
import stickerPoem from '../nalepky/BF04E6F9-C1CC-43C4-B653-B91A857DA635.png'

const currentPhotos = import.meta.glob('../fotky/*.{jpg,JPG,jpeg,JPEG,png,PNG}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const childhoodPhotos = import.meta.glob('../mala emma/*.{jpg,JPG,jpeg,JPEG,png,PNG}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const stickerPhotos = {
  '29EC708E': stickerLittleThinking,
  '56A73958': stickerLittlePortrait,
  '5722C620': stickerCatFlowers,
  '9CAB8B06': stickerSurprise,
  'AF789D95': stickerWinter,
  'B22534CC': stickerMoustache,
  'baby-heart-transparent': stickerBabyHeart,
  'no-18-sign': stickerNo18,
  'D1EB43E0': stickerChildhood,
  'F2158E3C': stickerVideo,
  'little-emmka-pink-transparent': stickerLittlePink,
  'BF04E6F9': stickerPoem,
}

const byName = (collection, name) =>
  Object.entries(collection).find(([path]) => path.includes(name))?.[1]

const reasons = [
  ['01', 'Tvoj úsmev', 'Lebo je nádherný, pls pls pls použivaj ho čo najviac'],
  ['02', 'Tvoj pohľad', 'Lebo z neho viem vyčítať viac než Raffaelo (viac než tisíc slov) '],
  ['03', 'Tvoje srdce', 'Lebo v sebe nosíš viac dobroty a lásky, než si ktokolvek zasluži dostať (ja) '],
]

const galleryOrder = [
  'IMG_1575', 'IMG_0362', 'IMG_0440', 'IMG_3916', 'IMG_1954', 'IMG_0286',
  'IMG_1569', 'IMG_2091', '6FBB9F4B', 'IMG_0314', 'IMG_1580', '64F71AA5',
  'IMG_0638', 'IMG_0505', 'IMG_1176', 'IMG_1267', '9A38E5AA', 'IMG_1521',
]

function Sticker({ name, className = '' }) {
  const src = stickerPhotos[name]
  return src ? <img src={src} alt="" aria-hidden="true" className={`pointer-events-none select-none ${className}`} /> : null
}

function App() {
  const [opened, setOpened] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [playing, setPlaying] = useState(false)
  const kidsScroller = useRef(null)
  const touchStartX = useRef(null)
  const gallery = useMemo(() => {
    const ordered = galleryOrder.map((name) => byName(currentPhotos, name)).filter(Boolean)
    const remaining = Object.entries(currentPhotos)
      .filter(([path]) => !path.includes('poster.png') && !path.includes('birthday-sky') && !path.includes('hero-portrait') && !galleryOrder.some((name) => path.includes(name)))
      .map(([, src]) => src)
    return [...ordered, ...remaining]
  }, [])
  const kids = useMemo(() => Object.values(childhoodPhotos), [])
  const poster = byName(currentPhotos, 'poster.png')
  const hero = byName(currentPhotos, 'hero-portrait')
  const heroTwo = byName(currentPhotos, 'IMG_1954')
  const busPhoto = byName(childhoodPhotos, 'IMG_1336')
  const birthdaySky = byName(currentPhotos, 'birthday-sky')
  useEffect(() => {
    document.body.style.overflow = opened && selectedIndex === null ? '' : 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [opened, selectedIndex])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (selectedIndex === null) return
      if (event.key === 'ArrowLeft') setSelectedIndex((current) => (current - 1 + gallery.length) % gallery.length)
      if (event.key === 'ArrowRight') setSelectedIndex((current) => (current + 1) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery.length, selectedIndex])

  const showPrevious = () => setSelectedIndex((current) => current === null ? null : (current - 1 + gallery.length) % gallery.length)
  const showNext = () => setSelectedIndex((current) => current === null ? null : (current + 1) % gallery.length)

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const distance = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) > 45) distance > 0 ? showPrevious() : showNext()
    touchStartX.current = null
  }

  const openLetter = () => {
    setOpened(true)
    window.setTimeout(() => document.getElementById('zaciatok')?.scrollIntoView({ behavior: 'smooth' }), 450)
  }

  return (
    <main className="overflow-hidden bg-[#f8f1ef] text-[#381f26] selection:bg-[#a9506c] selection:text-white">
      <div className={`intro fixed inset-0 z-[100] grid min-h-[100dvh] place-items-center overflow-hidden bg-[#f7eeee] px-4 py-8 transition-all duration-1000 ${opened ? 'pointer-events-none -translate-y-full opacity-0' : ''}`}>
        <div className="grain" />
        <Sticker name="29EC708E" className="absolute -left-5 top-12 w-32 rotate-[-12deg] opacity-80 md:left-[9%] md:w-44" />
        <Sticker name="56A73958" className="absolute -right-8 bottom-8 w-40 rotate-12 opacity-70 md:right-[10%] md:w-52" />
        <Sticker name="5722C620" className="absolute right-1 top-[12%] w-20 rotate-12 opacity-85 drop-shadow-lg sm:right-[4%] sm:w-28 lg:right-[18%]" />
        <Sticker name="9CAB8B06" className="absolute -left-5 bottom-[3%] w-24 rotate-[-8deg] opacity-80 drop-shadow-lg sm:left-[3%] sm:w-32 lg:left-[15%]" />
        <Sticker name="AF789D95" className="absolute bottom-[20%] right-2 hidden w-20 rotate-6 opacity-75 drop-shadow-lg min-[430px]:block sm:right-[5%] sm:w-24 lg:right-[20%]" />
        <Sticker name="B22534CC" className="absolute left-1 top-[42%] hidden w-20 rotate-[-8deg] opacity-75 drop-shadow-lg min-[430px]:block sm:left-[5%] sm:w-24 lg:left-[20%]" />
        <div className="relative mx-auto w-full max-w-xl text-center">
          <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.38em] text-[#8f5365] sm:mb-6 sm:text-[11px] sm:tracking-[0.5em]">Od bubáčka k narodeninkám</p>
          <div className="relative mx-auto mb-7 h-32 w-32 rounded-full border border-[#c9889a]/50 p-2 sm:h-44 sm:w-44">
            <img src={hero} alt="Emmka" className="h-full w-full rounded-full object-cover object-[50%_30%]" />
            <span className="absolute -bottom-3 -right-5 grid h-16 w-16 place-items-center rounded-full bg-[#8d3f59] font-display text-4xl font-semibold text-white shadow-xl sm:h-20 sm:w-20 sm:text-5xl">18</span>
          </div>
          <h1 className="font-kalam text-5xl font-normal leading-tight min-[380px]:text-6xl sm:text-8xl">Pre Bubáčka</h1>
          <button onClick={openLetter} className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#712f46] px-6 py-3.5 text-sm font-medium text-white shadow-[0_16px_40px_rgba(113,47,70,.22)] transition hover:-translate-y-1 hover:bg-[#8d3f59] focus:outline-none focus:ring-4 focus:ring-[#c98fa1] sm:mt-9 sm:px-7 sm:py-4">
            Prekvápko
            <Heart size={16} className="transition group-hover:scale-125 group-hover:fill-white" />
          </button>
          <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.28em] text-[#9b6c79] sm:text-[10px]">Hanz tu je opäť</p>
        </div>
      </div>

      <section id="zaciatok" className="relative min-h-screen px-5 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="grain" />
        <nav className="relative z-20 mx-auto flex max-w-[1500px] items-center justify-between border-b border-[#7b4958]/20 pb-5">
          <span className="handwritten text-xl">Pro mojeho Bubáčka</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em]">kapitola XVIII</span>
        </nav>

        <div className="relative mx-auto grid min-h-[calc(100vh-90px)] max-w-[1500px] items-center gap-5 py-10 sm:gap-8 sm:py-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 lg:pl-[5vw]">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#9b5067] sm:text-xs sm:tracking-[0.38em]">31 · 10 · 2026</p>
            <h2 className="font-display text-[clamp(4.2rem,21vw,13rem)] leading-[.72] tracking-[-.075em]">
              EM<span className="italic text-[#a44662]">M</span>INKA
            </h2>
            <p className="handwritten mt-2 ml-2 rotate-[-2deg] text-2xl text-[#8d3f59] min-[380px]:text-3xl sm:ml-14 sm:text-5xl">Ty moja malá bubinka</p>
            <div className="mt-8 max-w-md border-l border-[#8d3f59]/50 pl-4 text-[13px] leading-6 text-[#6f535c] sm:mt-12 sm:pl-5 sm:text-sm sm:leading-7">
              <p>Osemnásť rokov smiechu ale aj smútku, trapasov, bolesti brucha a občas aj krásnych chvíľ.</p>
            </div>
          </div>

          <div className="relative mx-auto h-[500px] w-full max-w-[620px] min-[400px]:h-[560px] sm:h-[700px]">
            <div className="absolute left-[1%] top-[7%] h-[50%] w-[96%] rotate-[-2deg] bg-white p-3 pb-14 shadow-[0_25px_80px_rgba(73,36,47,.2)] sm:p-5 sm:pb-16">
              <img src={poster} alt="Všetko najlepšie k narodeninám, Emmka" className="h-full w-full object-cover object-center" />
              <span className="absolute bottom-4 left-6 font-display text-xl font-medium italic sm:text-2xl">Moja oslávenkyňa ♡</span>
            </div>
            <div className="absolute bottom-[2%] right-[1%] h-[44%] w-[52%] rotate-[6deg] bg-[#efe0dc] p-2 pb-11 shadow-2xl sm:right-[3%] sm:w-[46%] sm:p-3 sm:pb-14">
              <img src={busPhoto} alt="Malá Emmka v autobuse" className="h-full w-full object-cover object-[63%_50%]" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] uppercase tracking-[.16em] sm:bottom-5 sm:text-[9px] sm:tracking-[.22em]">pretty since always</span>
            </div>
            <div className="absolute bottom-[8%] left-[7%] h-[34%] w-[32%] rotate-[-7deg] bg-white p-2 pb-9 shadow-xl sm:p-3 sm:pb-12">
              <img src={heroTwo} alt="Portrét Emmky" className="h-full w-full object-cover grayscale" />
            </div>
            <Sticker name="baby-heart-transparent" className="absolute -right-6 top-[4%] w-24 rotate-12 drop-shadow-xl sm:-right-12 sm:w-40" />
            <Sticker name="no-18-sign" className="absolute right-[2%] top-[48%] h-20 w-20 rotate-12 object-contain drop-shadow-xl sm:h-28 sm:w-28" />
          </div>
          <a href="#pribeh" aria-label="Pokračovať nižšie" className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 animate-bounce lg:block"><ArrowDown size={22} /></a>
        </div>
      </section>

      <section id="pribeh" className="relative bg-[#381f26] py-24 text-[#f9eeea] sm:py-32">
        <div className="grain opacity-20" />
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/20 pb-8 sm:mb-14 sm:gap-6 sm:pb-10 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[.38em] text-[#daa4b3]">kde sa to celé začalo</p>
              <h2 className="font-display text-5xl leading-none min-[380px]:text-6xl sm:text-8xl">Malá Emminka</h2>
            </div>
            <div className="flex items-center gap-3">
              <button aria-label="Predchádzajúce fotografie" onClick={() => kidsScroller.current?.scrollBy({ left: -380, behavior: 'smooth' })} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-[#381f26]"><ChevronLeft size={20} /></button>
              <button aria-label="Ďalšie fotografie" onClick={() => kidsScroller.current?.scrollBy({ left: 380, behavior: 'smooth' })} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-[#381f26]"><ChevronRight size={20} /></button>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#d9c7c9]">Ešte nevedela, aká krásna žena z nej vyrastie. Ale ten pohľad a iskra v očiach tam boli od malička hihi</p>
          </div>
          <div ref={kidsScroller} className="no-scrollbar -mx-5 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 pr-[20vw] sm:-mx-8 sm:gap-5 sm:px-8 sm:pr-[15vw] lg:-mx-12 lg:px-12 lg:pr-[12vw]">
            {kids.map((src, index) => (
              <figure key={src} className={`w-[78vw] shrink-0 snap-center bg-[#f7eee9] p-2.5 text-[#381f26] shadow-xl min-[430px]:w-[68vw] sm:w-[330px] sm:p-3 ${index % 2 ? 'mt-8 rotate-2 sm:mt-10' : '-rotate-2'}`}>
                <img src={src} alt={`Malá Emmka – spomienka ${index + 1}`} className="aspect-[4/3] w-full object-contain" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
        <Sticker name="D1EB43E0" className="absolute -bottom-6 right-[7%] w-32 rotate-6 sm:w-48" />
      </section>

      <section className="relative px-5 py-20 sm:px-8 sm:py-36 lg:px-12">
        <div className="mx-auto grid max-w-[1350px] gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[.4em] text-[#9d4963]">iba aby si vedela</p>
            <h2 className="font-kalam text-5xl font-normal leading-[.95] min-[380px]:text-6xl sm:text-7xl">Prečo si<br/><i>úžasná</i></h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#785e66]">Dôvodov je veľa. Tieto tri si však všimnem zakaždým.</p>
          </div>
          <div className="grid">
            {reasons.map(([number, title, text], index) => (
              <article key={number} className={`group border-[#9e6f7c]/25 px-2 py-8 sm:p-10 ${index < reasons.length - 1 ? 'border-b' : ''}`}>
                <span className="font-kalam mb-8 block text-5xl font-light text-[#b77b8c]/50 transition group-hover:text-[#9d4963]">{number}</span>
                <h3 className="font-kalam mb-4 text-4xl font-normal">{title}</h3>
                <p className="text-sm leading-7 text-[#745a62]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="halloween-section relative overflow-hidden px-5 py-24 text-[#fff2df] sm:px-8 sm:py-36 lg:px-12">
        <div className="halloween-stars" />
        <span aria-hidden="true" className="absolute -left-3 top-8 rotate-[-14deg] text-6xl drop-shadow-xl sm:left-[5%] sm:text-8xl">🎃</span>
        <span aria-hidden="true" className="absolute right-[4%] top-12 rotate-12 text-5xl drop-shadow-xl sm:text-7xl">👻</span>
        <span aria-hidden="true" className="absolute bottom-10 right-[8%] text-3xl text-[#f6b46c] sm:text-5xl">🎃</span>
        <div className="relative mx-auto grid max-w-[1250px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="relative mx-auto w-full max-w-[360px] sm:max-w-md">
            <div className="rounded-[2rem] border border-[#f3a65f]/40 bg-[#100b14] p-2.5 shadow-[0_30px_70px_rgba(0,0,0,.45)] sm:p-3">
              <video id="memory-video" src={memoryVideo} poster={heroTwo} playsInline loop className="aspect-[9/12] w-full rounded-[1.4rem] bg-black object-cover" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
              <button aria-label={playing ? 'Pozastaviť video' : 'Prehrať video'} onClick={() => { const el = document.getElementById('memory-video'); playing ? el.pause() : el.play() }} className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-md transition hover:scale-110">
                {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
              </button>
            </div>
            <Sticker name="F2158E3C" className="absolute -bottom-10 -left-8 w-32 rotate-[-8deg] drop-shadow-2xl sm:-bottom-16 sm:-left-20 sm:w-56" />
          </div>
          <div className="relative z-10 text-center lg:text-left">
            <span className="font-display text-8xl leading-none text-[#f0a45f] sm:text-9xl">18</span>
            <h2 className="-mt-5 font-display text-6xl leading-[.9] text-[#fff2df] sm:text-8xl">rokov<br/><i className="text-[#eaa3c5]">teba.</i></h2>
            <p className="handwritten mt-8 text-2xl text-[#f6c9a0] sm:text-3xl">Občas strašidelná, ale stále krásna 🎃💖 </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 sm:py-36">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <h2 className="font-kalam text-4xl font-normal leading-tight min-[390px]:text-5xl sm:text-6xl lg:text-7xl">Dôkazový materiál toho,<br className="hidden sm:block"/> ako si úžasná a pekná</h2>
        </div>
        <div className="mx-auto columns-1 max-w-[1400px] gap-3 min-[430px]:columns-2 sm:columns-3 sm:gap-5 lg:columns-4">
          {gallery.map((src, index) => (
            <button key={src} onClick={() => setSelectedIndex(index)} className="group relative mb-3 block w-full break-inside-avoid overflow-hidden bg-[#ead8d8] text-left sm:mb-5">
              <img src={src} alt={`Emmka – fotografia ${index + 1}`} className="w-full transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
              <span className="absolute inset-0 grid place-items-center bg-[#381f26]/0 text-xs uppercase tracking-[.25em] text-white opacity-0 transition group-hover:bg-[#381f26]/35 group-hover:opacity-100">pozrieť</span>
            </button>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#070a12] px-4 py-20 text-[#f8f1ef] sm:px-8 sm:py-32">
        <div className="halloween-stars opacity-40" />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="mx-auto mb-10 max-w-4xl text-center sm:mb-14">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[.38em] text-[#dba4b4]">31 · 10 · 2026</p>
            <h2 className="font-display text-5xl leading-[.95] min-[390px]:text-6xl sm:text-8xl">
              Takto vyzerá <br className="hidden sm:block"/> tvoja obloha
            </h2>
            <p className="handwritten mt-5 text-2xl text-[#e7b7c5] sm:text-4xl">No moja najkrajší hviezdička si aj tak ty ♡</p>
          </div>

          <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[1.5rem] bg-black shadow-[0_35px_100px_rgba(0,0,0,.65)] sm:rounded-[2.5rem]">
            <img
              src={birthdaySky}
              alt="Hviezdna obloha 31. októbra 2026 nad Šaštínom-Strážami"
              className="aspect-[3/2] h-auto w-full object-cover"
              loading="lazy"
            />
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-white/55">Obloha nad Šaštínem, alebo Strážama,nwm ... približne o 20:00, 31.10.2026.</p>
        </div>
      </section>

      <section className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-[#f2e3e2] px-5 py-24 text-center sm:px-8 sm:py-32">
        <div className="grain" />
        <Sticker name="little-emmka-pink-transparent" className="absolute -left-8 top-3 w-32 rotate-[-9deg] drop-shadow-lg sm:left-[3%] sm:top-[8%] sm:w-52" />
        <Sticker name="BF04E6F9" className="absolute -right-12 bottom-[3%] w-28 rotate-12 opacity-75 sm:right-[5%] sm:w-44" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <Heart className="mx-auto mb-8 fill-[#8d3f59] text-[#8d3f59]" size={24} />
          <p className="font-kalam text-[clamp(1.05rem,2vw,2rem)] font-light leading-[1.55] sm:leading-[1.6]">
            <span className="block">Naša malá-veľká Emminka,</span>
            <span className="block">občas je jej pýchou očná linka.</span>
            <span className="block">Aj keď sa jedna trochu kriví,</span>
            <span className="block">nevadí, úsmev je stále žiarivý.</span>

            <span className="mt-5 block">Keď ju zasa bolí brucho,</span>
            <span className="block">hneď sa o tom dozvie moje ucho.</span>
            <span className="block">Potom hodí jeden malý prdík,</span>
            <span className="block">a môj nosík predsa cíti ten smradík.</span>

            <span className="mt-5 block">V očiach nosí veľkú lásku,</span>
            <span className="block">hľadím na tú čistú krásku.</span>
            <span className="block">Stačí, že sa na mňa pekne pozrie,</span>
            <span className="block">hneď mi to závidí celé Záhorie.</span>

            <span className="mt-5 block">Niekedy nepoužiteľná a náladová,</span>
            <span className="block">no sladká ako zmrzlina čokoládová.</span>
            <span className="block">Si môj malý živý zmätok,</span>
            <i className="block text-[#984d64] font-bold">preto ťa ľúbim už nejaký piatok.</i>
          </p>
          <div className="mx-auto my-8 h-px w-24 bg-[#9d6676] sm:my-12" />
          <p className="signature mx-auto max-w-4xl text-5xl font-semibold leading-none text-[#694f57] sm:text-7xl">Želám ti všetko len to najkrajšie a najlepšie (presne jak si ty)</p>
          <div className="mt-8 flex flex-col items-center justify-center sm:mt-10">
            <div className="text-right">
              <p className="signature -rotate-2 text-5xl leading-none text-[#7b354c] sm:text-7xl">ľúbim ťa, bubáček ♡</p>
              <p className="handwritten mt-2 text-2xl text-[#a45a70]">wiwiwi</p>
            </div>
            <Sticker name="baby-heart-transparent" className="mt-3 w-42 -rotate-6 drop-shadow-lg sm:w-46" />
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center justify-between gap-4 bg-[#381f26] px-6 py-8 text-center text-[9px] uppercase tracking-[.28em] text-[#d9bdc4] sm:flex-row sm:text-left">
        <span>vyrobené z lásky pre mojeho Bubáčka</span>
        <span>eighteen looks good on you · 2026</span>
      </footer>

      {selectedIndex !== null && (
        <div role="dialog" aria-modal="true" aria-label="Zväčšená fotografia" className="fixed inset-0 z-[120] grid touch-pan-y place-items-center bg-[#241217]/95 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md" onClick={() => setSelectedIndex(null)} onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }} onTouchEnd={handleTouchEnd}>
          <button aria-label="Zavrieť fotografiu" onClick={() => setSelectedIndex(null)} className="absolute right-3 top-[max(.75rem,env(safe-area-inset-top))] z-20 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:rotate-90 sm:right-5 sm:top-5"><X size={20} /></button>
          <button aria-label="Predchádzajúca fotografia" onClick={(event) => { event.stopPropagation(); showPrevious() }} className="absolute bottom-5 left-[28%] z-20 grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2"><ChevronLeft /></button>
          <img src={gallery[selectedIndex]} alt={`Zväčšená spomienka ${selectedIndex + 1} z ${gallery.length}`} className="max-h-[78dvh] max-w-[94vw] select-none object-contain shadow-2xl sm:max-h-[90vh] sm:max-w-[86vw]" draggable="false" onClick={(e) => e.stopPropagation()} />
          <button aria-label="Nasledujúca fotografia" onClick={(event) => { event.stopPropagation(); showNext() }} className="absolute bottom-5 right-[28%] z-20 grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2"><ChevronRight /></button>
          <span className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium tracking-[.25em] text-white/65 sm:bottom-5">{selectedIndex + 1} / {gallery.length}</span>
        </div>
      )}
    </main>
  )
}

export default App

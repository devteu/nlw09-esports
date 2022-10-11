import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog'
import { CreateAdBanner } from './components/CreateAdBanner';

import { GameBanner } from './components/GameBanner';
import './styles/main.css';
import logoImg from './assets/logo-nlw-esports.svg'

import { CreateAdModal } from './components/CreateAdModal';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { CreateGame } from './components/CreateGame';

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from "keen-slider/react";


interface Game {
  id: string,
  title: string,
  bannerUrl: string,
  _count: {
    ads: number
  }
}

function App() {
  const [games, setGames] = useState<Game[]>([])
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      breakpoints: {
        "(min-width: 200px)": {
          slides: { perView: 2.2, spacing: 5 },
        },
        "(min-width: 400px)": {
          slides: { perView: 2.5, spacing: 5 },
        },
        "(min-width: 600px)": {
          slides: { perView: 3.5, spacing: 5 },
        },
        "(min-width: 800px)": {
          slides: { perView: 4.5, spacing: 5 },
        },
        "(min-width: 1000px)": {
          slides: { perView: 5.5, spacing: 10 },
        },
        "(min-width: 1200px)": {
          slides: { perView: 6.5, spacing: 10 },
        },
      },
      mode: "free",
      slides: { origin: "auto", perView: 'auto', spacing: 5 },
      range: {
        min: 1,
        max: 100,
        align: true,
      },
    },
    [
      // add plugins here
    ]
  );

  useEffect(() => {
    axios('http://localhost:3333/games').then(response => {
      setGames(response.data)
    })
  }, [])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="" />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="text-transparent bg-nlw-gradient bg-clip-text">duo</span> está aqui.
      </h1>

      <div ref={sliderRef} className="keen-slider grid grid-cols-6 gap-6 mt-16">
        {games.map(game => {
          return (
            <div className="keen-slider__slide">
              <GameBanner
                key={game.id}
                title={game.title}
                bannerUrl={game.bannerUrl}
                adsCount={game._count.ads}
              />
            </div>
          )
        })}


      </div>

      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root>

      <div>
        <Dialog.Root>
          <Dialog.Trigger className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded flex items-center gap-3">
            Cadastrar Game
          </Dialog.Trigger>
          <CreateGame />
        </Dialog.Root>
      </div>

      <ToastContainer />
    </div>
  )
}

export default App
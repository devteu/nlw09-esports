import * as Dialog from '@radix-ui/react-dialog';
import { Plus } from 'phosphor-react';
import { Input } from './Form/Input';
import { FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


export function CreateGame() {

  async function handleCreateGame(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData);

    console.log(data)

    try {
      await axios.post(`http://localhost:3333/games`, {
        game: data.game,
        bannerUrl: data.banner,
      });

      toast.success('Game criado com sucesso!', {
        theme: 'colored',
      });
    } catch (err: any) {
      const error: [Error] = err.response.data

      error.forEach((err) => {
        toast.error(err.message, {
          theme: 'colored',
        });
      })
    }

  }
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.DialogContent className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black text-white">Adicionar Game</Dialog.Title>
        <form onSubmit={handleCreateGame} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="nameGame">Nome do Game</label>
            <Input id="nameGame" name="game" placeholder="Ex: DOTA" />

            <label htmlFor="bannerGame">Banner</label>
            <Input id="bannerGame" name="banner" placeholder="URL foto" />
          </div>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Dialog.Close>

            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
            >
              <Plus size={24} />
              Salvar
            </button>

          </footer>

        </form>

      </Dialog.DialogContent>
    </Dialog.Portal>
  )
}


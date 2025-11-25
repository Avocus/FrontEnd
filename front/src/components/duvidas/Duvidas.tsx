'use client';

import React, { useEffect, useRef, useState } from 'react';
import { formatDoubt } from '@/services/analiseIAService';

type Sender = 'cliente' | 'sistema' | 'advogado';

interface Message {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
  viaIA?: boolean;
}

interface Doubt {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

const STORAGE_KEY = 'avocuss_duvidas_v1';

export default function Duvidas() {
  const [duvidas, setDuvidas] = useState<Doubt[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const msgInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDuvidas(JSON.parse(raw));
    } catch (e) {
      console.warn('Falha ao carregar dúvidas:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(duvidas));
    } catch (e) {
      console.warn('Falha ao salvar dúvidas:', e);
    }
  }, [duvidas]);

  function openCreate() {
    setCreating(true);
    setTitle('');
    setText('');
  }

  async function submitCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim() && !text.trim()) return;
    setLoading(true);
    try {
      const res = await formatDoubt(title.trim(), text.trim());
      const formatted = res.success && res.formatted ? res.formatted : `${title.trim()}\n\n${text.trim()}`;

      const id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const now = new Date().toISOString();

      const newDoubt: Doubt = {
        id,
        title: title.trim() || (formatted.length > 80 ? formatted.slice(0, 80) + '...' : formatted),
        createdAt: now,
        messages: [
          { id: `${id}_m1`, sender: 'cliente', text: text.trim(), createdAt: now },
          // marca a mensagem formatada pela IA como se fosse enviada pelo cliente,
          // mas sinaliza com `viaIA: true` para exibir a nota "Analisado pela IA".
          { id: `${id}_m2`, sender: 'cliente', text: formatted, createdAt: now, viaIA: true },
        ],
      };

      setDuvidas((s) => [newDoubt, ...s]);
      setSelected(id);
      setCreating(false);
    } catch (err) {
      console.error('Erro ao criar dúvida:', err);
      alert('Falha ao criar dúvida. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function selectDoubt(id: string) {
    setSelected(id);
    setCreating(false);
  }

  function addMessageToSelected(textMsg: string) {
    if (!selected || !textMsg.trim()) return;
    const now = new Date().toISOString();
    setDuvidas((prev) => prev.map((d) => d.id === selected ? { ...d, messages: [...d.messages, { id: `${Date.now()}_${Math.floor(Math.random()*10000)}`, sender: 'cliente', text: textMsg.trim(), createdAt: now }] } : d));
  }

  const selectedDoubt = duvidas.find((d) => d.id === selected) || null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Dúvidas</h1>

      <div className="flex gap-4">
        <div className="w-80 border rounded p-2" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center justify-between mb-2">
            <strong>Suas dúvidas</strong>
            <button onClick={openCreate} className="text-sm text-emerald-600">Nova</button>
          </div>

          {duvidas.length === 0 && <div className="text-sm text-muted-foreground">Nenhuma dúvida criada ainda.</div>}

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {duvidas.map((d) => (
              <button key={d.id} onClick={() => selectDoubt(d.id)} className={`w-full text-left p-2 rounded ${selected === d.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                <div className="font-medium truncate">{d.title}</div>
                <div className="text-xs opacity-70">{new Date(d.createdAt).toLocaleString('pt-BR')}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 border rounded p-3" style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          {creating ? (
            <form onSubmit={submitCreate}>
              <div className="mb-2">
                <label className="block text-sm mb-1">Título</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-2 py-1 text-sm" style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))' }} />
              </div>
              <div className="mb-2">
                <label className="block text-sm mb-1">Descreva sua dúvida</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="w-full rounded border px-2 py-1 text-sm" style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))' }} />
              </div>
              <div className="flex gap-2">
                <button disabled={loading} type="submit" className="px-3 py-2 rounded bg-emerald-600 text-white">{loading ? 'Processando...' : 'Enviar'}</button>
                <button type="button" onClick={() => setCreating(false)} className="px-3 py-2 rounded border">Cancelar</button>
              </div>
            </form>
          ) : selectedDoubt ? (
            <div className="flex flex-col h-[60vh]">
              <div className="mb-3">
                <h2 className="text-lg font-semibold">{selectedDoubt.title}</h2>
                <div className="text-xs opacity-70">{new Date(selectedDoubt.createdAt).toLocaleString('pt-BR')}</div>
              </div>

              <div className="flex-1 overflow-auto space-y-3 mb-3 px-1">
                {selectedDoubt.messages.map((m) => {
                  const isCliente = m.sender === 'cliente';
                  return (
                    <div key={m.id} className={`p-2 rounded ${isCliente ? 'bg-emerald-700 self-end' : m.sender === 'sistema' ? 'bg-muted' : 'bg-muted/80'}`} style={{ maxWidth: '85%' }}>
                      <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                      {m.viaIA && (
                        <div className="text-xs italic opacity-70 mt-1">Analisado pela IA</div>
                      )}
                      <div className="text-xs opacity-70 mt-1 text-right">{new Date(m.createdAt).toLocaleString('pt-BR')}</div>
                    </div>
                  );
                })}
              </div>

              <div className="">
                <div className="flex gap-2 items-end">
                  <textarea ref={msgInputRef} placeholder="Enviar nova mensagem sobre essa dúvida..." className="flex-1 rounded border px-2 py-1 text-sm" style={{ background: 'hsl(var(--input))', borderColor: 'hsl(var(--border))' }} rows={2} />
                  <div className="flex flex-col">
                    <button onClick={() => { if (msgInputRef.current) { addMessageToSelected(msgInputRef.current.value); msgInputRef.current.value = ''; } }} className="px-3 py-2 rounded bg-emerald-600 text-white">Enviar</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Selecione uma dúvida para ver os detalhes ou crie uma nova.</div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { CATEGORIES } from "@/types/product";
import { createProduct } from "@/lib/admin-queries";
import { uploadProductImage } from "@/lib/cloudinary-upload";

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "pendente" | "salvando" | "salvo" | "erro";
  error?: string;
  name: string;
  price: string;
  category: string;
  material: string;
  ringSize: string;
  description: string;
  featured: boolean;
}

export default function NewProductForm({ onCreated }: { onCreated: () => void }) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect name and category from file name
  function parseFilename(fileName: string) {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    let formatted = nameWithoutExt.replace(/[-_.]/g, ' ');
    formatted = formatted.replace(/\s+/g, ' ').trim();
    formatted = formatted.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    let category: string = CATEGORIES[0].value; // default
    const lower = nameWithoutExt.toLowerCase();
    if (lower.includes("colar") || lower.includes("gargantilha")) {
      category = "colar";
    } else if (lower.includes("brinco")) {
      category = "brinco";
    } else if (lower.includes("pingente")) {
      category = "pingente";
    } else if (lower.includes("pulseira")) {
      category = "pulseira";
    } else if (lower.includes("tornozeleira")) {
      category = "tornozeleira";
    } else if (lower.includes("anel")) {
      category = "anel";
    }

    return { name: formatted, category };
  }

  const addFilesToQueue = (files: FileList) => {
    const newItems: QueueItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const { name, category } = parseFilename(file.name);
      newItems.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "pendente",
        name,
        price: "",
        category,
        material: "Prata 925",
        ringSize: "",
        description: "",
        featured: false,
      });
    });

    if (newItems.length === 0) return;

    setQueue((prev) => {
      if (prev.length === 0) {
        setActiveIndex(0);
      }
      return [...prev, ...newItems];
    });
  };

  // Revoke URLs on removal/unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      queue.forEach((item) => {
        if (item.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [queue]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
    }
  };

  const updateItemField = <K extends keyof Omit<QueueItem, "id" | "file" | "previewUrl" | "status" | "error">>(
    index: number,
    field: K,
    value: QueueItem[K]
  ) => {
    setQueue((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const updateItemStatus = (
    index: number,
    status: QueueItem["status"],
    error?: string
  ) => {
    setQueue((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, status, error } : item))
    );
  };

  const removeItem = (indexToRemove: number) => {
    const item = queue[indexToRemove];
    if (item && item.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
    setQueue((prev) => {
      const nextQueue = prev.filter((_, idx) => idx !== indexToRemove);
      if (activeIndex >= nextQueue.length) {
        setActiveIndex(Math.max(0, nextQueue.length - 1));
      }
      return nextQueue;
    });
  };

  const clearQueue = () => {
    queue.forEach((item) => {
      if (item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
    setQueue([]);
    setActiveIndex(0);
  };

  const handleSaveItem = async (index: number) => {
    const item = queue[index];
    if (!item || item.status === "salvo" || item.status === "salvando") return;

    if (!item.name.trim()) {
      updateItemStatus(index, "erro", "O nome da peça é obrigatório.");
      return;
    }

    updateItemStatus(index, "salvando");

    try {
      const imageId = await uploadProductImage(item.file);
      const ok = await createProduct({
        name: item.name.trim(),
        price: item.price ? Number(item.price) : null,
        category: item.category,
        material: item.material.trim() || null,
        ring_size: item.category === "anel" && item.ringSize ? item.ringSize.trim() : null,
        description: item.description.trim() || null,
        imageId,
        featured: item.featured,
      });

      if (!ok) throw new Error("Erro ao salvar produto no Supabase.");

      updateItemStatus(index, "salvo");

      // Auto-advance to the next pending item
      const nextPendingIndex = queue.findIndex((itm, idx) => idx > index && itm.status === "pendente");
      if (nextPendingIndex !== -1) {
        setActiveIndex(nextPendingIndex);
      } else {
        const firstPendingIndex = queue.findIndex((itm) => itm.status === "pendente");
        if (firstPendingIndex !== -1) {
          setActiveIndex(firstPendingIndex);
        }
      }
    } catch (err) {
      updateItemStatus(index, "erro", err instanceof Error ? err.message : "Erro desconhecido ao salvar.");
    }
  };

  const activeItem = queue[activeIndex];
  const savedCount = queue.filter((item) => item.status === "salvo").length;
  const isQueueComplete = queue.length > 0 && savedCount === queue.length;

  if (queue.length === 0) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 min-h-[320px] ${
          dragOver
            ? "border-brand-tide bg-brand-tide/5 scale-[1.01]"
            : "border-brand-ink/20 hover:border-brand-ink/40 bg-brand-foam/40 hover:bg-brand-foam/60"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 text-brand-tide mb-4 animate-bounce"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        <h3 className="text-2xl font-serif text-brand-ink mb-2">
          Cadastro de Peças em Lote
        </h3>
        <p className="text-brand-ink-soft/70 max-w-md">
          Arraste e solte várias fotos de joias aqui ou clique para selecionar do computador.
        </p>
        <span className="text-xs text-brand-silver-deep mt-2 block">
          Dica: Seus arquivos podem conter o nome da joia (ex.: &quot;anel-luna-prata.jpg&quot;) para preenchimento automático.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progresso e cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-brand-paper/50 backdrop-blur-md p-4 rounded-xl border border-brand-ink/10">
        <div>
          <h2 className="text-xl font-serif text-brand-ink font-medium">
            Fila de Cadastro em Lote
          </h2>
          <p className="text-sm text-brand-ink-soft/75">
            Cadastrado: <strong>{savedCount}</strong> de <strong>{queue.length}</strong> peças.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            className="btn btn-ghost !py-2.5 !px-5"
            onClick={() => fileInputRef.current?.click()}
          >
            + Adicionar Peças
          </button>
          {isQueueComplete ? (
            <button
              type="button"
              className="btn btn-primary !py-2.5 !px-6"
              onClick={onCreated}
            >
              Concluir Cadastro
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-ghost !py-2.5 !px-5 text-red-600 border-red-200 hover:bg-red-50"
              onClick={clearQueue}
            >
              Limpar Fila
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        {/* Fila lateral esquerda */}
        <div className="w-full xl:w-80 flex-shrink-0 bg-brand-paper/30 backdrop-blur-sm border border-brand-ink/10 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-semibold text-brand-ink-soft/60 uppercase tracking-wider mb-3">
            Fila de Fotos
          </h3>
          <div className="flex xl:flex-col gap-3 overflow-x-auto xl:overflow-y-auto max-h-[140px] xl:max-h-[520px] pb-2 xl:pb-0 pr-0 xl:pr-1 custom-scrollbar">
            {queue.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-300 w-44 xl:w-full flex-shrink-0 relative overflow-hidden ${
                    isActive
                      ? "border-brand-tide bg-brand-foam shadow-md scale-[1.02]"
                      : "border-brand-ink/5 hover:border-brand-ink/15 bg-brand-foam/40 hover:bg-brand-foam/75"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-ink/5 flex-shrink-0">
                    <img
                      src={item.previewUrl}
                      alt={item.name || "Preview"}
                      className="w-full h-full object-cover"
                    />
                    {/* Badge Overlay */}
                    {item.status === "salvando" && (
                      <div className="absolute inset-0 bg-brand-ink/40 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                    {item.status === "salvo" && (
                      <div className="absolute inset-0 bg-brand-tide/80 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {item.status === "erro" && (
                      <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-brand-ink" : "text-brand-ink-soft"}`}>
                      {item.name || "Sem Nome"}
                    </p>
                    <span className="text-[10px] text-brand-silver-deep capitalize">
                      {CATEGORIES.find((c) => c.value === item.category)?.label || item.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor da Peça Ativa */}
        {activeItem && (
          <div className="flex-1 bg-brand-paper/50 backdrop-blur-md border border-brand-ink/10 rounded-2xl p-6 flex flex-col md:flex-row gap-8">
            
            {/* Lado Esquerdo: Imagem Grande */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center bg-brand-ink/5 rounded-xl border border-brand-ink/10 p-4 relative overflow-hidden min-h-[300px] xl:min-h-[400px]">
                <img
                  src={activeItem.previewUrl}
                  alt={activeItem.name || "Preview"}
                  className="max-h-[360px] object-contain rounded-lg shadow-sm"
                />
                
                {/* Overlay de Status da Imagem Ativa */}
                {activeItem.status === "salvo" && (
                  <div className="absolute top-3 right-3 bg-brand-tide text-white text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Peça Salva
                  </div>
                )}
                {activeItem.status === "salvando" && (
                  <div className="absolute top-3 right-3 bg-brand-ocean text-white text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Salvando Peça...
                  </div>
                )}
                {activeItem.status === "erro" && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
                    Falha no Envio
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-brand-silver-deep text-center truncate px-2">
                Arquivo: {activeItem.file.name} ({Math.round(activeItem.file.size / 1024)} KB)
              </div>
            </div>

            {/* Lado Direito: Formulário */}
            <div className="w-full md:w-96 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="border-b border-brand-ink/10 pb-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-brand-tide uppercase tracking-wider">
                    Detalhes do Item
                  </span>
                  <span className="text-xs text-brand-silver-deep">
                    Peça {activeIndex + 1} de {queue.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-brand-ink/80">
                    Nome da peça *
                    <input
                      type="text"
                      value={activeItem.name}
                      onChange={(e) => updateItemField(activeIndex, "name", e.target.value)}
                      disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                      placeholder="Ex: Anel Luna Prata"
                      className="w-full mt-1 px-3 py-2 bg-brand-foam border border-brand-ink/20 focus:border-brand-tide focus:ring-1 focus:ring-brand-tide text-brand-ink rounded-lg transition-all outline-none"
                      required
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-brand-ink/80">
                      Preço (opcional)
                      <input
                        type="number"
                        step="0.01"
                        value={activeItem.price}
                        onChange={(e) => updateItemField(activeIndex, "price", e.target.value)}
                        disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                        placeholder="0.00"
                        className="w-full mt-1 px-3 py-2 bg-brand-foam border border-brand-ink/20 focus:border-brand-tide focus:ring-1 focus:ring-brand-tide text-brand-ink rounded-lg transition-all outline-none"
                      />
                    </label>

                    <label className="text-xs font-semibold text-brand-ink/80">
                      Categoria
                      <select
                        value={activeItem.category}
                        onChange={(e) => updateItemField(activeIndex, "category", e.target.value)}
                        disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                        className="w-full mt-1 px-3 py-2 bg-brand-foam border border-brand-ink/20 focus:border-brand-tide focus:ring-1 focus:ring-brand-tide text-brand-ink rounded-lg transition-all outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-xs font-semibold text-brand-ink/80">
                      Material
                      <input
                        type="text"
                        value={activeItem.material}
                        onChange={(e) => updateItemField(activeIndex, "material", e.target.value)}
                        disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                        placeholder="Ex: Prata 925"
                        className="w-full mt-1 px-3 py-2 bg-brand-foam border border-brand-ink/20 focus:border-brand-tide focus:ring-1 focus:ring-brand-tide text-brand-ink rounded-lg transition-all outline-none"
                      />
                    </label>

                    {activeItem.category === "anel" && (
                      <label className="text-xs font-semibold text-brand-ink/80">
                        Número do aro
                        <input
                          type="text"
                          value={activeItem.ringSize}
                          onChange={(e) => updateItemField(activeIndex, "ringSize", e.target.value)}
                          disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                          placeholder="Ex: 16"
                          className="w-full mt-1 px-3 py-2 bg-brand-foam border border-brand-ink/20 focus:border-brand-tide focus:ring-1 focus:ring-brand-tide text-brand-ink rounded-lg transition-all outline-none animate-fade-in"
                        />
                      </label>
                    )}
                  </div>

                  <label className="text-xs font-semibold text-brand-ink/80">
                    Descrição (opcional)
                    <textarea
                      rows={2}
                      value={activeItem.description}
                      onChange={(e) => updateItemField(activeIndex, "description", e.target.value)}
                      disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                      placeholder="Detalhes adicionais da peça..."
                      className="w-full mt-1 px-3 py-2 bg-brand-foam border border-brand-ink/20 focus:border-brand-tide focus:ring-1 focus:ring-brand-tide text-brand-ink rounded-lg transition-all outline-none resize-none"
                    />
                  </label>

                  <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={activeItem.featured}
                      onChange={(e) => updateItemField(activeIndex, "featured", e.target.checked)}
                      disabled={activeItem.status === "salvo" || activeItem.status === "salvando"}
                      className="rounded border-brand-ink/20 text-brand-tide focus:ring-brand-tide"
                    />
                    <span className="text-xs text-brand-ink-soft">Destaque na Home</span>
                  </label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-2 mt-6">
                {activeItem.status === "erro" && activeItem.error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                    {activeItem.error}
                  </p>
                )}

                <div className="flex gap-2">
                  {activeItem.status === "salvo" ? (
                    <button
                      type="button"
                      className="btn btn-primary flex-1 justify-center !py-3"
                      onClick={() => {
                        const nextPending = queue.findIndex((itm, idx) => idx > activeIndex && itm.status === "pendente");
                        if (nextPending !== -1) {
                          setActiveIndex(nextPending);
                        } else {
                          const firstPending = queue.findIndex((itm) => itm.status === "pendente");
                          if (firstPending !== -1) {
                            setActiveIndex(firstPending);
                          }
                        }
                      }}
                    >
                      Avançar para o Próximo
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary flex-1 justify-center !py-3"
                      disabled={activeItem.status === "salvando"}
                      onClick={() => handleSaveItem(activeIndex)}
                    >
                      {activeItem.status === "salvando" ? "Salvando..." : "Salvar Peça"}
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-ghost !py-3 !px-4"
                    title="Pular Peça"
                    onClick={() => {
                      setActiveIndex((prev) => (prev + 1) % queue.length);
                    }}
                  >
                    Pular
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost !py-3 !px-3 border-red-200 text-red-600 hover:bg-red-50"
                    title="Remover da Fila"
                    onClick={() => removeItem(activeIndex)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

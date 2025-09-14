import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  categoria?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fill = false, 
  className = "", 
  sizes,
  categoria = "Jurídico"
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    // Placeholder baseado na categoria
    const placeholderColor = getCategoryColor(categoria);
    setImgSrc(`https://via.placeholder.com/1200x800/${placeholderColor}/ffffff?text=${encodeURIComponent(categoria)}`);
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      "Direito Civil": "3B82F6",
      "Direito Penal": "DC2626", 
      "Direito Trabalhista": "059669",
      "Direito de Família": "7C3AED",
      "Direito do Consumidor": "EA580C",
      "Direito Empresarial": "1F2937",
      "Direito Tributário": "B91C1C",
      "Direito Administrativo": "0F766E",
      "Direito Previdenciário": "7C2D12"
    };
    return colors[cat] || "6B7280";
  };

  if (hasError) {
    return (
      <div className={`image-placeholder ${className}`} style={{ 
        background: `linear-gradient(135deg, #${getCategoryColor(categoria)} 0%, #${getCategoryColor(categoria)}AA 100%)` 
      }}>
        <div className="text-center">
          <div className="text-lg font-bold mb-1">{categoria}</div>
          <div className="text-sm opacity-90">Imagem em breve</div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={handleError}
      priority={false}
    />
  );
}

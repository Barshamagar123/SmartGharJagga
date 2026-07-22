// src/components/property-detail/PropertyQRCode.tsx

import React, { useState, useRef } from 'react';
import { Download, Share2, QrCode, Copy, Check } from 'lucide-react';

interface PropertyQRCodeProps {
  propertyId: number;
  propertySlug: string;
  title: string;
  price: string;
}

const PropertyQRCode: React.FC<PropertyQRCodeProps> = ({
  propertyId,
  propertySlug,
  title,
  price,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const propertyUrl = `${window.location.origin}/property/${propertySlug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(propertyUrl)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${propertySlug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this property: ${title} - ${price}`,
          url: propertyUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 hover:bg-[#F8FAFC] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EDF5EC] rounded-lg">
            <QrCode size={20} className="text-[#2D5A27]" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[#0F172A]">QR Code</div>
            <div className="text-xs text-[#475569]">Scan to view on mobile</div>
          </div>
        </div>
        <span className={`text-sm text-[#2D5A27] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <div className="flex flex-col items-center py-4">
            {/* QR Code */}
            <div 
              ref={qrRef}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <img
                src={qrCodeUrl}
                alt={`QR Code for ${title}`}
                className="w-48 h-48 object-contain"
                loading="lazy"
              />
            </div>

            {/* Property URL */}
            <div className="w-full mt-4">
              <div className="flex items-center gap-2 p-2 bg-[#F8FAFC] rounded-lg">
                <input
                  type="text"
                  value={propertyUrl}
                  readOnly
                  className="flex-1 bg-transparent text-xs text-[#475569] outline-none px-2"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#475569]"
                  aria-label="Copy link"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4 w-full">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-lg transition-colors text-sm font-medium text-[#475569]"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D5A27] hover:bg-[#23461E] rounded-lg transition-colors text-sm font-medium text-white"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyQRCode;
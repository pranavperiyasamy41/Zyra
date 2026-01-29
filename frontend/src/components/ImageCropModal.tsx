import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { X, Check } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (croppedImage: string) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onSave(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
        
        {/* Header */}
        <div className="p-4 bg-white/10 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center z-10 relative">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Adjust Photo</h3>
            <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1} // Square aspect ratio for profile
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
            cropShape="round" // Show circular mask preview
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 space-y-6 z-10 relative">
            
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                    <Check className="w-4 h-4" /> Save Photo
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
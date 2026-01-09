import Image from 'next/image';

interface HeroProps {
  onStartMatchmaker: () => void;
}

export default function Hero({ onStartMatchmaker }: HeroProps) {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://loremflickr.com/1920/800/children,joy,landscape"
        alt="Children's HopeChest"
        fill
        className="object-cover"
        priority={true}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/90 via-brand-teal/60 to-brand-teal-light/40"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start container mx-auto px-12">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/hopechest-logo.png"
            alt="HopeChest Logo"
            width={200}
            height={80}
            className="object-contain"
          />
        </div>
        
        {/* Headline */}
        <div className="space-y-6">
          <h1 className="font-serif italic text-5xl md:text-7xl font-bold text-white leading-tight">
            Find Your Perfect Partnership
          </h1>
          <button
            onClick={onStartMatchmaker}
            className="bg-brand-orange hover:bg-brand-brown text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            Start Matchmaker
          </button>
        </div>
      </div>
    </div>
  );
}

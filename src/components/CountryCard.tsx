import Image from 'next/image';
import { Country } from '../types';

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Country Image with Overlay and Name */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={country.imgUrl}
          alt={country.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/80 to-transparent"></div>
        
        {/* Country Name over Gradient */}
        <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white z-10">
          {country.name}
        </h2>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Region */}
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Region:</span> {country.region}
        </p>

        {/* Ministry Type */}
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Ministry Type:</span> {country.ministryType}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {country.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-brand-teal-bg text-brand-teal-dark font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

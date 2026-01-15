function ExcursionsSection({
  excursions,
  country,
}: {
  excursions?: { 
    name: string; 
    description: string; 
    imageUrl: string;
    links?: { label: string; href: string }[];
    highlights?: string[];
    galleryImages?: string[];
  }[];
  country: string;
}) {
  if (excursions && excursions.length > 0) {
    // Special layout for single excursion with gallery
    if (excursions.length === 1 && excursions[0].galleryImages) {
      const excursion = excursions[0];
      return (
        <div className="bg-gradient-to-br from-brand-orange/10 to-white p-8 rounded-2xl border-2 border-brand-orange/20">
          <h4 className="text-2xl font-bold text-brand-teal-dark mb-4">
            Optional Excursions
          </h4>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Large main image */}
              <img
                src={excursion.imageUrl}
                alt={excursion.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              {/* Gallery images grid */}
              <div className="grid grid-cols-3 gap-2">
                {excursion.galleryImages?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${excursion.name} ${idx + 1}`}
                    className="w-full h-20 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-2 text-xl">{excursion.name}</h5>
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{excursion.description}</p>
              {excursion.highlights && excursion.highlights.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">Highlights:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {excursion.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        <strong>{highlight}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {excursion.links && excursion.links.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {excursion.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-teal hover:text-brand-teal-dark font-semibold underline text-sm"
                    >
                      Learn more about {link.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Standard grid layout for multiple excursions
    return (
      <div className="bg-gradient-to-br from-brand-orange/10 to-white p-8 rounded-2xl border-2 border-brand-orange/20">
        <h4 className="text-2xl font-bold text-brand-teal-dark mb-4">
          Optional Excursions
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          {excursions.map((excursion, idx) => (
            <div key={idx} className="text-center">
              <img
                src={excursion.imageUrl}
                alt={excursion.name}
                className="w-full h-32 object-cover rounded-lg mb-3 shadow-md"
              />
              <h5 className="font-bold text-gray-800 mb-1">{excursion.name}</h5>
              <p className="text-sm text-gray-700 mb-2">{excursion.description}</p>
              {excursion.highlights && excursion.highlights.length > 0 && (
                <div className="mb-2 text-left">
                  <p className="text-xs font-semibold text-gray-800 mb-1">Highlights:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {excursion.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="text-xs text-gray-700">
                        <strong>{highlight}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {excursion.links && excursion.links.length > 0 && (
                <div className="space-y-1">
                  {excursion.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-brand-teal hover:text-brand-teal-dark font-semibold underline text-xs"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-orange/10 to-white p-8 rounded-2xl border-2 border-brand-orange/20">
      <h4 className="text-2xl font-bold text-brand-teal-dark mb-4">
        Optional Excursions
      </h4>
      <p className="text-gray-700 leading-relaxed text-center">
        No specific excursions are planned for {country} at this time, but our team can help
        you explore unique cultural experiences during your visit.
      </p>
    </div>
  );
}

import { WizardState } from "../types/wizard";
import { VisionTrip } from "../types";
import { generatePersonalizedSections, generatePersonalizedGreeting } from "../lib/personalization";

interface CountryData {
  imageUrl: string;
  about: string;
  stats: Array<{
    value: string;
    description: string;
  }>;
  tagline: string;
  programs: string[];
  duration: string;
  costRange: string;
  language: string;
  visionTrips: VisionTrip[];
  excursions?: { 
    name: string; 
    description: string; 
    imageUrl: string;
    links?: { label: string; href: string }[];
    highlights?: string[];
    galleryImages?: string[];
  }[];
}

interface FeaturedCountryCardProps {
  country: string;
  score: number;
  reasons: string[];
  wizardAnswers: WizardState;
  countryData: CountryData;
}

export default function FeaturedCountryCard({
  country,
  score,
  reasons,
  wizardAnswers,
  countryData,
}: FeaturedCountryCardProps) {
  const personalizedSections = generatePersonalizedSections(country, wizardAnswers);
  const personalizedGreeting = generatePersonalizedGreeting(wizardAnswers, country);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
      {/* Hero Section with Image */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img
          src={countryData.imageUrl}
          alt={country}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */} 
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Hero Content */} 
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <div className="inline-block mb-4">
            <span className="bg-brand-orange text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              #1 BEST FIT FOR {wizardAnswers.churchName.toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
            {country}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            {score}% Match • Top Recommendation
          </p>
        </div>
      </div>

      {/* Content Container */} 
      <div className="p-8 md:p-12">
        {/* Personalized Greeting */} 
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-4">
            {personalizedGreeting}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-brand-teal-bg border-l-4 border-brand-teal p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed">
                Based on your church&apos;s size, ministry DNA, and vision, we believe {country} offers 
                the most compelling partnership opportunity. Here&apos;s why this could be a transformative 
                fit for {wizardAnswers.churchName}:
              </p>
            </div>
          </div>
        </div>

        {/* Why It\"s a Good Fit - Original Reasons */} 
        <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-3xl text-brand-teal">✓</span>
            Why This Partnership Fits Your Church
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-green-50 p-5 rounded-xl border border-green-100"> 
                <span className="text-green-600 text-xl flex-shrink-0 mt-1">●</span>
                <span className="text-gray-800 font-medium">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Sections */} 
        {personalizedSections.length > 0 && (
          <div className="mb-12 space-y-8">
            <h3 className="text-2xl font-bold text-brand-teal-dark mb-6 text-center">
              How {wizardAnswers.churchName} Can Make an Impact
            </h3>
            {personalizedSections.map((section, idx) => (
              <div key={idx} className="bg-gradient-to-br from-brand-teal-bg to-white p-8 rounded-2xl border-2 border-brand-teal-light">
                <div className="flex items-start gap-4">
                  {section.icon && (
                    <span className="text-4xl flex-shrink-0">{section.icon}</span>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-brand-teal-dark mb-3">
                      {section.title}
                    </h4>
                    {/* Render HTML for mobilization content (to show bolded text), plain text for others */} 
                    {section.title === "Mobilizing Your Team" ? (
                      <p 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Uganda Statistics Dashboard */} 
        {country === "Uganda" && ( // Only show for Uganda
          <div className="mb-12 bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-2xl border-2 border-gray-100">
            <h3 className="text-3xl font-bold text-center text-brand-teal-dark mb-8">
              Understanding Uganda&apos;s Need
            </h3>
            
            {/* Stats Grid */} 
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {countryData.stats.map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-white rounded-xl shadow-md">
                  <div className="text-5xl md:text-6xl font-bold text-brand-orange mb-3">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 leading-snug">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Tagline */} 
            <div className="text-center">
              <p className="text-xl md:text-2xl text-gray-700 font-semibold italic">
                {countryData.tagline}
              </p>
            </div>
          </div>
        )}

        {/* About the Country */} 
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            About {country}
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {countryData.about}
          </p>
          
          {/* Programs */} 
          {countryData.programs.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Community Transformation Programs:</h4>
              <div className="flex flex-wrap gap-3">
                {countryData.programs.map((program, idx) => (
                  <a
                    key={idx}
                    href="https://www.hopechest.org/12-areas-of-transformation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-brand-orange/10 text-brand-brown font-semibold rounded-full text-sm border border-brand-orange/20 hover:bg-brand-orange/20 hover:border-brand-orange/40 transition-all cursor-pointer"
                  >
                    {program}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vision Trip Snapshot */} 
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-brand-teal-dark mb-8">
            Vision Trip Snapshot
          </h3>
          
          {/* Duration */} 
          <div className="mb-8 bg-brand-teal text-white p-6 rounded-2xl text-center">
            <p className="text-sm uppercase tracking-wide mb-2 text-white/80">Duration</p>
            <p className="text-3xl font-bold">{countryData.duration}</p>
          </div>

          {/* Community Transformation */} 
          <div className="mb-8 bg-gradient-to-br from-brand-teal/5 to-white p-8 rounded-2xl border-2 border-brand-teal/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image */} 
              <div className="order-2 md:order-1">
                <img 
                  src={country === "Guatemala" 
                    ? "/images/guatemala-transformation.jpg" 
                    : country === "Uganda"
                    ? "/images/Uganda-trasnformation1.png"
                    : country === "Ethiopia"
                    ? "/images/Ethiopia-transformation1.jpeg"
                    : "https://images.unsplash.com/photo-1584282786940-2e4cc8e13fd9?w=600&h=400&fit=crop"
                  }
                  alt={`${country} Community`}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
              
              {/* Content */} 
              <div className="order-1 md:order-2">
                <h4 className="text-2xl font-bold text-brand-teal-dark mb-3">
                  Encounter Community-to-Community Transformation
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  During your visit, you&apos;ll witness transformation in action:
                </p>
                <ul className="space-y-2">
                  {[ 
                    "Local savings groups building financial stability",
                    "Youth empowerment & leadership development",
                    "Health and wellness initiatives",
                    "Agricultural & animal husbandry projects",
                    "Micro-enterprises & small businesses",
                    "CarePoint operations & holistic impact",
                    "Two-way transformational relationships"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-teal text-xl flex-shrink-0">✓</span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Excursions */} 
          <ExcursionsSection excursions={countryData.excursions} country={country} />
        </div>

        {/* Vision Trips */} 
        {countryData.visionTrips.length > 0 && (
          <div className="border-t-2 border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              2026 Vision Trips to {country}
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Experience this partnership firsthand. These trips fill quickly—reserve your spot today.
            </p>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {countryData.visionTrips.map((trip) => (
                <div
                  key={trip.tripId}
                  className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-brand-teal transition-all"
                >
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{trip.dateRange}</p>
                    {trip.leader && trip.leader !== "TBD" && (
                      <p className="text-sm text-gray-600">Led by {trip.leader}</p>
                    )}
                  </div>
                  <a
                    href={trip.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-brand-orange hover:bg-brand-brown text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-xl"
                  >
                    Register
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

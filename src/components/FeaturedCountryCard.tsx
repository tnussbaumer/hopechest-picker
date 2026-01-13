import { WizardState } from '../types/wizard';
import { VisionTrip } from '../types';
import { generatePersonalizedSections, generatePersonalizedGreeting } from '../lib/personalization';

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
                Based on your church's size, ministry DNA, and vision, we believe {country} offers 
                the most compelling partnership opportunity. Here's why this could be a transformative 
                fit for {wizardAnswers.churchName}:
              </p>
            </div>
          </div>
        </div>

        {/* Why It's a Good Fit - Original Reasons */}
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
                    {section.title === 'Mobilizing Your Team' ? (
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
        {country === 'Uganda' && (
          <div className="mb-12 bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-2xl border-2 border-gray-100">
            <h3 className="text-3xl font-bold text-center text-brand-teal-dark mb-8">
              Understanding Uganda's Need
            </h3>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {countryData.stats.map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-white rounded-xl shadow-md">
                  <div className="text-5xl md:text-6xl font-bold text-brand-orange mb-3">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 text-sm leading-snug">
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
          <h3 className="text-3xl font-bold mb-8 text-center text-brand-teal-dark">
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
                  src={country === 'Guatemala' 
                    ? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop' 
                    : country === 'Uganda'
                    ? 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop'
                    : 'https://images.unsplash.com/photo-1584282786940-2e4cc8e13fd9?w=600&h=400&fit=crop'
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
                <p className="text-gray-700 mb-4 leading-relaxed">
                  During your visit, you'll witness transformation in action:
                </p>
                <ul className="space-y-2">
                  {[
                    'Local savings groups building financial stability',
                    'Youth empowerment & leadership development',
                    'Health and wellness initiatives',
                    'Agricultural & animal husbandry projects',
                    'Micro-enterprises & small businesses',
                    'CarePoint operations & holistic impact',
                    'Two-way transformational relationships'
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
          <div className="bg-gradient-to-br from-brand-orange/10 to-white p-8 rounded-2xl border-2 border-brand-orange/20">
            <h4 className="text-2xl font-bold text-brand-teal-dark mb-4">
              {country === 'Guatemala' && 'Choose an Excursion: Experience a Volcano Climb, a Round of Golf, or a Coffee Tour in Guatemala!'}
              {country === 'Uganda' && 'Experience an African Safari in Murchison Falls National Park'}
              {country === 'Ethiopia' && 'Experience the Beauty and Culture of Ethiopia!'}
            </h4>
            
            {country === 'Guatemala' && (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">During your visit to Guatemala, you'll have three exciting excursions to choose from, each offering a unique experience of the country's beauty and culture.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=400&h=250&fit=crop"
                      alt="Volcano Pacaya"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="font-bold text-brand-teal-dark mb-2">🌋 Volcano Pacaya Hike</p>
                      <p className="text-sm text-gray-700">Take a moderately rated hike up Volcano Pacaya! At 8,370 feet, it stands as a breathtaking testament to God's creation!</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=250&fit=crop"
                      alt="Golf Course"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="font-bold text-brand-teal-dark mb-2">⛳ The Mayan Golf Club</p>
                      <p className="text-sm text-gray-700">Play next to breathtaking Lake Atitlan, surrounded by three stunning volcanoes—the 'Jewel of Guatemala.'</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=250&fit=crop"
                      alt="Coffee Plantation"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="font-bold text-brand-teal-dark mb-2">☕ Antigua Coffee Tour</p>
                      <p className="text-sm text-gray-700">Savor Antigua's history! Witness lush plantations and taste some of the world's finest coffee.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {country === 'Uganda' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <img 
                      src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&h=400&fit=crop"
                      alt="Murchison Falls Safari"
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p className="font-semibold">Located in the heart of Uganda, Murchison Falls National Park is a wildlife enthusiast's paradise, offering an opportunity for you to encounter the power of God's creation and the beauty of the African wilderness up close.</p>
                    <p>Murchison Falls is Uganda's largest safari park. Home to prolific wildlife and one of the most powerful stretches of white water in the world, its majestic waterfall is where the Nile river explodes through a narrow gorge!</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <p className="text-gray-700">Ride through the park in an open-top 4×4 vehicle, allowing for unobstructed views of incredible wildlife. Prepare to be captivated by majestic elephants roaming the savannah, graceful giraffes stretching to graze on acacia leaves, and playful lions basking in the golden African sun.</p>
                </div>
              </div>
            )}

            {country === 'Ethiopia' && (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">This Vision Trip includes exciting excursions throughout Southern Ethiopia, starting in the charming town of Arba Minch, known for its "40-Springs" and stunning surroundings.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&h=250&fit=crop"
                      alt="Haile Resort"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="font-bold text-brand-teal-dark mb-2">🏨 Haile Resort</p>
                      <p className="text-sm text-gray-700">Enjoy breathtaking views of the twin lakes of Abaya and Chamo, with the iconic 'Bridge of God' connecting them.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img 
                      src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&h=250&fit=crop"
                      alt="Dorze Village"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <p className="font-bold text-brand-teal-dark mb-2">🏘️ Dorze Village</p>
                      <p className="text-sm text-gray-700">Explore the Gamo Highlands, famous for distinctive hut architecture. Experience the rich culture of the Dorze people!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                    {trip.leader && trip.leader !== 'TBD' && (
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

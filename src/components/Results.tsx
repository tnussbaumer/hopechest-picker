import { WizardState, ScoringResult } from '../types/wizard';
import { VisionTrip } from '../types';
import { useEffect, useRef, useState } from 'react';
import { saveFitGuide } from '../lib/api';
import FeaturedCountryCard from './FeaturedCountryCard';

interface ResultsProps {
  wizardAnswers: WizardState;
  scoringResults: ScoringResult;
  onReset: () => void;
}

// Travel facts, images, and vision trips for each country
const COUNTRY_DATA = {
  Guatemala: {
    imageUrl: '/images/guatemala-hero.jpg',
    about: 'Guatemala is located in Central America, offering accessible short-term mission opportunities. HopeChest partners with communities facing challenges including poverty, limited education access, and food insecurity. Our CarePoints provide education, nutrition, and spiritual development for vulnerable children and families.',
    stats: [],
    tagline: '',
    programs: ['Education Support', 'Nutrition Programs', 'Family Development', 'Discipleship'],
    considerations: [
      'Shorter time commitment (5–6 days total)',
      'Most accessible first trip option',
      'Great for Spanish speakers or immersion learners',
    ],
    duration: '5 days',
    costRange: '$1,500–$2,200',
    language: 'Spanish',
    visionTrips: [
      { dateRange: 'Feb 23–28', leader: 'TBD', tripId: 'guatemala-feb-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/gt-feb26/' },
      { dateRange: 'Apr 13–18', leader: 'TBD', tripId: 'guatemala-apr-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/gt-apr26/' },
      { dateRange: 'Jun 15–20', leader: 'TBD', tripId: 'guatemala-jun-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/gt-jun26/' },
      { dateRange: 'Sep 7–12', leader: 'TBD', tripId: 'guatemala-sep-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/gt-sep26/' },
    ] as VisionTrip[],
    excursions: [
      { name: 'Coffee Farm Tour', description: 'Explore a local coffee farm and learn about the bean-to-cup process.', imageUrl: '/images/guatemala-excursion-coffee.jpg' },
      { name: 'Volcano Hike', description: 'Hike an active volcano and witness breathtaking views.', imageUrl: '/images/guatemala-excursion-volcano.jpg' },
      { name: 'Lake Atitlan Boat Trip', description: 'Discover the serene beauty of Lake Atitlan and its surrounding villages.', imageUrl: '/images/guatemala-excursion-golf.jpg' },
    ],
  },
  Uganda: {
    imageUrl: '/images/Uganda-hero.png',
    about: 'Uganda is a landlocked country located in East-Central Africa. Many children in Uganda have lost their parents to HIV/AIDS, while malaria, dehydration, and respiratory infections are the main causes of death in children under 5. Our established CarePoints serve more than 2,500 children and youth. Programs that equip communities and families to move toward self-sustainable transformation include tailoring, poultry farming, microfinance, and agricultural farming, while additionally teaching valuable life skills.',
    stats: [
      {
        value: '48.5%',
        description: "of the country's population is under 14 years old."
      },
      {
        value: '34%',
        description: "(8.5M) of girls are married before their 18th birthday."
      },
      {
        value: '1.3M',
        description: "adults are living with HIV."
      }
    ],
    tagline: 'We believe the next generation can experience hope through transformational relationships.',
    programs: ['Tailoring', 'Poultry Farming', 'Microfinance', 'Agricultural Farming', 'Vocational Training', 'Life Skills'],
    considerations: [
      'Typically requires 2–3 flight connections',
      '10-day commitment including travel time',
      'English is widely spoken—easy communication',
    ],
    duration: '5-7 days',
    costRange: '$1,800–$2,750',
    language: 'English',
    visionTrips: [
      { dateRange: 'Feb 10–18', leader: 'TBD', tripId: 'uganda-feb-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/ug-feb26/' },
      { dateRange: 'Apr 7–14', leader: 'TBD', tripId: 'uganda-apr-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/ug-apr26/' },
      { dateRange: 'Jul 27–Aug 4', leader: 'TBD', tripId: 'uganda-jul-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/ug-jul26/' },
      { dateRange: 'Sep 8–15', leader: 'TBD', tripId: 'uganda-sep-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/ug-sep26/' },
    ] as VisionTrip[],
    excursions: [
      { 
        name: 'Murchison Falls Safari', 
        description: 'Located in the heart of Uganda, Murchison Falls National Park is a wildlife enthusiast&apos;s paradise, offering an opportunity for you to encounter the power of God&apos;s creation and the beauty of the African wilderness up close.\n\nMurchison Falls National Park is the largest Uganda safari park and one of the most visited parks in Uganda. Home to prolific wildlife and one of the most powerful stretches of white water in the world, its majestic waterfall is where the Nile river explodes through a narrow gorge and cascades spectacularly downwards!\n\nRide through the park in an open-top 4×4 vehicle, allowing for unobstructed views of the incredible wildlife. Prepare to be captivated by the sight of majestic elephants roaming the savannah, graceful giraffes stretching their necks to graze on acacia leaves, and playful lions basking in the golden African sun.', 
        imageUrl: '/images/Uganda-safar1.jpg',
        galleryImages: ['/images/Uganda-safari2.png', '/images/Uganda-safari3.png', '/images/Uganda-safari4.png'],
        links: [{ label: 'Murchison Falls National Park', href: 'https://www.go2africa.com/destinations/murchison-falls/why-go' }],
        highlights: ['Murchison Falls National Park']
      }
    ],
  },
  Ethiopia: {
    imageUrl: '/images/Ethiopia-hero.png',
    about: 'Ethiopia is located in the Horn of Africa and is one of the oldest Christian nations in the world. HopeChest works in both Christian-majority and Muslim-majority areas, providing holistic care through CarePoints. Communities face challenges including drought, food insecurity, and limited healthcare access.',
    stats: [],
    tagline: '',
    programs: ['Health Programs', 'Water Projects', 'Education Support', 'Economic Development'],
    considerations: [
      'Direct flights available from select U.S. cities',
      '10-day trip duration',
      'Christian-majority context with meaningful Muslim-area ministry',
    ],
    duration: '5-7 days',
    costRange: '$1,800–$2,750',
    language: 'Amharic (interpreters available)',
    visionTrips: [
      { dateRange: 'Feb 16–20', leader: 'Peter Y. & Thad S.', tripId: 'ethiopia-feb-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/et-feb26/' },
      { dateRange: 'May 6–11', leader: 'TBD', tripId: 'ethiopia-may-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/et-may26/' },
      { dateRange: 'Aug 12–17', leader: 'TBD', tripId: 'ethiopia-aug-2026', registrationUrl: 'https://www.hopechest.org/vision-trips/et-aug26/' },
    ] as VisionTrip[],
    excursions: [
      { 
        name: 'Haile Resort', 
        description: 'This Vision Trip includes exciting excursions throughout Southern Ethiopia, starting in the charming town of Arba Minch, known for its "40-Springs" and stunning surroundings. During your stay at the Haile Resort, you will enjoy breathtaking views of the twin lakes of Abaya and Chamo, with the iconic &apos;Bridge of God&apos; connecting them.', 
        imageUrl: '/images/Ethiopia-excursion-Haile.jpg',
        links: [{ label: 'Haile Resort', href: 'https://hailehotelsandresorts.com/arbaminch_resort/' }],
        highlights: ['Haile Resort']
      },
      { 
        name: 'Dorze Village', 
        description: 'You&apos;ll also have the chance to explore the Dorze Village in the Gamo Highlands, famous for its distinctive hut architecture resembling beehives and elephants. You&apos;ll have the opportunity to experience the rich culture of the Dorze people, experiencing their traditions and warm hospitality!', 
        imageUrl: '/images/Ethiopia-excursion-Dorze.jpg',
        links: [{ label: 'Dorze Village', href: 'https://www.tripadvisor.com/Attraction_Review-g776853-d4814271-Reviews-Dorze_Village-Arba_Minch_Southern_Nations_Nationalities_and_People_s_Region.html' }],
        highlights: ['Dorze Village']
      }
    ],
  },
};

export default function Results({ wizardAnswers, scoringResults, onReset }: ResultsProps) {
  const hasSaved = useRef(false);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);

  // Save to database on mount
  useEffect(() => {
    if (hasSaved.current) return; // Prevent duplicate saves
    
    hasSaved.current = true;
    setSaveStatus('saving');
    
    const saveData = async () => {
      const result = await saveFitGuide(
        wizardAnswers,
        scoringResults.top3,
        scoringResults.allScores,
        scoringResults.confidence
      );
      
      if (result.success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
        console.error('Failed to save fit guide:', result.error);
      }
    };
    
    saveData();
  }, [wizardAnswers, scoringResults]);

  // Fit strength styling and labels
  const getFitStrength = (confidence: 'high' | 'medium' | 'low') => {
    const config = {
      high: {
        label: 'Strong Fit',
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        width: 'w-full',
        message: 'We have high confidence these partnerships align beautifully with your church DNA.',
      },
      medium: {
        label: 'Good Fit',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        width: 'w-2/3',
        message: 'These look like strong possibilities. A HopeChest team member can help refine the fit.',
      },
      low: {
        label: 'Exploring Fit',
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-800',
        width: 'w-1/3',
        message: "We'd love to learn more about your vision. Our team will reach out to explore options together.",
      },
    };
    return config[confidence];
  };

  const fitStrength = getFitStrength(scoringResults.confidence);

  // Get alignment badge based on top score
  const getAlignmentBadge = () => {
    const topScore = scoringResults.top3[0]?.score || 0;
    if (topScore > 80) {
      return { label: 'Strong Ministry Alignment', icon: '✦' };
    } else if (topScore > 50) {
      return { label: 'Good Ministry Alignment', icon: '○' };
    } else {
      return { label: 'Potential Alignment', icon: '·' };
    }
  };

  const alignmentBadge = getAlignmentBadge();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Save Status Indicator */}
      {saveStatus && (
        <div className="flex justify-center mb-6">
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating your report...</span>
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Results saved</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>Error saving (results still displayed)</span>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-teal mb-6">
          For {wizardAnswers.churchName}, here are the partnerships we invite you to explore
        </h1>

        {/* Alignment Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-teal/10 text-brand-teal-dark rounded-full mb-4">
          <span className="text-sm">{alignmentBadge.icon}</span>
          <span className="text-sm font-semibold">{alignmentBadge.label}</span>
        </div>

        {/* Discernment Copy */}
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          These recommendations are a starting point for your team's prayers and discernment. While the data suggests a strong fit, we trust that wisdom and the Spirit will guide your final decision.
        </p>
      </div>

      {/* Featured #1 Choice - Full Width */}
      {scoringResults.top3.length > 0 && (
        <FeaturedCountryCard
          country={scoringResults.top3[0].country}
          score={scoringResults.top3[0].score}
          reasons={scoringResults.top3[0].reasons}
          wizardAnswers={wizardAnswers}
          countryData={COUNTRY_DATA[scoringResults.top3[0].country as keyof typeof COUNTRY_DATA]}
        />
      )}

      {/* Other Recommendations Header */}
      {scoringResults.top3.length > 1 && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Other Strong Options to Consider
          </h2>
          <p className="text-gray-600">
            These countries also align well with your church's vision and capacity
          </p>
        </div>
      )}

      {/* Choices #2 and #3 - Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {scoringResults.top3.slice(1).map((result, index) => {
          const countryData = COUNTRY_DATA[result.country as keyof typeof COUNTRY_DATA];
          const actualIndex = index + 1; // This is now the 2nd or 3rd item
          
          return (
            <div
              key={result.country}
              className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* Hero Image with Ranking */}
              <div className="relative h-56 overflow-hidden flex-shrink-0">
                <img
                  src={countryData.imageUrl}
                  alt={result.country}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Country Name and Ranking */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-block bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    #{actualIndex + 1} Recommendation
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {result.country}
                  </h2>
                </div>
              </div>

              {/* Card Content - Flex column to push vision trips to bottom */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Why It Could Be a Good Fit */} 
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-brand-teal">✓</span>
                    Why it could be a good fit
                  </h3>
                  <ul className="space-y-1.5">
                    {result.reasons.slice(0, 3).map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-brand-teal mt-0.5 flex-shrink-0">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Things to Consider */} 
                <div className="mb-4 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                    <span className="text-blue-600">ℹ️</span>
                    Things to consider
                  </h3>
                  <ul className="space-y-1.5">
                    {countryData.considerations.map((consideration, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 text-xs">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">→</span>
                        <span>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vision Trip Snapshot */} 
                <div className="bg-brand-teal-bg rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-bold text-brand-teal-dark mb-3">
                    Vision Trip Snapshot
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Duration</p>
                      <p className="text-sm font-bold text-gray-800">{countryData.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Language</p>
                      <p className="text-sm font-bold text-gray-800">{countryData.language}</p>
                    </div>
                  </div>
                </div>

                {/* 2026 Vision Trips - Pushed to bottom with mt-auto */} 
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">
                    2026 Vision Trips
                  </h3>
                  <div className="space-y-2">
                    {countryData.visionTrips.map((trip) => (
                      <div key={trip.tripId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{trip.dateRange}</span>
                        <a
                          href={trip.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1 bg-brand-orange hover:bg-brand-brown text-white text-xs font-semibold rounded-full transition-colors"
                        >
                          Register
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */} 
      <div className="text-center space-y-6 pb-12">
        <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
          <p className="text-gray-700 mb-2">
            <span className="text-green-600 font-semibold">✅ Your Fit Guide is ready.</span>
          </p>
          <p className="text-gray-600 text-sm">
            We've emailed a copy to <span className="font-semibold">{wizardAnswers.email}</span> and our team. 
            A HopeChest representative will follow up to help you take the next step.
          </p>
        </div>

        <button
          onClick={onReset}
          className="text-brand-teal hover:text-brand-teal-dark font-semibold underline"
        >
          Start over with new answers
        </button>
      </div>
    </div>
  );
}

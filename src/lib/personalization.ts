import { WizardState, ImpactDNA, MobilizationOption, PartnershipPosture } from '../types/wizard';

interface PersonalizedSection {
  title: string;
  content: string;
  icon?: string;
}

export function generatePersonalizedSections(
  countryName: string,
  wizardAnswers: WizardState
): PersonalizedSection[] {
  const sections: PersonalizedSection[] = [];
  const { impactDNA, mobilization, partnershipPosture, contactName } = wizardAnswers;
  const firstName = contactName.split(' ')[0];

  // Generate sections based on Impact DNA (now supports multiple selections)
  if (impactDNA && impactDNA.includes('education_medical')) {
    if (countryName === 'Uganda') {
      sections.push({
        title: 'Education & Schools Partnership',
        content: `Your heart for education aligns perfectly with Uganda. Through CarePoints, your church can support vocational skills training programs that equip youth with marketable skills like tailoring, agriculture, and entrepreneurship. Many partnering churches also fund educational supplies, literacy programs, and scholarships that transform children's futures. The "Rescued Readers" initiative and educational support at CarePoints serve over 2,500 children across Uganda.`,
        icon: '📚'
      });
    } else if (countryName === 'Ethiopia') {
      sections.push({
        title: 'Education & Schools Partnership',
        content: `Ethiopia's educational landscape offers tremendous opportunity for your church to make lasting impact. Many children lack access to quality education, school supplies, and safe learning environments. Your church can support school construction, teacher training, literacy programs, and sponsorships that enable children to complete their education and break the cycle of poverty.`,
        icon: '📚'
      });
    } else if (countryName === 'Guatemala') {
      sections.push({
        title: 'Education & Schools Partnership',
        content: `Guatemala's rural communities face significant educational challenges. Your church can engage through after-school programs, literacy initiatives, tutoring, and educational supplies. Many churches also build relationships with local schools, fund scholarships, and equip teachers with resources that multiply their impact across entire classrooms.`,
        icon: '📚'
      });
    }
  }
  
  if (impactDNA && impactDNA.includes('education_medical')) {
    if (countryName === 'Uganda') {
      sections.push({
        title: 'Medical & Healthcare Ministry',
        content: `Your focus on medical care is critically needed in Uganda, where malaria, dehydration, and respiratory infections are leading causes of death for children under 5. With 1.3 million adults living with HIV, there's tremendous opportunity for your medical professionals to provide health screenings, basic medical care, and preventative education. CarePoints offer occasional health screenings and basic medical support that your team can enhance through visits and training local healthcare workers.`,
        icon: '🏥'
      });
    } else if (countryName === 'Ethiopia') {
      sections.push({
        title: 'Medical & Healthcare Ministry',
        content: `Ethiopia faces significant healthcare challenges including limited access to medical facilities, lack of clean water, and preventable diseases. Your medical professionals can conduct health screenings, provide basic medical training, improve sanitation practices, and address nutritional needs. Medical teams make profound impact through clinics, health education, and training community health workers who serve long after your team returns home.`,
        icon: '🏥'
      });
    } else if (countryName === 'Guatemala') {
      sections.push({
        title: 'Medical & Healthcare Ministry',
        content: `Guatemala's rural communities have limited access to healthcare services. Your medical team can provide health screenings, dental care, vision services, and health education. Many churches also support clean water initiatives, nutrition programs, and partnerships with local clinics that extend medical care throughout the year.`,
        icon: '🏥'
      });
    }
  }
  
  if (impactDNA && impactDNA.includes('community_transformation')) {
    if (countryName === 'Uganda') {
      sections.push({
        title: 'Holistic Community Transformation',
        content: `Uganda's community transformation programs embody sustainable development at its best. Your church can engage with tailoring cooperatives, poultry farming initiatives, microfinance programs, and agricultural farming projects. These income-generating activities move families from survival to thriving, breaking generational cycles of poverty. You'll witness how teaching valuable life skills creates lasting change that continues long after your team returns home.`,
        icon: '🌱'
      });
    } else if (countryName === 'Ethiopia') {
      sections.push({
        title: 'Holistic Community Transformation',
        content: `Ethiopia's focus on sustainable development creates opportunities for churches to engage in water projects, agricultural training, microenterprise development, and economic empowerment. Your church can help establish income-generating activities, support savings groups, and provide business training that lifts entire communities out of poverty through dignified work and economic opportunity.`,
        icon: '🌱'
      });
    } else if (countryName === 'Guatemala') {
      sections.push({
        title: 'Holistic Community Transformation',
        content: `Guatemala's community development programs address multiple aspects of poverty. Your church can support agricultural projects, microenterprise initiatives, women's cooperatives, and skills training. These sustainable solutions create economic opportunity, strengthen families, and demonstrate God's love through practical care that brings lasting transformation.`,
        icon: '🌱'
      });
    }
  }
  
  if (impactDNA && impactDNA.includes('frontier_hard_to_reach')) {
    if (countryName === 'Uganda') {
      sections.push({
        title: 'Reaching Vulnerable Communities',
        content: `Uganda's rural CarePoints reach some of East Africa's most vulnerable populations. With 48.5% of the population under 14 and 34% of girls married before their 18th birthday, the need is urgent. Your church will partner with communities facing extreme poverty, limited infrastructure, and minimal access to basic services. These frontier partnerships offer profound kingdom impact in places where hope is scarce.`,
        icon: '🌍'
      });
    } else if (countryName === 'Ethiopia') {
      sections.push({
        title: 'Reaching Vulnerable Communities',
        content: `Ethiopia's diverse landscape includes both Christian-majority and Muslim-majority areas where HopeChest serves. Your church can reach isolated communities facing drought, food insecurity, and limited resources. These frontier areas offer unique opportunities to demonstrate Christ's love in places where access to the gospel and basic services is limited.`,
        icon: '🌍'
      });
    } else if (countryName === 'Guatemala') {
      sections.push({
        title: 'Reaching Vulnerable Communities',
        content: `Guatemala's mountainous regions and remote villages represent frontier mission opportunities. Many communities lack roads, electricity, and basic services. Your church can reach indigenous populations, serve isolated villages, and bring hope to places where poverty and hardship are most severe. These partnerships require commitment but yield extraordinary spiritual fruit.`,
        icon: '🌍'
      });
    }
  }
  
  if (impactDNA && impactDNA.includes('friendship_model')) {
    sections.push({
      title: 'The Friendship Model: Partnerships Built on Dignity',
      content: `Your heart for relationship-centered ministry aligns perfectly with HopeChest's Friendship Model. This approach reimagines partnership—between two communities and between individuals. Rather than a top-down assignment, it invites children to take the lead in choosing their sponsor, reducing paternalism and reframing sponsorship as a relationship built on dignity and connection. This launch model reflects HopeChest's holistic approach to community transformation, which invests in local leadership, amplifies children's voices, and connects communities in long-term, transformational relationships.`,
      icon: '🤝'
    });
  }
  
  if (impactDNA && impactDNA.includes('carepoint_graduation')) {
    sections.push({
      title: 'CarePoint Graduation: Building for Independence',
      content: `Your commitment to sustainable transformation aligns with HopeChest's graduation model. Every CarePoint begins with a target graduation timeline of 8-15 years. Through three phases—Build Foundation (3-5 years), Growth & Development (4-8 years), and Prepare for Independence (3-4 years)—communities transition from external support to local ownership. At graduation, the CarePoint becomes a Community-Based Organization led by trained local leaders. This isn't dependency—it's empowerment. Your partnership plants seeds of possibility that communities nurture into lasting change, powered by their own spirit and drive. Graduation frees resources to serve new communities, multiplying your mission's impact.`,
      icon: '🎓'
    });
  }

  // Add mobilization-specific content
  if (mobilization && mobilization.length > 0) {
    const mobilizationContent = generateMobilizationContent(countryName, mobilization);
    if (mobilizationContent) {
      sections.push(mobilizationContent);
    }
  }

  // Add partnership posture content
  if (partnershipPosture) {
    const partnershipContent = generatePartnershipContent(countryName, partnershipPosture);
    if (partnershipContent) {
      sections.push(partnershipContent);
    }
  }

  return sections;
}

function generateMobilizationContent(
  countryName: string,
  mobilization: MobilizationOption[]
): PersonalizedSection | null {

  // Map of mobilization options to their display names for bolding
  const mobilizationDisplayNames: Record<MobilizationOption, string> = {
    students_young_adults: 'Students and young adults',
    families_with_children: 'Families',
    teachers_educators: 'Educators',
    medical_professionals: 'Medical professionals',
    adults_seniors: 'Adult and senior teams',
    broad_church_wide: 'Church-wide',
    small_groups_sunday_school: 'Small groups and Sunday school classes',
    construction_teams: 'Construction teams',
    other: 'Other groups'
  };

  const mobilizationDescriptions: Record<string, Partial<Record<MobilizationOption, string>>> = {
    Uganda: {
      students_young_adults: 'Students and young adults thrive on Uganda vision trips, building cross-cultural friendships with Ugandan youth, participating in sports outreach, and serving at CarePoints. These trips often become defining moments in their spiritual journey.',
      families_with_children: 'Uganda welcomes families beautifully. Children can interact with Ugandan kids at CarePoints, play together, and see global compassion in action. Many families report these trips as the most meaningful experiences they\'ve shared together.',
      teachers_educators: 'Educators find natural connections in Uganda through school visits, literacy programs, and vocational training centers. You can observe teaching methods, share educational resources, and mentor local teachers who serve hundreds of children.',
      medical_professionals: 'Medical professionals can conduct health screenings, provide basic medical training to community health workers, and assess healthcare needs. Your expertise brings hope to communities where medical care is scarce and preventable diseases are common.',
      adults_seniors: 'Adult and senior teams bring wisdom, life experience, and encouragement to Ugandan communities. Whether supporting income-generating projects, mentoring caregivers, or building relationships with community leaders, your maturity and perspective are invaluable gifts.',
      broad_church_wide: 'Church-wide mobilization to Uganda creates unity and shared purpose across all ages. From children to seniors, everyone finds meaningful ways to serve—whether through building projects, VBS programs, home visits, or community celebrations.',
      small_groups_sunday_school: 'Small groups and Sunday school classes find deep connection through shared Uganda experiences. These cohesive teams build lasting bonds while serving together, creating stories and relationships that continue long after returning home.',
      construction_teams: 'Construction teams bring practical skills to Uganda, building classrooms, water systems, and community infrastructure. Your hands-on work creates tangible improvements that serve communities for years to come.'
    },
    Ethiopia: {
      students_young_adults: 'Young adults connect deeply with Ethiopian youth through sports, music, and cultural exchange. Ethiopia\'s rich history and diverse communities provide transformative cross-cultural experiences that shape lifelong global perspectives.',
      families_with_children: 'Ethiopian communities warmly welcome families. Children experience hospitality, share meals, and play with Ethiopian children, creating memories and understanding that transcend cultural differences.',
      teachers_educators: 'Teachers can engage in schools, support literacy initiatives, and encourage local educators. Ethiopia\'s emphasis on education creates natural connections for educators passionate about expanding learning opportunities.',
      medical_professionals: 'Medical teams address critical health needs through clinics, training, and preventative care education. Your medical expertise brings hope where healthcare access is limited and needs are great.',
      adults_seniors: 'Mature believers bring encouragement, wisdom, and partnership to Ethiopian communities. Your life experience and spiritual depth offer invaluable mentorship to local leaders and community members.',
      broad_church_wide: 'Ethiopia welcomes diverse teams where every age and skill finds meaningful engagement—from children\'s programs to construction, from prayer ministry to agricultural support.',
      small_groups_sunday_school: 'Tight-knit groups experience profound transformation together in Ethiopia. Shared experiences deepen existing relationships while creating new ministry momentum back home.',
      construction_teams: 'Construction expertise is highly valued in Ethiopia for building schools, water systems, and community facilities. Your skilled work addresses critical infrastructure needs.'
    },
    Guatemala: {
      students_young_adults: 'Guatemala\'s proximity and accessibility make it ideal for student trips. Young adults engage through sports, VBS, construction projects, and relationship-building that often ignites passion for missions.',
      families_with_children: 'Guatemala is exceptionally family-friendly with short travel time and culturally rich experiences. Families serve together, children connect across language barriers through play, and everyone returns transformed.',
      teachers_educators: 'Spanish-speaking educators especially thrive in Guatemala, partnering with schools, leading educational activities, and supporting literacy programs that multiply impact through local teachers.',
      medical_professionals: 'Guatemala\'s medical needs create opportunities for dental clinics, health screenings, and training that bring healing and demonstrate Christ\'s compassion in practical, life-changing ways.',
      adults_seniors: 'Mature teams bring construction skills, life wisdom, and encouragement. Guatemala\'s shorter trips accommodate various physical abilities while providing meaningful service opportunities.',
      broad_church_wide: 'Guatemala\'s accessibility makes church-wide trips practical and impactful. Multiple generations serve together, creating shared experiences that unite your congregation in mission.',
      small_groups_sunday_school: 'Guatemala is perfect for small group and Sunday school trips. Shorter travel time and lower costs make it accessible while creating tight-knit team experiences that deepen community.',
      construction_teams: 'Construction teams thrive in Guatemala with accessible building projects, reasonable costs, and immediate visible impact. Many teams return annually to complete multi-phase projects.'
    }
  };

  const countryDescriptions = mobilizationDescriptions[countryName];
  if (!countryDescriptions) return null;

  let descriptions = mobilization
    .map(m => countryDescriptions[m])
    .filter(d => d) // Filter out undefined
    .join(' ');

  // Bold the user-selected mobilization phrases in the text
  mobilization.forEach((option) => {
    const displayName = mobilizationDisplayNames[option];
    if (displayName) {
      // Create a case-insensitive regex to match the phrase
      const regex = new RegExp(`(${displayName})`, 'gi');
      descriptions = descriptions.replace(regex, '<strong>$1</strong>');
    }
  });

  return {
    title: 'Mobilizing Your Team',
    content: descriptions,
    icon: '👥'
  };
}

function generatePartnershipContent(
  countryName: string,
  partnershipPosture: PartnershipPosture
): PersonalizedSection | null {

  const partnershipContent: Record<string, Record<string, { title: string; content: string; icon: string }>> = {
    Uganda: {
      own_community: {
        title: 'Your Own CarePoint Partnership',
        content: 'With your own CarePoint community in Uganda, your church becomes the primary partner for an entire village. You\'ll build deep, lasting relationships with specific families, watch children grow year after year, and celebrate milestones together. This exclusive partnership creates accountability, intimacy, and the joy of seeing sustainable transformation that your church directly impacts.',
        icon: '🤝'
      },
      partner_with_others: {
        title: 'Joining Existing Partnerships',
        content: 'Several Uganda CarePoints have existing church partnerships where additional U.S. churches can collaborate. This approach lets you learn from experienced partners, share resources and vision trip costs, and benefit from established relationships. It\'s an excellent way to start your Uganda journey with built-in support and mentorship.',
        icon: '🤝'
      }
    },
    Ethiopia: {
      own_community: {
        title: 'Your Own CarePoint Partnership',
        content: 'Partnering with your own CarePoint in Ethiopia creates lasting, transformational relationships. Your church becomes deeply invested in one community\'s journey from poverty to flourishing. You\'ll know families by name, celebrate victories, walk through challenges, and witness God\'s faithfulness through long-term commitment.',
        icon: '🤝'
      },
      partner_with_others: {
        title: 'Collaborative Partnerships',
        content: 'Join existing church partnerships in Ethiopia where you can share resources, learn from experienced partners, and multiply impact through collaboration. This approach provides community, shared costs, and built-in mentorship as you begin your Ethiopia partnership journey.',
        icon: '🤝'
      }
    },
    Guatemala: {
      own_community: {
        title: 'Your Own Community Partnership',
        content: 'Adopt your own community in Guatemala where your church provides primary support and builds intimate, multi-year relationships. This focused partnership creates deep bonds, consistent impact, and the privilege of watching children and families transform through your church\'s faithful commitment.',
        icon: '🤝'
      },
      partner_with_others: {
        title: 'Joining Established Partnerships',
        content: 'Many Guatemala communities welcome additional partnering churches. Collaborate with other U.S. churches to share vision trips, combine resources, and learn from those with established relationships. This approach eases the learning curve and builds immediate momentum.',
        icon: '🤝'
      }
    }
  };

  const countryContent = partnershipContent[countryName];
  if (!countryContent) return null;

  if (partnershipPosture === 'own_community' && countryContent.own_community) {
    return countryContent.own_community;
  } else if (partnershipPosture === 'partner_with_others' && countryContent.partner_with_others) {
    return countryContent.partner_with_others;
  }

  return null;
}

export function generatePersonalizedGreeting(wizardAnswers: WizardState, countryName: string): string {
  const firstName = wizardAnswers.contactName.split(' ')[0];
  return `${firstName}, based on ${wizardAnswers.churchName}'s heart and vision, here's why ${countryName} could be your perfect partnership`;
}

export interface WildlifeSpecies {
  id: string;
  name: string;
  icon: string;
  description: string;
  habitat: string[];
  eatingHabits: string[];
  migrationPattern: string;
  seasonalActivity: {
    spring: string;
    summer: string;
    fall: string;
    winter: string;
  };
  bestHuntingTimes: string[];
  preferredWeather: string[];
}

export const wildlifeSpeciesData: WildlifeSpecies[] = [
  {
    id: 'white-tailed-deer',
    name: 'White-tailed Deer',
    icon: '🦌',
    description: 'Most common deer species in North America, known for their distinctive white tail flash when alarmed.',
    habitat: ['Deciduous forests', 'Mixed woodlands', 'Forest edges', 'Agricultural areas', 'Suburban areas'],
    eatingHabits: ['Browse on woody plants', 'Acorns and nuts', 'Grasses and herbs', 'Agricultural crops', 'Fruit and berries'],
    migrationPattern: 'Seasonal movement between summer and winter ranges, typically moving to lower elevations and sheltered areas in winter.',
    seasonalActivity: {
      spring: 'Active feeding to regain winter weight, fawning season begins in May',
      summer: 'Peak feeding activity, bucks growing antlers, does caring for fawns',
      fall: 'Rutting season (breeding), increased movement and activity, peak hunting season',
      winter: 'Conserving energy, seeking shelter, feeding on woody browse'
    },
    bestHuntingTimes: ['Early morning (dawn)', 'Late evening (dusk)', 'Overcast days', 'Just before weather fronts'],
    preferredWeather: ['Cool temperatures', 'Light rain', 'Stable barometric pressure', 'Minimal wind']
  },
  {
    id: 'elk',
    name: 'Elk',
    icon: '🫎',
    description: 'Large members of the deer family, known for their impressive antlers and distinctive bugling calls.',
    habitat: ['Mountain forests', 'Alpine meadows', 'Grasslands', 'Open woodlands', 'River valleys'],
    eatingHabits: ['Grasses and sedges', 'Forbs and wildflowers', 'Woody plants and bark', 'Aspen leaves', 'Mountain shrubs'],
    migrationPattern: 'Extensive seasonal migrations between high elevation summer ranges and lower elevation winter ranges.',
    seasonalActivity: {
      spring: 'Moving to higher elevations, calving season, feeding on new growth',
      summer: 'High alpine feeding, bachelor groups, antler growth',
      fall: 'Rutting season with bugling, increased movement, moving to winter range',
      winter: 'Conserving energy in winter range, feeding on woody browse'
    },
    bestHuntingTimes: ['Early morning', 'Late evening', 'During weather changes', 'Rutting season (September-October)'],
    preferredWeather: ['Cool temperatures', 'Light snow', 'Stable conditions', 'Minimal human activity']
  },
  {
    id: 'wild-turkey',
    name: 'Wild Turkey',
    icon: '🦃',
    description: 'Large ground birds known for their distinctive gobbling calls and impressive display during mating season.',
    habitat: ['Mixed forests', 'Open woodlands', 'Forest clearings', 'Agricultural areas', 'Roost trees near water'],
    eatingHabits: ['Acorns and nuts', 'Seeds and berries', 'Insects and small reptiles', 'Grasses and leaves', 'Agricultural grains'],
    migrationPattern: 'Generally non-migratory, but may move seasonally between different habitat types within their range.',
    seasonalActivity: {
      spring: 'Breeding season with gobbling and displaying, nesting begins',
      summer: 'Brood rearing, insects important for poult development',
      fall: 'Flocking behavior, feeding heavily on mast crops',
      winter: 'Large winter flocks, roosting in evergreen trees'
    },
    bestHuntingTimes: ['Early morning gobbling', 'Late afternoon', 'Roost sites at dawn/dusk', 'Spring breeding season'],
    preferredWeather: ['Clear mornings', 'Calm conditions', 'Mild temperatures', 'No precipitation']
  },
  {
    id: 'waterfowl',
    name: 'Waterfowl',
    icon: '🦆',
    description: 'Collective term for ducks, geese, and swans that depend on wetland habitats for feeding and reproduction.',
    habitat: ['Wetlands and marshes', 'Lakes and ponds', 'Rivers and streams', 'Coastal areas', 'Flooded fields'],
    eatingHabits: ['Aquatic plants', 'Seeds and grains', 'Aquatic invertebrates', 'Small fish', 'Agricultural crops'],
    migrationPattern: 'Extensive north-south migrations following major flyways, timing depends on species and weather conditions.',
    seasonalActivity: {
      spring: 'Northward migration to breeding grounds, pair formation, nesting',
      summer: 'Breeding and brood rearing, molting period with flightlessness',
      fall: 'Southward migration, peak hunting season, staging in key wetlands',
      winter: 'Wintering in southern areas, large concentrations in suitable habitat'
    },
    bestHuntingTimes: ['Early morning flights', 'Evening returns', 'Weather fronts', 'Migration periods'],
    preferredWeather: ['Overcast skies', 'Light winds', 'Stable conditions', 'Cold fronts for migration']
  }
];

export const getWildlifeById = (id: string): WildlifeSpecies | undefined => {
  return wildlifeSpeciesData.find(species => species.id === id);
};

export const getSeasonalInfo = (speciesId: string, season: string): string => {
  const species = getWildlifeById(speciesId);
  if (!species) return '';
  
  const seasonKey = season.toLowerCase() as keyof typeof species.seasonalActivity;
  return species.seasonalActivity[seasonKey] || '';
};

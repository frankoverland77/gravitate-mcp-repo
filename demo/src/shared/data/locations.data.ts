/**
 * Shared Locations Data
 *
 * Master location list for fuel industry demos.
 * Includes terminals and delivery locations used across features.
 */

import type { Location, LocationOption } from '../types/location.types'

// Curated standard location list
export const LOCATIONS: Location[] = [
  {
    LocationId: 1,
    Name: 'Houston Terminal',
    Abbreviation: 'HOU',
    Region: 'Gulf Coast',
    State: 'TX',
    IsTerminal: true,
    IsActive: true,
  },
  {
    LocationId: 2,
    Name: 'Houston',
    Abbreviation: 'HOU',
    Region: 'Gulf Coast',
    State: 'TX',
    IsTerminal: false,
    IsActive: true,
  },
  {
    LocationId: 3,
    Name: 'Dallas',
    Abbreviation: 'DAL',
    Region: 'Texas',
    State: 'TX',
    IsTerminal: false,
    IsActive: true,
  },
  {
    LocationId: 4,
    Name: 'Beaumont',
    Abbreviation: 'BMT',
    Region: 'Gulf Coast',
    State: 'TX',
    IsTerminal: false,
    IsActive: true,
  },
  {
    LocationId: 5,
    Name: 'Nashville Terminal',
    Abbreviation: 'NSH',
    Region: 'Southeast',
    State: 'TN',
    IsTerminal: true,
    IsActive: true,
  },
  {
    LocationId: 6,
    Name: 'Detroit Terminal',
    Abbreviation: 'DET',
    Region: 'Midwest',
    State: 'MI',
    IsTerminal: true,
    IsActive: true,
  },
  {
    LocationId: 7,
    Name: 'Columbia Terminal',
    Abbreviation: 'COL',
    Region: 'Mid-Atlantic',
    State: 'SC',
    IsTerminal: true,
    IsActive: true,
  },
  {
    LocationId: 8,
    Name: 'Phoenix',
    Abbreviation: 'PHX',
    Region: 'Southwest',
    State: 'AZ',
    IsTerminal: false,
    IsActive: true,
  },
  {
    LocationId: 9,
    Name: 'Atlanta',
    Abbreviation: 'ATL',
    Region: 'Southeast',
    State: 'GA',
    IsTerminal: false,
    IsActive: true,
  },

  // ============================================================================
  // TEXAS
  // ============================================================================
  { LocationId: 10, Name: 'Abilene', Abbreviation: 'ABI', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 11, Name: 'Amarillo', Abbreviation: 'AMA', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 12, Name: 'Big Spring', Abbreviation: 'BGS', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 13, Name: 'Cisco', Abbreviation: 'CIS', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 14, Name: 'El Paso', Abbreviation: 'ELP', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 15, Name: 'Lubbock', Abbreviation: 'LBB', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 16, Name: 'Midland/Odessa', Abbreviation: 'MAF', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },
  { LocationId: 17, Name: 'Wichita Falls', Abbreviation: 'SPS', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },

  // ============================================================================
  // OKLAHOMA
  // ============================================================================
  { LocationId: 18, Name: 'Ardmore', Abbreviation: 'ADM', Region: 'Midwest', State: 'OK', IsTerminal: false, IsActive: true },
  { LocationId: 19, Name: 'Enid', Abbreviation: 'END', Region: 'Midwest', State: 'OK', IsTerminal: false, IsActive: true },
  { LocationId: 20, Name: 'Oklahoma City', Abbreviation: 'OKC', Region: 'Midwest', State: 'OK', IsTerminal: false, IsActive: true },
  { LocationId: 21, Name: 'Ponca City', Abbreviation: 'PNC', Region: 'Midwest', State: 'OK', IsTerminal: false, IsActive: true },
  { LocationId: 22, Name: 'Tulsa', Abbreviation: 'TUL', Region: 'Midwest', State: 'OK', IsTerminal: false, IsActive: true },
  { LocationId: 23, Name: 'Wynnewood', Abbreviation: 'WYN', Region: 'Midwest', State: 'OK', IsTerminal: false, IsActive: true },

  // ============================================================================
  // KANSAS
  // ============================================================================
  { LocationId: 24, Name: 'Coffeyville', Abbreviation: 'CFV', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 25, Name: 'Concordia', Abbreviation: 'CNC', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 26, Name: 'El Dorado', Abbreviation: 'ELD', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 27, Name: 'Great Bend', Abbreviation: 'GBD', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 28, Name: 'Hutchinson', Abbreviation: 'HUT', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 29, Name: 'Junction City', Abbreviation: 'JCT', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 30, Name: 'Kansas City', Abbreviation: 'MCI', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 31, Name: 'McPherson', Abbreviation: 'MCP', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 32, Name: 'Salina', Abbreviation: 'SLN', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 33, Name: 'Scott City', Abbreviation: 'SCT', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 34, Name: 'Topeka', Abbreviation: 'TOP', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 35, Name: 'Wathena', Abbreviation: 'WAT', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },
  { LocationId: 36, Name: 'Wichita', Abbreviation: 'ICT', Region: 'Midwest', State: 'KS', IsTerminal: false, IsActive: true },

  // ============================================================================
  // NEBRASKA
  // ============================================================================
  { LocationId: 37, Name: 'Columbus', Abbreviation: 'CLU', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 38, Name: 'Doniphan', Abbreviation: 'DON', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 39, Name: 'Geneva', Abbreviation: 'GNV', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 40, Name: 'Lincoln', Abbreviation: 'LNK', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 41, Name: 'Milford', Abbreviation: 'MLF', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 42, Name: 'Norfolk', Abbreviation: 'OFK', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 43, Name: 'North Platte', Abbreviation: 'LBF', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },
  { LocationId: 44, Name: 'Omaha', Abbreviation: 'OMA', Region: 'Midwest', State: 'NE', IsTerminal: false, IsActive: true },

  // ============================================================================
  // IOWA
  // ============================================================================
  { LocationId: 45, Name: 'Bettendorf', Abbreviation: 'BTF', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 46, Name: 'Council Bluffs', Abbreviation: 'CBF', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 47, Name: 'Des Moines', Abbreviation: 'DSM', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 48, Name: 'Dubuque', Abbreviation: 'DBQ', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 49, Name: 'Ft. Dodge', Abbreviation: 'FOD', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 50, Name: 'Iowa City', Abbreviation: 'IOW', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 51, Name: 'Lemars', Abbreviation: 'LMR', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 52, Name: 'Mason Cty/Clr.Lk.', Abbreviation: 'MCW', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 53, Name: 'Osceola', Abbreviation: 'OSC', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 54, Name: 'Ottumwa', Abbreviation: 'OTM', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 55, Name: 'Rock Rapids', Abbreviation: 'RKR', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 56, Name: 'Sioux City', Abbreviation: 'SUX', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },
  { LocationId: 57, Name: 'Waterloo', Abbreviation: 'ALO', Region: 'Midwest', State: 'IA', IsTerminal: false, IsActive: true },

  // ============================================================================
  // MISSOURI
  // ============================================================================
  { LocationId: 58, Name: 'Cape Girardeau', Abbreviation: 'CGI', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },
  { LocationId: 59, Name: 'Carthage', Abbreviation: 'CRT', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },
  { LocationId: 60, Name: 'Columbia', Abbreviation: 'COU', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },
  { LocationId: 61, Name: 'Jefferson City', Abbreviation: 'JEF', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },
  { LocationId: 62, Name: 'Palmyra', Abbreviation: 'PLY', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },
  { LocationId: 63, Name: 'Springfield', Abbreviation: 'SGF', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },
  { LocationId: 64, Name: 'St. Louis', Abbreviation: 'STL', Region: 'Midwest', State: 'MO', IsTerminal: false, IsActive: true },

  // ============================================================================
  // ARKANSAS
  // ============================================================================
  { LocationId: 65, Name: 'El Dorado', Abbreviation: 'EDA', Region: 'Midwest', State: 'AR', IsTerminal: false, IsActive: true },
  { LocationId: 66, Name: 'Ft. Smith', Abbreviation: 'FSM', Region: 'Midwest', State: 'AR', IsTerminal: false, IsActive: true },
  { LocationId: 67, Name: 'Jonesboro', Abbreviation: 'JBR', Region: 'Midwest', State: 'AR', IsTerminal: false, IsActive: true },
  { LocationId: 68, Name: 'Little Rock', Abbreviation: 'LIT', Region: 'Midwest', State: 'AR', IsTerminal: false, IsActive: true },
  { LocationId: 69, Name: 'Rogers', Abbreviation: 'ROG', Region: 'Midwest', State: 'AR', IsTerminal: false, IsActive: true },

  // ============================================================================
  // MINNESOTA
  // ============================================================================
  { LocationId: 70, Name: 'Duluth', Abbreviation: 'DLH', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 71, Name: 'Duluth/Esko', Abbreviation: 'DLE', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 72, Name: 'Duluth/Wrenshall', Abbreviation: 'DLW', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 73, Name: 'Mankato', Abbreviation: 'MKT', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 74, Name: 'Marshall', Abbreviation: 'MML', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 75, Name: 'Minneapolis', Abbreviation: 'MSP', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 76, Name: 'Moorhead', Abbreviation: 'MHD', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 77, Name: 'Pn Bnd/FlntHlsRs', Abbreviation: 'PBF', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 78, Name: 'Rochester', Abbreviation: 'RST', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 79, Name: 'Roseville/Magellan', Abbreviation: 'RVM', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 80, Name: 'Rsvile/FlntHlsRs', Abbreviation: 'RVF', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },
  { LocationId: 81, Name: 'Sauk Centre', Abbreviation: 'SKC', Region: 'Midwest', State: 'MN', IsTerminal: false, IsActive: true },

  // ============================================================================
  // WISCONSIN
  // ============================================================================
  { LocationId: 82, Name: 'Chippewa Falls', Abbreviation: 'CHF', Region: 'Midwest', State: 'WI', IsTerminal: false, IsActive: true },
  { LocationId: 83, Name: 'Madison', Abbreviation: 'MSN', Region: 'Midwest', State: 'WI', IsTerminal: false, IsActive: true },
  { LocationId: 84, Name: 'Superior', Abbreviation: 'SUW', Region: 'Midwest', State: 'WI', IsTerminal: false, IsActive: true },

  // ============================================================================
  // NORTH DAKOTA
  // ============================================================================
  { LocationId: 85, Name: 'Bismarck/Mandan', Abbreviation: 'BIS', Region: 'Midwest', State: 'ND', IsTerminal: false, IsActive: true },
  { LocationId: 86, Name: 'Fargo', Abbreviation: 'FAR', Region: 'Midwest', State: 'ND', IsTerminal: false, IsActive: true },
  { LocationId: 87, Name: 'Grand Forks', Abbreviation: 'GFK', Region: 'Midwest', State: 'ND', IsTerminal: false, IsActive: true },
  { LocationId: 88, Name: 'Jamestown', Abbreviation: 'JMS', Region: 'Midwest', State: 'ND', IsTerminal: false, IsActive: true },
  { LocationId: 89, Name: 'Minot', Abbreviation: 'MOT', Region: 'Midwest', State: 'ND', IsTerminal: false, IsActive: true },
  { LocationId: 90, Name: 'Sheerin', Abbreviation: 'SHR', Region: 'Midwest', State: 'ND', IsTerminal: false, IsActive: true },

  // ============================================================================
  // SOUTH DAKOTA
  // ============================================================================
  { LocationId: 91, Name: 'Aberdeen', Abbreviation: 'ABR', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },
  { LocationId: 92, Name: 'Mitchell', Abbreviation: 'MHE', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },
  { LocationId: 93, Name: 'Rapid City', Abbreviation: 'RAP', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },
  { LocationId: 94, Name: 'Sioux Falls', Abbreviation: 'FSD', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },
  { LocationId: 95, Name: 'Watertown', Abbreviation: 'ATY', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },
  { LocationId: 96, Name: 'Wolsey', Abbreviation: 'WOL', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },
  { LocationId: 97, Name: 'Yankton', Abbreviation: 'YKN', Region: 'Midwest', State: 'SD', IsTerminal: false, IsActive: true },

  // ============================================================================
  // MONTANA
  // ============================================================================
  { LocationId: 98, Name: 'Billings', Abbreviation: 'BIL', Region: 'Mountain', State: 'MT', IsTerminal: false, IsActive: true },
  { LocationId: 99, Name: 'Bozeman', Abbreviation: 'BZN', Region: 'Mountain', State: 'MT', IsTerminal: false, IsActive: true },
  { LocationId: 100, Name: 'Glendive', Abbreviation: 'GDV', Region: 'Mountain', State: 'MT', IsTerminal: false, IsActive: true },
  { LocationId: 101, Name: 'Great Falls', Abbreviation: 'GTF', Region: 'Mountain', State: 'MT', IsTerminal: false, IsActive: true },
  { LocationId: 102, Name: 'Helena', Abbreviation: 'HLN', Region: 'Mountain', State: 'MT', IsTerminal: false, IsActive: true },
  { LocationId: 103, Name: 'Missoula', Abbreviation: 'MSO', Region: 'Mountain', State: 'MT', IsTerminal: false, IsActive: true },

  // ============================================================================
  // WYOMING
  // ============================================================================
  { LocationId: 104, Name: 'Casper', Abbreviation: 'CPR', Region: 'Mountain', State: 'WY', IsTerminal: false, IsActive: true },
  { LocationId: 105, Name: 'Cheyenne', Abbreviation: 'CYS', Region: 'Mountain', State: 'WY', IsTerminal: false, IsActive: true },
  { LocationId: 106, Name: 'Rock Springs', Abbreviation: 'RKS', Region: 'Mountain', State: 'WY', IsTerminal: false, IsActive: true },
  { LocationId: 107, Name: 'Sheridan', Abbreviation: 'SHR', Region: 'Mountain', State: 'WY', IsTerminal: false, IsActive: true },
  { LocationId: 108, Name: 'Sinclair', Abbreviation: 'SNC', Region: 'Mountain', State: 'WY', IsTerminal: false, IsActive: true },

  // ============================================================================
  // COLORADO
  // ============================================================================
  { LocationId: 109, Name: 'Colorado Springs', Abbreviation: 'COS', Region: 'Mountain', State: 'CO', IsTerminal: false, IsActive: true },
  { LocationId: 110, Name: 'Denver', Abbreviation: 'DEN', Region: 'Mountain', State: 'CO', IsTerminal: false, IsActive: true },
  { LocationId: 111, Name: 'Fountain', Abbreviation: 'FTN', Region: 'Mountain', State: 'CO', IsTerminal: false, IsActive: true },
  { LocationId: 112, Name: 'Grand Junction', Abbreviation: 'GJT', Region: 'Mountain', State: 'CO', IsTerminal: false, IsActive: true },

  // ============================================================================
  // UTAH
  // ============================================================================
  { LocationId: 113, Name: 'Cedar City', Abbreviation: 'CDC', Region: 'Mountain', State: 'UT', IsTerminal: false, IsActive: true },
  { LocationId: 114, Name: 'Salt Lake City', Abbreviation: 'SLC', Region: 'Mountain', State: 'UT', IsTerminal: false, IsActive: true },

  // ============================================================================
  // IDAHO
  // ============================================================================
  { LocationId: 115, Name: 'Boise', Abbreviation: 'BOI', Region: 'Mountain', State: 'ID', IsTerminal: false, IsActive: true },
  { LocationId: 116, Name: 'Burley', Abbreviation: 'BYI', Region: 'Mountain', State: 'ID', IsTerminal: false, IsActive: true },
  { LocationId: 117, Name: 'Pocatello', Abbreviation: 'PIH', Region: 'Mountain', State: 'ID', IsTerminal: false, IsActive: true },

  // ============================================================================
  // NEW MEXICO
  // ============================================================================
  { LocationId: 118, Name: 'Albuquerque', Abbreviation: 'ABQ', Region: 'Southwest', State: 'NM', IsTerminal: false, IsActive: true },
  { LocationId: 119, Name: 'Artesia', Abbreviation: 'ATS', Region: 'Southwest', State: 'NM', IsTerminal: false, IsActive: true },
  { LocationId: 120, Name: 'Bloomfield', Abbreviation: 'BLM', Region: 'Southwest', State: 'NM', IsTerminal: false, IsActive: true },
  { LocationId: 121, Name: 'Hobbs', Abbreviation: 'HOB', Region: 'Southwest', State: 'NM', IsTerminal: false, IsActive: true },
  { LocationId: 122, Name: 'Moriarty', Abbreviation: 'MOR', Region: 'Southwest', State: 'NM', IsTerminal: false, IsActive: true },

  // ============================================================================
  // ARIZONA
  // ============================================================================
  { LocationId: 123, Name: 'Tucson', Abbreviation: 'TUS', Region: 'Southwest', State: 'AZ', IsTerminal: false, IsActive: true },

  // ============================================================================
  // NEVADA
  // ============================================================================
  { LocationId: 124, Name: 'Las Vegas', Abbreviation: 'LAS', Region: 'Southwest', State: 'NV', IsTerminal: false, IsActive: true },

  // ============================================================================
  // WASHINGTON
  // ============================================================================
  { LocationId: 125, Name: 'Anacortes', Abbreviation: 'ANA', Region: 'Pacific Northwest', State: 'WA', IsTerminal: false, IsActive: true },
  { LocationId: 126, Name: 'Moses Lake', Abbreviation: 'MWH', Region: 'Pacific Northwest', State: 'WA', IsTerminal: false, IsActive: true },
  { LocationId: 127, Name: 'Pasco', Abbreviation: 'PSC', Region: 'Pacific Northwest', State: 'WA', IsTerminal: false, IsActive: true },
  { LocationId: 128, Name: 'Seattle', Abbreviation: 'SEA', Region: 'Pacific Northwest', State: 'WA', IsTerminal: false, IsActive: true },
  { LocationId: 129, Name: 'Spokane', Abbreviation: 'GEG', Region: 'Pacific Northwest', State: 'WA', IsTerminal: false, IsActive: true },
  { LocationId: 130, Name: 'Tacoma', Abbreviation: 'TCM', Region: 'Pacific Northwest', State: 'WA', IsTerminal: false, IsActive: true },

  // ============================================================================
  // OREGON
  // ============================================================================
  { LocationId: 131, Name: 'Eugene', Abbreviation: 'EUG', Region: 'Pacific Northwest', State: 'OR', IsTerminal: false, IsActive: true },
  { LocationId: 132, Name: 'Portland', Abbreviation: 'PDX', Region: 'Pacific Northwest', State: 'OR', IsTerminal: false, IsActive: true },

  // ============================================================================
  // LOUISIANA / GULF COAST
  // ============================================================================
  { LocationId: 133, Name: 'Alexandria', Abbreviation: 'AEX', Region: 'Gulf Coast', State: 'LA', IsTerminal: false, IsActive: true },

  // ============================================================================
  // TENNESSEE / SOUTHEAST
  // ============================================================================
  { LocationId: 134, Name: 'Memphis', Abbreviation: 'MEM', Region: 'Southeast', State: 'TN', IsTerminal: false, IsActive: true },

  // ============================================================================
  // MISSISSIPPI
  // ============================================================================
  { LocationId: 135, Name: 'Greenville', Abbreviation: 'GLH', Region: 'Southeast', State: 'MS', IsTerminal: false, IsActive: true },

  // ============================================================================
  // OHIO
  // ============================================================================
  { LocationId: 136, Name: 'Columbus', Abbreviation: 'CMH', Region: 'Midwest', State: 'OH', IsTerminal: false, IsActive: true },

  // ============================================================================
  // TEXAS - MARSHALL
  // ============================================================================
  { LocationId: 137, Name: 'Marshall', Abbreviation: 'MLL', Region: 'Texas', State: 'TX', IsTerminal: false, IsActive: true },

  // ============================================================================
  // PENNSYLVANIA
  // ============================================================================
  { LocationId: 138, Name: 'Northumberland', Abbreviation: 'NTH', Region: 'Northeast', State: 'PA', IsTerminal: false, IsActive: true },

  // ============================================================================
  // MAINE
  // ============================================================================
  { LocationId: 139, Name: 'Portland', Abbreviation: 'PWM', Region: 'Northeast', State: 'ME', IsTerminal: false, IsActive: true },

  // ============================================================================
  // ILLINOIS
  // ============================================================================
  { LocationId: 140, Name: 'Mt. Vernon', Abbreviation: 'MVN', Region: 'Midwest', State: 'IL', IsTerminal: false, IsActive: true },
]

/**
 * Get location by ID
 */
export function getLocationById(id: number): Location | undefined {
  return LOCATIONS.find((l) => l.LocationId === id)
}

/**
 * Get location by name
 */
export function getLocationByName(name: string): Location | undefined {
  return LOCATIONS.find((l) => l.Name === name || l.Abbreviation === name)
}

/**
 * Get all active locations as dropdown options
 */
export function getLocationOptions(): LocationOption[] {
  return LOCATIONS.filter((l) => l.IsActive).map((l) => ({
    value: l.LocationId,
    label: l.Name,
    region: l.Region,
    abbreviation: l.Abbreviation,
  }))
}

/**
 * Get only terminal locations
 */
export function getTerminalLocations(): Location[] {
  return LOCATIONS.filter((l) => l.IsTerminal && l.IsActive)
}

/**
 * Get terminal locations as dropdown options
 */
export function getTerminalOptions(): LocationOption[] {
  return getTerminalLocations().map((l) => ({
    value: l.LocationId,
    label: l.Name,
    region: l.Region,
    abbreviation: l.Abbreviation,
  }))
}

/**
 * Get locations by region
 */
export function getLocationsByRegion(region: string): Location[] {
  return LOCATIONS.filter((l) => l.Region === region && l.IsActive)
}

/**
 * Location name string literals for backward compatibility with RFP
 */
export const RFP_LOCATION_NAMES = ['Dallas', 'Beaumont', 'Houston'] as const
export type RFPLocationName = (typeof RFP_LOCATION_NAMES)[number]

/**
 * Terminal names used in Online Selling Platform
 */
export const TERMINAL_NAMES = [
  'Houston',
  'Houston Terminal',
  'Nashville Terminal',
  'Detroit Terminal',
  'Columbia Terminal',
] as const
export type TerminalName = (typeof TERMINAL_NAMES)[number]

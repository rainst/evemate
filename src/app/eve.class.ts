export class BaseEveModel {
  _rawData: any;

  constructor (rawData) {
    this._rawData = rawData;

    for (var key in rawData) {
      if (rawData.hasOwnProperty(key)) {
        this[key] = rawData[key];
      }
    }
  }
}

export class NameModel {
  name: string;
  id: number;
  category: string;
}

export class EveUnits {
  units: {id: number, type: string, name:string, symbol:string, description?:string}[] = [
    {id: 1, type: 'Length', symbol: 'm', name: 'Meter'},
    {id: 2, type: 'Mass', symbol: 'kg', name: 'Kilogram'},
    {id: 3, type: 'Time', symbol: 's', name: 'Second'},
    {id: 4, type: 'Electric Current', symbol: 'A', name: 'Ampere'},
    {id: 5, type: 'Temperature', symbol: 'K', name: 'Kelvin'},
    {id: 6, type: 'Amount Of Substance', symbol: 'mol', name: 'Mole'},
    {id: 7, type: 'Luminous Intensity', symbol: 'cd', name: 'Candela'},
    {id: 8, type: 'Area', symbol: 'm²',name: 'Square meter'},
    {id: 9, type: 'Volume', symbol: 'm³',name: 'Cubic meter'},
    {id: 10, type: 'Speed', symbol: 'm/s',name: 'Meter per second'},
    {id: 11, type: 'Acceleration', symbol: 'm/s²', name: 'Meter per second squared'},
    {id: 12, type: 'Wave Number', symbol: 'm-1', name: 'Reciprocal meter'},
    {id: 13, type: 'Mass Density', symbol: 'kg/m³', name: 'Kilogram per cubic meter'},
    {id: 14, type: 'Specific Volume', symbol: 'm³/kg', name: 'Cubic meter per kilogram'},
    {id: 15, type: 'Current Density', symbol: 'A/m²', name: 'Ampere per square meter'},
    {id: 16, type: 'Magnetic Field Strength', symbol: 'A/m', name: 'Ampere per meter'},
    {id: 17, type: 'Amount-Of-Substance Concentration', symbol: 'mol/m³', name: 'Mole per cubic meter'},
    {id: 18, type: 'Luminance', symbol: 'cd/m²', name: 'Candela per square meter'},
    {id: 19, type: 'Mass Fraction', symbol: 'kg/kg = 1', name: 'Kilogram per kilogram'}, // which may be represented by the number 1
    {id: 101, type: 'Time', symbol: 'ms', name: 'Millisecond'},
    {id: 102, type: 'Length', symbol: 'mm', name: 'Millimeter'},
    {id: 103, type: 'Pressure', symbol: 'MPa', name: 'MegaPascal'},
    {id: 104, type: 'Multiplier', symbol: 'x', name: 'Multiplier'}, // 'Indicates that the unit is a multiplier.
    {id: 105, type: 'Percentage', symbol: '%', name: 'Percent'},
    {id: 106, type: 'Computational unit', symbol: 'tf', name: 'Teraflop'},
    {id: 107, type: 'Power', symbol: 'MW', name: 'Megawatt'},
    {id: 108, type: 'Inverse Absolute Percent', symbol: '%', name: 'Used for resistance.\r\n0.0 = 100% 1.0 = 0%\r\n'},
    {id: 109, type: 'Modifier Percent', symbol: '%', name: 'Used for multipliers displayed as %\r\n1.1 = +10%\r\n0.9 = -10%'},
    {id: 111, type: 'Inversed Modifier Percent', symbol: '%', name: 'Used to modify damage resistance. Damage resistance bonus.\r\n0.1 = 90%\r\n0.9 = 10%'},
    {id: 112, type: 'Rotational speed', symbol: 'rad/s', name: 'Radians per second'},
    {id: 113, type: 'Hitpoints', symbol: 'HP', name: 'Hitpoints'},
    {id: 114, type: 'Energy', symbol: 'GJ', name: 'Giga Joule'},
    {id: 115, type: 'groupID', symbol: 'groupID', name: 'groupID'},
    {id: 116, type: 'typeID', symbol: 'typeID',name: 'NULL'},
    {id: 117, type: 'Sizeclass', symbol: '1=small 2=medium 3=l',name: 'NULL'},
    {id: 118, type: 'Ore units', symbol: 'Ore units',name: 'NULL'},
    {id: 119, type: 'attributeID', symbol: 'attributeID',name: 'NULL'},
    {id: 120, type: 'attributePoints', symbol: 'points',name: 'NULL'},
    {id: 121, type: 'realPercent', symbol: '%', name: 'Used for real percentages, i.e. the number 5 is 5%'},
    {id: 122, type: 'Fitting slots', symbol: '' , name: 'NULL'},
    {id: 123, type: 'trueTime', symbol: 's', name: 'Shows seconds directly'},
    {id: 124, type: 'Modifier Relative Percent', symbol: '%', name: 'Used for relative percentages displayed as %'},
    {id: 125, type: 'Force', symbol: 'N', name: 'Newton'},
    {id: 126, type: 'Length', symbol: 'ly', name: 'Light year'},
    {id: 127, type: 'Absolute Percent', symbol: '%', name: 'Percent', description: '0.0 = 0% 1.0 = 100%'},
    {id: 128, type: 'Bandwidth', symbol: 'Mbit/sec', name: 'Megabits per second'},
    {id: 129, type: 'Time', symbol: 'h', name: 'Hour'},
    {id: 133, type: 'Currency',symbol: 'ISK', name: 'ISK'},
    {id: 134, type: 'Logistical Capacity', symbol: 'm³/hour', name: 'Cubic meters per hour'},
    {id: 135, type: 'Length', symbol: 'AU', name: 'Astronomical Unit'},
    {id: 136, type: 'Slot', symbol: 'Slot', name: 'Slot number prefix for various purposes'},
    {id: 137, type: 'Boolean', symbol: '1=True 0=False', name: 'For displaying boolean flags'},
    {id: 138, type: 'Units', symbol: 'units', name: 'Units of something, for example fuel'},
    {id: 139, type: 'Bonus', symbol: '+', name: 'Forces a plus sign for positive values'},
    {id: 140, type: 'Level', symbol: 'Level', name: 'For anything which is divided by levels'},
    {id: 141, type: 'Hardpoints', symbol: 'hardpoints', name: 'For various counts to do with turret, launcher and rig hardpoints'},
    {id: 142, type: 'Sex', symbol: '', name: 'Sex', description: '1=Male 2=Unisex 3=Female'},
    {id: 143, type: 'Datetime', symbol: '', name:'Date and time'}
  ];

  get(unitID: number): {id: number, type: string, name:string, symbol:string, description?:string} {
    return this.units.find(unit => {return unit.id === unitID});
  }
}
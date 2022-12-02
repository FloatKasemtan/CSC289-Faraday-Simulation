export interface FaradayLawInterface {
  loop: number;
  changeInFlux: FluxCalculationInterface;
  time: number;
}

export interface MagneticFieldCalculationInterface {
  xBefore: number;
  xAfter: number;
  yBefore: number;
  yAfter: number;
}

export interface FluxCalculationInterface {
  magneticField: MagneticFieldCalculationInterface;
  area: {
    width: number;
    height: number;
  };
  angle: number;
}

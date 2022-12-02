import type {
  MagneticFieldCalculationInterface,
  FluxCalculationInterface,
  FaradayLawInterface,
} from "../interfaces/faraday";

export const MagneticFieldCalculation = (
  data: MagneticFieldCalculationInterface
): number => {
  const { xAfter, yAfter, xBefore, yBefore } = data;
  //   const result = xAfter - xBefore - (yAfter - yBefore);
  const coilPosition = [1000, 1000];
  const position1 = [xBefore - coilPosition[0], yBefore - coilPosition[1]];
  const r1 = Math.sqrt(Math.pow(position1[0], 2) + Math.pow(position1[1], 2));
  const position2 = [xAfter - coilPosition[0], yAfter - coilPosition[1]];
  const r2 = Math.sqrt(Math.pow(position2[0], 2) + Math.pow(position2[1], 2));
  const b1 = (4 * Math.PI * Math.pow(10, -7)) / (r1 * 2 * Math.PI);
  const b2 = (4 * Math.PI * Math.pow(10, -7)) / (r2 * 2 * Math.PI);
  const result = b2 - b1 / 0.1;
  console.log("position1", position1);
  console.log("position2", position2);
  console.log("r1", r1);
  console.log("r2", r2);

  console.log("b1", b1);
  console.log("b2", b2);
  console.log(result);

  return result;
};

export const ChangeInFluxCalculation = (
  data: FluxCalculationInterface
): number => {
  const { magneticField, area, angle } = data;
  const result =
    MagneticFieldCalculation(magneticField) *
    (area.width * area.height) *
    Math.cos(angle);
  return result;
};

export const FaradayLaw = (data: FaradayLawInterface): [number, boolean] => {
  const { loop, changeInFlux, time } = data;

  if (time === 0) {
    return [0, false];
  }

  const calculatedFlux = ChangeInFluxCalculation(changeInFlux);

  return [(-loop * calculatedFlux) / time, true];
};

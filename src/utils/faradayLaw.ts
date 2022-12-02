import type { MagneticFieldCalculationInterface, FluxCalculationInterface, FaradayLawInterface } from "../interfaces/faraday";

export const MagneticFieldCalculation = (data: MagneticFieldCalculationInterface): number => {
    const { xBefore, xAfter, yBefore, yAfter } = data;
    const result = (xAfter - xBefore) - (yAfter - yBefore);
    return result;
}

export const ChangeInFluxCalculation = (data: FluxCalculationInterface): number => {
    const { magneticField, area, angle } = data;
    const result = MagneticFieldCalculation(magneticField) * (area.width * area.height) * Math.cos(angle);
    return result;
}

export const FaradayLaw = (data: FaradayLawInterface) => {
    const { loop, changeInFlux, time } = data;

    if (time === 0) {
        return [0, false];
    }

    const calculatedFlux = ChangeInFluxCalculation(changeInFlux);

    return [-loop * calculatedFlux / time, true];
}


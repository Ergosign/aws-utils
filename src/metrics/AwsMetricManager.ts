import { createMetricsLogger, Unit } from "aws-embedded-metrics";

export class AwsMetricManager {
  public static recordMetric = async (
    namespace: string,
    metricName: string,
    unit: Unit,
    value: number,
    dimensions: Record<string, string>,
    properties: { key: string; value: unknown }[]
  ) => {
    const metrics = createMetricsLogger();
    metrics.putDimensions(dimensions);
    metrics.setNamespace(namespace);
    metrics.putMetric(metricName, value, unit);
    properties.forEach((property) => {
      metrics.setProperty(property.key, property.value);
    });
    await metrics.flush();
  };
}

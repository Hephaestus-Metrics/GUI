import {MetricItem} from "./MetricItem";
import {Metric} from "../../../../models/metrics/Metric";

export function toMetricItem(metrics: Metric[]): MetricItem[] {

    const result: MetricItem[] = []
    metrics.forEach(metric => {
        const labels: Map<string, string> = new Map<string, string>();
        const entries = Object.entries(metric.labels);
        for (const entry of entries){
            labels.set(entry[0], entry[1]);
        }
        const metricItem = new MetricItem(labels);
        result.push(metricItem);
    });
    return result;
}
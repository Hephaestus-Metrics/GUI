import {MetricItem} from "./MetricItem";
import {Metric} from "../../../models/metrics/Metric";
import {map} from "rxjs";

export function toMetricItem(metrics: any): MetricItem[] {
    console.log(metrics);
    const result: MetricItem[] = [];
    // metrics.forEach(x => {
    //     const metricItem = new MetricItem(x.Labels);
    //     result.push(metricItem);
    // });
    console.log(metrics.Labels);
    const newMap: Map<string, string> = new Map<string, string>();
    metrics.Labels.forEach((value: string, key: string) => {
        newMap.set(key, value)
    });
    console.log(newMap);
    const metricItem = new MetricItem(metrics.Labels);
    result.push(metricItem);
    console.log(result);
    return result;

}
export class MetricItem {
    private labels: Map<string, string> = new Map<string, string>();

    constructor(labels: Map<string, string>) {
        this.labels = labels;
    }

    public readonly isQuery: boolean = false;

    public parents = new Set<MetricItem>();

    public children = new Set<MetricItem>();

    public getTextRepresentation(): string{
        return Array.from((this.labels.entries())).map(pair => pair[0] + ': ' + pair[1]).join(', ') + '>>> ' +
            this.parents.size;
    }

    public equals(other: MetricItem): boolean{
        if ( this.labels.size !== other.labels.size){
            return false
        }
        for (const key of this.labels.keys()){
            if (other.labels.has(key) && other.labels.get(key) === this.labels.get(key)){
                continue;
            } else{
                return false;
            }
        }
        return true;
    }

    public checkConflict(other: MetricItem): boolean{
        const shorter = ((other.labels.size < this.labels.size) ? other : this);
        const longer = ((other.labels.size >= this.labels.size) ? other : this);
        for (const key of shorter.labels.keys()){
            if (longer.labels.has(key) && shorter.labels.get(key) === longer.labels.get(key)){
                continue;
            } else{
                return false;
            }
        }
        shorter.children.add(longer);
        longer.parents.add(shorter);
        return true;
    }
}
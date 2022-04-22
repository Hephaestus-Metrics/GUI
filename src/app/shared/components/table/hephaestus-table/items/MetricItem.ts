export class MetricItem {
    private labels: Map<string, string> = new Map<string, string>();

    constructor(labels: Map<string, string>) {
        this.labels = labels;
    }

    private conflicts: Set<MetricItem> = new Set<MetricItem>();

    public readonly isQuery: boolean = false;

    public getTextRepresentation(): string{
        return Array.from((this.labels.entries())).map(pair => pair[0] + ': ' + pair[1]).join(', ') +
            ((this.conflicts.size > 0) ? "CONFLICT!!!!!!!!!!!!!!" : "");
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
        other.conflicts.add(this);
        this.conflicts.add(other);
        return true;
    }

    //TODO remove
    public addRand(){
        this.labels.set((Math.random() + 1).toString(36).substring(7),(Math.random() + 1).toString(36).substring(7));
    }
}

// TODO as a would -> automatic conflict resolution:
// e.g select narrowest case delete -> delete from conflicts -> repeat
// warning -> selecting narrowest is not optimal
// possible better solution -> build tree of conflicts of selected metrics
// tree can result in optimization in many places
// dealing with diamond case but should be doable
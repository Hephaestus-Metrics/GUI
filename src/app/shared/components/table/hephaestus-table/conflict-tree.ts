
// import { MetricItem } from "./items/MetricItem";
// // BUGGED
// export class ConflictTree {

//     private root = new MetricItem(new Map);

//     public constructor(metrics: MetricItem[]){
//         let a: number = 1/0;
//         // this is bugged, do not use
//         for (const metric of metrics){
//             this.addMetric(metric);
//         }
//     }

//     public addMetric(metric: MetricItem){
//         const visited = new Set<MetricItem>();
//         this.addToTree(metric, visited, this.root);
//     }

//     private addToTree(newNode: MetricItem, visited: Set<MetricItem>, parent: MetricItem){
//         let isEqualChildren = true;
//         visited.add(parent);
//         for (const child of parent.children){
//             console.log("fsd");
//             // skip heuristic
//             if (newNode.getSize() === child.getSize()){
//                 continue;
//             }
//             console.log("fssdaqwad");
//             const subSet: MetricItem| null = newNode.checkSubset(child);
//             console.log(subSet);
//             // new node i subset of child -> go down the tree
//             if (subSet === newNode){
//                 isEqualChildren = false;
//                 if (!visited.has(child)){
//                     this.addToTree(newNode, visited, child);
//                 }
               
//             }
//             // new node is Superset of tree -> insert between child and parent
//             else if (subSet === child){
//                 console.log("!!!");
//                 isEqualChildren = false;
//                 newNode.parents.add(parent);
//                 newNode.children.add(child);
//                 child.parents.delete(parent);
//                 child.parents.add(newNode);
//                 console.log(child);
//             }
//         }
//         // new node does not have any relationships with children
//         if (isEqualChildren){
//             console.log("!!!");
//             parent.children.add(newNode);
//             newNode.parents.add(parent);
//         }
//     }

//     //warning:
//     // such situtation is ok:
//     //  ROOT         ROOT
//     //  / \          /  \
//     //  a  b    ->   a   |
//     //  \  /         \   /
//     //   c             c
//     // Having more than one backtracking path to parent is not considered a mistake
//     public removeMetric(removedNode: MetricItem){
//         for (const parent of removedNode.parents){
//             parent.children.delete(removedNode);
//         }
//         for (const child of removedNode.children){
//             child.parents.delete(removedNode);
//         }
//         for (const parent of removedNode.parents){
//             parent.children = new Set([...removedNode.children, ...parent.children]);
//         }
//         for (const child of removedNode.children){
//            child.parents = new Set([...removedNode.parents, ...child.parents]);
//            console.log(child);
//         }
        
//     }

// }
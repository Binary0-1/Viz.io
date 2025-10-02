import dagre from "dagre";
import type { Node as FlowNode } from "@xyflow/react";

interface QueueItem {
  key: string;
  value: unknown;
  parentId: string | undefined;
  id: string;
}

interface CustomNode extends FlowNode {
  parentId?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

let idCounter = 0;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// You can change this to 'LR' for left-right
const graphOptions = { rankdir: "LR" };

export const jsonToNodes = (
  json: string
): { nodes: FlowNode[]; edges: Edge[] } => {
  json = JSON.parse(json);

  const nodes: CustomNode[] = [];
  const edges: Edge[] = [];
  const queue: QueueItem[] = [];

  const getId = () => `node_${idCounter++}`;

  const rootId = getId();

  queue.push({
    key: "root",
    value: json,
    parentId: undefined,
    id: rootId,
  });

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;

    const { key, value, parentId, id } = item;

    const label =
      typeof value === "object" && value !== null ? key : `${key}: ${value}`;

    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 }, // Will update this after   layout
      type: "default",
      sourcePosition: "right", 
      targetPosition: "left", 
      ...(parentId ? { parentId } : {}),
    });

    if (parentId) {
      const edgeId = `e_${parentId}-${id}`;
      edges.push({
        id: edgeId,
        source: parentId,
        target: id,
      });
    }

    if (typeof value === "object" && value !== null) {
      for (const childKey in value as any) {
        const childValue = (value as any)[childKey];
        const childId = getId();

        queue.push({
          key: childKey,
          value: childValue,
          parentId: id,
          id: childId,
        });
      }
    }
  }


  dagreGraph.setGraph(graphOptions);

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 150, height: 50 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPos.x,
        y: nodeWithPos.y,
      },
    };
  });

  return { nodes: positionedNodes, edges };
};

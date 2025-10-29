import ELK from "elkjs/lib/elk.bundled.js";
import type { Node as FlowNode } from "@xyflow/react";

interface QueueItem {
  key: string;
  value: unknown;
  parentId?: string;
  id: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

let idCounter = 0;

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "mrtree",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "40",
  "elk.layered.spacing.nodeNodeBetweenLayers": "80",
  "elk.edgeRouting": "ORTHOGONAL",
};

export const jsonToNodes = async (
  json: string
): Promise<{ nodes: FlowNode[]; edges: Edge[] }> => {
  const parsedJson = JSON.parse(json);
  idCounter = 0;

  const nodes: FlowNode[] = [];
  const edges: Edge[] = [];
  const queue: QueueItem[] = [];

  const getId = () => `node_${idCounter++}`;
  const rootId = getId();

  queue.push({ key: "root", value: parsedJson, id: rootId });

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;

    const { key, value, parentId, id } = item;
    const label =
      typeof value === "object" && value !== null ? key : `${key}: ${value}`;

    nodes.push({
      id,
      data: { label },
      position: { x: 0, y: 0 },
      type: "default",
    });

    if (parentId) {
      edges.push({
        id: `e_${parentId}-${id}`,
        source: parentId,
        target: id,
      });
    }

    if (typeof value === "object" && value !== null) {
      for (const childKey in value as any) {
        const childValue = (value as any)[childKey];
        queue.push({
          key: childKey,
          value: childValue,
          parentId: id,
          id: getId(),
        });
      }
    }
  }

  const graph = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((n) => ({
      id: n.id,
      width: 150,
      height: 50,
      labels: [{ text: n.data.label }],
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const layout = await elk.layout(graph);

  const positionedNodes = nodes.map((node) => {
    const layoutNode = layout.children.find((c) => c.id === node.id);
    return {
      ...node,
      position: {
        x: layoutNode?.x || 0,
        y: layoutNode?.y || 0,
      },
    };
  });

  // Center the layout
  const minX = Math.min(...positionedNodes.map((n) => n.position.x));
  const minY = Math.min(...positionedNodes.map((n) => n.position.y));

  const centeredNodes = positionedNodes.map((n) => ({
    ...n,
    position: {
      x: n.position.x - minX + 50,
      y: n.position.y - minY + 50,
    },
  }));

  return { nodes: centeredNodes, edges };
};
